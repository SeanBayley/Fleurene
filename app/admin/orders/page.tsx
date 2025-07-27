"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Calendar, 
  User, 
  MapPin,
  ShoppingCart,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

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
    month: 'short',
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
  order_number: string
  status: string
  total_amount: number
  created_at: string
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone?: string
  shipping_address1: string
  shipping_city: string
  shipping_state: string
  payment_status: string
  order_items: OrderItem[]
  order_status_history: StatusHistory[]
}

const ORDER_STATUSES = [
  'pending',
  'processing', 
  'shipped',
  'delivered',
  'cancelled'
]

export default function AdminOrdersPage() {
  const { user, profile } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchOrders()
    }
  }, [user, profile])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        console.error('No access token available')
        toast.error('No access token available')
        return
      }

      console.log('Fetching orders with token:', session.access_token.substring(0, 20) + '...')

      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        toast.error(`Failed to fetch orders: ${errorData.error || 'Unknown error'}`)
        return
      }

      const { orders: fetchedOrders } = await response.json()
      console.log('Fetched orders:', fetchedOrders)
      setOrders(fetchedOrders)

    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string, notes?: string) => {
    try {
      setUpdatingStatus(orderId)
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('No access token available')
      }

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          notes
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order status')
      }

      toast.success(`Order status updated to ${newStatus}`)
      
      // Refresh orders
      await fetchOrders()
      
      // Close dialog if open
      setSelectedOrder(null)

    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_last_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to view this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>
        <Button onClick={fetchOrders} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'No orders have been placed yet'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.customer_first_name} {order.customer_last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer_email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(order.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Order #{order.order_number}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Order Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <h3 className="font-medium flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      Customer Information
                                    </h3>
                                    <div className="text-sm space-y-1">
                                      <p><strong>Name:</strong> {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}</p>
                                      <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                                      {selectedOrder.customer_phone && (
                                        <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <h3 className="font-medium flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      Shipping Address
                                    </h3>
                                    <div className="text-sm space-y-1">
                                      <p>{selectedOrder.shipping_address1}</p>
                                      <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3">
                                  <h3 className="font-medium flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4" />
                                    Order Items
                                  </h3>
                                  <div className="space-y-2">
                                    {selectedOrder.order_items.map((item) => (
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

                                {/* Status Update */}
                                <div className="space-y-3">
                                  <h3 className="font-medium">Update Order Status</h3>
                                  <div className="flex gap-2">
                                    {ORDER_STATUSES.map(status => (
                                      <Button
                                        key={status}
                                        variant={selectedOrder.status === status ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                        disabled={updatingStatus === selectedOrder.id}
                                      >
                                        {updatingStatus === selectedOrder.id && selectedOrder.status === status && (
                                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                        )}
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                {/* Status History */}
                                {selectedOrder.order_status_history.length > 0 && (
                                  <div className="space-y-3">
                                    <h3 className="font-medium">Status History</h3>
                                    <div className="space-y-2">
                                      {selectedOrder.order_status_history
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
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 