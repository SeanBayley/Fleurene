"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Gem, Heart, Users, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FlowerBasket from "@/components/flower-basket"

interface DiscoverYourMagicProps {
  onTakeQuiz: () => void
}

type Section = "all-pieces" | "archetypes" | "romance" | "friends" | "family"

// Sample jewelry pieces - you can replace with real data
const allJewelryPieces = [
  {
    id: 1,
    name: "Wisteria Haze Bracelet",
    price: "R89",
    image: "/placeholder.svg?height=300&width=300&text=Wisteria+Haze+Bracelet",
    description: "Delicate purple hues with dreamy charm details",
    tags: ["romantic", "dreamy", "purple"],
    magical: "Whispers of twilight gardens and secret wishes",
    fleureneSpot: "Nestled among the enchanted wisteria blooms",
  },
  {
    id: 2,
    name: "Moonbeam Necklace",
    price: "R124",
    image: "/placeholder.svg?height=300&width=300&text=Moonbeam+Necklace",
    description: "Crescent moon pendant with pearl accents",
    tags: ["celestial", "elegant", "silver"],
    magical: "Captures moonlight in crystalline dreams",
    fleureneSpot: "Bathing in the ethereal moonlit pond",
  },
  {
    id: 3,
    name: "Garden Party Earrings",
    price: "R67",
    image: "/placeholder.svg?height=300&width=300&text=Garden+Party+Earrings",
    description: "Floral studs in soft pastel tones",
    tags: ["floral", "playful", "colorful"],
    magical: "Blooms with the joy of spring mornings",
    fleureneSpot: "Dancing among the whispering wildflowers",
  },
  {
    id: 4,
    name: "Vintage Rose Ring",
    price: "R156",
    image: "/placeholder.svg?height=300&width=300&text=Vintage+Rose+Ring",
    description: "Rose gold band with vintage-inspired details",
    tags: ["vintage", "romantic", "rose-gold"],
    magical: "Holds the romance of forgotten love letters",
    fleureneSpot: "Hidden within the petals of timeless roses",
  },
  {
    id: 5,
    name: "Starlight Anklet",
    price: "R78",
    image: "/placeholder.svg?height=300&width=300&text=Starlight+Anklet",
    description: "Delicate chain with tiny star charms",
    tags: ["celestial", "delicate", "gold"],
    magical: "Dances with stardust and midnight wishes",
    fleureneSpot: "Twinkling in the dreamy stargazing meadow",
  },
  {
    id: 6,
    name: "Butterfly Dreams Pendant",
    price: "R98",
    image: "/placeholder.svg?height=300&width=300&text=Butterfly+Dreams+Pendant",
    description: "Iridescent butterfly with color-changing details",
    tags: ["whimsical", "colorful", "nature"],
    magical: "Transforms with your every movement and mood",
    fleureneSpot: "Fluttering through the enchanted butterfly haven",
  },
  {
    id: 7,
    name: "Minimalist Bar Necklace",
    price: "R89",
    image: "/placeholder.svg?height=300&width=300&text=Minimalist+Bar+Necklace",
    description: "Clean lines with optional engraving",
    tags: ["minimalist", "modern", "gold"],
    magical: "Simplicity that speaks volumes of elegance",
    fleureneSpot: "Resting in the serene meditation garden",
  },
  {
    id: 8,
    name: "Bohemian Stack Rings",
    price: "R134",
    image: "/placeholder.svg?height=300&width=300&text=Bohemian+Stack+Rings",
    description: "Set of 3 stackable rings with natural stones",
    tags: ["bohemian", "natural", "set"],
    magical: "Earth's treasures gathered in harmony",
    fleureneSpot: "Scattered among the crystal healing circle",
  },
  {
    id: 9,
    name: "Promise Heart Locket",
    price: "R145",
    image: "/placeholder.svg?height=300&width=300&text=Promise+Heart+Locket",
    description: "Heart-shaped locket with space for photos",
    tags: ["romantic", "sentimental", "heart"],
    magical: "Keeps love close to your heart, always",
    fleureneSpot: "Hanging from the lovers' wishing tree",
  },
  {
    id: 10,
    name: "Infinity Best Friends Set",
    price: "R112",
    image: "/placeholder.svg?height=300&width=300&text=Infinity+Best+Friends+Set",
    description: "Matching infinity symbol bracelets for two",
    tags: ["friendship", "matching", "infinity"],
    magical: "Bonds that transcend time and distance",
    fleureneSpot: "Entwined in the friendship blossom archway",
  },
  {
    id: 11,
    name: "Mother's Birthstone Ring",
    price: "R189",
    image: "/placeholder.svg?height=300&width=300&text=Mother+Birthstone+Ring",
    description: "Customizable ring with family birthstones",
    tags: ["family", "birthstone", "customizable"],
    magical: "A constellation of family love on your finger",
    fleureneSpot: "Blooming in the ancestral memory garden",
  },
  {
    id: 12,
    name: "Sister Soul Necklaces",
    price: "R156",
    image: "/placeholder.svg?height=300&width=300&text=Sister+Soul+Necklaces",
    description: "Complementary sun and moon pendant set",
    tags: ["family", "sister", "celestial"],
    magical: "Two halves of the same celestial story",
    fleureneSpot: "Reflecting in the twin soul pools",
  },
]

