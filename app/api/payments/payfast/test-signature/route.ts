import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testData } = body

    // Test signature generation with sample data
    const sampleData = testData || {
      merchant_id: '10000100',
      merchant_key: '46f0cd694581a',
      amount: '100.00',
      item_name: 'Test Order',
      return_url: 'https://example.com/return',
      cancel_url: 'https://example.com/cancel',
      notify_url: 'https://example.com/notify'
    }

    // Generate signature
    const signature = generateTestSignature(sampleData)
    
    // Also show the parameter string for debugging
    const sortedParams = Object.keys(sampleData)
      .filter(key => key !== 'signature' && sampleData[key] !== '' && sampleData[key] !== null && sampleData[key] !== undefined)
      .sort()
      .map(key => {
        const value = sampleData[key].toString().trim()
        return `${key}=${value}`
      })
      .join('&')

    return NextResponse.json({
      success: true,
      data: sampleData,
      parameterString: sortedParams,
      signature: signature,
      instructions: 'Use this to test your signature generation'
    })

  } catch (error) {
    console.error('Test signature error:', error)
    return NextResponse.json({ error: 'Failed to test signature' }, { status: 500 })
  }
}

function generateTestSignature(data: Record<string, any>, passphrase?: string): string {
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

  console.log('Test signature string (correct field order):', getString)

  // Generate MD5 hash
  return crypto.createHash('md5').update(getString).digest('hex')
}