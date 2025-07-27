"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle, ArrowLeft } from 'lucide-react'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber?: string
    totalAmount?: string
  }>({})

  useEffect(() => {
    // Get order details from URL params
    const orderNumber = searchParams.get('order')
    const totalAmount = searchParams.get('total')
    
    if (orderNumber || totalAmount) {
      setOrderDetails({
        orderNumber: orderNumber || undefined,
        totalAmount: totalAmount || undefined
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-800">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Thank you for your order! We've received your payment and are preparing your items.
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll receive an order confirmation email</li>
              <li>• We'll process your payment through Payfast</li>
              <li>• Once payment is confirmed, we'll prepare your order</li>
              <li>• You'll receive shipping updates via email</li>
            </ul>
          </div>

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