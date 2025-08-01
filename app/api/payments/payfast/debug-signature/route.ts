import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use the exact data from your payment
    const paymentData = {
      merchant_id: '10040872',
      merchant_key: '0hhk76lcagavz',
      return_url: 'https://fleurene.vercel.app/checkout/confirmation?payment=success&order=c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
      cancel_url: 'https://fleurene.vercel.app/checkout?payment=cancelled&order=c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
      notify_url: 'https://fleurene.vercel.app/api/payments/payfast/webhook',
      m_payment_id: 'c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
      amount: '75.10',
      item_name: 'Order 20250801-0004',
      item_description: 'Payment for order 20250801-0004',
      name_first: 'Sean',
      name_last: 'Bayley',
      email_address: 'seanjbayley@gmail.com',
      custom_str1: 'c49cfe3cfa0a48399073331bc73fbcc5',
      custom_str2: '202508010004'
    }

    // Test with different passphrase scenarios
    const results = []

    // Test 1: No passphrase
    const sig1 = generateDebugSignature(paymentData)
    results.push({
      scenario: 'No passphrase',
      signature: sig1.signature,
      paramString: sig1.paramString
    })

    // Test 2: Empty passphrase
    const sig2 = generateDebugSignature(paymentData, '')
    results.push({
      scenario: 'Empty passphrase',
      signature: sig2.signature,
      paramString: sig2.paramString
    })

    // Test 3: Common test passphrases
    const testPassphrases = ['test', 'sandbox', 'payfast']
    for (const passphrase of testPassphrases) {
      const sig = generateDebugSignature(paymentData, passphrase)
      results.push({
        scenario: `Passphrase: "${passphrase}"`,
        signature: sig.signature,
        paramString: sig.paramString
      })
    }

    return NextResponse.json({
      success: true,
      paymentData,
      yourSignature: 'f756038e8a9da53f10080ad04b5bd564',
      expectedSignature: 'a8260285010cc512f3512e15e21ced19',
      results,
      instructions: 'Compare these signatures with what Payfast expects'
    })

  } catch (error) {
    console.error('Debug signature error:', error)
    return NextResponse.json({ error: 'Failed to debug signature' }, { status: 500 })
  }
}

function generateDebugSignature(data: Record<string, any>, passphrase?: string): { signature: string, paramString: string } {
  // Create parameter string exactly like PHP documentation
  let pfOutput = ''
  
  // Sort keys alphabetically (like PHP ksort)
  const sortedKeys = Object.keys(data)
    .filter(key => key !== 'signature' && data[key] !== '' && data[key] !== null && data[key] !== undefined)
    .sort()
  
  // Build parameter string like PHP: key=urlencode(trim(val))&
  for (const key of sortedKeys) {
    const val = data[key].toString().trim()
    pfOutput += `${key}=${encodeURIComponent(val)}&`
  }
  
  // Remove last ampersand (like PHP substr($pfOutput, 0, -1))
  let getString = pfOutput.slice(0, -1)
  
  // Add passphrase if provided (like PHP documentation)
  if (passphrase && passphrase.trim()) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim())}`
  }

  // Generate MD5 hash
  const signature = crypto.createHash('md5').update(getString).digest('hex')
  
  return { signature, paramString: getString }
}