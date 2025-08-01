"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function PayfastTestPage() {
  const [testData, setTestData] = useState({
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
  })

  const [passphrase, setPassphrase] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Client-side signature generation (multiple methods)
  const generateClientSignatures = () => {
    const signatures = []

    // Method 1: Standard URL encoding
    let pfOutput1 = ''
    for (let key in testData) {
      if (testData.hasOwnProperty(key)) {
        if (testData[key] !== '') {
          pfOutput1 += `${key}=${encodeURIComponent(testData[key].trim())}&`
        }
      }
    }
    let getString1 = pfOutput1.slice(0, -1)
    if (passphrase) {
      getString1 += `&passphrase=${encodeURIComponent(passphrase.trim())}`
    }
    signatures.push({
      method: 'Standard URL Encoding (%20 for spaces)',
      paramString: getString1,
      signature: 'client-side-not-available'
    })

    // Method 2: Form encoding (+ for spaces)
    let pfOutput2 = ''
    for (let key in testData) {
      if (testData.hasOwnProperty(key)) {
        if (testData[key] !== '') {
          pfOutput2 += `${key}=${encodeURIComponent(testData[key].trim()).replace(/%20/g, '+')}&`
        }
      }
    }
    let getString2 = pfOutput2.slice(0, -1)
    if (passphrase) {
      getString2 += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
    }
    signatures.push({
      method: 'Form Encoding (+ for spaces)',
      paramString: getString2,
      signature: 'client-side-not-available'
    })

    // Method 3: No encoding
    let pfOutput3 = ''
    for (let key in testData) {
      if (testData.hasOwnProperty(key)) {
        if (testData[key] !== '') {
          pfOutput3 += `${key}=${testData[key].trim()}&`
        }
      }
    }
    let getString3 = pfOutput3.slice(0, -1)
    if (passphrase) {
      getString3 += `&passphrase=${passphrase.trim()}`
    }
    signatures.push({
      method: 'No Encoding',
      paramString: getString3,
      signature: 'client-side-not-available'
    })

    // Method 4: Sorted keys + form encoding
    let pfOutput4 = ''
    const sortedKeys = Object.keys(testData).sort()
    for (const key of sortedKeys) {
      if (testData[key] !== '') {
        pfOutput4 += `${key}=${encodeURIComponent(testData[key].trim()).replace(/%20/g, '+')}&`
      }
    }
    let getString4 = pfOutput4.slice(0, -1)
    if (passphrase) {
      getString4 += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
    }
    signatures.push({
      method: 'Sorted Keys + Form Encoding',
      paramString: getString4,
      signature: 'client-side-not-available'
    })

    return signatures
  }

  const testSignatures = async () => {
    setIsLoading(true)
    
    try {
      // Get client-side parameter strings
      const clientSignatures = generateClientSignatures()
      
      // Test with server-side signature generation
      const response = await fetch('/api/payments/payfast/debug-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testData,
          passphrase: passphrase || null
        })
      })

      const serverResults = await response.json()
      
      // Combine client and server results
      const allResults = [
        ...clientSignatures,
        ...serverResults.results || []
      ]

      setResults(allResults)
    } catch (error) {
      console.error('Test error:', error)
      setResults([{
        method: 'Error',
        paramString: 'Failed to test signatures',
        signature: error.message
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const updateTestData = (key: string, value: string) => {
    setTestData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payfast Signature Test</h1>
          <p className="text-gray-600">Test different signature generation methods to debug Payfast integration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(testData).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key}>{key}</Label>
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => updateTestData(key, e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                ))}
                
                <div>
                  <Label htmlFor="passphrase">Passphrase (optional)</Label>
                  <Input
                    id="passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Leave empty for sandbox"
                  />
                </div>

                <Button 
                  onClick={testSignatures} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Testing...' : 'Test Signatures'}
                </Button>
                
                <Button 
                  onClick={async () => {
                    setIsLoading(true)
                    try {
                      const response = await fetch('/api/payments/payfast/debug-name', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({})
                      })
                      const nameResults = await response.json()
                      setResults(nameResults.results || [])
                    } catch (error) {
                      console.error('Name debug error:', error)
                    } finally {
                      setIsLoading(false)
                    }
                  }}
                  disabled={isLoading}
                  className="w-full"
                  variant="secondary"
                >
                  🔍 Debug Name Field Issue
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label>Your Current Signature:</Label>
                    <code className="block p-2 bg-red-50 border rounded text-sm">
                      f756038e8a9da53f10080ad04b5bd564
                    </code>
                  </div>
                  <div>
                    <Label>Payfast Expected:</Label>
                    <code className="block p-2 bg-green-50 border rounded text-sm">
                      a8260285010cc512f3512e15e21ced19
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Signature Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <p className="text-gray-500">Click "Test Signatures" to see results</p>
                ) : (
                  <div className="space-y-6">
                    {results.map((result, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={result.signature === 'a8260285010cc512f3512e15e21ced19' ? 'default' : 'secondary'}>
                            {result.method}
                          </Badge>
                          {result.signature === 'a8260285010cc512f3512e15e21ced19' && (
                            <Badge variant="default" className="bg-green-600">✓ MATCH!</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-gray-600">Parameter String:</Label>
                            <Textarea
                              value={result.paramString}
                              readOnly
                              rows={3}
                              className="font-mono text-xs"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-600">Generated Signature:</Label>
                            <code className={`block p-2 border rounded text-sm ${
                              result.signature === 'a8260285010cc512f3512e15e21ced19' 
                                ? 'bg-green-50 border-green-300' 
                                : 'bg-gray-50'
                            }`}>
                              {result.signature}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Test Buttons */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setTestData({
                      merchant_id: '10000100',
                      merchant_key: '46f0cd694581a',
                      amount: '100.00',
                      item_name: 'Test Order',
                      return_url: 'https://example.com/return',
                      cancel_url: 'https://example.com/cancel',
                      notify_url: 'https://example.com/notify'
                    })
                    setPassphrase('')
                  }}
                >
                  Load Standard Sandbox Data
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setTestData({
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
                    })
                  }}
                >
                  Load Your Actual Data
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setTestData({
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
                    })
                  }}
                >
                  Load Data WITHOUT Names
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Test if it's specific to "Sean" or any name
                    setTestData({
                      merchant_id: '10040872',
                      merchant_key: '0hhk76lcagavz',
                      return_url: 'https://fleurene.vercel.app/checkout/confirmation?payment=success&order=c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
                      cancel_url: 'https://fleurene.vercel.app/checkout?payment=cancelled&order=c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
                      notify_url: 'https://fleurene.vercel.app/api/payments/payfast/webhook',
                      m_payment_id: 'c49cfe3c-fa0a-4839-9073-331bc73fbcc5',
                      amount: '75.10',
                      item_name: 'Order 20250801-0004',
                      item_description: 'Payment for order 20250801-0004',
                      name_first: 'John',
                      name_last: 'Doe', 
                      email_address: 'seanjbayley@gmail.com',
                      custom_str1: 'c49cfe3cfa0a48399073331bc73fbcc5',
                      custom_str2: '202508010004'
                    })
                  }}
                >
                  Test with "John Doe"
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}