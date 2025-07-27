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

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminAccess(request)

    const { data: product, error } = await supabaseServer
      .from('products')
      .select(`
        *,
        product_categories(id, name, slug),
        product_images(id, image_url, alt_text, sort_order, is_primary),
        product_variants(id, name, sku, price, compare_price, stock_quantity, weight, dimensions, options, image_url, is_active)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })

  } catch (error: any) {
    console.error('Get product error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminAccess(request)

    const productData = await request.json()

    // Generate slug from name if name is being updated
    if (productData.name && !productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Update product using server client (bypasses RLS)
    const { data: product, error: updateError } = await supabaseServer
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select(`
        *,
        product_categories(id, name, slug),
        product_images(id, image_url, alt_text, sort_order, is_primary),
        product_variants(id, name, sku, price, compare_price, stock_quantity, weight, dimensions, options, image_url, is_active)
      `)
      .single()

    if (updateError) {
      console.error('Error updating product:', updateError)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    return NextResponse.json({ product, success: true })

  } catch (error: any) {
    console.error('Update product error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAdminAccess(request)

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabaseServer
      .from('products')
      .select('id, name')
      .eq('id', params.id)
      .single()

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product (cascade will handle related records)
    const { error: deleteError } = await supabaseServer
      .from('products')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting product:', deleteError)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Product "${existingProduct.name}" deleted successfully` 
    })

  } catch (error: any) {
    console.error('Delete product error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 