const archetypes = [
  {
    name: "The Timeless Romantic",
    emoji: "🌹",
    essence: "Devoted",
    description: "You collect love letters and vintage dreams",
    colors: ["#F8BBD9", "#E8D5F2"],
    recommendedPieces: [1, 4, 2],
    style: "Vintage-inspired pieces with romantic details, soft metals, and sentimental touches",
    aura: "Soft rose petals floating in moonlight",
    fleurenePath: "The Eternal Bloom Path",
    fleureneDescription: "Wander through cascading wisteria and vintage garden gates where romance blooms eternal",
  },
  {
    name: "The Grounded Stylist",
    emoji: "🌿",
    essence: "Balanced",
    description: "You make mindful choices and curate calm",
    colors: ["#D4C5B9", "#E8D5F2"],
    recommendedPieces: [7, 2, 8],
    style: "Quality pieces with clean lines, thoughtful details, and versatile styling",
    aura: "Gentle morning mist over still waters",
    fleurenePath: "The Serene Reflection Path",
    fleureneDescription: "Find peace among carefully arranged crystal pools and minimalist stone pathways",
  },
  {
    name: "The Natural Creative",
    emoji: "🌿",
    essence: "Soulful",
    description: "You paint with your heart and wear your soul",
    colors: ["#ACD8D5", "#F0E6FF"],
    recommendedPieces: [3, 6, 8],
    style: "Organic shapes, natural materials, and pieces that tell a story",
    aura: "Wildflowers dancing in a summer breeze",
    fleurenePath: "The Wild Imagination Path",
    fleureneDescription: "Dance through untamed beauty where creativity blooms in every magical corner",
  },
  {
    name: "The Intentional Dresser",
    emoji: "🌱",
    essence: "Curated",
    description: "You architect your aesthetic with precision",
    colors: ["#E5E7EB", "#DDD6FE"],
    recommendedPieces: [7, 4, 2],
    style: "Strategic pieces that serve multiple purposes and create perfect balance",
    aura: "Crystalline structures catching perfect light",
    fleurenePath: "The Harmonious Design Path",
    fleureneDescription: "Stroll through perfectly balanced arrangements and geometric flower beds",
  },
  {
    name: "The Sentimental Dreamer",
    emoji: "🌙",
    essence: "Melancholic (in a poetic way)",
    description: "You dream in stardust and feel in poetry",
    colors: ["#C4B5FD", "#F8BBD9"],
    recommendedPieces: [2, 5, 6],
    style: "Ethereal pieces with celestial themes and dreamy, mystical qualities",
    aura: "Twilight skies painted with shooting stars",
    fleurenePath: "The Celestial Dream Path",
    fleureneDescription: "Wander through night-blooming jasmine and silver-leafed plants under starlight",
  },
  {
    name: "The Playful Explorer",
    emoji: "🌻",
    essence: "Kaleidoscopic",
    description: "You collect joy and wear it like confetti",
    colors: ["#FFAEC0", "#ACD8D5"],
    recommendedPieces: [3, 6, 5],
    style: "Colorful, fun pieces that bring joy and spark conversations",
    aura: "Rainbow prisms dancing through crystal drops",
    fleurenePath: "The Joyful Discovery Path",
    fleureneDescription: "Explore vibrant magical blooms where butterflies paint the air with color",
  },
]

const relationshipCollections = {
  romance: {
    title: "Love's Enchanted Garden",
    subtitle: "Where hearts bloom and love stories unfold",
    emoji: "💕",
    aura: "Rose petals floating on moonbeams",
    fleureneTheme: "A secret garden where lovers meet beneath blooming wisteria",
    description: `
      Step into our enchanted romance garden, where every petal-strewn path leads to love. Here, beneath the cascading 
      wisteria and jasmine-scented arbors, you'll discover pieces that capture the essence of true romance.

      Each treasure is nestled among the magical blooms like a secret waiting to be found. From promise rings hidden 
      beneath the moonlit flowers to lockets hanging from the lovers' wishing tree, every piece tells a story of devotion 
      and dreams shared under starlit skies.
    `,
    pieces: [1, 4, 9, 2],
    occasions: [
      "Anniversary celebrations in the rose garden",
      "Promise moments under the wisteria arbor",
      "Valentine's Day picnics by the moonlit pond",
      "Surprise proposals in the secret garden",
      "Love letter exchanges at the enchanted gate",
    ],
  },
  friends: {
    title: "Friendship's Magical Meadow",
    subtitle: "Where chosen family gathers and joy blooms wild",
    emoji: "🌸",
    aura: "Butterfly wings shimmering with joy",
    fleureneTheme: "A wildflower meadow where laughter echoes and friendships flourish eternally",
    description: `
      Welcome to our friendship meadow, where magical wildflowers grow free and friendships bloom without boundaries. 
      This is where soul sisters gather, where laughter carries on the enchanted breeze, and where the most precious 
      bonds are celebrated in sparkling wonder.

      Wander through fields of ethereal daisies and forget-me-nots, where friendship bracelets hang from flowering 
      branches and matching sets sparkle in the morning dew. Every piece here celebrates the magic of 
      chosen family and the joy of true connection that transcends ordinary reality.
    `,
    pieces: [10, 3, 6, 5],
    occasions: [
      "Best friend picnics in the enchanted meadow",
      "Friendship anniversary celebrations",
      "Moving away memory-making rituals",
      "Achievement celebrations under the wisdom oak",
      "Random acts of friendship magic",
    ],
  },
  family: {
    title: "Heritage Blossom Garden",
    subtitle: "Where family roots run deep and love grows eternal",
    emoji: "🌟",
    aura: "Golden threads weaving through generations",
    fleureneTheme: "An ancient magical garden where family trees tell stories of generations",
    description: `
      Enter our heritage garden, where family trees have grown for generations and love is passed down 
      like precious magical heirlooms. Here, among the memory blossoms and ancestral paths, you'll find pieces that 
      honor the bonds that shaped your very essence.

      Each treasure rests beneath the family trees, from mother's rings nestled in the herb garden to 
      sister necklaces reflecting in the twin soul pools. This is where traditions are born and family 
      stories are written in gold and silver, connecting past to future in an unbroken magical chain.
    `,
    pieces: [11, 12, 2, 7],
    occasions: [
      "Mother's Day tea in the sacred herb garden",
      "Sister milestone celebrations",
      "Grandmother's wisdom sharing circles",
      "Coming of age ceremonies",
      "Family reunion memory making",
    ],
  },
}

