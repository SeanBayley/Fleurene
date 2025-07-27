"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Save, Globe, Lock, Heart, Upload, Camera, Palette, Wand2, ImageIcon, Trash2 } from "lucide-react"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  quote: string
  date: string
  tags: string[]
  isPublic: boolean
  author?: string
  likes?: number
  images?: string[]
  moodBoard?: string[]
}

interface JournalModalProps {
  isOpen: boolean
  onClose: () => void
}

const moods = [
  { name: "Ethereal", emoji: "🌙", color: "from-indigo-200 via-purple-200 to-pink-200", glow: "shadow-indigo-200/50" },
  { name: "Grateful", emoji: "🙏", color: "from-pink-200 via-rose-200 to-orange-200", glow: "shadow-pink-200/50" },
  { name: "Dreamy", emoji: "✨", color: "from-purple-200 via-pink-200 to-blue-200", glow: "shadow-purple-200/50" },
  { name: "Melancholy", emoji: "🌧️", color: "from-blue-200 via-gray-200 to-slate-200", glow: "shadow-blue-200/50" },
  { name: "Inspired", emoji: "💫", color: "from-yellow-200 via-pink-200 to-purple-200", glow: "shadow-yellow-200/50" },
  { name: "Peaceful", emoji: "🕊️", color: "from-green-200 via-blue-200 to-teal-200", glow: "shadow-green-200/50" },
  {
    name: "Mystical",
    emoji: "🔮",
    color: "from-violet-200 via-purple-200 to-indigo-200",
    glow: "shadow-violet-200/50",
  },
  { name: "Radiant", emoji: "🌟", color: "from-amber-200 via-yellow-200 to-orange-200", glow: "shadow-amber-200/50" },
]

const inspiringQuotes = [
  "The quieter you become, the more you are able to hear. - Rumi",
  "What we plant in the soil of contemplation, we shall reap in the harvest of action. - Meister Eckhart",
  "The wound is the place where the Light enters you. - Rumi",
  "Be yourself; everyone else is already taken. - Oscar Wilde",
  "In the depth of winter, I finally learned that there was in me an invincible summer. - Albert Camus",
  "The only way to make sense out of change is to plunge into it, move with it, and join the dance. - Alan Watts",
  "Magic is believing in yourself. If you can do that, you can make anything happen. - Johann Wolfgang von Goethe",
  "She was a wildflower in love with the moon, dancing in fields of stardust and dreams. - Unknown",
  "Your soul is attracted to people the same way flowers are attracted to the sun. - Unknown",
  "In a world full of roses, be a wildflower. - Unknown",
]

const writingPrompts = [
  "What magic did you discover in the ordinary today? ✨",
  "If your heart could speak, what story would it tell? 💖",
  "Describe this moment as if it were a scene from a fairytale 🧚‍♀️",
  "What whispered to your soul when the world grew quiet? 🌙",
  "Paint your feelings with words like watercolors 🎨",
  "What small wonder made your spirit dance today? 💃",
  "If you could bottle this feeling, what would you call it? 🍃",
  "What dreams are blooming in your heart's garden? 🌸",
  "Describe the colors of your current emotions 🌈",
  "What would you tell your younger self about this moment? 💫",
]

