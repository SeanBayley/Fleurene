import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import { AuthProvider } from "@/components/auth-context"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { Toaster } from "sonner"
import Navigation from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {children}
    </div>
  )
} 