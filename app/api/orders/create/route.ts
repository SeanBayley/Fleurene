import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user (optional for guest checkout)
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id || null

    const body = await request.json()
    const { 
      items, 
      shippingInfo, 
      subtotal, 
      taxAmount, 
      shippingAmount, 
      totalAmount,
      discountAmount = 0 
    } = body

    if (!items || !shippingInfo || !subtotal || !totalAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        subtotal: subtotal,
        tax_amount: taxAmount || 0,
        shipping_amount: shippingAmount || 0,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        
        // Customer information
        customer_email: shippingInfo.email,
        customer_first_name: shippingInfo.firstName,
        customer_last_name: shippingInfo.lastName,
        customer_phone: shippingInfo.phone || null,
        
        // Shipping information
        shipping_address1: shippingInfo.address1,
        shipping_address2: shippingInfo.address2 || null,
        shipping_city: shippingInfo.city,
        shipping_state: shippingInfo.state,
        shipping_zip_code: shippingInfo.zipCode,
        shipping_country: shippingInfo.country || 'South Africa',
        
        // Payment information (will be updated when payment is processed)
        payment_method: null,
        payment_status: 'pending',
        payment_transaction_id: null
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ 
        error: 'Failed to create order', 
        details: orderError.message 
      }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId, // Use productId instead of id
      product_name: item.name,
      product_sku: item.sku || null,
      product_image: item.image || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      variant_options: item.variant ? JSON.stringify(item.variant) : null
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      console.error('Order items data:', orderItems)
      // If order items fail, we should delete the order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ 
        error: 'Failed to create order items', 
        details: itemsError.message 
      }, { status: 500 })
    }

    // Update product stock levels
    for (const item of items) {
      if (item.productId) {
        // Get current stock and update if sufficient
        const { data: product, error: getError } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.productId)
          .single()

        if (!getError && product && product.stock_quantity >= item.quantity) {
          const { error: stockError } = await supabase
            .from('products')
            .update({ 
              stock_quantity: product.stock_quantity - item.quantity
            })
            .eq('id', item.productId)

          if (stockError) {
            console.error('Error updating stock for product:', item.productId, stockError)
            // Continue with other products, but log the error
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status
      }
    })

  } catch (error) {
    console.error('Error in order creation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 