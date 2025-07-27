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

// PUT /api/admin/products/images/primary - Set primary image
export async function PUT(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const { productId, imageId } = await request.json()

    if (!productId || !imageId) {
      return NextResponse.json({ error: 'Product ID and Image ID are required' }, { status: 400 })
    }

    // First, set all images for this product to not primary
    const { error: updateAllError } = await supabaseServer
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId)

    if (updateAllError) {
      console.error('Error updating all images:', updateAllError)
      return NextResponse.json({ 
        error: 'Failed to update images' 
      }, { status: 500 })
    }

    // Then, set the specified image as primary
    const { error: updatePrimaryError } = await supabaseServer
      .from('product_images')
      .update({ is_primary: true })
      .eq('id', imageId)
      .eq('product_id', productId)

    if (updatePrimaryError) {
      console.error('Error setting primary image:', updatePrimaryError)
      return NextResponse.json({ 
        error: 'Failed to set primary image' 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Primary image updated successfully'
    })

  } catch (error: any) {
    console.error('Set primary image error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 