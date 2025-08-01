import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

interface PayfastRetryRequest {
  orderId: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { orderId }: PayfastRetryRequest = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if order is already paid
    if (order.payment_status === 'completed') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    // Reset payment status to pending
    await supabase
      .from('orders')
      .update({
        payment_status: 'pending',
        payment_transaction_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // Generate Payfast payment data
    const merchantId = process.env.PAYFAST_MERCHANT_ID
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY
    const passphrase = process.env.PAYFAST_PASSPHRASE
    const sandbox = process.env.PAYFAST_SANDBOX === 'true'

    if (!merchantId || !merchantKey) {
      console.error('Payfast credentials not configured')
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 })
    }

    // Get the base URL for redirects
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host')
    
    // For development, use ngrok or a configured public URL
    let baseUrl = `${protocol}://${host}`
    
    // Check if we're on localhost and have a public URL configured
    if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
      const publicUrl = process.env.PAYFAST_PUBLIC_URL || process.env.NGROK_URL
      if (publicUrl) {
        baseUrl = publicUrl.replace(/\/$/, '') // Remove trailing slash
        console.log('🌐 Using configured public URL for Payfast redirects:', baseUrl)
      } else {
        console.warn('⚠️  LOCALHOST DETECTED: Payfast webhooks will fail! Options:')
        console.warn('   1. Set NGROK_URL for local testing')
        console.warn('   2. Deploy to production and test with sandbox credentials')
      }
    } else {
      console.log('🚀 Using production domain for Payfast redirects:', baseUrl)
      if (sandbox) {
        console.log('🧪 SANDBOX MODE: Safe to test on production - no real payments will be processed')
      }
    }

    // Create Payfast payment data
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/checkout/confirmation?payment=success&order=${orderId}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled&order=${orderId}`,
      notify_url: `${baseUrl}/api/payments/payfast/webhook`,
      
      // Payment details
      m_payment_id: orderId,
      amount: order.total_amount.toFixed(2),
      item_name: `Order ${order.order_number} Retry`,
      item_description: `Retry payment for order ${order.order_number}`,
      
      // Customer details
      name_first: order.customer_first_name,
      name_last: order.customer_last_name,
      email_address: order.customer_email,
      
      // Additional fields (alphanumeric only - remove dashes from UUID)
      custom_str1: orderId.replace(/-/g, ''), // Remove dashes for Payfast compatibility
      custom_str2: order.order_number.replace(/[^a-zA-Z0-9]/g, ''), // Clean order number
    }

    // Generate signature (don't include empty passphrase for sandbox)
    const signature = generatePayfastSignature(paymentData, sandbox ? null : passphrase)
    
    // Add signature to payment data
    const paymentDataWithSignature = {
      ...paymentData,
      signature
    }

    // Return payment form data and URL
    const payfastUrl = sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process'

    return NextResponse.json({
      success: true,
      paymentUrl: payfastUrl,
      paymentData: paymentDataWithSignature,
      orderId,
      orderNumber: order.order_number
    })

  } catch (error) {
    console.error('Payfast retry error:', error)
    return NextResponse.json({ error: 'Failed to retry payment' }, { status: 500 })
  }
}

function generatePayfastSignature(data: Record<string, any>, passphrase?: string): string {
  // CRITICAL: Use Payfast attribute description order, NOT alphabetical!
  // From Payfast docs: "pairs must be listed in the order in which they appear in the attributes description"
  const payfastFieldOrder = [
    'merchant_id',
    'merchant_key', 
    'return_url',
    'cancel_url',
    'notify_url',
    'name_first',
    'name_last',
    'email_address',
    'cell_number',
    'm_payment_id',
    'amount',
    'item_name',
    'item_description',
    'custom_int1',
    'custom_int2',
    'custom_int3',
    'custom_int4',
    'custom_int5',
    'custom_str1',
    'custom_str2',
    'custom_str3',
    'custom_str4',
    'custom_str5',
    'payment_method',
    'subscription_type'
  ]
  
  let pfOutput = ''
  
  // Process fields in Payfast attribute order - SAME encoding for ALL fields
  for (const key of payfastFieldOrder) {
    if (data.hasOwnProperty(key) && data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      const val = data[key].toString().trim()
      // Use identical encoding for ALL fields (URL and non-URL)
      pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`
    }
  }
  
  // Remove last ampersand
  let getString = pfOutput.slice(0, -1)
  
  // Add passphrase if provided (passphrase is not a URL, use standard encoding)
  if (passphrase !== null && passphrase !== undefined && passphrase.trim()) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  }

  // Generate MD5 hash
  return crypto.createHash('md5').update(getString).digest('hex')
}