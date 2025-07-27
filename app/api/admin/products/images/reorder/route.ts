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

// PUT /api/admin/products/images/reorder - Reorder images
export async function PUT(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const { productId, imageId, newOrder } = await request.json()

    if (!productId || !imageId || typeof newOrder !== 'number') {
      return NextResponse.json({ error: 'Product ID, Image ID, and new order are required' }, { status: 400 })
    }

    // Get current image order
    const { data: currentImage, error: fetchError } = await supabaseServer
      .from('product_images')
      .select('sort_order')
      .eq('id', imageId)
      .eq('product_id', productId)
      .single()

    if (fetchError || !currentImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const currentOrder = currentImage.sort_order || 0

    // If moving to the same position, no need to update
    if (currentOrder === newOrder) {
      return NextResponse.json({
        success: true,
        message: 'Image order unchanged'
      })
    }

    // Update the sort order of the target image
    const { error: updateError } = await supabaseServer
      .from('product_images')
      .update({ sort_order: newOrder })
      .eq('id', imageId)
      .eq('product_id', productId)

    if (updateError) {
      console.error('Error updating image order:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update image order' 
      }, { status: 500 })
    }

    // Simply update the sort order directly - no complex logic
    const { error: reorderError } = await supabaseServer
      .from('product_images')
      .update({ sort_order: newOrder })
      .eq('id', imageId)
      .eq('product_id', productId)

    if (reorderError) {
      console.error('Error updating image order:', reorderError)
      return NextResponse.json({ 
        error: 'Failed to update image order' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Image order updated successfully'
    })

  } catch (error: any) {
    console.error('Reorder images error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 