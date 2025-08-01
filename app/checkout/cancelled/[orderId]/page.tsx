"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react'

interface Props {
  params: {
    orderId: string
  }
}

export default function PaymentCancelledPage({ params }: Props) {
  const router = useRouter()
  const { orderId } = params

  useEffect(() => {
    toast.error('Payment was cancelled. You can try again below.')
  }, [])

  const handleRetryPayment = async () => {
    try {
      const response = await fetch('/api/payments/payfast/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      })

      const result = await response.json()

      if (response.ok && result.paymentUrl && result.paymentData) {
        // Create and submit form to redirect to Payfast
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = result.paymentUrl

        Object.keys(result.paymentData).forEach(key => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = result.paymentData[key].toString()
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      } else {
        toast.error(result.error || 'Failed to retry payment')
      }
    } catch (error) {
      console.error('Retry payment error:', error)
      toast.error('Failed to retry payment. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-600">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Your payment for order <strong>#{orderId.slice(-8)}</strong> was cancelled.
          </p>
          <p className="text-sm text-gray-500">
            No charges were made to your payment method. You can try again or return to continue shopping.
          </p>
          
          <div className="space-y-2 pt-4">
            <Button 
              onClick={handleRetryPayment}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Payment Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/checkout')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Checkout
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => router.push('/shop')}
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}