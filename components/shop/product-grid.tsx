"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { ShoppingCart, Eye } from 'lucide-react'

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
  short_description?: string
  status: 'active' | 'draft' | 'archived'
  created_at: string
  product_images?: Array<{
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

interface ProductGridProps {
  products: Product[]
  loading: boolean
  viewMode: 'grid' | 'list'
}

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

export function ProductGrid({ products, loading, viewMode }: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="rounded-full bg-gray-100 p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <ShoppingCart className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500 mb-6">
          Try adjusting your search criteria or browse our collections
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {products.map((product, index) => {
          const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url ||
                              product.product_images?.[0]?.image_url
          const isOutOfStock = product.track_quantity && !product.allow_backorder && product.stock_quantity <= 0
          const isLowStock = product.track_quantity && product.stock_quantity <= 5 && product.stock_quantity > 0
          const onSale = product.compare_price && product.compare_price > product.price

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {primaryImage ? (
                        <Link href={`/shop/${product.slug}`}>
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <span className="text-3xl">✨</span>
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {onSale && (
                          <Badge className="bg-red-500 text-white text-xs">
                            Sale
                          </Badge>
                        )}
                        {isLowStock && !isOutOfStock && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            Low Stock
                          </Badge>
                        )}
                        {isOutOfStock && (
                          <Badge className="bg-gray-500 text-white text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <Link href={`/shop/${product.slug}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          
                          {product.short_description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {product.short_description}
                            </p>
                          )}
                          
                          {product.sku && (
                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-purple-600">
                              {formatPrice(product.price)}
                            </span>
                            {onSale && (
                              <span className="text-lg text-gray-500 line-through">
                                {formatPrice(product.compare_price!)}
                              </span>
                            )}
                          </div>
                          
                          {onSale && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Save {formatPrice(product.compare_price! - product.price)}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/shop/${product.slug}`}>
                            <div className="p-2 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </div>
                          </Link>
                          
                          <AddToCartButton
                            product={product}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // Grid View
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* Floating magical elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute top-1/4 left-1/10 w-40 h-40 bg-pink-100/30 rounded-full blur-2xl"
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-2/3 right-1/6 w-56 h-56 bg-purple-100/30 rounded-full blur-2xl"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -15, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: -6 }}
        />
        <motion.div
          className="absolute bottom-1/10 left-1/5 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"
          animate={{
            x: [0, 20, -25, 0],
            y: [0, -15, 20, 0],
            scale: [1, 1.08, 0.92, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: -10 }}
        />
        {/* Floating flower/emoji elements */}
        <motion.div className="absolute left-1/3 top-1/2 text-3xl opacity-30" animate={{ y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity }}>
          🌸
        </motion.div>
        <motion.div className="absolute right-1/4 top-1/3 text-2xl opacity-30" animate={{ x: [0, 20, -20, 0] }} transition={{ duration: 14, repeat: Infinity }}>
          🦋
        </motion.div>
        <motion.div className="absolute left-1/5 bottom-1/4 text-2xl opacity-30" animate={{ y: [0, 20, -20, 0] }} transition={{ duration: 16, repeat: Infinity }}>
          🌷
        </motion.div>
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
        {products.map((product, index) => {
          const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url ||
                              product.product_images?.[0]?.image_url
          const isOutOfStock = product.track_quantity && !product.allow_backorder && product.stock_quantity <= 0
          const isLowStock = product.track_quantity && product.stock_quantity <= 5 && product.stock_quantity > 0
          const onSale = product.compare_price && product.compare_price > product.price

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border-0">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden flex items-center justify-center">
                    {primaryImage ? (
                      <Link href={`/shop/${product.slug}`}>
                        <Image
                          src={primaryImage}
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <span className="text-4xl">✨</span>
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {onSale && (
                        <Badge className="bg-red-500 text-white">
                          Sale
                        </Badge>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <Badge className="bg-orange-500 text-white">
                          Only {product.stock_quantity} left
                        </Badge>
                      )}
                      {isOutOfStock && (
                        <Badge className="bg-gray-500 text-white">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    {/* Quick View Button */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/shop/${product.slug}`}>
                        <div className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </div>
                      </Link>
                    </div>
                  </div>
                  {/* Product Details */}
                  <div className="p-4">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.short_description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    {product.sku && (
                      <p className="text-xs text-gray-500 mb-3">
                        SKU: {product.sku}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-purple-600">
                          {formatPrice(product.price)}
                        </span>
                        {onSale && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compare_price!)}
                          </span>
                        )}
                      </div>
                      {onSale && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Save {formatPrice(product.compare_price! - product.price)}
                        </Badge>
                      )}
                    </div>
                    <AddToCartButton
                      product={product}
                      className="w-full bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 rounded-full font-semibold shadow-md hover:shadow-xl transition-all duration-300 hover:from-pink-300 hover:to-purple-300 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      size="sm"
                      label="Add to Garden"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 