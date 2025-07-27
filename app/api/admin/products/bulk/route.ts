import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

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

// POST /api/admin/products/bulk - Bulk operations
export async function POST(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const { action, productIds, data } = await request.json()

    if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ 
        error: 'Action and product IDs are required' 
      }, { status: 400 })
    }

    let results: any = {}
    let errors: string[] = []

    switch (action) {
      case 'delete':
        // Bulk delete products
        const { error: deleteError } = await supabaseServer
          .from('products')
          .delete()
          .in('id', productIds)

        if (deleteError) {
          console.error('Bulk delete error:', deleteError)
          return NextResponse.json({ 
            error: 'Failed to delete products' 
          }, { status: 500 })
        }

        results = { deleted: productIds.length }
        break

      case 'update_status':
        // Bulk update product status
        if (typeof data?.is_active !== 'boolean') {
          return NextResponse.json({ 
            error: 'is_active status is required for status update' 
          }, { status: 400 })
        }

        const { error: statusError } = await supabaseServer
          .from('products')
          .update({ 
            is_active: data.is_active,
            updated_at: new Date().toISOString()
          })
          .in('id', productIds)

        if (statusError) {
          console.error('Bulk status update error:', statusError)
          return NextResponse.json({ 
            error: 'Failed to update product status' 
          }, { status: 500 })
        }

        results = { 
          updated: productIds.length, 
          status: data.is_active ? 'active' : 'inactive' 
        }
        break

      case 'update_category':
        // Bulk update product category
        if (!data?.category_id) {
          return NextResponse.json({ 
            error: 'category_id is required for category update' 
          }, { status: 400 })
        }

        const { error: categoryError } = await supabaseServer
          .from('products')
          .update({ 
            category_id: data.category_id,
            updated_at: new Date().toISOString()
          })
          .in('id', productIds)

        if (categoryError) {
          console.error('Bulk category update error:', categoryError)
          return NextResponse.json({ 
            error: 'Failed to update product category' 
          }, { status: 500 })
        }

        results = { 
          updated: productIds.length, 
          category_id: data.category_id 
        }
        break

      case 'duplicate':
        // Bulk duplicate products
        const { data: originalProducts, error: fetchError } = await supabaseServer
          .from('products')
          .select('*')
          .in('id', productIds)

        if (fetchError || !originalProducts) {
          console.error('Fetch products error:', fetchError)
          return NextResponse.json({ 
            error: 'Failed to fetch products for duplication' 
          }, { status: 500 })
        }

        const duplicatedProducts = []
        for (const product of originalProducts) {
          const duplicateData = {
            ...product,
            id: undefined, // Let database generate new ID
            name: `${product.name} (Copy)`,
            slug: `${product.slug}-copy-${Date.now()}`,
            sku: product.sku ? `${product.sku}-COPY` : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: newProduct, error: duplicateError } = await supabaseServer
            .from('products')
            .insert(duplicateData)
            .select()
            .single()

          if (duplicateError) {
            console.error('Duplicate product error:', duplicateError)
            errors.push(`Failed to duplicate ${product.name}`)
          } else {
            duplicatedProducts.push(newProduct)
          }
        }

        results = { 
          duplicated: duplicatedProducts.length,
          products: duplicatedProducts 
        }
        break

      default:
        return NextResponse.json({ 
          error: `Unknown action: ${action}` 
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
      message: `Bulk ${action} completed successfully`
    })

  } catch (error: any) {
    console.error('Bulk operation error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET /api/admin/products/bulk/export - Export products to CSV
export async function GET(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const url = new URL(request.url)
    const format = url.searchParams.get('format') || 'csv'
    const category = url.searchParams.get('category') || ''
    const status = url.searchParams.get('status') || 'all'

    // Build query
    let query = supabaseServer
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        compare_price,
        sku,
        stock_quantity,
        is_active,
        weight,
        dimensions,
        created_at,
        updated_at,
        product_categories(name)
      `)

    // Apply filters
    if (category) {
      query = query.eq('category_id', category)
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data: products, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Export products error:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'ID', 'Name', 'Description', 'Price', 'Compare Price', 'SKU', 
        'Stock Quantity', 'Active', 'Weight', 'Dimensions', 'Category', 
        'Created At', 'Updated At'
      ]

      const csvRows = [
        headers.join(','),
        ...(products || []).map(product => [
          product.id,
          `"${(product.name || '').replace(/"/g, '""')}"`,
          `"${(product.description || '').replace(/"/g, '""')}"`,
          product.price || 0,
          product.compare_price || '',
          product.sku || '',
          product.stock_quantity || 0,
          product.is_active ? 'Yes' : 'No',
          product.weight || '',
          product.dimensions || '',
          (product.product_categories as any)?.name || '',
          product.created_at || '',
          product.updated_at || ''
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="products-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else {
      // Return JSON
      return NextResponse.json({
        products,
        total: products?.length || 0,
        exported_at: new Date().toISOString()
      })
    }

  } catch (error: any) {
    console.error('Export error:', error)
    if (error.message === 'No auth token' || error.message === 'Invalid token') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 