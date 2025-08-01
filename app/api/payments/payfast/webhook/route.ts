import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

// Disable body parsing for webhook
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text()
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}
    
    // Convert URLSearchParams to object
    for (const [key, value] of params) {
      data[key] = value
    }

    console.log('Payfast webhook received:', data)

    // Validate signature
    const isValidSignature = validatePayfastSignature(data, process.env.PAYFAST_PASSPHRASE)
    
    if (!isValidSignature) {
      console.error('Invalid Payfast signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Extract payment information
    const {
      payment_status,
      m_payment_id: orderId,
      pf_payment_id: payfastPaymentId,
      amount_gross,
      amount_fee,
      amount_net,
      custom_str1,
      custom_str2
    } = data

    // Try to get order ID from m_payment_id first, then from custom_str1 (without dashes)
    let cleanOrderId = orderId
    if (!cleanOrderId && custom_str1) {
      // Reconstruct UUID from custom_str1 (add dashes back)
      const str = custom_str1
      if (str.length === 32) {
        cleanOrderId = `${str.slice(0,8)}-${str.slice(8,12)}-${str.slice(12,16)}-${str.slice(16,20)}-${str.slice(20,32)}`
      }
    }

    if (!cleanOrderId) {
      console.error('No order ID in webhook data')
      return NextResponse.json({ error: 'No order ID provided' }, { status: 400 })
    }

    // Get the order
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('id', cleanOrderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', cleanOrderId, orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order based on payment status
    let newStatus = 'pending'
    let paymentStatus = 'pending'

    switch (payment_status) {
      case 'COMPLETE':
        newStatus = 'processing'
        paymentStatus = 'completed'
        break
      case 'FAILED':
        newStatus = 'payment_failed'
        paymentStatus = 'failed'
        break
      case 'CANCELLED':
        newStatus = 'cancelled'
        paymentStatus = 'cancelled'
        break
      default:
        console.log('Unknown payment status:', payment_status)
    }

    // Update the order
    const { error: updateError } = await supabaseServer
      .from('orders')
      .update({
        status: newStatus,
        payment_status: paymentStatus,
        payment_transaction_id: payfastPaymentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', cleanOrderId)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Create order status history entry
    await supabaseServer
      .from('order_status_history')
      .insert({
        order_id: cleanOrderId,
        status: newStatus,
        notes: `Payment ${payment_status.toLowerCase()} via Payfast. Transaction ID: ${payfastPaymentId}`,
        created_at: new Date().toISOString()
      })

    // If payment is complete, you might want to:
    // 1. Send confirmation email
    // 2. Update inventory
    // 3. Trigger fulfillment process
    if (payment_status === 'COMPLETE') {
      console.log(`Payment completed for order ${order.order_number}`)
      // TODO: Add any post-payment processing here
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Payfast webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

function validatePayfastSignature(data: Record<string, string>, passphrase?: string): boolean {
  try {
    const receivedSignature = data.signature
    if (!receivedSignature) {
      return false
    }

    // Remove signature from data for validation
    const { signature, ...dataForSignature } = data

    // Generate expected signature
    const expectedSignature = generatePayfastSignature(dataForSignature, passphrase)
    
    return receivedSignature === expectedSignature
  } catch (error) {
    console.error('Signature validation error:', error)
    return false
  }
}

function generatePayfastSignature(data: Record<string, any>, passphrase?: string): string {
  // Create parameter string exactly like Node.js documentation
  let pfOutput = ''
  
  // Process all keys (don't sort - process in received order)
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        const val = data[key].toString().trim()
        pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`
      }
    }
  }
  
  // Remove last ampersand
  let getString = pfOutput.slice(0, -1)
  
  // Add passphrase if provided
  if (passphrase !== null && passphrase !== undefined && passphrase.trim()) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  }

  console.log('Webhook signature string:', getString)

  // Generate MD5 hash
  return crypto.createHash('md5').update(getString).digest('hex')
}