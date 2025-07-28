"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import FlowerButton from "@/components/flower-button"
import WhisperIcon from "@/components/whisper-icon"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

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

export default function FeaturedCollections() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
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
          product_images (
            image_url,
            alt_text,
            is_primary
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20) // Increased limit to account for filtering

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        // Filter out out-of-stock products
        const availableProducts = (data || []).filter(product => {
          // If product doesn't track quantity, it's always available
          if (!product.track_quantity) return true
          
          // If product allows backorder, it's available even if stock is 0
          if (product.allow_backorder) return true
          
          // If product tracks quantity and doesn't allow backorder, check if stock > 0
          return product.stock_quantity > 0
        }).slice(0, 6) // Take only the first 6 available products
        
        setProducts(availableProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded-md w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-md w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="collections" className="py-20 bg-white relative overflow-hidden">
      {/* Background whisper icons - positioned far from any text */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Only extreme corners - away from all text */}
        <WhisperIcon icon="🌻" className="absolute top-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="🌼" className="absolute top-[1%] right-[1%] z-0" size="small" />
        <WhisperIcon icon="💐" className="absolute bottom-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="🌹" className="absolute bottom-[1%] right-[1%] z-0" size="small" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-800 mb-6 hover:translate-x-2 transition-transform duration-300 cursor-default relative z-10">
            ✨ Shop Our Magical Collection
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto hover:translate-x-2 transition-transform duration-300 cursor-default relative z-10">
            Discover handcrafted jewelry that captures your dreams and celebrates your unique spirit
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-serif font-light text-gray-600 mb-4">
              🌸 Coming Soon
            </h3>
            <p className="text-gray-500 mb-8">
              Our magical collection is being carefully curated just for you.
            </p>
            <FlowerButton>
              Be the first to shop
            </FlowerButton>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {products.map((product, index) => {
              const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url ||
                                  product.product_images?.[0]?.image_url
              
              return (
                <motion.div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 z-10 bg-white"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative h-64 overflow-hidden cursor-pointer">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <span className="text-4xl">✨</span>
                      </div>
                    )}
                    
                    {/* Sale badge */}
                    {product.compare_price && product.compare_price > product.price && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        Sale
                      </Badge>
                    )}
                    
                    {/* Stock indicator */}
                    {product.track_quantity && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <Badge className="absolute top-3 right-3 bg-orange-500 text-white">
                        Only {product.stock_quantity} left
                      </Badge>
                    )}
                    
                    {product.track_quantity && product.stock_quantity <= 0 && !product.allow_backorder && (
                      <Badge className="absolute top-3 right-3 bg-gray-500 text-white">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  </Link>

                  <div className="p-6">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-xl font-serif font-light text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                    </Link>
                    
                    {product.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    
                    {product.sku && (
                      <p className="text-xs text-gray-500 mb-3">
                        SKU: {product.sku}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-purple-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                      </div>
                      
                      {product.compare_price && product.compare_price > product.price && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Save {formatPrice(product.compare_price - product.price)}
                        </Badge>
                      )}
                    </div>
                    
                    <AddToCartButton
                      product={product}
                      className="w-full"
                      size="md"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        
        {products.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/shop">
              <FlowerButton
                variant="outline"
                className="px-8 py-3 text-lg"
              >
                View All Products
              </FlowerButton>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
