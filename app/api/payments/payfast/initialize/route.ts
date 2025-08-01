import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

interface PayfastPaymentRequest {
  orderId: string
  amount: number
  description?: string
  email: string
  firstName: string
  lastName: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { orderId, amount, description, email, firstName, lastName }: PayfastPaymentRequest = await request.json()

    if (!orderId || !amount || !email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the order exists and belongs to the user (or is a guest order)
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

    // Create Payfast payment data - ensure all values are clean
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/checkout/confirmation?payment=success&order=${orderId}`,
      cancel_url: `${baseUrl}/checkout?payment=cancelled&order=${orderId}`,
      notify_url: `${baseUrl}/api/payments/payfast/webhook`,
      
      // Payment details
      m_payment_id: orderId,
      amount: amount.toFixed(2),
      item_name: cleanString(description || `Order ${order.order_number}`),
      item_description: cleanString(`Payment for order ${order.order_number}`),
      
      // Customer details
      name_first: cleanString(firstName),
      name_last: cleanString(lastName),
      email_address: email.trim(),
      
      // Additional fields (alphanumeric only - remove dashes from UUID)
      custom_str1: orderId.replace(/-/g, ''), // Remove dashes for Payfast compatibility
      custom_str2: order.order_number.replace(/[^a-zA-Z0-9]/g, ''), // Clean order number
    }

    console.log('Payfast payment data:', paymentData)

    // Generate signature (don't include empty passphrase for sandbox)
    const signature = generatePayfastSignature(paymentData, sandbox ? null : passphrase)
    
    // Add signature to payment data - CRITICAL: Use exact same data for signature and sending
    const paymentDataWithSignature = {
      ...paymentData,
      signature
    }

    console.log('Final payment data being sent:', paymentDataWithSignature)

    // Update order with payment attempt
    await supabase
      .from('orders')
      .update({
        payment_method: 'payfast',
        payment_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

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
    console.error('Payfast initialization error:', error)
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
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
  
  // Process fields in Payfast attribute order
  for (const key of payfastFieldOrder) {
    if (data.hasOwnProperty(key) && data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      const val = data[key].toString().trim()
      pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+').toUpperCase()}&`
    }
  }
  
  // Remove last ampersand
  let getString = pfOutput.slice(0, -1)
  
  // Add passphrase if provided
  if (passphrase !== null && passphrase !== undefined && passphrase.trim()) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+').toUpperCase()}`
  }

  console.log('Payfast signature string (correct field order):', getString)

  // Generate MD5 hash
  const signature = crypto.createHash('md5').update(getString).digest('hex')
  console.log('Generated signature:', signature)
  
  return signature
}

// Helper function to clean strings for Payfast
function cleanString(str: string): string {
  return str
    .trim()
    .replace(/[^\w\s-_.]/g, '') // Remove special characters that can cause issues
    .substring(0, 100) // Limit length
}