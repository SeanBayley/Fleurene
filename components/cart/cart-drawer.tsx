"use client"

import { useCart } from './cart-provider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { EnchantedButton } from '@/components/ui/enchanted-button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

interface CartDrawerProps {
  children?: React.ReactNode
  side?: 'left' | 'right'
}

export function CartDrawer({ children, side = 'right' }: CartDrawerProps) {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    totalSavings, 
    isOpen, 
    isLoading, 
    closeCart, 
    updateQuantity, 
    removeItem,
    clearCart 
  } = useCart()

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCart()
    } catch (error) {
      console.error('Failed to clear cart:', error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      {children && (
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
      )}
      
      <SheetContent side={side} className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-gray-100 p-6">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some products to get started</p>
                <Button onClick={closeCart} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1 pr-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingCart className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm leading-tight line-clamp-2">
                              {item.name}
                            </h4>
                            {item.variant && (
                              <p className="text-xs text-gray-600 mt-1">
                                {Object.entries(item.variant.options)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')}
                              </p>
                            )}
                            {item.sku && (
                              <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {formatPrice(item.price)}
                              </span>
                              {item.comparePrice && item.comparePrice > item.price && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(item.comparePrice)}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-600">
                              Total: {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isLoading || Boolean(item.maxQuantity && item.quantity >= item.maxQuantity)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {item.maxQuantity && item.quantity >= item.maxQuantity && (
                          <p className="text-xs text-orange-600 mt-1">
                            Maximum quantity reached
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Cart Summary */}
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>You save</span>
                      <span>-{formatPrice(totalSavings)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href="/checkout" onClick={closeCart}>
                    <EnchantedButton className="w-full" size="lg">
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </EnchantedButton>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      disabled={isLoading}
                      className="px-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-gray-600 text-center">
                  <p>Secure checkout with SSL encryption</p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Cart Trigger Button Component
interface CartTriggerProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CartTrigger({ className = '', showText = true, size = 'md' }: CartTriggerProps) {
  const { totalItems, openCart } = useCart()

  const sizeClasses = {
    sm: 'h-8 px-2 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }

  return (
    <Button
      variant="outline"
      className={`relative ${sizeClasses[size]} ${className}`}
      onClick={openCart}
    >
      <ShoppingCart className="h-4 w-4" />
      
      {showText && <span className="ml-2">Cart</span>}
      
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
    </Button>
  )
} 