// Helper function to get consistent positioning based on index
const getPosition = (index: number, total: number = 100) => {
  const angle = (index * 137.508) % 360 // Golden angle for natural distribution
  const radius = 30 + (index % 3) * 20
  const x = 50 + radius * Math.cos(angle * Math.PI / 180)
  const y = 50 + radius * Math.sin(angle * Math.PI / 180)
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
}

export default function DiscoverYourMagic({ onTakeQuiz }: DiscoverYourMagicProps) {
  const [activeSection, setActiveSection] = useState<Section>("all-pieces")
  const [flowerBasket, setFlowerBasket] = useState<any[]>([])
  const [isBasketOpen, setIsBasketOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const sections = [
    {
      id: "all-pieces" as Section,
      title: "The Fleurene Garden",
      icon: Gem,
      description: "Explore our complete magical garden",
      gradient: "from-purple-400 to-pink-400",
      fleureneArea: "The Grand Enchanted Garden",
    },
    {
      id: "archetypes" as Section,
      title: "Magical Pathways",
      icon: Sparkles,
      description: "Follow your personality path",
      gradient: "from-violet-400 to-purple-400",
      fleureneArea: "Six Enchanted Garden Paths",
    },
    {
      id: "romance" as Section,
      title: "Love's Garden",
      icon: Heart,
      description: "Where romance blooms",
      gradient: "from-pink-400 to-rose-400",
      fleureneArea: "The Secret Love Garden",
    },
    {
      id: "friends" as Section,
      title: "Friendship Meadow",
      icon: Users,
      description: "Where chosen family gathers",
      gradient: "from-purple-300 to-violet-400",
      fleureneArea: "The Magical Wildflower Meadow",
    },
    {
      id: "family" as Section,
      title: "Heritage Garden",
      icon: Home,
      description: "Family roots and traditions",
      gradient: "from-violet-400 to-purple-400",
      fleureneArea: "The Ancestral Blossom Garden",
    },
  ]

  const renderRelationshipSection = (type: keyof typeof relationshipCollections) => {
    const collection = relationshipCollections[type]

    return (
      <div className="space-y-12">
        {/* Garden Entrance */}
        <motion.div
          className="text-center relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Garden atmosphere */}
          {isClient && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Floating garden elements */}
              {[...Array(12)].map((_, i) => {
                const pos = getPosition(i)
                return (
                  <motion.div
                    key={i}
                    className="absolute text-lg opacity-20"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 8 + (i % 4),
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {["🌸", "🌺", "🌷", "🌹", "🌻", "🌼", "🌿", "🍃", "🌱", "🌾", "🪻", "🌵", "🌴", "🌳", "🌲"][i % 15]}
                  </motion.div>
                )
              })}

              {/* Garden path stones */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`stone-${i}`}
                  className="absolute w-4 h-4 rounded-full bg-purple-300/30"
                  style={{
                    left: `${20 + i * 10}%`,
                    bottom: "10%",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.6, 0.2],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          )}

          {/* Garden Gate */}
          <motion.div
            className="relative mb-8"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="text-4xl mb-4">{collection.emoji}</div>
            <div className="text-sm text-slate-500 font-medium">✨ Welcome to ✨</div>
          </motion.div>

          <h3
            className="text-4xl md:text-5xl font-serif mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #C697D4 0%, #FFAEC0 30%, #D4C5F0 60%, #B19CD9 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {collection.title}
          </h3>
          <p className="text-xl text-gray-600 italic mb-4">{collection.subtitle}</p>
          <p className="text-sm text-slate-600 font-medium italic mb-2">{collection.fleureneTheme}</p>
          <p className="text-xs text-slate-500 italic">{collection.aura}</p>
        </motion.div>

        {/* Garden Description Gazebo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 via-white/90 to-pink-50/60 backdrop-blur-xl border border-purple-200/50 shadow-2xl">
            {/* Garden border with growing vines */}
            <div className="absolute inset-0">
              <motion.div
                className="absolute inset-0 border-2 border-purple-300/30 rounded-lg"
                animate={{
                  borderColor: ["rgba(196, 181, 253, 0.3)", "rgba(251, 207, 232, 0.5)", "rgba(196, 181, 253, 0.3)"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              {/* Growing vine effect */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            <CardContent className="relative p-6 md:p-8">
              {/* Floating garden sprites */}
              {isClient && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => {
                    const pos = getPosition(i, 6)
                    return (
                      <motion.div
                        key={i}
                        className="absolute text-purple-400/60"
                        style={{
                          left: `${pos.x}%`,
                          top: `${pos.y}%`,
                          fontSize: `${10 + (i % 6)}px`,
                        }}
                        animate={{
                          y: [0, -15, 0],
                          opacity: [0.3, 0.7, 0.3],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 4 + (i % 2),
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: "easeInOut",
                        }}
                      >
                        ✨
                      </motion.div>
                    )
                  })}
                </div>
              )}

              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed relative z-10">
                {collection.description.split("\n\n").map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className="mb-6 last:mb-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  >
                    {paragraph.trim()}
                  </motion.p>
                ))}
              </div>

              <motion.div
                className="mt-8 p-6 bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-purple-50/80 rounded-2xl backdrop-blur-sm border border-purple-200/40 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(196, 181, 253, 0.1) 0%, rgba(251, 207, 232, 0.15) 50%, rgba(212, 197, 240, 0.1) 100%)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h4 className="text-lg font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <motion.span
                    className="text-pink-400"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    🌸
                  </motion.span>
                  Perfect magical moments for:
                  <motion.span
                    className="text-purple-400"
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  >
                    🌺
                  </motion.span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {collection.occasions.map((occasion, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      <motion.span
                        className="text-pink-400"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      >
                        {["🌸", "🌺", "🌷", "🌹", "🌻", "🌼"][index % 6]}
                      </motion.span>
                      <span className="text-sm text-gray-700 font-medium">{occasion}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Garden Treasure Hunt - Product Display */}
        <div className="relative">
          {/* Garden path */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-10" viewBox="0 0 800 400">
              <path
                d="M 0,200 Q 200,100 400,200 T 800,200"
                stroke="#C697D4"
                strokeWidth="20"
                fill="none"
                strokeDasharray="10,5"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {collection.pieces.map((pieceId, index) => {
              const piece = allJewelryPieces.find((p) => p.id === pieceId)
              if (!piece) return null

              const addToBasket = () => {
                const existingItem = flowerBasket.find((item) => item.id === piece.id)
                if (existingItem) {
                  updateBasketQuantity(piece.id, existingItem.quantity + 1)
                } else {
                  setFlowerBasket((prev) => [...prev, { ...piece, quantity: 1 }])
                }
              }

              return (
                <motion.div
                  key={piece.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Garden treasure marker */}
                  <motion.div
                    className="absolute -top-4 -right-4 z-20 text-xl"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {["🌸", "🌺", "🌷", "🌹"][index % 4]}
                  </motion.div>

                  <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-purple-50/50 backdrop-blur-sm border border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                    {/* Garden glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100"
                      animate={{
                        background: [
                          "radial-gradient(circle at 30% 30%, rgba(196, 181, 253, 0.1), transparent 50%)",
                          "radial-gradient(circle at 70% 70%, rgba(251, 207, 232, 0.1), transparent 50%)",
                          "radial-gradient(circle at 30% 30%, rgba(196, 181, 253, 0.1), transparent 50%)",
                        ],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Garden sprites on hover */}
                    {isClient && (
                      <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
                        {[...Array(4)].map((_, i) => {
                          const pos = getPosition(i + index, 4)
                          return (
                            <motion.div
                              key={i}
                              className="absolute text-purple-400/60"
                              style={{
                                left: `${20 + (pos.x % 60)}%`,
                                top: `${20 + (pos.y % 60)}%`,
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                y: [0, -20],
                                rotate: [0, 360],
                              }}
                              transition={{
                                duration: 2,
                                delay: i * 0.3,
                                repeat: Infinity,
                              }}
                            >
                              {["🌸", "🌿", "🌺", "🦋", "🐝", "🌻", "🌷", "🍀"][i % 8]}
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}

                    <div className="aspect-square overflow-hidden relative">
                      <motion.img
                        src={piece.image || "/placeholder.svg"}
                        alt={piece.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Garden light filter */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardContent className="p-6 relative z-10">
                      <motion.h4
                        className="font-serif text-lg text-gray-800 mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {piece.name}
                      </motion.h4>
                      <p className="text-sm text-gray-600 mb-2">{piece.description}</p>
                      <p className="text-xs text-slate-500 italic mb-2">{piece.magical}</p>
                      <p className="text-xs text-slate-600 italic mb-4">✨ {piece.fleureneSpot}</p>

                      <div className="flex flex-col gap-3">
                        <div className="text-center">
                          <span className="text-lg font-bold text-purple-600/80">{piece.price}</span>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <motion.div
                            className="w-full relative overflow-hidden text-white shadow-md hover:shadow-xl transition-all duration-500 px-3 py-2 text-xs group rounded-md"
                            style={{
                              background: "linear-gradient(45deg, #DDD6FE, #C4B5FD, #A78BFA, #8B5CF6)",
                              backgroundSize: "300% 300%",
                            }}
                            animate={{
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Button
                              onClick={addToBasket}
                              className="w-full bg-transparent border-0 p-0 h-auto text-white hover:bg-transparent"
                              size="sm"
                            >
                              {/* Flower bloom effect on hover */}
                              {isClient && (
                                <motion.div
                                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                                  initial={{ scale: 0 }}
                                  whileHover={{ scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {[...Array(6)].map((_, i) => {
                                    const pos = getPosition(i + index, 6)
                                    return (
                                      <motion.div
                                        key={i}
                                        className="absolute text-white/40"
                                        style={{
                                          left: `${20 + (pos.x % 60)}%`,
                                          top: `${20 + (pos.y % 60)}%`,
                                        }}
                                        initial={{ scale: 0, rotate: 0 }}
                                        animate={{
                                          scale: [0, 1, 0],
                                          rotate: [0, 180, 360],
                                          opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          delay: i * 0.1,
                                          repeat: Infinity,
                                        }}
                                      >
                                        {["🌸", "🌺", "🌷"][i % 3]}
                                      </motion.div>
                                    )
                                  })}
                                </motion.div>
                              )}
                              <motion.div
                                className="flex items-center justify-center gap-1"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.span
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  🌸
                                </motion.span>
                                Add to Your Garden
                                <motion.span
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                >
                                  🌿
                                </motion.span>
                              </motion.div>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const updateBasketQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromBasket(id)
      return
    }
    setFlowerBasket((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromBasket = (id: number) => {
    setFlowerBasket((prev) => prev.filter((item) => item.id !== id))
  }

  const totalBasketItems = flowerBasket.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Multi-layered Garden Background */}

      {/* Sky and distant background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-purple-50/40 via-pink-50/30 to-green-50/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/20 via-pink-100/10 to-transparent" />
        <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-rose-100/10 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" className="opacity-20">
            <pattern id="stardust" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="#C697D4" />
              <circle cx="10" cy="10" r="0.5" fill="#FFAEC0" />
              <circle cx="40" cy="35" r="0.7" fill="#D4C5F0" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#stardust)" />
          </svg>
        </div>
      </div>

      {/* Distant garden hills */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-green-100/40 via-purple-100/30 to-transparent" />
        <svg className="absolute bottom-0 w-full h-3/4 opacity-20" viewBox="0 0 1200 600">
          <path d="M0,400 Q300,300 600,350 T1200,320 L1200,600 L0,600 Z" fill="url(#hillGradient1)" />
          <path d="M0,450 Q400,380 800,420 T1200,400 L1200,600 L0,600 Z" fill="url(#hillGradient2)" />
          <defs>
            <linearGradient id="hillGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E8D5F2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C697D4" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="hillGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4F1D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A8E6A3" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Garden path texture */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full opacity-15"
          style={{
            backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(251, 207, 232, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 70%, rgba(196, 181, 253, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 90% 80%, rgba(212, 197, 240, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, transparent 48%, rgba(139, 92, 246, 0.05) 49%, rgba(139, 92, 246, 0.05) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(251, 207, 232, 0.05) 49%, rgba(251, 207, 232, 0.05) 51%, transparent 52%)
        `,
            backgroundSize: "400px 400px, 350px 350px, 300px 300px, 450px 450px, 60px 60px, 60px 60px",
          }}
        />
      </div>

      {/* Dappled sunlight effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sunlight-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${60 + Math.random() * 120}px`,
              height: `${60 + Math.random() * 120}px`,
              background: `radial-gradient(circle, rgba(255, 255, 255, ${0.1 + Math.random() * 0.2}) 0%, transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
              x: [0, 10, -5, 0],
              y: [0, -8, 5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Garden foliage layers - Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`bg-foliage-${i}`}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${40 + Math.random() * 30}px`,
              color: ["#4ADE80", "#22C55E", "#16A34A", "#15803D"][i % 4],
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, 8, -5, 0],
              rotate: [0, 5, -3, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          >
            {["🌿", "🍃", "🌱", "🌾", "🌸", "🌺", "🌷", "🌹", "🌻", "🌼", "🌵", "🌴", "🌳", "🌲", "🪻"][i % 15]}
          </motion.div>
        ))}
      </div>

      {/* Additional Garden Foliage */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`extra-foliage-${i}`}
            className="absolute opacity-8"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 25}px`,
              color: ["#4ADE80", "#22C55E", "#16A34A", "#15803D", "#C697D4", "#FFAEC0"][i % 6],
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, 5, -3, 0],
              rotate: [0, 3, -2, 0],
              opacity: [0.03, 0.12, 0.03],
            }}
            transition={{
              duration: 15 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
              ease: "easeInOut",
            }}
          >
            {["🌿", "🍃", "🌱", "🌾", "🌸", "🌺", "🌷", "🌹", "🌻", "🌼", "🪻", "🌵", "🌴", "🌳", "🌲"][i % 15]}
          </motion.div>
        ))}
      </div>

      {/* Animated Butterflies */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`butterfly-${i}`}
            className="absolute opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: "16px",
              filter: "drop-shadow(0 0 2px rgba(255,255,255,0.5))",
            }}
            animate={{
              x: [0, 30, -20, 15, 0],
              y: [0, -25, -10, -30, 0],
              rotate: [0, 10, -5, 8, 0],
              scale: [1, 1.2, 0.9, 1.1, 1],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 2,
              ease: "easeInOut",
            }}
          >
            <motion.span
              animate={{
                scaleX: [1, 0.7, 1, 0.8, 1],
                scaleY: [1, 1.1, 0.9, 1.05, 1],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                display: "inline-block",
                color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9", "#C8A8E9"][i % 5],
              }}
            >
              🦋
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Floating Flower Petals */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: "10px",
              color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9", "#C8A8E9"][i % 5],
              filter: "drop-shadow(0 0 1px rgba(255,255,255,0.3))",
            }}
            animate={{
              x: [0, 20, 10, 30, 0],
              y: [0, 30, 15, 40, 80],
              rotate: [0, 120, 240, 360],
              opacity: [0, 0.3, 0.5, 0.3, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 3,
              ease: "linear",
            }}
          >
            {["🌸", "🌺", "🌷", "🌹", "🌻", "🌼"][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Magical Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`,
              background: `radial-gradient(circle, ${
                ["rgba(196, 181, 253, 0.8)", "rgba(251, 207, 232, 0.8)", "rgba(212, 197, 240, 0.8)"][i % 3]
              } 0%, transparent 70%)`,
              filter: "blur(2px)",
            }}
            animate={{
              x: [0, 10, -10, 0],
              y: [0, -15, -5, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Garden archway entrance */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
        {/* Fleurene archway */}
        <motion.div
          className="relative mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="relative">
            <motion.div
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, rgba(196, 181, 253, 0.1) 50%, transparent 80%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="text-4xl opacity-70 mt-4"
              animate={{
                filter: [
                  "drop-shadow(0 0 8px rgba(196, 181, 253, 0.3))",
                  "drop-shadow(0 0 15px rgba(196, 181, 253, 0.5))",
                  "drop-shadow(0 0 8px rgba(196, 181, 253, 0.3))",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🌸🌺🌸
            </motion.div>
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Archway vines */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`vine-${i}`}
              className="absolute text-green-400 opacity-20"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + Math.sin(i) * 20}%`,
                fontSize: "24px",
              }}
              animate={{
                rotate: [0, 10, -5, 0],
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
              }}
            >
              🌿
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ambient garden lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: `
          radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 30%, rgba(251, 207, 232, 0.05) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 80%, rgba(196, 181, 253, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 60%)
        `,
          }}
        />
      </div>

      {/* Garden mist effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `
          linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%),
          linear-gradient(-45deg, transparent 40%, rgba(251, 207, 232, 0.05) 60%, transparent 80%)
        `,
            backgroundSize: "200px 200px, 150px 150px",
          }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Fleurene Garden Entrance Gate */}
        <motion.div
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Flower border */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top border flowers */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`top-border-${i}`}
                className="absolute text-xs opacity-30"
                style={{
                  left: `${i * 8.33 + 4}%`,
                  top: "-10px",
                  color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9"][i % 4],
                }}
                animate={{
                  y: [0, -3, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              >
                {["🌸", "🌺", "🌷", "🌹"][i % 4]}
              </motion.div>
            ))}

            {/* Bottom border flowers */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`bottom-border-${i}`}
                className="absolute text-xs opacity-30"
                style={{
                  left: `${i * 8.33 + 4}%`,
                  bottom: "-10px",
                  color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9"][i % 4],
                }}
                animate={{
                  y: [0, 3, 0],
                  rotate: [0, -10, 10, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              >
                {["🌼", "🌻", "🌷", "🌺"][i % 4]}
              </motion.div>
            ))}

            {/* Left border flowers */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`left-border-${i}`}
                className="absolute text-xs opacity-30"
                style={{
                  left: "-15px",
                  top: `${i * 12.5 + 6}%`,
                  color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9"][i % 4],
                }}
                animate={{
                  x: [0, -3, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 5 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              >
                {["🌸", "🌺", "🌷", "🌹"][i % 4]}
              </motion.div>
            ))}

            {/* Right border flowers */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`right-border-${i}`}
                className="absolute text-xs opacity-30"
                style={{
                  right: "-15px",
                  top: `${i * 12.5 + 6}%`,
                  color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9"][i % 4],
                }}
                animate={{
                  x: [0, 3, 0],
                  rotate: [0, -15, 15, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 5 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              >
                {["🌼", "🌻", "🌷", "🌺"][i % 4]}
              </motion.div>
            ))}
          </div>

          {/* Fleurene archway */}
          <motion.h2
            className="text-5xl md:text-7xl font-serif mb-8 relative"
            style={{
              fontFamily: "'Playfair Display', serif",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.span
              className="absolute inset-0 block"
              style={{
                background: "linear-gradient(135deg, #C697D4 0%, #FFAEC0 30%, #D4C5F0 60%, #B19CD9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "300% 300%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              The Fleurene Garden
            </motion.span>
            <span className="opacity-0">The Fleurene Garden</span>
            <motion.div
              className="absolute -inset-4 -z-10 rounded-lg opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(196, 181, 253, 0.4) 0%, rgba(251, 207, 232, 0.2) 50%, transparent 80%)",
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.h2>

          <motion.div
            className="max-w-4xl mx-auto mb-12 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="absolute -inset-6 -z-10 rounded-2xl opacity-20"
              style={{
                background:
                  "radial-gradient(circle, rgba(196, 181, 253, 0.3) 0%, rgba(251, 207, 232, 0.2) 50%, transparent 80%)",
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <p className="text-base text-gray-600 leading-relaxed text-center italic relative">
              <motion.span
                className="absolute -left-6 top-0 text-xl text-purple-300 opacity-70"
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ❝
              </motion.span>
              Welcome, gentle dreamer. Step softly into the Fleurene Garden, where every path leads to something
              beautiful — a sunny meadow of wild friendships, a quiet grove of deep love, a moonlit trail lined with
              pieces that match your soul. Whether you're the Romantic, the Free Spirit, the Old Soul, or the Bright
              Spark, there's a bloom here for you. Wander alone or with someone you love — a sister, a friend, a mother
              — and let the garden reveal the jewels meant just for you.
              <motion.span
                className="absolute -right-6 bottom-0 text-xl text-purple-300 opacity-70"
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                ❞
              </motion.span>
            </p>
            <motion.div
              className="w-20 h-px mx-auto mt-6 bg-gradient-to-r from-transparent via-purple-300 to-transparent"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                width: ["60px", "100px", "60px"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          <motion.div
            className="text-sm text-slate-600 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Fleurene Garden Map Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`relative overflow-hidden group px-6 py-4 rounded-full transition-all duration-500 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-purple-100 to-pink-100 text-slate-700 shadow-xl scale-105"
                    : "bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-white/90 hover:scale-102"
                }`}
                whileHover={{ y: -5, rotate: 2, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Magical path effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-20`}
                  initial={false}
                  animate={{
                    scale: activeSection === section.id ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />

                <div className="relative z-10 flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: activeSection === section.id ? [0, 360] : 0,
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <div className="text-left">
                    <div className="font-medium">{section.title}</div>
                    <div className="text-xs opacity-75">{section.fleureneArea}</div>
                  </div>
                </div>

                {/* Magical sprites on active */}
                {activeSection === section.id && (
                  <motion.div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-slate-500 text-xs"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          y: [0, -15],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.4,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Garden Content Areas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {activeSection === "all-pieces" ? (
              <div className="space-y-12">
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3
                    className="text-4xl md:text-5xl font-serif mb-6"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      background: "linear-gradient(135deg, #C697D4 0%, #FFAEC0 50%, #D4C5F0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Coming Soon...
                  </h3>
                  <p className="text-xl text-gray-600 italic">This magical section is being reimagined ✨</p>
                  <p className="text-sm text-slate-600 mt-2">
                    "Visit 'The Enchanted Garden' below to explore our beautiful collection"
                  </p>
                </motion.div>
              </div>
            ) : activeSection === "archetypes" ? (
              <div className="space-y-16">
                <motion.div
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3
                    className="text-4xl md:text-5xl font-serif mb-6"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      background: "linear-gradient(135deg, #C697D4 0%, #FFAEC0 50%, #D4C5F0 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Six Enchanted Garden Paths
                  </h3>
                  <p className="text-xl text-gray-600 italic">
                    Each personality leads to a different magical sanctuary
                  </p>
                  <p className="text-sm text-slate-600 mt-2">"Follow your heart's path to find your perfect magic"</p>
                </motion.div>

                {/* Fleurene Garden Pathways */}
                <div className="space-y-20">
                  {archetypes.map((archetype, archetypeIndex) => (
                    <motion.div
                      key={archetype.name}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: archetypeIndex * 0.2 }}
                      className="space-y-8"
                    >
                      {/* Garden Path Entrance */}
                      <div className="text-center relative">
                        {/* Magical path */}
                        <div className="absolute inset-0 pointer-events-none">
                          <svg className="w-full h-32 opacity-20" viewBox="0 0 800 100">
                            <path
                              d="M 0,50 Q 200,20 400,50 T 800,50"
                              stroke={archetype.colors[0]}
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray="15,10"
                            />
                          </svg>
                        </div>

                        <motion.div
                          className="relative w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl"
                          style={{
                            background: `linear-gradient(135deg, ${archetype.colors[0]}, ${archetype.colors[1]})`,
                          }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          animate={{
                            boxShadow: [
                              `0 0 30px ${archetype.colors[0]}40`,
                              `0 0 50px ${archetype.colors[1]}60`,
                              `0 0 30px ${archetype.colors[0]}40`,
                            ],
                          }}
                          transition={{
                            boxShadow: { duration: 4, repeat: Number.POSITIVE_INFINITY },
                          }}
                        >
                          {archetype.emoji}
                        </motion.div>

                        <h4
                          className="text-3xl font-serif text-gray-800 mb-3"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {archetype.name}
                        </h4>
                        <p className="text-slate-600 font-medium mb-3 text-lg">✨ {archetype.fleurenePath} ✨</p>
                        <p className="text-gray-600 italic mb-4 text-lg">{archetype.description}</p>
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-2">{archetype.fleureneDescription}</p>
                        <p className="text-xs text-slate-400 italic">{archetype.aura}</p>
                      </div>

                      {/* Fleurene Garden Treasures */}
                      <div className="relative">
                        {/* Magical path for this archetype */}
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                          <svg className="w-full h-full" viewBox="0 0 1200 300">
                            <path
                              d="M 0,150 Q 300,100 600,150 T 1200,150"
                              stroke={archetype.colors[0]}
                              strokeWidth="20"
                              fill="none"
                              strokeDasharray="25,15"
                            />
                          </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                          {archetype.recommendedPieces.map((pieceId, pieceIndex) => {
                            const piece = allJewelryPieces.find((p) => p.id === pieceId)
                            if (!piece) return null

                            const addToBasket = () => {
                              const existingItem = flowerBasket.find((item) => item.id === piece.id)
                              if (existingItem) {
                                updateBasketQuantity(piece.id, existingItem.quantity + 1)
                              } else {
                                setFlowerBasket((prev) => [...prev, { ...piece, quantity: 1 }])
                              }
                            }

                            return (
                              <motion.div
                                key={piece.id}
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: pieceIndex * 0.15 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative"
                              >
                                {/* Archetype magical marker */}
                                <motion.div
                                  className="absolute -top-4 -right-4 z-20 text-xl"
                                  animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                    y: [0, -5, 0],
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: pieceIndex * 0.5,
                                  }}
                                >
                                  {archetype.emoji}
                                </motion.div>

                                <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-purple-50/50 backdrop-blur-sm border border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                                  {/* Archetype-specific magical glow */}
                                  <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-30"
                                    style={{
                                      background: `radial-gradient(circle at center, ${archetype.colors[0]}20, ${archetype.colors[1]}10, transparent)`,
                                    }}
                                    animate={{
                                      scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                      duration: 4,
                                      repeat: Number.POSITIVE_INFINITY,
                                    }}
                                  />

                                  <div className="aspect-square overflow-hidden relative">
                                    <motion.img
                                      src={piece.image || "/placeholder.svg"}
                                      alt={piece.name}
                                      className="w-full h-full object-cover"
                                      whileHover={{ scale: 1.1 }}
                                      transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                  </div>

                                  <CardContent className="p-6 relative z-10">
                                    <h5
                                      className="font-serif text-lg text-gray-800 mb-2"
                                      style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                      {piece.name}
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-2">{piece.description}</p>
                                    <p className="text-xs text-slate-500 italic mb-2">{piece.magical}</p>
                                    <p className="text-xs text-slate-600 italic mb-4">✨ {piece.fleureneSpot}</p>

                                    <div className="flex flex-col gap-3">
                                      <div className="text-center">
                                        <span className="text-lg font-bold text-purple-600/80">{piece.price}</span>
                                      </div>
                                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                          onClick={addToBasket}
                                          className="w-full relative overflow-hidden text-white shadow-md hover:shadow-xl transition-all duration-500 px-3 py-2 text-xs group"
                                          style={{
                                            background: "linear-gradient(45deg, #DDD6FE, #C4B5FD, #A78BFA, #8B5CF6)",
                                            backgroundSize: "300% 300%",
                                          }}
                                          animate={{
                                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                          }}
                                          transition={{
                                            duration: 3,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "linear",
                                          }}
                                          size="sm"
                                        >
                                          {/* Flower bloom effect on hover */}
                                          <motion.div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                                            initial={{ scale: 0 }}
                                            whileHover={{ scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                          >
                                            {[...Array(6)].map((_, i) => (
                                              <motion.div
                                                key={i}
                                                className="absolute text-white/40"
                                                style={{
                                                  left: `${20 + Math.random() * 60}%`,
                                                  top: `${20 + Math.random() * 60}%`,
                                                }}
                                                initial={{ scale: 0, rotate: 0 }}
                                                animate={{
                                                  scale: [0, 1, 0],
                                                  rotate: [0, 180, 360],
                                                  opacity: [0, 1, 0],
                                                }}
                                                transition={{
                                                  duration: 1.5,
                                                  delay: i * 0.1,
                                                  repeat: Number.POSITIVE_INFINITY,
                                                }}
                                              >
                                                {["🌸", "🌺", "🌷"][i % 3]}
                                              </motion.div>
                                            ))}
                                          </motion.div>
                                          <motion.div
                                            className="flex items-center justify-center gap-1"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                          >
                                            <motion.span
                                              animate={{ rotate: [0, 10, -10, 0] }}
                                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            >
                                              🌸
                                            </motion.span>
                                            Add to Your Garden
                                            <motion.span
                                              animate={{ scale: [1, 1.2, 1] }}
                                              transition={{
                                                duration: 1.5,
                                                repeat: Number.POSITIVE_INFINITY,
                                                delay: 0.5,
                                              }}
                                            >
                                              🌿
                                            </motion.span>
                                          </motion.div>
                                        </Button>
                                      </motion.div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : activeSection === "romance" ? (
              renderRelationshipSection("romance")
            ) : activeSection === "friends" ? (
              renderRelationshipSection("friends")
            ) : activeSection === "family" ? (
              renderRelationshipSection("family")
            ) : null}

            {/* Fleurene Garden Gate Call to Action */}
            <motion.div
              className="text-center mt-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Magical garden frame */}
              <motion.div
                className="relative inline-block p-8"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                {/* Enchanted border with growing vines */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(45deg, rgba(196, 181, 253, 0.1), rgba(251, 207, 232, 0.1), rgba(212, 197, 240, 0.1))",
                    border: "2px solid transparent",
                    backgroundClip: "padding-box",
                  }}
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(196, 181, 253, 0.1), rgba(251, 207, 232, 0.1), rgba(212, 197, 240, 0.1))",
                      "linear-gradient(45deg, rgba(251, 207, 232, 0.15), rgba(212, 197, 240, 0.15), rgba(196, 181, 253, 0.15))",
                      "linear-gradient(45deg, rgba(196, 181, 253, 0.1), rgba(251, 207, 232, 0.1), rgba(212, 197, 240, 0.1))",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Corner flower decorations */}
                {[
                  { position: "top-left", rotation: 0 },
                  { position: "top-right", rotation: 90 },
                  { position: "bottom-left", rotation: 270 },
                  { position: "bottom-right", rotation: 180 },
                ].map((corner, i) => (
                  <motion.div
                    key={corner.position}
                    className={`absolute text-2xl ${
                      corner.position === "top-left"
                        ? "-top-3 -left-3"
                        : corner.position === "top-right"
                          ? "-top-3 -right-3"
                          : corner.position === "bottom-left"
                            ? "-bottom-3 -left-3"
                            : "-bottom-3 -right-3"
                    }`}
                    style={{ rotate: `${corner.rotation}deg` }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [corner.rotation, corner.rotation + 10, corner.rotation],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.5,
                    }}
                  >
                    🌸
                  </motion.div>
                ))}

                {/* Floating magical elements around button */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`magic-element-${i}`}
                      className="absolute text-sm opacity-40"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        color: ["#C697D4", "#FFAEC0", "#D4C5F0", "#B19CD9"][i % 4],
                      }}
                      animate={{
                        y: [0, -20, 0],
                        x: [0, Math.sin(i) * 10, 0],
                        rotate: [0, 360],
                        scale: [0.5, 1, 0.5],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      {["🌸", "🌺", "🌷", "🌹", "🌻", "🌼", "🦋", "✨"][i % 8]}
                    </motion.div>
                  ))}
                </div>

                <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {/* Magical aura layers */}
                  <motion.div
                    className="absolute inset-0 rounded-full blur-2xl opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(196, 181, 253, 0.6) 0%, rgba(251, 207, 232, 0.4) 50%, transparent 80%)",
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute inset-0 rounded-full blur-xl opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(251, 207, 232, 0.8) 0%, rgba(212, 197, 240, 0.6) 50%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1.2, 1.6, 1.2],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  <Button
                    onClick={onTakeQuiz}
                    className="relative overflow-hidden text-white px-12 py-4 rounded-full text-lg font-serif shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-white/30 group"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      background: "linear-gradient(135deg, #E8D5F2 0%, #F8BBD9 50%, #E8D5F2 100%)",
                      backgroundSize: "200% 200%",
                      boxShadow:
                        "0 8px 32px rgba(196, 181, 253, 0.4), 0 0 20px rgba(251, 207, 232, 0.3), inset 0 2px 16px rgba(255, 255, 255, 0.2)",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      boxShadow: [
                        "0 8px 32px rgba(196, 181, 253, 0.4), 0 0 20px rgba(251, 207, 232, 0.3), inset 0 2px 16px rgba(255, 255, 255, 0.2)",
                        "0 12px 40px rgba(251, 207, 232, 0.5), 0 0 30px rgba(196, 181, 253, 0.4), inset 0 2px 20px rgba(255, 255, 255, 0.3)",
                        "0 8px 32px rgba(196, 181, 253, 0.4), 0 0 20px rgba(251, 207, 232, 0.3), inset 0 2px 16px rgba(255, 255, 255, 0.2)",
                      ],
                    }}
                    transition={{
                      backgroundPosition: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      boxShadow: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    }}
                  >
                    {/* Subtle shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Gentle sparkles on hover */}
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={`sparkle-${i}`}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.div>

                    {/* Floating petals on hover */}
                    <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 overflow-hidden rounded-full">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={`petal-${i}`}
                          className="absolute text-white/40 text-sm"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: "100%",
                          }}
                          animate={{
                            y: [-20, -60],
                            x: [0, Math.sin(i) * 20],
                            rotate: [0, 360],
                            opacity: [0, 0.6, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.3,
                            ease: "easeOut",
                          }}
                        >
                          {["🌸", "🌺", "🌷"][i % 3]}
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Button content */}
                    <motion.div
                      className="relative z-10 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="text-xl"
                        animate={{
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        🌸
                      </motion.span>
                      <span className="font-medium tracking-wide">Find Your Magical Path</span>
                      <motion.span
                        className="text-xl"
                        animate={{
                          rotate: [0, -5, 5, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: 2,
                        }}
                      >
                        🌺
                      </motion.span>
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                className="text-gray-500 mt-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Take our enchanted quiz to discover which garden path calls to your soul ✨
              </motion.p>

              <motion.p
                className="text-slate-500 mt-2 text-sm italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                "Where your personality blooms into perfect jewelry treasures"
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flower Basket */}
      <FlowerBasket
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        items={flowerBasket}
        onUpdateQuantity={updateBasketQuantity}
        onRemoveItem={removeFromBasket}
      />

      {/* Floating Basket Button */}
      {totalBasketItems > 0 && (
        <motion.button
          className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
          onClick={() => setIsBasketOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <div className="relative">
            <motion.div
              className="text-2xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🧺
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 bg-white text-purple-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {totalBasketItems}
            </motion.div>
          </div>
        </motion.button>
      )}
    </section>
  )
}
