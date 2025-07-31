"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Search, Mail, Calendar, MapPin, Sparkles } from 'lucide-react'
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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
    <div className="min-h-screen bg-gradient-to-br from-pink-25 via-purple-25 to-blue-25 relative overflow-x-hidden">
      <Navigation />
      {/* Magical Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-1/10 w-80 h-80 bg-pink-50/20 rounded-full blur-3xl"
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/5 right-1/6 w-96 h-96 bg-purple-50/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: -8 }}
        />
        <motion.div
          className="absolute bottom-1/10 left-1/5 w-72 h-72 bg-blue-50/20 rounded-full blur-3xl"
          animate={{
            x: [0, 40, -50, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: -15 }}
        />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`floating-${i}`}
            className="absolute text-lg opacity-20"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 20 + (i * 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          >
            {["🌸", "✨", "🦋", "💫", "🌺", "⭐"][i % 6]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Track Your Order ✨
            </motion.h1>
            <motion.p 
              className="text-lg text-purple-700/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Enter your email address to discover the journey of your beautiful blooms
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-200/50 shadow-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl text-purple-700">
                  <Search className="h-6 w-6" />
                  Track Your Order
                  <Sparkles className="h-5 w-5 text-pink-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTrackOrder} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-purple-700 font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="orderNumber" className="text-purple-700 font-medium">Order Number (Optional)</Label>
                    <Input
                      id="orderNumber"
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Enter order number to track specific order"
                      className="mt-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 text-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Searching for your blooms...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Track Order ✨
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {hasSearched && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {orders.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50 shadow-xl">
                    <CardContent className="text-center py-12">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Package className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-3 text-purple-700">No Orders Found</h3>
                      <p className="text-purple-600/80">
                        We couldn't find any orders for the email address provided.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/80 backdrop-blur-sm border-purple-200/50 shadow-xl">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-3 text-xl text-purple-700">
                                <Package className="h-6 w-6" />
                                Order #{order.orderNumber}
                              </CardTitle>
                              <p className="text-sm text-purple-600/80 mt-2">
                                Placed on {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} text-sm font-medium px-3 py-1`}>
                              {order.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Order Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                              <div className="flex items-center gap-2 text-sm text-purple-600 mb-2">
                                <Mail className="h-4 w-4" />
                                Customer
                              </div>
                              <p className="font-medium text-purple-700">
                                {order.customer.firstName} {order.customer.lastName}
                              </p>
                              <p className="text-sm text-purple-600/80">{order.customer.email}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                              <div className="flex items-center gap-2 text-sm text-purple-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                Shipping
                              </div>
                              <p className="font-medium text-purple-700">{order.shipping.address}</p>
                              <p className="text-sm text-purple-600/80">
                                {order.shipping.city}, {order.shipping.state}
                              </p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                              <div className="flex items-center gap-2 text-sm text-purple-600 mb-2">
                                <Calendar className="h-4 w-4" />
                                Total
                              </div>
                              <p className="font-medium text-lg text-purple-700">{formatPrice(order.totalAmount)}</p>
                              <p className="text-sm text-purple-600/80">{order.items.length} item(s)</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div>
                            <h4 className="font-medium mb-4 text-purple-700 text-lg">Order Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/50">
                                  <div className="flex items-center gap-4">
                                    {item.product_image && (
                                      <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="w-14 h-14 object-cover rounded-lg border border-purple-200"
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium text-purple-700">{item.product_name}</p>
                                      <p className="text-sm text-purple-600/80">
                                        Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-medium text-purple-700">{formatPrice(item.total_price)}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status History */}
                          {order.statusHistory.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-4 text-purple-700 text-lg">Order Status History</h4>
                              <div className="space-y-3">
                                {order.statusHistory
                                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                  .map((status, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/50">
                                      <Badge className={`${getStatusColor(status.status)} text-sm font-medium`}>
                                        {status.status}
                                      </Badge>
                                      <div className="flex-1">
                                        {status.notes && <p className="text-sm text-purple-700">{status.notes}</p>}
                                        <p className="text-xs text-purple-600/80">
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
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 