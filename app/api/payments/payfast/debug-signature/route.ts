import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use data from request or fallback to default
    const paymentData = body.testData || {
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
    
    const customPassphrase = body.passphrase

    // Test with different methods and passphrase scenarios
    const results = []

    // Test with provided passphrase first
    if (customPassphrase !== undefined) {
      const sig0 = generateDebugSignature(paymentData, customPassphrase)
      results.push({
        method: `Server: With your passphrase "${customPassphrase || 'empty'}"`,
        signature: sig0.signature,
        paramString: sig0.paramString
      })
    }

    // Test 1: No passphrase (null)
    const sig1 = generateDebugSignature(paymentData, undefined)
    results.push({
      method: 'Server: No passphrase (null)',
      signature: sig1.signature,
      paramString: sig1.paramString
    })

    // Test 2: Empty passphrase
    const sig2 = generateDebugSignature(paymentData, '')
    results.push({
      method: 'Server: Empty passphrase ("")',
      signature: sig2.signature,
      paramString: sig2.paramString
    })

    // Test 3: Method variations with same data
    const altSig1 = generateDebugSignatureAlt1(paymentData, customPassphrase)
    results.push({
      method: 'Server: Standard URL Encoding Method',
      signature: altSig1.signature,
      paramString: altSig1.paramString
    })

    const altSig2 = generateDebugSignatureAlt2(paymentData, customPassphrase)
    results.push({
      method: 'Server: Sorted Keys Method',
      signature: altSig2.signature,
      paramString: altSig2.paramString
    })

    // Test common passphrases
    const testPassphrases = ['test', 'sandbox', 'payfast', 'jt7NOE43FZPn']
    for (const passphrase of testPassphrases) {
      const sig = generateDebugSignature(paymentData, passphrase)
      results.push({
        method: `Server: Passphrase "${passphrase}"`,
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

  // Generate MD5 hash
  const signature = crypto.createHash('md5').update(getString).digest('hex')
  
  return { signature, paramString: getString }
}

// Alternative method 1: Standard URL encoding (no + replacement)
function generateDebugSignatureAlt1(data: Record<string, any>, passphrase?: string): { signature: string, paramString: string } {
  let pfOutput = ''
  
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        const val = data[key].toString().trim()
        pfOutput += `${key}=${encodeURIComponent(val)}&`
      }
    }
  }
  
  let getString = pfOutput.slice(0, -1)
  
  if (passphrase !== null && passphrase !== undefined && passphrase.trim()) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim())}`
  }

  const signature = crypto.createHash('md5').update(getString).digest('hex')
  return { signature, paramString: getString }
}

// Alternative method 2: Sorted keys + form encoding
function generateDebugSignatureAlt2(data: Record<string, any>, passphrase?: string): { signature: string, paramString: string } {
  let pfOutput = ''
  
  const sortedKeys = Object.keys(data)
    .filter(key => data[key] !== '' && data[key] !== null && data[key] !== undefined)
    .sort()
  
  for (const key of sortedKeys) {
    const val = data[key].toString().trim()
    pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`
  }
  
  let getString = pfOutput.slice(0, -1)
  
  if (passphrase !== null && passphrase !== undefined && passphrase.trim()) {
    getString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
  }

  const signature = crypto.createHash('md5').update(getString).digest('hex')
  return { signature, paramString: getString }
}