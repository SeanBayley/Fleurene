import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Base data that works
    const baseData = {
      merchant_id: '10040872',
      merchant_key: '0hhk76lcagavz',
      return_url: 'https://fleurene.vercel.app/checkout/confirmation?payment=success&order=c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
      cancel_url: 'https://fleurene.vercel.app/checkout?payment=cancelled&order=c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
      notify_url: 'https://fleurene.vercel.app/api/payments/payfast/webhook',
      m_payment_id: 'c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
      amount: '75.10',
      item_name: 'Order 20250801-0004',
      item_description: 'Payment for order 20250801-0004',
      email_address: 'seanjbayley@gmail.com',
      custom_str1: 'c49cfe3cfa0a48399073331bc73fbcc5',
      custom_str2: '202508010004'
    }

    const results = []

    // Test 1: Base data only (should work)
    const sig1 = generateSignature(baseData)
    results.push({
      test: 'Base data only (no names)',
      signature: sig1.signature,
      paramString: sig1.paramString,
      fieldCount: Object.keys(baseData).length
    })

    // Test 2: Add name_first only
    const dataWithFirstName = { ...baseData, name_first: 'Sean' }
    const sig2 = generateSignature(dataWithFirstName)
    results.push({
      test: 'Base + name_first: "Sean"',
      signature: sig2.signature,
      paramString: sig2.paramString,
      fieldCount: Object.keys(dataWithFirstName).length
    })

    // Test 3: Add both names
    const dataWithBothNames = { ...baseData, name_first: 'Sean', name_last: 'Bayley' }
    const sig3 = generateSignature(dataWithBothNames)
    results.push({
      test: 'Base + both names',
      signature: sig3.signature,
      paramString: sig3.paramString,
      fieldCount: Object.keys(dataWithBothNames).length
    })

    // Test 4: Different name to see if it's specific to "Sean"
    const dataWithDifferentName = { ...baseData, name_first: 'John', name_last: 'Doe' }
    const sig4 = generateSignature(dataWithDifferentName)
    results.push({
      test: 'Base + "John Doe"',
      signature: sig4.signature,
      paramString: sig4.paramString,
      fieldCount: Object.keys(dataWithDifferentName).length
    })

    // Test 5: Names in different order (create object with names first)
    const dataNameFirst = {
      name_first: 'Sean',
      name_last: 'Bayley',
      ...baseData
    }
    const sig5 = generateSignature(dataNameFirst)
    results.push({
      test: 'Names declared first in object',
      signature: sig5.signature,
      paramString: sig5.paramString,
      fieldCount: Object.keys(dataNameFirst).length
    })

    // Test 6: Alphabetically sorted always
    const dataSorted = Object.keys(dataWithBothNames)
      .sort()
      .reduce((obj, key) => {
        obj[key] = dataWithBothNames[key]
        return obj
      }, {})
    const sig6 = generateSignatureAlphabetical(dataSorted)
    results.push({
      test: 'Alphabetically sorted fields',
      signature: sig6.signature,
      paramString: sig6.paramString,
      fieldCount: Object.keys(dataSorted).length
    })

    return NextResponse.json({
      success: true,
      targetSignature: 'a8260285010cc512f3512e15e21ced19',
      results,
      analysis: {
        message: 'Look for which test produces the target signature',
        breakingPoint: 'Compare base vs name_first to see exactly what breaks'
      }
    })

  } catch (error) {
    console.error('Debug name error:', error)
    return NextResponse.json({ error: 'Failed to debug name field' }, { status: 500 })
  }
}

function generateSignature(data: Record<string, any>): { signature: string, paramString: string } {
  let pfOutput = ''
  
  // Process in object order (current method)
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
        const val = data[key].toString().trim()
        pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`
      }
    }
  }
  
  let getString = pfOutput.slice(0, -1)
  
  const signature = crypto.createHash('md5').update(getString).digest('hex')
  return { signature, paramString: getString }
}

function generateSignatureAlphabetical(data: Record<string, any>): { signature: string, paramString: string } {
  let pfOutput = ''
  
  // Process in alphabetical order
  const sortedKeys = Object.keys(data).sort()
  for (const key of sortedKeys) {
    if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
      const val = data[key].toString().trim()
      pfOutput += `${key}=${encodeURIComponent(val).replace(/%20/g, '+')}&`
    }
  }
  
  let getString = pfOutput.slice(0, -1)
  
  const signature = crypto.createHash('md5').update(getString).digest('hex')
  return { signature, paramString: getString }
}