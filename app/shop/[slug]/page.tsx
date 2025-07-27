"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  Star, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { toast } from 'sonner'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  sku: string | null
  price: number
  compare_price: number | null
  brand: string | null
  stock_quantity: number
  track_quantity: boolean
  allow_backorder: boolean
  is_active: boolean
  is_featured: boolean
  tags: string[]
  materials: string[]
  care_instructions: string | null
  weight: number | null
  dimensions: any
  created_at: string
  product_categories?: { name: string; slug: string }
  product_images?: Array<{
    id: string
    image_url: string
    alt_text: string | null
    is_primary: boolean
    sort_order: number
  }>
  product_variants?: Array<{
    id: string
    name: string
    price: number | null
    stock_quantity: number
    options: Record<string, string>
  }>
}

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_categories(name, slug),
          product_images(id, image_url, alt_text, is_primary, sort_order),
          product_variants(id, name, price, stock_quantity, options)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        if (error.code === 'PGRST116') {
          // Product not found
          router.push('/shop')
          toast.error('Product not found')
        }
      } else {
        setProduct(data)
        // Sort images by sort_order and primary first
        if (data.product_images) {
          data.product_images.sort((a: any, b: any) => {
            if (a.is_primary && !b.is_primary) return -1
            if (!a.is_primary && b.is_primary) return 1
            return a.sort_order - b.sort_order
          })
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const adjustQuantity = (delta: number) => {
    const maxQuantity = product?.track_quantity ? product.stock_quantity : 99
    const newQuantity = Math.max(1, Math.min(quantity + delta, maxQuantity))
    setQuantity(newQuantity)
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description || '',
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image skeleton */}
              <div className="bg-gray-200 rounded-lg h-96"></div>
              {/* Content skeleton */}
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.product_images || []
  const currentImage = images[selectedImageIndex]
  const isOutOfStock = product.track_quantity && !product.allow_backorder && product.stock_quantity <= 0
  const isOnSale = product.compare_price && product.compare_price > product.price

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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/shop" className="hover:text-purple-600 transition-colors">
            Shop
          </Link>
          <span>/</span>
          {product.product_categories && (
            <>
              <span className="hover:text-purple-600 transition-colors">
                {product.product_categories.name}
              </span>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800 font-medium">{product.name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-2xl">
              {currentImage ? (
                <Image
                  src={currentImage.image_url}
                  alt={currentImage.alt_text || product.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-6xl">✨</span>
                </div>
              )}
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      if (selectedImageIndex === 0) {
                        setSelectedImageIndex(images.length - 1) // Loop to last image
                      } else {
                        setSelectedImageIndex(selectedImageIndex - 1)
                      }
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (selectedImageIndex === images.length - 1) {
                        setSelectedImageIndex(0) // Loop to first image
                      } else {
                        setSelectedImageIndex(selectedImageIndex + 1)
                      }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Sale Badge */}
              {isOnSale && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  Sale
                </Badge>
              )}

              {/* Stock Badge */}
              {isOutOfStock && (
                <Badge className="absolute top-4 right-4 bg-gray-500 text-white">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl p-6">
              <CardContent className="p-0 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-serif font-light text-gray-800">
                      {product.name}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className={`p-2 rounded-full transition-colors ${
                          isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {product.brand && (
                    <p className="text-gray-600 mb-2">by {product.brand}</p>
                  )}

                  {product.sku && (
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-purple-600">
                      {formatPrice(product.price)}
                    </span>
                    {isOnSale && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(product.compare_price!)}
                        </span>
                        <Badge className="bg-green-100 text-green-800">
                          Save {formatPrice(product.compare_price! - product.price)}
                        </Badge>
                      </>
                    )}
                  </div>
                  
                  {/* Stock Info */}
                  <div className="flex items-center space-x-2">
                    {product.track_quantity && (
                      <span className={`text-sm ${
                        product.stock_quantity > 10 
                          ? 'text-green-600' 
                          : product.stock_quantity > 0 
                            ? 'text-orange-600' 
                            : 'text-red-600'
                      }`}>
                        {product.stock_quantity > 0 
                          ? `${product.stock_quantity} in stock`
                          : 'Out of stock'
                        }
                      </span>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                {product.short_description && (
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {product.short_description}
                  </p>
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => adjustQuantity(-1)}
                        disabled={quantity <= 1}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => adjustQuantity(1)}
                        disabled={product.track_quantity && quantity >= product.stock_quantity}
                        className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <AddToCartButton
                    product={product}
                    quantity={quantity}
                    size="lg"
                    className="w-full rounded-full font-semibold relative z-20"
                    disabled={isOutOfStock}
                    label="Add to Garden"
                  />
                </div>

                <Separator />

                {/* Full Description */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Description</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Materials */}
                {product.materials && product.materials.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Materials</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Care Instructions */}
                {product.care_instructions && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Care Instructions</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {product.care_instructions}
                    </p>
                  </div>
                )}

                {/* Product Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Product Details</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {product.weight && (
                      <div className="flex justify-between">
                        <span>Weight:</span>
                        <span>{product.weight}g</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span>{JSON.stringify(product.dimensions)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Collection:</span>
                      <span>{product.brand || 'FJ Collection'}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 