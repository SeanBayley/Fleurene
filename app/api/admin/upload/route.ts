import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Helper function to verify admin access
async function verifyAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No auth token')
  }

  const token = authHeader.replace('Bearer ', '')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  
  if (userError || !user) {
    throw new Error('Invalid token')
  }

  const { data: profile, error: profileError } = await supabaseServer
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    throw new Error('Admin access required')
  }

  return user
}

// POST /api/admin/upload - Upload image
export async function POST(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const altText = formData.get('altText') as string || ''
    const isPrimary = formData.get('isPrimary') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const filePath = productId ? `products/${productId}/${fileName}` : `temp/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ 
        error: 'Failed to upload image to storage' 
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseServer.storage
      .from('product-images')
      .getPublicUrl(filePath)

    const imageUrl = urlData.publicUrl

    // If productId is provided, save to database
    let productImage = null
    if (productId) {
      // If this is set as primary, update other images to not be primary
      if (isPrimary) {
        await supabaseServer
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', productId)
      }

      // Get the next sort order
      const { data: existingImages } = await supabaseServer
        .from('product_images')
        .select('sort_order')
        .eq('product_id', productId)
        .order('sort_order', { ascending: false })
        .limit(1)

      const nextSortOrder = existingImages && existingImages.length > 0 
        ? (existingImages[0].sort_order || 0) + 1 
        : 0

      // Save image record to database
      const { data: imageData, error: imageError } = await supabaseServer
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: imageUrl,
          alt_text: altText,
          sort_order: nextSortOrder,
          is_primary: isPrimary || false
        })
        .select()
        .single()

      if (imageError) {
        console.error('Database insert error:', imageError)
        // Clean up uploaded file if database insert fails
        await supabaseServer.storage
          .from('product-images')
          .remove([filePath])
        
        return NextResponse.json({ 
          error: 'Failed to save image record' 
        }, { status: 500 })
      }

      productImage = imageData
    }

    return NextResponse.json({
      success: true,
      image: {
        id: productImage?.id,
        url: imageUrl,
        alt_text: altText,
        is_primary: isPrimary,
        sort_order: productImage?.sort_order || 0
      },
      message: 'Image uploaded successfully'
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/upload - Delete image
export async function DELETE(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const { imageId } = await request.json()

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

    // Get image record to find the file path
    const { data: imageRecord, error: fetchError } = await supabaseServer
      .from('product_images')
      .select('image_url, product_id')
      .eq('id', imageId)
      .single()

    if (fetchError || !imageRecord) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Extract file path from URL
    const url = new URL(imageRecord.image_url)
    const filePath = url.pathname.split('/').slice(-3).join('/') // Get last 3 parts

    // Delete from storage
    const { error: storageError } = await supabaseServer.storage
      .from('product-images')
      .remove([filePath])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabaseServer
      .from('product_images')
      .delete()
      .eq('id', imageId)

    if (dbError) {
      console.error('Database delete error:', dbError)
      return NextResponse.json({ 
        error: 'Failed to delete image record' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete image error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 