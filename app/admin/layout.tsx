"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings, 
  Shield,
  Menu,
  X,
  Home,
  LogOut
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import "./globals.css"

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic'

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and stats"
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage customers"
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    description: "Product catalog",
    badge: "Phase 2"
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Order management",
    badge: "Phase 5"
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Sales & performance",
    badge: "Phase 7"
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "System configuration"
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, loading, signOut, forceRefresh } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // Removed isAdmin state - we check profile?.role directly
  const [checking, setChecking] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authCheckStartTime, setAuthCheckStartTime] = useState<number>(Date.now())

  useEffect(() => {
    const startTime = Date.now()
    setAuthCheckStartTime(startTime)
    
    console.log(`🔐 [AdminLayout] Auth check started at ${new Date().toISOString()}`)
    console.log(`🔐 [AdminLayout] Current state:`, {
      loading,
      hasUser: !!user,
      userId: user?.id,
      profileRole: profile?.role,
      profileLoaded: profile !== undefined,
      checking
    })

    // Reduce timeout and add more detailed logging
    const timeout = setTimeout(() => {
      if (checking) {
        const elapsed = Date.now() - startTime
        console.error(`🔐 [AdminLayout] Auth check timed out after ${elapsed}ms`)
        console.error(`🔐 [AdminLayout] Final state:`, {
          loading,
          hasUser: !!user,
          profileLoaded: profile !== undefined,
          profileRole: profile?.role
        })
        setAuthError(`Authentication check timed out (${elapsed}ms)`)
        setChecking(false)
      }
    }, 30000) // Increased to 30 seconds

    // REMOVED: No more caching - check admin status on every page load
    // This ensures fresh auth checks for each admin page

    if (!loading) {
      console.log(`🔐 [AdminLayout] Auth loading complete, processing...`)
      
      // Clear any previous auth errors
      setAuthError(null)
      
      if (!user) {
        console.log(`🔐 [AdminLayout] No user found, redirecting to sign in`)
        window.location.href = '/?auth=signin&message=Please sign in to access admin area'
        setChecking(false)
        clearTimeout(timeout)
        return
      }

      // Check if user is admin
      if (profile?.role === 'admin') {
        const elapsed = Date.now() - startTime
        console.log(`🔐 [AdminLayout] Admin access confirmed in ${elapsed}ms for user:`, user.id)
        setChecking(false)
        clearTimeout(timeout)
      } else if (profile && profile.role !== 'admin') {
        console.log(`🔐 [AdminLayout] User is not admin, role:`, profile.role)
        window.location.href = '/?error=access_denied&message=Admin access required'
        setChecking(false)
        clearTimeout(timeout)
      } else if (profile === null) {
        // Profile is explicitly null - this could be a database issue
        console.error(`🔐 [AdminLayout] Profile is null for user:`, user.id)
        setAuthError('Unable to load user profile')
        setChecking(false)
        clearTimeout(timeout)
      } else {
        // Profile is undefined, still waiting
        console.log(`🔐 [AdminLayout] Still waiting for profile to load...`)
      }
    } else {
      console.log(`🔐 [AdminLayout] Auth still loading...`)
    }

    return () => {
      console.log(`🔐 [AdminLayout] Cleanup: clearing timeout`)
      clearTimeout(timeout)
    }
  }, [user, profile, loading, router])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (loading || checking || !profile) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600">Verifying admin access...</p>
          {authError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{authError}</p>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Return to Home
                </button>
                <button 
                  onClick={forceRefresh}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Force Refresh (Debug)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center z-50">
        <div className="max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin dashboard.
              {profile && (
                <span className="block text-sm mt-1">
                  Current role: {profile.role || 'No role assigned'}
                </span>
              )}
            </p>
            <Button onClick={() => router.push('/')} className="w-full cursor-pointer">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 cursor-default">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : -320,
        }}
        className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 cursor-default"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">FJ Admin</h1>
                <p className="text-sm text-gray-500">E-Commerce Dashboard</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Admin User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {profile?.first_name || 'Admin User'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="admin-nav flex-1 p-4 space-y-2 overflow-y-auto">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors group cursor-pointer"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 group-hover:text-purple-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span>View Website</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Header */}
        <header className="admin-header bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your FJ e-commerce platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Phase 1 Active
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Home className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 cursor-default">
          {children}
        </main>
      </div>
    </div>
  )
} 