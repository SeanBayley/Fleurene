"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ShoppingCart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
  is_active: boolean
  created_at: string
  product_images?: Array<{
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          compare_price,
          stock_quantity,
          track_quantity,
          allow_backorder,
          sku,
          short_description,
          is_active,
          created_at,
          product_images (
            image_url,
            alt_text,
            is_primary
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.short_description && product.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-16 relative overflow-hidden">
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
        <motion.div
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-pink-100/20 rounded-full blur-2xl"
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 15, -10, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: -15 }}
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
        <motion.div className="absolute right-1/3 bottom-1/3 text-2xl opacity-30" animate={{ x: [0, -15, 15, 0] }} transition={{ duration: 13, repeat: Infinity }}>
          ✨
        </motion.div>
        <motion.div className="absolute left-1/4 top-1/4 text-2xl opacity-30" animate={{ y: [0, -20, 20, 0] }} transition={{ duration: 15, repeat: Infinity }}>
          🌺
        </motion.div>
        <motion.div className="absolute right-1/5 top-2/3 text-2xl opacity-30" animate={{ x: [0, 25, -25, 0] }} transition={{ duration: 17, repeat: Infinity }}>
          💫
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-serif font-light text-gray-800 mb-4">
            ✨ Enchanted Garden Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover handcrafted jewelry that captures your dreams and celebrates your unique spirit in our magical garden
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search our enchanted collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-200 rounded-full shadow-lg"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'treasure' : 'treasures'} found in our garden
          </span>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="rounded-full bg-white/80 backdrop-blur-sm p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <ShoppingCart className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No treasures found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or explore our enchanted collections
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url ||
                                  product.product_images?.[0]?.image_url
              const isOutOfStock = product.track_quantity && !product.allow_backorder && product.stock_quantity <= 0
              const onSale = product.compare_price && product.compare_price > product.price

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border-0">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <Link href={`/shop/${product.slug}`}>
                        <div className="relative h-64 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden cursor-pointer flex items-center justify-center">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              className="object-contain transition-transform duration-300 hover:scale-105"
                            />
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
                            {isOutOfStock && (
                              <Badge className="bg-gray-500 text-white">
                                Out of Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-4">
                        <Link href={`/shop/${product.slug}`}>
                          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-purple-600 transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {product.short_description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.short_description}
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
                          className="w-full rounded-full font-semibold relative z-20"
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
        )}
      </div>
    </div>
  )
} 