"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, Minimize2, Maximize2 } from "lucide-react"

interface GiftGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Persona {
  id: string
  emoji: string
  title: string
  description: string
  copy: string
  suggestions: string[]
  buttons: { text: string; action: string; icon: string }[]
  gradient: string
}

const personas: Persona[] = [
  {
    id: "girlfriend",
    emoji: "🌹",
    title: "I'm shopping for my girlfriend...",
    description: "Oh you romantic soul...",
    copy: "Listen to her softness. Does she light up at the scent of lilacs? Does she laugh with her whole heart?\n\nTake her somewhere thoughtful - a picnic under dappled light, strawberries, a little jazz in the background.\n\nGive her this bracelet — not just as a gift, but as a moment she'll remember.\n\nWrite her a love letter — we'll print it on vintage-style paper and seal it with wax. Just send us your words, and we'll do the rest.\n\nPair it with flowers and her favourite chocolate - and we can almost guarantee she'll love it.\n\nNot sure what fits her vibe? Start with the quiz.\nOr let the Wisteria Haze bracelet say what words can't.",
    suggestions: ["Pair it with feelings. We'll take care of the sparkle."],
    buttons: [
      { text: "Add a Vintage Letter", action: "letter", icon: "💌" },
      { text: "Take the Quiz", action: "quiz", icon: "🎀" },
      { text: "Browse Romance Collection", action: "romance", icon: "🌹" },
    ],
    gradient: "from-rose-100 via-pink-50 to-rose-100",
  },
  {
    id: "friend",
    emoji: "🌷",
    title: "I'm shopping for my best friend...",
    description: "This one's for the ride-or-die. The brunch buddy. The voice note therapist.",
    copy: "Whether you've been inseparable since school or just found your soul-sister recently — some friendships deserve more than just a text.\n\nA friendship bracelet is a forever kind of thing.\n\nHow cute would it be to get matching sets? Or compare your personalities and wear pieces that complement each other — like moon and sun, lilac and rose, sparkle and storm.\n\nFriends for life, am I right?\n\nAdd a letter, a joke, a shared secret — we'll wrap it like a keepsake.",
    suggestions: ["Tiny tokens. Big feelings. You'll both be glowing."],
    buttons: [
      { text: "Browse Friendship Pieces", action: "friendship", icon: "🌷" },
      { text: "Add a Memory Note", action: "memory", icon: "💝" },
      { text: "Take the Quiz Together", action: "quiz", icon: "✨" },
    ],
    gradient: "from-orange-100 via-peach-50 to-orange-100",
  },
  {
    id: "myself",
    emoji: "🦋",
    title: "I want something for myself...",
    description: "Darling, yes. You deserve sparkle just because you breathe.",
    copy: "Take the quiz to find your mood, or scroll until something flutters in your chest.",
    suggestions: ["Jewelry that feels like you. Not like a trend."],
    buttons: [
      { text: "Take the Quiz", action: "quiz", icon: "🎀" },
      { text: "Browse by Mood", action: "mood", icon: "🌙" },
      { text: "Self-Love Collection", action: "selflove", icon: "💖" },
    ],
    gradient: "from-blue-100 via-sky-50 to-blue-100",
  },
  {
    id: "browsing",
    emoji: "💌",
    title: "I'm just browsing...",
    description: "Stay a while, dreamer.",
    copy: "Let the petals fall where they may. Why not try our mood mirror? Or click a floating flower — there may be a whisper meant just for you.",
    suggestions: ["There's no wrong way to explore beauty."],
    buttons: [
      { text: "Visit the Mood Mirror", action: "mood", icon: "🪞" },
      { text: "Explore Collections", action: "collections", icon: "🌸" },
      { text: "Find Hidden Whispers", action: "whispers", icon: "✨" },
    ],
    gradient: "from-purple-100 via-lavender-50 to-purple-100",
  },
  {
    id: "family",
    emoji: "🌼",
    title: "I'm shopping for a family member...",
    description: "Your mom, sister, aunt — they hold pieces of your heart.",
    copy: "Let's find them something meaningful, not just pretty. We can help you write a message and wrap it like a story.",
    suggestions: ["For the ones who raised you, made you laugh, or held you when you broke."],
    buttons: [
      { text: "Family Collection", action: "family", icon: "🌼" },
      { text: "Add a Story Note", action: "story", icon: "📜" },
      { text: "Meaningful Pieces", action: "meaningful", icon: "💝" },
    ],
    gradient: "from-yellow-100 via-amber-50 to-yellow-100",
  },
  {
    id: "help",
    emoji: "🎁",
    title: "I have no idea. Please help.",
    description: "You're not lost. You're just about to find something.",
    copy: "Take our Fleurene Personality Quiz — it's like mood-matching magic. Or, if all else fails:",
    suggestions: ["Tell us how you feel — we'll translate it into sparkle.", "Visit the Mood Mirror ✨"],
    buttons: [
      { text: "Take the Quiz", action: "quiz", icon: "🎀" },
      { text: "Visit Mood Mirror", action: "mood", icon: "🪞" },
      { text: "Chat with Us", action: "chat", icon: "💬" },
    ],
    gradient: "from-green-100 via-mint-50 to-green-100",
  },
]

