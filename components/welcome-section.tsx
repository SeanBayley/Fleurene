"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FloatingElement {
  id: string
  left: number
  top: number
  emoji: string
  duration: number
  delay: number
  fontSize?: number
  motionType?: number
}

export default function WelcomeSection() {
  const [displayedText, setDisplayedText] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
  const [isLetterVisible, setIsLetterVisible] = useState(false)
  const [hasAnimationCompleted, setHasAnimationCompleted] = useState(false)
  const [isHoveringEnvelope, setIsHoveringEnvelope] = useState(false)
  const [isHoveringButton, setIsHoveringButton] = useState(false)
  const [isHoveringSeal, setIsHoveringSeal] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([])
  const [flowerMotifs, setFlowerMotifs] = useState<FloatingElement[]>([])
  const [lightParticles, setLightParticles] = useState<FloatingElement[]>([])
  const envelopeRef = useRef<HTMLDivElement>(null)

  const fullText = `Dearest gentle dreamer,

You've stumbled upon a most curious corner of the internet — where moods bloom, sparkle whispers secrets, and no feeling is ever too much.

This is Fleurene — not just a jewelry brand, but a little garden of aesthetic expression. A place where your inner soft girl, romantic rebel, or flower-hearted philosopher is not only welcome, but celebrated.

So take a breath. Let the petals part.

And come discover the jewels that already live inside you — we're just here to help you wear them.

With affection,
Fleurene`

  const words = fullText.split(" ")

  // Set client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Generate floating elements only on client side
  useEffect(() => {
    if (!isClient) return

    const romanticeElements = ["🌸", "✨", "🌺", "🌷", "💐", "🦋", "💕", "🌙", "⭐", "🧚‍♀️", "🌹", "💖", "💫", "🌼", "🌻"]
    const flowerEmojis = ["🌸", "🌺", "🌷", "🌹", "🌻", "🌼", "💐", "🦋"]

    // Generate truly random floating elements with enhanced movement
    const newFloatingElements = Array.from({ length: 18 }, (_, i) => ({
      id: `romantic-element-${i}`,
      left: Math.random() * 85 + 5, // Random positioning between 5-90%
      top: Math.random() * 85 + 5,  // Random positioning between 5-90%
      emoji: romanticeElements[Math.floor(Math.random() * romanticeElements.length)],
      duration: Math.random() * 15 + 10, // Faster duration between 10-25 seconds
      delay: Math.random() * 8,
      motionType: Math.floor(Math.random() * 4), // Different motion patterns
    }))

    // Generate random flower motifs with enhanced movement
    const newFlowerMotifs = Array.from({ length: 10 }, (_, i) => ({
      id: `flower-motif-${i}`,
      left: Math.random() * 80 + 10, // Random positioning
      top: Math.random() * 80 + 10,  // Random positioning
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      duration: Math.random() * 20 + 15, // Faster duration between 15-35 seconds
      delay: Math.random() * 6,
      fontSize: Math.random() * 35 + 30, // Random size between 30-65px
      motionType: Math.floor(Math.random() * 4), // Different motion patterns
    }))

    // Generate random light particles with enhanced movement
    const newLightParticles = Array.from({ length: 12 }, (_, i) => ({
      id: `light-particle-${i}`,
      left: Math.random() * 95 + 2, // Random positioning
      top: Math.random() * 95 + 2,  // Random positioning
      emoji: '',
      duration: Math.random() * 12 + 12, // Faster duration between 12-24 seconds
      delay: Math.random() * 4,
      motionType: Math.floor(Math.random() * 3), // Different motion patterns
    }))

    setFloatingElements(newFloatingElements)
    setFlowerMotifs(newFlowerMotifs)
    setLightParticles(newLightParticles)
  }, [isClient])

  // Smoother typewriter effect with better timing
  useEffect(() => {
    if (isLetterVisible && currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => {
          const newText = prev + (prev ? " " : "") + words[currentWordIndex]
          return newText
        })
        setCurrentWordIndex((prev) => prev + 1)
      }, 120) // Slightly slower for better readability

      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, words, isLetterVisible])

  // Check if typing is complete
  useEffect(() => {
    if (currentWordIndex >= words.length && displayedText && !hasAnimationCompleted) {
      const timer = setTimeout(() => {
        setHasAnimationCompleted(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, words.length, displayedText, hasAnimationCompleted])

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true)
    setTimeout(() => {
      setIsLetterVisible(true)
    }, 800)
  }

  const handleCloseLetter = () => {
    setIsLetterVisible(false)
      setIsEnvelopeOpen(false)
      setDisplayedText("")
      setCurrentWordIndex(0)
    setHasAnimationCompleted(false)
  }

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-25 via-purple-25 to-blue-25 flex items-center justify-center">
      {/* Enchanted background - only show when letter is not visible */}
      {!isLetterVisible && (
        <div className="absolute inset-0 z-0">
          {/* Dreamy gradient background with soft pink haze */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 30% 40%, rgba(251, 207, 232, 0.5), rgba(233, 213, 255, 0.4), rgba(248, 244, 255, 0.3))",
                "radial-gradient(circle at 70% 60%, rgba(248, 244, 255, 0.5), rgba(251, 207, 232, 0.4), rgba(233, 213, 255, 0.3))",
                "radial-gradient(circle at 50% 80%, rgba(233, 213, 255, 0.5), rgba(248, 244, 255, 0.4), rgba(251, 207, 232, 0.3))",
              ],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Floating romantic elements with enhanced random motion */}
          {isClient && floatingElements.map((element) => {
            // Create different motion patterns based on motionType
            const getMotionPattern = (type: number) => {
              switch(type) {
                case 0: // Spiral motion
                  return {
                    x: [0, 150 * Math.cos(0), 150 * Math.cos(Math.PI/2), 150 * Math.cos(Math.PI), 150 * Math.cos(3*Math.PI/2), 0],
                    y: [0, 150 * Math.sin(0), 150 * Math.sin(Math.PI/2), 150 * Math.sin(Math.PI), 150 * Math.sin(3*Math.PI/2), 0],
                    rotate: [0, 90, 180, 270, 360],
                    scale: [1, 1.4, 0.8, 1.2, 1],
                  }
                case 1: // Wave motion
                  return {
                    x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                    y: [0, Math.sin(0) * 100, Math.sin(Math.PI/2) * 100, Math.sin(Math.PI) * 100, 0],
                    rotate: [0, Math.random() * 720, Math.random() * 720, 0],
                    scale: [1, Math.random() * 1 + 0.5, Math.random() * 1 + 0.5, 1],
                  }
                case 2: // Bounce motion
                  return {
                    x: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
                    y: [0, -Math.random() * 150, Math.random() * 150, -Math.random() * 100, 0],
                    rotate: [0, Math.random() * 360, Math.random() * 360, 0],
                    scale: [1, 1.8, 0.6, 1.4, 1],
                  }
                default: // Random chaotic motion
                  return {
                    x: [0, Math.random() * 180 - 90, Math.random() * 180 - 90, Math.random() * 180 - 90, 0],
                    y: [0, Math.random() * 180 - 90, Math.random() * 180 - 90, Math.random() * 180 - 90, 0],
                    rotate: [0, Math.random() * 540, Math.random() * 540, 0],
                    scale: [1, Math.random() * 1.2 + 0.4, Math.random() * 1.2 + 0.4, 1],
                  }
              }
            }

            const motionPattern = getMotionPattern(element.motionType || 0) // Default to 0 if motionType is missing
            
            return (
            <motion.div
                key={element.id}
                className="absolute text-xl sm:text-2xl opacity-40 select-none pointer-events-none"
              style={{
                  left: `${element.left}%`,
                  top: `${element.top}%`,
                  zIndex: 1,
                }}
                animate={motionPattern}
              transition={{
                  duration: element.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                  delay: element.delay,
              }}
            >
                {element.emoji}
            </motion.div>
            )
          })}

          {/* Floating flower motifs with enhanced random motion */}
          {isClient && flowerMotifs.map((motif) => {
            // Create different motion patterns for flowers
            const getFlowerMotion = (type: number) => {
              switch(type) {
                case 0: // Figure-8 motion
                  return {
                    x: [0, 100 * Math.cos(0), 100 * Math.cos(Math.PI/4), 100 * Math.cos(Math.PI/2), 100 * Math.cos(3*Math.PI/4), 100 * Math.cos(Math.PI), 0],
                    y: [0, 50 * Math.sin(0), 50 * Math.sin(Math.PI/2), 50 * Math.sin(Math.PI), 50 * Math.sin(3*Math.PI/2), 50 * Math.sin(2*Math.PI), 0],
                    rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
                    scale: [1, 1.3, 0.9, 1.5, 0.7, 1.2, 1],
                  }
                case 1: // Petal drift
                  return {
                    x: [0, Math.random() * 160 - 80, Math.random() * 160 - 80, Math.random() * 160 - 80, 0],
                    y: [0, Math.random() * 160 - 80, Math.random() * 160 - 80, Math.random() * 160 - 80, 0],
                    rotate: [0, Math.random() * 270, Math.random() * 270, 0],
                    scale: [1, Math.random() * 0.8 + 0.6, Math.random() * 0.8 + 0.6, 1],
                  }
                case 2: // Floating dance
                  return {
                    x: [0, Math.sin(0) * 80, Math.sin(Math.PI/3) * 80, Math.sin(2*Math.PI/3) * 80, Math.sin(Math.PI) * 80, 0],
                    y: [0, Math.cos(0) * 120, Math.cos(Math.PI/3) * 120, Math.cos(2*Math.PI/3) * 120, Math.cos(Math.PI) * 120, 0],
                    rotate: [0, 72, 144, 216, 288, 360],
                    scale: [1, 1.4, 0.8, 1.6, 0.9, 1],
                  }
                default: // Wild flutter
                  return {
                    x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                    y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
                    rotate: [0, Math.random() * 450, Math.random() * 450, 0],
                    scale: [1, Math.random() * 1 + 0.5, Math.random() * 1 + 0.5, 1],
                  }
              }
            }

            const flowerMotion = getFlowerMotion(motif.motionType || 0) // Default to 0 if motionType is missing
            
            return (
            <motion.div
                key={motif.id}
                className="absolute opacity-25 select-none pointer-events-none"
              style={{
                  left: `${motif.left}%`,
                  top: `${motif.top}%`,
                  fontSize: `${motif.fontSize}px`,
                  zIndex: 1,
                }}
                animate={flowerMotion}
              transition={{
                  duration: motif.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                  delay: motif.delay,
              }}
            >
                {motif.emoji}
            </motion.div>
            )
          })}

          {/* Ambient light particles with enhanced random motion */}
          {isClient && lightParticles.map((particle) => {
            // Create different motion patterns for particles
            const getParticleMotion = (type: number) => {
              switch(type) {
                case 0: // Sparkle burst
                  return {
                    x: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
                    y: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
                    scale: [0.5, 3, 0.5, 2.5, 0.5],
                    opacity: [0.1, 0.8, 0.1, 0.6, 0.1],
                  }
                case 1: // Gentle float
                  return {
                    x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                    y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
                    scale: [0.8, 2.2, 0.8, 1.8, 0.8],
                    opacity: [0.2, 0.5, 0.2, 0.4, 0.2],
                  }
                default: // Twinkle dance
                  return {
                    x: [0, Math.random() * 140 - 70, Math.random() * 140 - 70, Math.random() * 140 - 70, 0],
                    y: [0, Math.random() * 140 - 70, Math.random() * 140 - 70, Math.random() * 140 - 70, 0],
                    scale: [0.5, 2.8, 0.5, 2.2, 0.5],
                    opacity: [0.1, 0.7, 0.1, 0.5, 0.1],
                  }
              }
            }

            const particleMotion = getParticleMotion(particle.motionType || 0) // Default to 0 if motionType is missing
            
            return (
            <motion.div
                key={particle.id}
              className="absolute w-1 h-1 bg-pink-200 rounded-full opacity-20"
              style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  zIndex: 1,
                }}
                animate={particleMotion}
              transition={{
                  duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                  delay: particle.delay,
              }}
            />
            )
          })}
        </div>
      )}

      {/* Serene background when letter is visible */}
      {isLetterVisible && (
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(251, 207, 232, 0.2), rgba(248, 244, 255, 0.3), rgba(233, 213, 255, 0.2))",
            }}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Elegant header decoration - appears after completion */}
        {hasAnimationCompleted && (
          <motion.div
            className="flex justify-center items-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-6">
              <motion.div
                className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "4rem sm:6rem" }}
                transition={{ duration: 3, delay: 0.5 }}
              />
              <motion.span
                className="text-xl sm:text-2xl text-pink-300"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                🌸
              </motion.span>
              <motion.div
                className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "4rem sm:6rem" }}
                transition={{ duration: 3, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Enhanced Envelope and Letter Container */}
        <div className="relative flex justify-center">
          <motion.div
            ref={envelopeRef}
            className="relative"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              width: isEnvelopeOpen && isLetterVisible ? "100%" : "min(420px, 95%)",
              maxWidth: "100%",
            }}
          >
            {/* Complete Envelope with Text Written on It */}
            {!isLetterVisible && (
            <motion.div
                className="relative cursor-pointer"
                style={{
                  width: "min(420px, 90%)",
                  height: "400px",
                }}
                onClick={handleOpenEnvelope}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={
                  isEnvelopeOpen
                    ? {
                        rotateY: [0, -5, 5, 0],
                        scale: [1, 1.02, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.8 }}
              >
                {/* Twinkling sparkles around envelope */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`envelope-sparkle-${i}`}
                    className="absolute text-sm z-20"
                  style={{
                      left: i < 4 ? (i % 2 === 0 ? "-25px" : "calc(100% + 25px)") : `${15 + i * 12}%`,
                      top: i < 3 ? "-25px" : i < 6 ? "calc(100% + 25px)" : "50%",
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
                      delay: i * 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                {/* Envelope Base (back) - Main envelope body */}
                <div
                  className="absolute z-5"
                  style={{
                    width: "420px",
                    height: "320px",
                    top: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: `
                      linear-gradient(135deg, 
                        #fef9fe 0%, 
                        #fdf8fd 25%,
                        #f8f4ff 50%, 
                        #f0ebff 75%,
                        #e8deff 100%
                      )
                    `,
                    borderRadius: "12px",
                    boxShadow: `
                      0 20px 40px rgba(216, 180, 248, 0.4),
                      0 8px 20px rgba(233, 213, 255, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9),
                      inset 0 -1px 0 rgba(216, 180, 248, 0.2)
                    `,
                    filter: "drop-shadow(0 6px 12px rgba(216, 180, 248, 0.4))",
                  }}
                />

                {/* Envelope Flap (triangular) */}
                <motion.div
                  className="absolute z-10"
                  style={{
                    width: "100%",
                    height: "0",
                    top: "40px",
                    left: "0",
                  }}
                  animate={
                    isEnvelopeOpen
                      ? {
                          rotateX: [0, -45, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  <div
                    style={{
                      width: "0",
                      height: "0",
                      borderLeft: "210px solid transparent",
                      borderRight: "210px solid transparent",
                      borderTop: `140px solid #fef9fe`,
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      filter: "drop-shadow(0 6px 12px rgba(216, 180, 248, 0.4))",
                    }}
                  />
                  
                  {/* Flap gradient overlay for depth */}
                  <div
                    style={{
                      width: "0",
                      height: "0",
                      borderLeft: "210px solid transparent",
                      borderRight: "210px solid transparent",
                      borderTop: `140px solid transparent`,
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, rgba(251, 207, 232, 0.4), rgba(233, 213, 255, 0.3))",
                      clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    }}
                  />
                </motion.div>

                

                {/* Text Written on Envelope */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center z-15"
                  style={{ 
                    top: "180px", 
                    left: "50%", 
                    transform: "translateX(-50%)",
                    width: "400px",
                    height: "140px"
                  }}
                >
                  {/* Call to action text - matches hero section aesthetic */}
                  <div className="text-center">
                    <div 
                      className="text-base font-medium leading-relaxed cursor-default"
                      style={{ 
                        color: "#B28AD8",
                        fontFamily: "'Cormorant', serif",
                        fontSize: "1.15rem",
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        textShadow: "0 1px 2px rgba(178, 138, 216, 0.1)"
                      }}
                    >
                      Click to open your personal invitation
                    </div>
                  </div>
                </div>
                  </motion.div>
                )}

            {/* Letter Content */}
            <AnimatePresence>
              {isLetterVisible && (
                <motion.div
                  className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="text-center relative z-10">
                    <motion.div
                      className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-gray-700 font-serif max-w-4xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      style={{ position: "relative", zIndex: 10 }}
                    >
                      {displayedText}
                      {currentWordIndex < words.length && (
                        <motion.span
                          className="text-pink-400"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        >
                          |
                    </motion.span>
                      )}
                      </motion.div>

                    {hasAnimationCompleted && (
                      <motion.div
                        className="mt-8 flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        <motion.button
                          className="px-6 py-3 bg-gradient-to-r from-pink-200 to-purple-200 text-purple-700 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={handleCloseLetter}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Begin Your Journey 🌸
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
