"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Database,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AdminStats {
  totalUsers: number
  totalProfiles: number
  totalQuizResults: number
  recentSignups: number
  adminUsers: number
  totalOrders: number
}

interface RecentUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  created_at: string
}

export default function AdminDashboard() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProfiles: 0,
    totalQuizResults: 0,
    recentSignups: 0,
    adminUsers: 0,
    totalOrders: 0
  })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchDashboardData()
    }
  }, [user, profile])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        console.error('No access token available')
        return
      }

      // Fetch data from API route that uses server-side client
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        return
      }

      const { stats: fetchedStats, recentUsers: fetchedRecentUsers } = await response.json()
      
      setStats(fetchedStats)
      setRecentUsers(fetchedRecentUsers)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.first_name || 'Admin'}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your FJ e-commerce platform today.
        </p>
      </div>

      {/* Phase Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Development Status
          </CardTitle>
          <CardDescription>
            Current phase progress and next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Database Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Admin System Active</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">User Management Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Products (Phase 2)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Orders (Phase 5)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
              +{stats.recentSignups} this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Completions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalQuizResults}</div>
            <p className="text-xs text-muted-foreground mt-1">
              User engagement metric
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.adminUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Platform administrators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total orders placed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Users
            </CardTitle>
            <CardDescription>
              Latest user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.email
                          }
                        </p>
                        {user.role === 'admin' && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {getTimeAgo(user.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No users found. Database tables may need to be set up.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => window.open('/admin/users', '_blank')}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => window.open('/admin/products', '_blank')}
            >
              <Package className="w-4 h-4 mr-2" />
              Add Products (Phase 2)
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => window.open('/admin/orders', '_blank')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Orders
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard/project/okejhghftdsvvtsjtwbe', '_blank')}
            >
              <Database className="w-4 h-4 mr-2" />
              Database Console
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Development Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Development Roadmap
          </CardTitle>
          <CardDescription>
            Upcoming features and phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">Phase 1 - Users</span>
              </div>
              <p className="text-xs text-gray-600">
                Authentication & user management system
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-sm">Phase 2 - Products</span>
              </div>
              <p className="text-xs text-gray-600">
                Product catalog & inventory management
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-sm">Phase 3 - Cart</span>
              </div>
              <p className="text-xs text-gray-600">
                Shopping cart & checkout system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 