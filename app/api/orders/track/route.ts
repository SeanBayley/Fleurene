import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const body = await request.json()
    const { email, orderNumber } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Build the query
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount,
        created_at,
        customer_email,
        customer_first_name,
        customer_last_name,
        shipping_address1,
        shipping_city,
        shipping_state,
        order_items (
          id,
          product_name,
          quantity,
          unit_price,
          total_price,
          product_image
        ),
        order_status_history (
          status,
          notes,
          created_at
        )
      `)
      .eq('customer_email', email.toLowerCase())

    // If order number is provided, filter by it
    if (orderNumber) {
      query = query.eq('order_number', orderNumber)
    }

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false })

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // If no orders found
    if (!orders || orders.length === 0) {
      return NextResponse.json({ 
        orders: [],
        message: orderNumber 
          ? `No order found with number ${orderNumber} for email ${email}`
          : `No orders found for email ${email}`
      })
    }

    // Format the response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      customer: {
        email: order.customer_email,
        firstName: order.customer_first_name,
        lastName: order.customer_last_name
      },
      shipping: {
        address: order.shipping_address1,
        city: order.shipping_city,
        state: order.shipping_state
      },
      items: order.order_items || [],
      statusHistory: order.order_status_history || []
    }))

    return NextResponse.json({ 
      orders: formattedOrders,
      count: formattedOrders.length
    })

  } catch (error) {
    console.error('Error in order tracking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 