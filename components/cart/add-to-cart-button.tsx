"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart, type CartItem } from './cart-provider'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { analytics } from '@/lib/analytics'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_price?: number
  stock_quantity: number
  track_quantity: boolean
  allow_backorder: boolean
  sku?: string
  product_images?: Array<{
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

interface AddToCartButtonProps {
  product: Product
  variant?: {
    id: string
    name: string
    price?: number
    stock_quantity?: number
    options: Record<string, string>
  }
  quantity?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showQuantitySelector?: boolean
  disabled?: boolean
  label?: string // <-- add label prop
}

export function AddToCartButton({ 
  product, 
  variant, 
  quantity: initialQuantity = 1,
  size = 'md',
  className = '',
  showQuantitySelector = false,
  disabled = false,
  label = 'Add to Cart', // <-- default label
}: AddToCartButtonProps) {
  const { addItem, updateQuantity, items, isLoading } = useCart()
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Get the effective price (variant price overrides product price)
  const effectivePrice = variant?.price ?? product.price
  const effectiveStock = variant?.stock_quantity ?? product.stock_quantity
  
  // Check if item is already in cart
  const existingCartItem = items.find(
    (item: CartItem) => item.productId === product.id && item.variantId === variant?.id
  )
  const cartQuantity = existingCartItem?.quantity || 0

  // Get primary image
  const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url ||
                      product.product_images?.[0]?.image_url

  // Check stock availability
  const isOutOfStock = product.track_quantity && !product.allow_backorder && effectiveStock <= 0
  const maxQuantity = product.track_quantity && !product.allow_backorder 
    ? Math.max(0, effectiveStock - cartQuantity)
    : 99

  const canAddToCart = !isOutOfStock && !disabled && quantity > 0 && quantity <= maxQuantity

  const handleAddToCart = async () => {
    if (!canAddToCart) return

    setIsAdding(true)
    
    try {
      await addItem({
        id: `${product.id}-${variant?.id || 'default'}`,
        productId: product.id,
        variantId: variant?.id,
        name: variant?.name || product.name,
        price: effectivePrice,
        comparePrice: product.compare_price,
        slug: product.slug,
        sku: product.sku,
        image: primaryImage,
        maxQuantity: product.track_quantity ? effectiveStock : undefined,
        variant: variant ? {
          id: variant.id,
          name: variant.name,
          options: variant.options
        } : undefined
      }, quantity)

      // Track add to cart event
      analytics.trackAddToCart(
        variant?.name || product.name,
        product.id,
        effectivePrice,
        quantity
      )

      // Show success feedback
      setJustAdded(true)
      toast.success(
        `Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`,
        {
          description: variant?.name || product.name
        }
      )

      // Reset quantity if not showing selector
      if (!showQuantitySelector) {
        setQuantity(1)
      }

      // Reset success state after animation
      setTimeout(() => setJustAdded(false), 2000)
      
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add item to cart', {
        description: error instanceof Error ? error.message : 'Please try again'
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleUpdateCartQuantity = async (newQuantity: number) => {
    if (!existingCartItem) return

    try {
      await updateQuantity(existingCartItem.id, newQuantity)
      toast.success('Cart updated')
    } catch (error) {
      console.error('Update cart error:', error)
      toast.error('Failed to update cart')
    }
  }

  const adjustQuantity = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(quantity + delta, maxQuantity))
    setQuantity(newQuantity)
  }

  // Size variants
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }

  // If item is already in cart and we have a quantity selector
  if (existingCartItem && showQuantitySelector) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleUpdateCartQuantity(cartQuantity - 1)}
            disabled={isLoading || cartQuantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
            {cartQuantity}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleUpdateCartQuantity(cartQuantity + 1)}
            disabled={isLoading || cartQuantity >= maxQuantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Badge variant="secondary" className="text-xs">
          In Cart
        </Badge>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Quantity Selector */}
      {showQuantitySelector && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => adjustQuantity(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => adjustQuantity(1)}
              disabled={quantity >= maxQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {maxQuantity < 10 && (
            <span className="text-xs text-gray-500">
              {maxQuantity} available
            </span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!canAddToCart || isAdding || isLoading}
        variant={isOutOfStock ? "secondary" : "default"}
        className={`${sizeClasses[size]} transition-all duration-200 relative z-10 ${
          justAdded ? 'bg-green-600 hover:bg-green-700 text-white' : ''
        } ${
          isOutOfStock 
            ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border border-gray-300 shadow-sm hover:from-gray-200 hover:to-gray-300 cursor-not-allowed' 
            : 'bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 hover:from-pink-300 hover:to-purple-300 shadow-md hover:shadow-xl focus:ring-2 focus:ring-purple-300 focus:outline-none'
        } ${className}`}
        style={{ pointerEvents: isOutOfStock ? 'none' : 'auto' }}
      >
        {isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Adding...
          </>
        ) : justAdded ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Added to Cart!
          </>
        ) : isOutOfStock ? (
          <>
            <span className="mr-2">🌱</span>
            Temporarily Unavailable
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {label}
            {showQuantitySelector && quantity > 1 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {quantity}
              </Badge>
            )}
          </>
        )}
      </Button>

      {/* Stock indicator */}
      {product.track_quantity && !isOutOfStock && effectiveStock <= 5 && (
        <p className="text-xs text-orange-600">
          Only {effectiveStock} left in stock
        </p>
      )}
      
      {/* Cart indicator */}
      {cartQuantity > 0 && !showQuantitySelector && (
        <p className="text-xs text-green-600">
          {cartQuantity} in cart
        </p>
      )}
    </div>
  )
} 