export default function GiftGuideModal({ isOpen, onClose }: GiftGuideModalProps) {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showEnvelopeOpen, setShowEnvelopeOpen] = useState(false)
  const dragControls = useDragControls()

  const selectedPersonaData = personas.find((p) => p.id === selectedPersona)

  // Custom cursor trail for modal
  useEffect(() => {
    if (!isOpen) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [isOpen])

  const handleAction = (action: string) => {
    switch (action) {
      case "quiz":
        document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" })
        onClose()
        break
      case "collections":
        // Scroll to collections section
        break
      case "mood":
        // Open mood mirror
        break
      default:
        console.log(`Action: ${action}`)
    }
  }

  const handlePersonaSelect = (personaId: string) => {
    setShowEnvelopeOpen(true)
    setTimeout(() => {
      setSelectedPersona(personaId)
      setShowEnvelopeOpen(false)
    }, 800)
  }

  const handleBack = () => {
    setSelectedPersona(null)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Custom cursor trail - flower petals */}
        <motion.div
          className="absolute pointer-events-none z-60"
          style={{
            left: mousePosition.x - 8,
            top: mousePosition.y - 8,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <span className="text-sm opacity-60">🌸</span>
        </motion.div>

        {/* Backdrop with floating petals */}
        <div className="absolute inset-0 pointer-events-auto" onClick={onClose}>
          {/* Dreamy background */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(248, 244, 255, 0.9) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(254, 242, 242, 0.8) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(240, 253, 244, 0.7) 0%, transparent 60%),
                linear-gradient(135deg, #fef7ff 0%, #fef2f2 25%, #f0fdf4 50%, #faf5ff 75%, #fef7ff 100%)
              `,
            }}
            animate={{
              background: [
                `radial-gradient(circle at 20% 30%, rgba(248, 244, 255, 0.9) 0%, transparent 50%),
                 radial-gradient(circle at 80% 70%, rgba(254, 242, 242, 0.8) 0%, transparent 50%),
                 radial-gradient(circle at 50% 50%, rgba(240, 253, 244, 0.7) 0%, transparent 60%),
                 linear-gradient(135deg, #fef7ff 0%, #fef2f2 25%, #f0fdf4 50%, #faf5ff 75%, #fef7ff 100%)`,
                `radial-gradient(circle at 30% 40%, rgba(254, 242, 242, 0.9) 0%, transparent 50%),
                 radial-gradient(circle at 70% 60%, rgba(240, 253, 244, 0.8) 0%, transparent 50%),
                 radial-gradient(circle at 60% 40%, rgba(248, 244, 255, 0.7) 0%, transparent 60%),
                 linear-gradient(135deg, #fef2f2 0%, #f0fdf4 25%, #faf5ff 50%, #fef7ff 75%, #fef2f2 100%)`,
                `radial-gradient(circle at 20% 30%, rgba(248, 244, 255, 0.9) 0%, transparent 50%),
                 radial-gradient(circle at 80% 70%, rgba(254, 242, 242, 0.8) 0%, transparent 50%),
                 radial-gradient(circle at 50% 50%, rgba(240, 253, 244, 0.7) 0%, transparent 60%),
                 linear-gradient(135deg, #fef7ff 0%, #fef2f2 25%, #f0fdf4 50%, #faf5ff 75%, #fef7ff 100%)`,
              ],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Floating petals in background */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`bg-petal-${i}`}
              className="absolute text-lg opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: ["#F8BBD9", "#E879F9", "#A78BFA", "#60A5FA", "#34D399"][Math.floor(Math.random() * 5)],
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
                scale: [0.5, 1, 0.5],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 2,
              }}
            >
                {["🌸", "🌺", "🌷", "🦋", "✨", "💫"][i % 6]}
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <motion.div
          drag
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0.1}
          className="absolute pointer-events-auto cursor-move"
          style={{
            top: "5%",
            left: "50%",
            x: "-50%",
            maxHeight: "90vh",
          }}
          initial={{
            scale: 0.8,
            opacity: 0,
            y: 50,
            rotateX: -15,
          }}
          animate={{
            scale: isMinimized ? 0.3 : 1,
            opacity: 1,
            y: isMinimized ? 200 : 0,
            rotateX: 0,
          }}
          exit={{
            scale: 0.8,
            opacity: 0,
            y: 50,
            rotateX: -15,
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          {/* Storybook Container */}
          <div
            className="relative max-w-xl w-full mx-4 cursor-auto max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{
              filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15))",
            }}
          >
            {/* Twinkling sparkles around corners */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`corner-sparkle-${i}`}
                className="absolute text-xs z-10"
                style={{
                  left: i < 4 ? (i % 2 === 0 ? "-8px" : "calc(100% + 8px)") : i % 2 === 0 ? "20%" : "80%",
                  top: i < 2 || (i >= 4 && i < 6) ? "-8px" : i < 4 ? "calc(100% + 8px)" : "50%",
                  color: "#D8B4F8",
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            ))}

            {/* Envelope/Storybook Background */}
            <motion.div
              className="relative rounded-3xl overflow-hidden flex flex-col max-h-full"
              style={{
                background: `
                  linear-gradient(135deg, 
                    #fefcff 0%, 
                    #fdf8fd 10%,
                    #fcf4fb 20%, 
                    #faf0f9 30%,
                    #f8ecf7 40%, 
                    #f6e8f5 50%,
                    #f4e4f3 60%, 
                    #f2e0f1 70%,
                    #f0dcef 80%, 
                    #eed8ed 90%,
                    #ecd4eb 100%
                  )
                `,
                boxShadow: `
                  0 30px 60px rgba(216, 180, 248, 0.3),
                  0 15px 30px rgba(233, 213, 255, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.9),
                  inset 0 -1px 0 rgba(216, 180, 248, 0.1)
                `,
              }}
              animate={
                showEnvelopeOpen
                  ? {
                      rotateY: [0, -15, 15, 0],
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.8 }}
            >
              {/* Watercolor texture overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(248, 244, 255, 0.8), transparent 50%),
                    radial-gradient(circle at 75% 25%, rgba(254, 242, 242, 0.6), transparent 50%),
                    radial-gradient(circle at 25% 75%, rgba(240, 253, 244, 0.5), transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(251, 207, 232, 0.7), transparent 50%)
                  `,
                }}
              />

              {/* Delicate paper texture */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 1px 1px, rgba(216, 180, 248, 0.2) 1px, transparent 0),
                    linear-gradient(90deg, transparent 98%, rgba(216, 180, 248, 0.05) 100%),
                    linear-gradient(0deg, transparent 99%, rgba(233, 213, 255, 0.03) 100%)
                  `,
                  backgroundSize: "20px 20px, 100% 2px, 2px 100%",
                }}
              />

              {/* Header */}
              <div className="relative p-8 pb-6">
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-center flex-1"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <motion.h2
                      className="text-3xl font-serif mb-2"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        background: "linear-gradient(135deg, #D8B4F8 0%, #C49CCF 50%, #B794C4 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 2px 4px rgba(216, 180, 248, 0.3))",
                      }}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      Fleurene Gift Guide
                    </motion.h2>

                    {/* Typewriter subtitle */}
                    <motion.p
                      className="text-base italic"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#A78BFA",
                        fontWeight: 400,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 1.5 }}
                    >
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                        style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap" }}
                      >
                        "Not sure where to begin? Let's find your sparkly path..."
                      </motion.span>
                    </motion.p>
                  </motion.div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="w-8 h-8 p-0 text-purple-300 hover:text-purple-500 hover:bg-purple-50/50 rounded-full"
                    >
                      {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="w-8 h-8 p-0 text-purple-300 hover:text-purple-500 hover:bg-purple-50/50 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {!isMinimized && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div
                    className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-200 hover:scrollbar-thumb-purple-300"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#DDD6FE transparent",
                    }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 6px;
                      }
                      div::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      div::-webkit-scrollbar-thumb {
                        background: linear-gradient(to bottom, #DDD6FE, #C4B5FD);
                        border-radius: 3px;
                        transition: all 0.3s ease;
                      }
                      div::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(to bottom, #C4B5FD, #A78BFA);
                      }
                    `}</style>

                    <AnimatePresence mode="wait">
                      {!selectedPersona ? (
                        <motion.div
                          key="personas"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.h3
                            className="text-xl font-serif mb-8 text-center sticky top-0 bg-gradient-to-b from-white/90 to-transparent py-4 -mx-8 px-8 backdrop-blur-sm z-10"
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              color: "#8B5CF6",
                              fontWeight: 500,
                            }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            Who are you shopping for?
                            <motion.div
                              className="w-24 h-0.5 mx-auto mt-2"
                              style={{
                                background: "linear-gradient(90deg, transparent, #D8B4F8, transparent)",
                              }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.8, duration: 1 }}
                            />
                          </motion.h3>

                          <div className="grid grid-cols-2 gap-6 pb-4">
                            {personas.map((persona, index) => (
                              <motion.button
                                key={persona.id}
                                onClick={() => handlePersonaSelect(persona.id)}
                                className={`group relative p-6 rounded-3xl transition-all duration-500 text-left overflow-hidden bg-gradient-to-br ${persona.gradient} border border-white/50 hover:border-white/80`}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.1 * index + 0.6, duration: 0.6 }}
                                whileHover={{
                                  scale: 1.05,
                                  y: -8,
                                  boxShadow: "0 20px 40px rgba(216, 180, 248, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                  boxShadow: "0 8px 25px rgba(216, 180, 248, 0.15)",
                                }}
                              >
                                {/* Keep all the existing button content */}
                                <motion.div
                                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100"
                                  transition={{ duration: 0.3 }}
                                >
                                  {[...Array(6)].map((_, i) => (
                                    <motion.div
                                      key={`petal-${i}`}
                                      className="absolute text-xs"
                                      style={{
                                        left: `${20 + Math.random() * 60}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                        color: "#F8BBD9",
                                      }}
                                      animate={{
                                        y: [0, -20],
                                        x: [0, (Math.random() - 0.5) * 30],
                                        rotate: [0, Math.random() * 360],
                                        scale: [0, 1, 0],
                                        opacity: [0, 0.8, 0],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatDelay: Math.random() * 2,
                                        ease: "easeOut",
                                      }}
                                    >
                                      🌸
                                    </motion.div>
                                  ))}
                                </motion.div>

                                <div className="relative z-10">
                                  <div className="flex items-center gap-4 mb-3">
                                    <motion.span
                                      className="text-3xl"
                                      whileHover={{
                                        scale: 1.2,
                                        rotate: [0, -10, 10, 0],
                                        filter: [
                                          "drop-shadow(0 0 0px rgba(216, 180, 248, 0))",
                                          "drop-shadow(0 0 8px rgba(216, 180, 248, 0.6))",
                                        ],
                                      }}
                                      transition={{ duration: 0.5 }}
                                    >
                                      {persona.emoji}
                                    </motion.span>
                                    <div className="flex-1">
                                      <motion.p
                                        className="text-sm font-medium leading-tight italic"
                                        style={{
                                          color: "#6B46C1",
                                          fontFamily: "'Cormorant Garamond', serif",
                                        }}
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        {persona.title
                                          .replace("I'm shopping for ", "")
                                          .replace("I want something for ", "")
                                          .replace("I have no idea. Please help.", "Help me choose")
                                          .replace("I'm just browsing...", "Just browsing")}
                                      </motion.p>
                                    </div>
                                  </div>

                                  <motion.div
                                    className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-0 group-hover:opacity-100"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="selected"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          transition={{ duration: 0.5 }}
                          className="space-y-6 pb-4"
                        >
                          {/* Back button - sticky */}
                          <div className="sticky top-0 bg-gradient-to-b from-white/90 to-transparent py-4 -mx-8 px-8 backdrop-blur-sm z-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleBack}
                              className="text-purple-400 hover:text-purple-600 p-0 h-auto font-normal italic"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              ← Back to dreaming
                            </Button>
                          </div>

                          {/* Selected persona content */}
                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div
                              className="text-5xl mb-4"
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            >
                              {selectedPersonaData?.emoji}
                            </motion.div>
                            <h3
                              className="text-xl font-serif mb-3 italic"
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                color: "#8B5CF6",
                              }}
                            >
                              {selectedPersonaData?.title}
                            </h3>
                            <p
                              className="text-purple-500 italic mb-4"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              {selectedPersonaData?.description}
                            </p>
                          </motion.div>

                          {/* Copy */}
                          <motion.div
                            className="bg-white/60 rounded-2xl p-6 border border-purple-100/50 hover:border-purple-300/80 transition-all duration-500 text-left overflow-hidden"
                            style={{
                              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <p
                              className="text-slate-600 text-sm leading-relaxed mb-4 whitespace-pre-line"
                              style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                color: "#6B7280", // A nice purply-grey color
                              }}
                            >
                              {selectedPersonaData?.copy}
                            </p>
                            {selectedPersonaData?.suggestions.map((suggestion, index) => (
                              <motion.p
                                key={index}
                                className="text-slate-500 italic text-sm"
                                style={{
                                  fontFamily: "'Cormorant Garamond', serif",
                                  color: "#64748B", // Slightly lighter purply-grey
                                }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.2 }}
                              >
                                → "{suggestion}"
                              </motion.p>
                            ))}
                          </motion.div>

                          {/* Action buttons */}
                          <motion.div
                            className="space-y-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            {selectedPersonaData?.buttons.map((button, index) => (
                              <motion.button
                                key={button.action}
                                onClick={() => handleAction(button.action)}
                                className="group w-full p-4 rounded-2xl bg-gradient-to-r from-white/80 to-white/60 hover:from-white/90 hover:to-white/80 border border-purple-200/50 hover:border-purple-300/80 transition-all duration-500 text-left overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                whileHover={{
                                  scale: 1.02,
                                  y: -2,
                                  boxShadow: "0 10px 25px rgba(216, 180, 248, 0.2)",
                                }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  boxShadow: "0 4px 15px rgba(216, 180, 248, 0.1)",
                                }}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 opacity-0 group-hover:opacity-100"
                                  initial={{ scale: 0 }}
                                  whileHover={{ scale: 1 }}
                                  transition={{ duration: 0.5 }}
                                  style={{ borderRadius: "inherit" }}
                                />

                                <div className="relative z-10 flex items-center gap-4">
                                  <motion.span
                                    className="text-xl"
                                    whileHover={{
                                      scale: 1.2,
                                      filter: "drop-shadow(0 0 8px rgba(216, 180, 248, 0.6))",
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {button.icon}
                                  </motion.span>
                                  <span
                                    className="font-medium text-sm italic"
                                    style={{
                                      color: "#6B46C1",
                                      fontFamily: "'Cormorant Garamond', serif",
                                    }}
                                  >
                                    {button.text}
                                  </span>
                                </div>
                              </motion.button>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Decorative fairy */}
              <motion.div
                className="absolute top-6 right-6 text-purple-300 opacity-70"
                animate={{
                  rotate: [0, 10, -10, 0],
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                🧚‍♀️
              </motion.div>

              {/* Bottom sparkle */}
              <motion.div
                className="absolute bottom-6 left-6 text-purple-300 opacity-60"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
