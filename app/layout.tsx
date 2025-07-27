import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { WhisperProvider } from "@/components/whisper-context"
import WhisperMessage from "@/components/whisper-message"
import CustomCursor from "@/components/custom-cursor"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fleurene - Jewelry for the Free-Spirited",
  description: "Magical jewelry that captures your dreams, wildflowers, and beautiful moments",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <WhisperProvider>
              <CustomCursor />
              {children}
              <WhisperMessage />
              <CartDrawer />
              <Toaster 
                position="top-right"
                richColors
                closeButton
                duration={4000}
              />
            </WhisperProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
