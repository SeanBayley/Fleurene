"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle, ArrowLeft, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber?: string
    totalAmount?: string
    paymentStatus?: string
  }>({})
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    // Get order details from URL params
    const orderNumber = searchParams.get('order')
    const totalAmount = searchParams.get('total')
    const paymentStatus = searchParams.get('payment')
    
    if (orderNumber || totalAmount) {
      setOrderDetails({
        orderNumber: orderNumber || undefined,
        totalAmount: totalAmount || undefined,
        paymentStatus: paymentStatus || undefined
      })
    }
  }, [searchParams])

  const handleRetryPayment = async () => {
    const orderId = searchParams.get('order')
    if (!orderId) {
      toast.error('Order ID not found')
      return
    }

    setIsRetrying(true)

    try {
      const response = await fetch('/api/payments/payfast/retry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to retry payment')
      }

      // Create and submit the payment form
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = result.paymentUrl
      form.style.display = 'none'

      // Add all payment data as hidden inputs
      Object.keys(result.paymentData).forEach(key => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = result.paymentData[key]
        form.appendChild(input)
      })

      // Add form to document and submit
      document.body.appendChild(form)
      form.submit()

    } catch (error) {
      console.error('Error retrying payment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to retry payment')
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            orderDetails.paymentStatus === 'success' 
              ? 'bg-green-100' 
              : orderDetails.paymentStatus === 'cancelled'
              ? 'bg-yellow-100'
              : 'bg-green-100'
          }`}>
            <CheckCircle className={`h-8 w-8 ${
              orderDetails.paymentStatus === 'success' 
                ? 'text-green-600' 
                : orderDetails.paymentStatus === 'cancelled'
                ? 'text-yellow-600'
                : 'text-green-600'
            }`} />
          </div>
          <CardTitle className={`text-xl ${
            orderDetails.paymentStatus === 'success' 
              ? 'text-green-800' 
              : orderDetails.paymentStatus === 'cancelled'
              ? 'text-yellow-800'
              : 'text-green-800'
          }`}>
            {orderDetails.paymentStatus === 'success' 
              ? 'Payment Successful!' 
              : orderDetails.paymentStatus === 'cancelled'
              ? 'Payment Cancelled'
              : 'Order Confirmed!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {orderDetails.paymentStatus === 'success' 
                ? "Thank you for your order! We've received your payment and are preparing your items."
                : orderDetails.paymentStatus === 'cancelled'
                ? "Your payment was cancelled. You can try again or contact support if you need assistance."
                : "Thank you for your order! We've received your payment and are preparing your items."}
            </p>
            
            {orderDetails.orderNumber && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-mono font-medium">{orderDetails.orderNumber}</p>
              </div>
            )}
            
            {orderDetails.totalAmount && (
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-medium">{orderDetails.totalAmount}</p>
              </div>
            )}
          </div>

          {orderDetails.paymentStatus === 'cancelled' ? (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-yellow-800">What can you do next?</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Return to checkout to try payment again</li>
                <li>• Contact our support team for assistance</li>
                <li>• Your order is saved and waiting for payment</li>
              </ul>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">What happens next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• You'll receive an order confirmation email</li>
                <li>• Your payment has been processed through Payfast</li>
                <li>• We'll prepare your order for shipping</li>
                <li>• You'll receive shipping updates via email</li>
              </ul>
            </div>
          )}

          {orderDetails.paymentStatus === 'cancelled' ? (
            <div className="space-y-3">
              <Button 
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="w-full"
              >
                {isRetrying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Retrying Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Retry Payment
                  </>
                )}
              </Button>
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account/orders" className="flex-1">
                <Button className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
              </Link>
            </div>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Questions about your order? Contact us at{' '}
              <a href="mailto:support@fj.com" className="text-blue-600 hover:underline">
                support@fj.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" />
            <CardTitle className="text-xl">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-gray-600">Loading order confirmation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
} 