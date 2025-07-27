import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Test if orders table exists
    const { data: ordersTest, error: ordersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    // Test if order_items table exists
    const { data: itemsTest, error: itemsError } = await supabase
      .from('order_items')
      .select('count')
      .limit(1)
    
    // Test if order_status_history table exists
    const { data: historyTest, error: historyError } = await supabase
      .from('order_status_history')
      .select('count')
      .limit(1)

    return NextResponse.json({
      orders_table: {
        exists: !ordersError,
        error: ordersError?.message
      },
      order_items_table: {
        exists: !itemsError,
        error: itemsError?.message
      },
      order_status_history_table: {
        exists: !historyError,
        error: historyError?.message
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 