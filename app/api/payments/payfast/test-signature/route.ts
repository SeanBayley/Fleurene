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
  // Create parameter string exactly like Node.js documentation  
  let pfOutput = ''
  
  // Process all keys (don't sort - process in object order)
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

  console.log('Test signature string:', getString)

  // Generate MD5 hash
  return crypto.createHash('md5').update(getString).digest('hex')
}