"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  compare_price?: number
  stock_quantity: number
  track_quantity: boolean
  allow_backorder: boolean
  sku?: string
  is_active: boolean
  materials: string[]
  care_instructions: string | null
  product_images?: Array<{
    image_url: string
    alt_text?: string
    is_primary: boolean
  }>
}

interface MagicalElement {
  id: string
  x: number
  y: number
  emoji: string
  fontSize: number
  duration: number
  delay: number
}

export default function CommunityJournalSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sparkles, setSparkles] = useState<MagicalElement[]>([])
  const [magicalElements, setMagicalElements] = useState<MagicalElement[]>([])
  const [isClient, setIsClient] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Generate sparkles
    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: `sparkle-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: "✨",
      fontSize: Math.random() * 8 + 8,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }))

    // Generate magical elements
    const newMagicalElements = Array.from({ length: 12 }, (_, i) => ({
      id: `magic-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: ["🧚‍♀️", "🦋", "🌸", "🍄", "🌙", "⭐", "🌿", "🌺", "🕊️", "💫", "🦢", "🌹"][i],
      fontSize: 24,
      duration: 6 + Math.random() * 3,
      delay: Math.random() * 4,
    }))

    setSparkles(newSparkles)
    setMagicalElements(newMagicalElements)
  }, [isClient])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          short_description,
          price,
          compare_price,
          stock_quantity,
          track_quantity,
          allow_backorder,
          sku,
          is_active,
          materials,
          care_instructions,
          product_images (
            id,
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

  // Helper function to get magical elements based on product index
  const getMagicalElements = (index: number) => {
    const elements = [
      { emoji: "🌸", element: "🌺", mood: "Enchanting" },
      { emoji: "✨", element: "💫", mood: "Mystical" },
      { emoji: "🦋", element: "🌷", mood: "Delicate" },
      { emoji: "🌙", element: "⭐", mood: "Dreamy" },
      { emoji: "🌿", element: "🌹", mood: "Natural" },
      { emoji: "🧚‍♀️", element: "🌼", mood: "Magical" },
    ]
    return elements[index % elements.length]
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-25 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-12 bg-purple-100 rounded-md w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-purple-100 rounded-md w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-purple-100 rounded-3xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-25 to-blue-25 relative overflow-hidden">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Sparkles */}
        {isClient && sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute text-yellow-300"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              fontSize: `${sparkle.fontSize}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}

        {/* Floating Magical Elements */}
        {isClient && magicalElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 15, -15, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: element.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: element.delay,
            }}
          >
            {element.emoji}
          </motion.div>
        ))}

        {/* Magical Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-40 h-40 bg-gradient-to-r from-blue-200/30 to-pink-200/30 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: -3 }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Enchanted Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Magical Title with Floating Elements */}
          <motion.div
            className="relative inline-block mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute -top-4 -left-4 text-2xl"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              🧚‍♀️
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-6 text-xl"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: -1 }}
            >
              ✨
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-purple-600 via-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              The Fleurene Garden
            </h2>
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-lg"
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
            >
              🌸
            </motion.div>
          </motion.div>

          <motion.p
            className="text-xl text-purple-500 mb-6 font-light italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Where dreams take shape in precious metals and sparkling stones
          </motion.p>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Step into our enchanted garden where each piece tells a story of magic and wonder
            </p>
            <p className="text-purple-400 italic">
              Every treasure blooms with its own unique charm, waiting to become part of your story 🌺
            </p>
          </motion.div>
        </motion.div>

        {/* Magical Products Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
        >
          {products.map((product, index) => {
            const magicalElements = getMagicalElements(index)
            const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url ||
                                product.product_images?.[0]?.image_url

            return (
            <motion.div
                key={product.id}
              className="relative group"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              {/* Magical Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-25/60 to-pink-25/60 rounded-3xl backdrop-blur-sm border border-purple-100/50 shadow-lg group-hover:shadow-2xl transition-all duration-500" />

              {/* Floating Sparkles around Card */}
              <motion.div
                className="absolute -top-2 -right-2 text-yellow-400 text-sm"
                animate={{
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
              >
                ✨
              </motion.div>
              <motion.div
                className="absolute -bottom-1 -left-1 text-pink-400 text-xs"
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.7 }}
              >
                🌸
              </motion.div>

              {/* Card Content */}
              <div className="relative p-8">
                {/* Magical Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        className="text-2xl"
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: index }}
                      >
                          {magicalElements.element}
                      </motion.div>
                        <Link href={`/shop/${product.slug}`}>
                          <h3 className="font-serif text-lg text-gray-800 font-medium hover:text-purple-600 transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <motion.div
                        className="w-6 h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center text-xs"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        🧚‍♀️
                      </motion.div>
                        <span className="text-purple-600 font-medium">{formatPrice(product.price)}</span>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-gray-400 line-through text-xs">
                            {formatPrice(product.compare_price)}
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <motion.div
                      className="text-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                    >
                        {magicalElements.emoji}
                    </motion.div>
                      <span className="text-xs text-gray-400">{magicalElements.mood}</span>
                    </div>
                  </div>

                  {/* Product Image */}
                  {primaryImage && (
                    <div className="relative mb-6 rounded-2xl overflow-hidden">
                      <Link href={`/shop/${product.slug}`}>
                        <div className="aspect-square relative cursor-pointer">
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {/* Garden light filter */}
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </Link>
                </div>
                  )}

                {/* Magical Content */}
                <div className="relative">
                    <p className="text-gray-700 leading-relaxed mb-6 text-sm font-light italic">
                      "{product.short_description || product.description || 'A magical piece waiting to tell its story...'}"
                    </p>

                  {/* Decorative Quote Marks */}
                  <div className="absolute -top-2 -left-2 text-purple-200 text-2xl font-serif">"</div>
                  <div className="absolute -bottom-4 -right-2 text-purple-200 text-2xl font-serif">"</div>
                </div>

                {/* Magical Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-100/50">
                  <motion.div
                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100/60 to-pink-100/60 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                      <span className="text-lg">{magicalElements.emoji}</span>
                      <span className="text-xs text-purple-700 font-medium">{magicalElements.mood}</span>
                  </motion.div>

                    {/* Add to Garden Button */}
                  <motion.button
                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-100/60 to-rose-100/60 rounded-full text-pink-600 hover:text-pink-700 transition-colors group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        try {
                          await addItem({
                            id: `${product.id}-default`,
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            comparePrice: product.compare_price,
                            slug: product.slug,
                            sku: product.sku,
                            image: primaryImage,
                            maxQuantity: product.track_quantity ? product.stock_quantity : undefined,
                          }, 1)
                          
                          toast.success('Added to your enchanted garden! 🌸', {
                            description: product.name
                          })
                        } catch (error) {
                          console.error('Add to garden error:', error)
                          toast.error('Failed to add to garden', {
                            description: 'Please try again'
                          })
                        }
                      }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.4 }}
                    >
                       🌸
                    </motion.div>
                     <span className="text-sm font-medium">Add to Garden</span>
                    <motion.div
                      className="text-xs"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.6 }}
                    >
                      ✨
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )
        })}
        </motion.div>

        {/* Magical Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          viewport={{ once: true }}
        >
          <motion.div className="relative inline-block mb-6" whileHover={{ scale: 1.05 }}>
            <motion.div
              className="absolute -top-3 -left-3 text-xl"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              🌟
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-4 text-lg"
              animate={{
                y: [0, -8, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: -1 }}
            >
              ✨
            </motion.div>

            <div className="bg-gradient-to-r from-purple-50 via-pink-25 to-purple-50 rounded-2xl p-8 border border-purple-100/50 backdrop-blur-sm shadow-lg">
              <p className="text-gray-600 mb-4 text-lg font-light">
              Discover more magical treasures waiting to be found in our enchanted collection?
              </p>
            <Link href="/shop">
              <motion.div
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-200/60 to-pink-200/60 text-purple-700 rounded-full text-sm font-medium border border-purple-200/50 backdrop-blur-sm cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(147, 51, 234, 0.15)",
                  background: "linear-gradient(to right, rgba(196, 181, 253, 0.8), rgba(251, 207, 232, 0.8))",
                }}
                animate={{
                  boxShadow: [
                    "0 5px 15px rgba(147, 51, 234, 0.1)",
                    "0 8px 25px rgba(147, 51, 234, 0.15)",
                    "0 5px 15px rgba(147, 51, 234, 0.1)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  🧚‍♀️
                </motion.span>
                <span>Explore Our Complete Garden Collection</span>
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  ✨
                </motion.span>
              </motion.div>
            </Link>
            </div>

            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-lg"
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: -2 }}
            >
              🌸
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
