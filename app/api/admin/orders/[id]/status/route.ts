import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create a client-side Supabase client to verify the user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin using server client
    const { data: profile, error: profileError } = await supabaseServer
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id: orderId } = params
    const body = await request.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    // Update the order status using server client
    const { error: updateError } = await supabaseServer
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (updateError) {
      console.error('Error updating order status:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    // Add status history entry using server client
    const { error: historyError } = await supabaseServer
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status,
        notes: notes || `Status updated to ${status}`,
        created_by: user.id
      })

    if (historyError) {
      console.error('Error adding status history:', historyError)
      // Don't fail the request if history fails, but log it
    }

    return NextResponse.json({ 
      success: true,
      message: `Order status updated to ${status}`
    })

  } catch (error) {
    console.error('Error in order status update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 