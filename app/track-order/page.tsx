"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Search, Mail, Calendar, MapPin } from 'lucide-react'
import { toast } from 'sonner'

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  product_image?: string
}

interface StatusHistory {
  status: string
  notes?: string
  created_at: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  createdAt: string
  customer: {
    email: string
    firstName: string
    lastName: string
  }
  shipping: {
    address: string
    city: string
    state: string
  }
  items: OrderItem[]
  statusHistory: StatusHistory[]
}

export default function TrackOrderPage() {
  const [email, setEmail] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          orderNumber: orderNumber.trim() || undefined
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to track order')
      }

      setOrders(result.orders || [])
      
      if (result.orders && result.orders.length === 0) {
        toast.info(result.message || 'No orders found')
      } else {
        toast.success(`Found ${result.count} order(s)`)
      }

    } catch (error) {
      console.error('Error tracking order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to track order')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your email address to track your orders
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="orderNumber">Order Number (Optional)</Label>
                <Input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter order number to track specific order"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                  <p className="text-gray-600">
                    We couldn't find any orders for the email address provided.
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Order #{order.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Mail className="h-4 w-4" />
                          Customer
                        </div>
                        <p className="font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4" />
                          Shipping
                        </div>
                        <p className="font-medium">{order.shipping.address}</p>
                        <p className="text-sm text-gray-600">
                          {order.shipping.city}, {order.shipping.state}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Calendar className="h-4 w-4" />
                          Total
                        </div>
                        <p className="font-medium text-lg">{formatPrice(order.totalAmount)}</p>
                        <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {item.product_image && (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">{formatPrice(item.total_price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status History */}
                    {order.statusHistory.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Order Status History</h4>
                        <div className="space-y-2">
                          {order.statusHistory
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((status, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Badge className={getStatusColor(status.status)}>
                                  {status.status}
                                </Badge>
                                <div className="flex-1">
                                  {status.notes && <p className="text-sm">{status.notes}</p>}
                                  <p className="text-xs text-gray-600">
                                    {formatDate(status.created_at)}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
} 