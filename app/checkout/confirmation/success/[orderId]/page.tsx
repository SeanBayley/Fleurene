"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { analytics } from '@/lib/analytics'

interface Props {
  params: {
    orderId: string
  }
}

interface OrderDetails {
  orderNumber?: string
  totalAmount?: string
  email?: string
  status?: string
  created_at?: string
}

export default function PaymentSuccessPage({ params }: Props) {
  const router = useRouter()
  const { orderId } = params
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details from the database
        const { data: order, error } = await supabase
          .from('orders')
          .select('order_number, total_amount, email, status, created_at')
          .eq('id', orderId)
          .single()

        if (error) {
          console.error('Error fetching order:', error)
          toast.error('Order not found')
          return
        }

        if (order) {
          setOrderDetails({
            orderNumber: order.order_number,
            totalAmount: order.total_amount?.toFixed(2),
            email: order.email,
            status: order.status,
            created_at: order.created_at
          })

          // Track successful purchase
          analytics.trackPurchase({
            orderId,
            orderNumber: order.order_number,
            total: order.total_amount,
            email: order.email
          })

          toast.success('Payment successful! Your order has been confirmed.')
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        toast.error('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading order confirmation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Thank you for your order! Your payment has been processed successfully.
          </p>
          
          {orderDetails.orderNumber && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Order Details</h3>
              <div className="space-y-1 text-sm text-green-700">
                <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
                {orderDetails.totalAmount && (
                  <p><strong>Total:</strong> R{orderDetails.totalAmount}</p>
                )}
                {orderDetails.email && (
                  <p><strong>Email:</strong> {orderDetails.email}</p>
                )}
                <p><strong>Status:</strong> {orderDetails.status || 'Processing'}</p>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>• A confirmation email has been sent to your email address</p>
            <p>• You can track your order using your email address</p>
            <p>• Your order will be processed within 1-2 business days</p>
          </div>
          
          <div className="space-y-2 pt-4">
            <Link href="/track-order" className="w-full">
              <Button className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Track Your Order
              </Button>
            </Link>
            
            <Link href="/shop" className="w-full">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}