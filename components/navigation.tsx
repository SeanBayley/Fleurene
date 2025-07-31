"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/button"
import { AuthModal } from "./auth-modal"
import { UserProfileModal } from "./user-profile-modal"
import { CartTrigger } from "./cart/cart-drawer"
import { useAuth } from "./auth-context"
import Link from "next/link"
import { Shield } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, profile, loading, signOut } = useAuth()
  const pathname = usePathname()

  // Don't render navigation on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">
                  Fleurene
                </h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  href="/shop"
                  className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Shop
                </Link>
                <Link
                  href="/track-order"
                  className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Track Order
                </Link>
                
                {/* Admin Link - Only show for admin users */}
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-purple-50 hover:bg-purple-100"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </div>
            </div>

            {/* Auth Section + Cart */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Shopping Cart */}
              <CartTrigger 
                size="sm" 
                className="border-purple-200 text-purple-600 hover:bg-purple-50" 
              />
              
              {loading ? (
                <div className="w-6 h-6 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <motion.button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-6 h-6 bg-purple-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {profile?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm hidden lg:block">
                    {profile?.first_name || "Profile"}
                    {profile?.role === 'admin' && (
                      <span className="ml-1 text-xs bg-purple-600 text-white px-1 rounded">
                        Admin
                      </span>
                    )}
                  </span>
                </motion.button>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm"
                >
                  Sign In ✨
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-purple-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">☰</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-white border-t border-purple-100 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link
                  href="/shop"
                  className="text-purple-600 hover:text-purple-800 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/track-order"
                  className="text-purple-600 hover:text-purple-800 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
                
                {/* Mobile Admin Link */}
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-800 block px-3 py-2 rounded-md text-base font-medium bg-purple-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}

                {/* Mobile Cart */}
                <div className="px-3 py-2">
                  <CartTrigger 
                    size="md" 
                    className="w-full justify-center border-purple-200 text-purple-600 hover:bg-purple-50" 
                    showText={true}
                  />
                </div>

                {/* Mobile Auth */}
                <div className="pt-4 pb-3 border-t border-purple-100">
                  {loading ? (
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : user ? (
                    <div className="flex items-center px-3">
                      <div className="flex-shrink-0">
                        <span className="w-8 h-8 bg-purple-400 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {profile?.first_name?.[0] || user.email?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-purple-800">
                          {profile?.first_name || "User"}
                          {profile?.role === 'admin' && (
                            <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-purple-600">{user.email}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-3">
                      <Button
                        onClick={() => {
                          setShowAuthModal(true)
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm"
                      >
                        Sign In ✨
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  )
}