// Mock shared entries from the community
const mockSharedEntries: JournalEntry[] = [
  {
    id: "shared-1",
    title: "Morning Coffee Ritual",
    content:
      "There's something magical about the first sip of coffee in the morning. The steam rising like tiny prayers, the warmth spreading through my hands. Today I noticed how the light caught the steam, creating little rainbows. Sometimes the smallest moments hold the biggest magic.",
    mood: "Peaceful",
    quote: "Life is like a cup of tea. It's all in how you make it. - Unknown",
    date: new Date(Date.now() - 86400000).toISOString(),
    tags: ["morning", "gratitude"],
    isPublic: true,
    author: "Luna",
    likes: 12,
    images: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "shared-2",
    title: "Rainy Day Thoughts",
    content:
      "The rain is painting patterns on my window, and I'm watching each drop race down the glass. There's poetry in the chaos of weather. I used to fear storms, but now I see them as nature's way of washing the world clean, preparing it for new growth.",
    mood: "Dreamy",
    quote: "Let the rain kiss you. Let the rain beat upon your head with silver liquid drops. - Langston Hughes",
    date: new Date(Date.now() - 172800000).toISOString(),
    tags: ["rain", "reflection"],
    isPublic: true,
    author: "Sage",
    likes: 8,
    moodBoard: [
      "/placeholder.svg?height=150&width=200",
      "/placeholder.svg?height=150&width=200",
      "/placeholder.svg?height=150&width=200",
    ],
  },
  {
    id: "shared-3",
    title: "Garden Wisdom",
    content:
      "My grandmother's roses are blooming again. She's been gone for three years, but her garden keeps teaching me about resilience. The roses don't mourn the winter; they simply trust that spring will come. Maybe that's the secret - not to fear the seasons of our hearts.",
    mood: "Grateful",
    quote:
      "A garden requires patient labor and attention. Plants and flowers provide the reward. - Liberty Hyde Bailey",
    date: new Date(Date.now() - 259200000).toISOString(),
    tags: ["family", "growth"],
    isPublic: true,
    author: "Rose",
    likes: 15,
    images: ["/placeholder.svg?height=250&width=400"],
  },
]

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
  const [currentEntry, setCurrentEntry] = useState<Partial<JournalEntry>>({
    title: "",
    content: "",
    mood: "",
    quote: "",
    tags: [],
    isPublic: false,
    images: [],
    moodBoard: [],
  })
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [view, setView] = useState<"write" | "entries" | "community">("write")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [showMoodAnalysis, setShowMoodAnalysis] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Load entries from localStorage
      const savedEntries = localStorage.getItem("fleurene-journal-entries")
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries))
      }
      // Set a random prompt
      setCurrentPrompt(writingPrompts[Math.floor(Math.random() * writingPrompts.length)])
    }
  }, [isOpen])

  const saveEntry = () => {
    if (!currentEntry.content?.trim()) return

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title || "Untitled",
      content: currentEntry.content,
      mood: currentEntry.mood || "",
      quote: currentEntry.quote || "",
      date: new Date().toISOString(),
      tags: currentEntry.tags || [],
      isPublic: currentEntry.isPublic || false,
      author: currentEntry.isPublic ? "You" : undefined,
      likes: 0,
      images: currentEntry.images || [],
      moodBoard: currentEntry.moodBoard || [],
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem("fleurene-journal-entries", JSON.stringify(updatedEntries))

    // Reset form
    setCurrentEntry({
      title: "",
      content: "",
      mood: "",
      quote: "",
      tags: [],
      isPublic: false,
      images: [],
      moodBoard: [],
    })

    // Show mood analysis
    setShowMoodAnalysis(true)
    setTimeout(() => setShowMoodAnalysis(false), 4000)
  }

  const getRandomQuote = () => {
    const randomQuote = inspiringQuotes[Math.floor(Math.random() * inspiringQuotes.length)]
    setCurrentEntry({ ...currentEntry, quote: randomQuote })
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setCurrentEntry((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setCurrentEntry((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleImageUpload(e.dataTransfer.files)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gradient-to-br from-white via-purple-25 via-pink-25 to-rose-25 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl relative border border-purple-200/50"
          initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Magical Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Aurora Effect */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
                `,
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Enhanced Sparkles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`modal-sparkle-${i}`}
                className="absolute text-sm opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -25, 0],
                  rotate: [0, 360],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [0.8, 1.5, 0.8],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 4,
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Magical Creatures */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`modal-creature-${i}`}
                className="absolute text-lg opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -20, 15, 0],
                  rotate: [0, 8, -8, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 3,
                }}
              >
                {["🧚‍♀️", "🦋", "🌸", "🍃", "💫", "🌿", "🔮", "🌟", "🎭", "💎"][i]}
              </motion.div>
            ))}
          </div>

          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-200/50 relative z-10 bg-white/30 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-2xl drop-shadow-lg"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  🧚‍♀️
                </motion.span>
                <h2 className="text-2xl font-serif bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
                  Your Enchanted Journal
                </h2>
                <motion.span
                  className="text-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  ✨
                </motion.span>
              </div>
              <div className="flex gap-3">
                {[
                  { key: "write", icon: "✍️", label: "Write", count: null },
                  { key: "entries", icon: "📖", label: "My Stories", count: entries.length },
                  { key: "community", icon: "🌍", label: "Kindred Spirits", count: null },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setView(tab.key as any)}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center gap-2 ${
                      view === tab.key
                        ? "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 shadow-lg"
                        : "text-gray-600 hover:text-purple-700 hover:bg-white/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-3 hover:bg-purple-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          </div>

          {/* Enhanced Content */}
          <div className="p-6 max-h-[calc(95vh-140px)] overflow-y-auto relative z-10 custom-scrollbar">
            {view === "write" ? (
              <div className="space-y-6">
                {/* Enhanced Writing Prompt */}
                <motion.div
                  className="bg-gradient-to-br from-white/70 via-purple-50/70 to-pink-50/70 backdrop-blur-md rounded-3xl p-6 border border-purple-200/50 relative overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Prompt magical effects */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xs opacity-30"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          rotate: [0, 360],
                          opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 2,
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                  <div className="relative z-10">
                    <p className="text-purple-600 italic text-sm mb-3 flex items-center gap-2 font-medium">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        🌟
                      </motion.span>
                      Today's magical writing prompt:
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed">{currentPrompt}</p>
                    <motion.button
                      onClick={() =>
                        setCurrentPrompt(writingPrompts[Math.floor(Math.random() * writingPrompts.length)])
                      }
                      className="mt-3 text-purple-500 hover:text-purple-700 text-sm flex items-center gap-1 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Wand2 className="w-3 h-3" />
                      New prompt
                    </motion.button>
                  </div>
                </motion.div>

                {/* Enhanced Title Input */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Whisper a title for your enchanted tale... ✨"
                    value={currentEntry.title || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    className="w-full p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-200/50 focus:border-purple-400 focus:outline-none text-lg font-medium placeholder-gray-400 shadow-lg transition-all duration-300 focus:shadow-xl"
                  />
                </motion.div>

                {/* Enhanced Main Text Area */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <textarea
                    placeholder="Let your heart spill its secrets onto these enchanted pages... What magic lives within you today? 🌸"
                    value={currentEntry.content || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                    rows={8}
                    className="w-full p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-200/50 focus:border-purple-400 focus:outline-none text-gray-700 text-base leading-relaxed placeholder-gray-400 resize-none shadow-lg transition-all duration-300 focus:shadow-xl"
                  />
                  <motion.div
                    className="absolute top-4 right-4 text-sm opacity-40"
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    ✨
                  </motion.div>
                </motion.div>

                {/* Enhanced Image Upload Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="text-gray-600 mb-4 font-medium text-sm flex items-center gap-2">
                    <span>🖼️</span> Create your visual story
                  </p>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragOver ? "border-purple-400 bg-purple-50/50" : "border-purple-200 bg-white/50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <motion.div animate={{ y: dragOver ? -5 : 0 }} transition={{ duration: 0.2 }}>
                      <ImageIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Drag & drop your magical moments here, or click to browse</p>
                      <div className="flex gap-3 justify-center">
                        <motion.button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 rounded-full text-sm font-medium hover:from-purple-300 hover:to-pink-300 transition-all duration-300 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className="w-4 h-4" />
                          Upload Images
                        </motion.button>
                        <motion.button
                          className="px-4 py-2 bg-gradient-to-r from-blue-200 to-purple-200 text-blue-700 rounded-full text-sm font-medium hover:from-blue-300 hover:to-purple-300 transition-all duration-300 flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Camera className="w-4 h-4" />
                          Take Photo
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                  />

                  {/* Image Preview Grid */}
                  {currentEntry.images && currentEntry.images.length > 0 && (
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {currentEntry.images.map((image, index) => (
                        <motion.div
                          key={index}
                          className="relative group rounded-xl overflow-hidden shadow-lg"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <motion.button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>

                {/* Enhanced Mood Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <p className="text-gray-600 mb-4 font-medium text-sm flex items-center gap-2">
                    <span>💭</span> How is your heart feeling today?
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {moods.map((mood, index) => (
                      <motion.button
                        key={mood.name}
                        onClick={() => setCurrentEntry({ ...currentEntry, mood: mood.name })}
                        className={`p-4 rounded-2xl text-sm transition-all duration-300 flex flex-col items-center gap-2 ${
                          currentEntry.mood === mood.name
                            ? `bg-gradient-to-br ${mood.color} text-gray-800 shadow-lg ${mood.glow} border-2 border-white/50`
                            : "bg-white/60 text-gray-600 hover:bg-white/80 border-2 border-transparent"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className="text-2xl"
                          animate={
                            currentEntry.mood === mood.name
                              ? {
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 10, -10, 0],
                                }
                              : {}
                          }
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {mood.emoji}
                        </motion.span>
                        <span className="font-medium">{mood.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Quote Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-600 font-medium text-sm flex items-center gap-2">
                      <span>📖</span> Words that dance with your soul
                    </p>
                    <motion.button
                      onClick={getRandomQuote}
                      className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-2 px-3 py-1 rounded-full hover:bg-purple-50 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles className="w-4 h-4" />
                      Inspire me
                    </motion.button>
                  </div>
                  <textarea
                    placeholder="A quote, a whispered wisdom, or words that made your spirit soar... ✨"
                    value={currentEntry.quote || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, quote: e.target.value })}
                    rows={3}
                    className="w-full p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-purple-200/50 focus:border-purple-400 focus:outline-none text-gray-700 text-sm italic placeholder-gray-400 resize-none shadow-lg transition-all duration-300 focus:shadow-xl"
                  />
                </motion.div>

                {/* Enhanced Privacy Toggle */}
                <motion.div
                  className="bg-gradient-to-br from-white/70 via-purple-50/70 to-pink-50/70 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 relative overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-xs opacity-20"
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          top: `${30 + Math.random() * 40}%`,
                        }}
                        animate={{
                          rotate: [0, 360],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 5 + Math.random() * 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 2,
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="flex items-center gap-3"
                          animate={currentEntry.isPublic ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {currentEntry.isPublic ? (
                            <Globe className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-500" />
                          )}
                          <span className="font-medium text-gray-700">
                            {currentEntry.isPublic ? "Share with kindred spirits" : "Keep in my secret garden"}
                          </span>
                        </motion.div>
                      </div>
                      <motion.button
                        onClick={() => setCurrentEntry({ ...currentEntry, isPublic: !currentEntry.isPublic })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          currentEntry.isPublic ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300"
                          animate={{
                            x: currentEntry.isPublic ? 24 : 4,
                          }}
                        />
                      </motion.button>
                    </div>
                    <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                      {currentEntry.isPublic
                        ? "Your beautiful words will inspire other dreamers in our magical community ✨"
                        : "Your precious thoughts will remain safe in your private sanctuary 🔒"}
                    </p>
                  </div>
                </motion.div>

                {/* Enhanced Save Button */}
                <motion.div
                  className="flex justify-center pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <div className="relative">
                    {/* Button magical aura */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-purple-400/40 rounded-full blur-lg"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />

                    <motion.button
                      onClick={saveEntry}
                      disabled={!currentEntry.content?.trim()}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-full font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-500 flex items-center gap-3 relative overflow-hidden shadow-2xl border border-white/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button sparkles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-sm opacity-60"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                              rotate: [0, 360],
                              opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                              duration: 2 + Math.random(),
                              repeat: Number.POSITIVE_INFINITY,
                              delay: Math.random(),
                            }}
                          >
                            ✨
                          </motion.div>
                        ))}
                      </div>
                      <Save className="w-5 h-5" />
                      <span>Plant in My Enchanted Garden</span>
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        🌸
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ) : view === "entries" ? (
              <div className="space-y-6">
                {entries.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      className="text-8xl mb-6"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    >
                      🌱
                    </motion.div>
                    <h3 className="text-2xl font-serif text-purple-600 mb-4">
                      Your enchanted garden awaits its first bloom
                    </h3>
                    <p className="text-gray-500 text-lg mb-6">Every magical story begins with a single word...</p>
                    <motion.button
                      onClick={() => setView("write")}
                      className="text-purple-600 hover:text-purple-700 text-base flex items-center gap-2 mx-auto px-6 py-3 bg-purple-50 rounded-full hover:bg-purple-100 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Begin your enchanted tale <span>✨</span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid gap-6">
                    {entries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        className="bg-gradient-to-br from-white/80 via-purple-50/80 to-pink-50/80 backdrop-blur-md rounded-3xl p-6 border border-purple-200/50 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        {/* Entry magical effects */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute text-xs opacity-20"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                              }}
                              animate={{
                                rotate: [0, 360],
                                opacity: [0.1, 0.3, 0.1],
                              }}
                              transition={{
                                duration: 5 + Math.random() * 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: Math.random() * 2,
                              }}
                            >
                              ✨
                            </motion.div>
                          ))}
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-gray-800 text-lg">{entry.title}</h3>
                            <div className="flex items-center gap-2 text-xs">
                              {entry.isPublic && (
                                <span className="px-3 py-1 bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 rounded-full text-xs flex items-center gap-1 font-medium">
                                  <Globe className="w-3 h-3" />
                                  Shared
                                </span>
                              )}
                              {entry.mood && (
                                <span className="px-3 py-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full text-xs font-medium text-purple-700">
                                  {moods.find((m) => m.name === entry.mood)?.emoji} {entry.mood}
                                </span>
                              )}
                              <span className="text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed mb-4 text-sm">{entry.content}</p>

                          {/* Entry Images */}
                          {entry.images && entry.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                              {entry.images.map((image, imgIndex) => (
                                <motion.div
                                  key={imgIndex}
                                  className="rounded-xl overflow-hidden shadow-md"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Entry image ${imgIndex + 1}`}
                                    className="w-full h-24 object-cover"
                                  />
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {entry.quote && (
                            <blockquote className="border-l-4 border-purple-300 pl-4 italic text-gray-600 text-sm bg-purple-50/50 rounded-r-lg p-3 mb-4">
                              {entry.quote}
                            </blockquote>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                    >
                      🧚‍♀️
                    </motion.span>
                    <h3 className="text-2xl font-serif text-purple-700">Kindred Spirits Garden</h3>
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, -15, 15, 0] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
                    >
                      🌸
                    </motion.span>
                  </div>
                  <p className="text-gray-600 text-base">Beautiful souls sharing their magic with the world</p>
                </motion.div>

                <div className="grid gap-6">
                  {mockSharedEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      className="bg-gradient-to-br from-white/80 via-purple-50/80 to-pink-50/80 backdrop-blur-md rounded-3xl p-6 border border-purple-200/50 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      {/* Community entry sparkles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute text-xs opacity-20"
                            style={{
                              left: `${20 + Math.random() * 60}%`,
                              top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                              rotate: [0, 360],
                              opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                              duration: 5 + Math.random() * 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: Math.random() * 2,
                            }}
                          >
                            ✨
                          </motion.div>
                        ))}
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">{entry.title}</h3>
                            <p className="text-sm text-purple-600 flex items-center gap-2 font-medium">
                              <span>🧚‍♀️</span> by {entry.author}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {entry.mood && (
                              <span className="px-3 py-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full text-xs font-medium text-purple-700">
                                {moods.find((m) => m.name === entry.mood)?.emoji} {entry.mood}
                              </span>
                            )}
                            <span className="text-gray-500">{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4 text-sm">{entry.content}</p>

                        {/* Community Entry Images */}
                        {entry.images && entry.images.length > 0 && (
                          <div className="grid grid-cols-1 gap-3 mb-4">
                            {entry.images.map((image, imgIndex) => (
                              <motion.div
                                key={imgIndex}
                                className="rounded-xl overflow-hidden shadow-md"
                                whileHover={{ scale: 1.02 }}
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`${entry.author}'s image ${imgIndex + 1}`}
                                  className="w-full h-48 object-cover"
                                />
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Community Entry Mood Board */}
                        {entry.moodBoard && entry.moodBoard.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-purple-600 mb-2 flex items-center gap-1">
                              <Palette className="w-3 h-3" />
                              Mood Board
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {entry.moodBoard.map((image, imgIndex) => (
                                <motion.div
                                  key={imgIndex}
                                  className="rounded-lg overflow-hidden shadow-sm"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Mood ${imgIndex + 1}`}
                                    className="w-full h-20 object-cover"
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {entry.quote && (
                          <blockquote className="border-l-4 border-purple-300 pl-4 italic text-gray-600 mb-4 text-sm bg-purple-50/50 rounded-r-lg p-3">
                            {entry.quote}
                          </blockquote>
                        )}

                        <div className="flex items-center gap-6 pt-4 border-t border-purple-200/50">
                          <motion.button
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Heart className="w-4 h-4" />
                            </motion.div>
                            <span>{entry.likes}</span>
                          </motion.button>
                          <span className="text-gray-400 text-xs flex items-center gap-1">
                            <motion.span
                              animate={{
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                            >
                              💫
                            </motion.span>
                            Inspiring souls
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Mood Analysis Popup */}
          <AnimatePresence>
            {showMoodAnalysis && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl p-8 shadow-2xl border border-purple-200 z-20 backdrop-blur-md"
                initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0, opacity: 0, rotateY: 180 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <div className="text-center relative">
                  {/* Popup sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-sm opacity-40"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          rotate: [0, 360],
                          opacity: [0.2, 0.6, 0.2],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random(),
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="text-5xl mb-4"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    🌸
                  </motion.div>
                  <h3 className="text-xl font-serif text-purple-600 mb-3">Your story has bloomed!</h3>
                  <p className="text-gray-600 text-sm mb-4 max-w-xs">
                    {currentEntry.isPublic
                      ? "Your beautiful words will inspire kindred spirits in our magical community ✨"
                      : "Your precious thoughts rest safely in your enchanted sanctuary 🔒"}
                  </p>
                  <motion.div
                    className="flex items-center justify-center gap-2 text-purple-500 text-sm"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <span>🧚‍♀️</span>
                    <span>Magic planted successfully</span>
                    <span>🌟</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
