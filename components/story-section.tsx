"use client"

import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import FlowerButton from "@/components/flower-button"
import WhisperIcon from "@/components/whisper-icon"
import { useRef } from "react"

interface StorySectionProps {
  onStartStory: () => void
}

export default function StorySection({ onStartStory }: StorySectionProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showTwinkle, setShowTwinkle] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px" })

  const fullText = "You've entered the world of Fleurene — and I'm so happy you're here."

  useEffect(() => {
    if (isInView && !isTyping && displayedText === "") {
      setIsTyping(true)

      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
          // Start the twinkle effect after typing completes
          setTimeout(() => setShowTwinkle(true), 1000)
        }
      }, 80)

      return () => clearInterval(typeInterval)
    }
  }, [isInView, fullText])

  const handleStartStory = () => {
    console.log("🌸 Start Story button clicked!") // Debug log
    onStartStory()
  }

  return (
    <section className="py-20 bg-gradient-to-br from-lavender-50/50 via-rose-50/50 to-sky-50/50 relative overflow-hidden">
      {/* Background whisper icons - positioned far from any text */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Only in extreme corners - away from all text */}
        <WhisperIcon icon="🌙" className="absolute top-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="💫" className="absolute top-[1%] right-[1%] z-0" size="small" />
        <WhisperIcon icon="🌟" className="absolute bottom-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="🌈" className="absolute bottom-[1%] right-[1%] z-0" size="small" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center group relative z-10" ref={ref}>
        <motion.h2
          className="text-2xl md:text-4xl font-serif font-light text-slate-700 mb-8 leading-tight hover:translate-x-2 transition-transform duration-300 cursor-default min-h-[3rem] md:min-h-[4rem] relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {displayedText}
          {isTyping && (
            <motion.span
              className="inline-block w-0.5 h-6 md:h-8 bg-slate-700 ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
        </motion.h2>

        <motion.div
          className="space-y-8 mb-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: !isTyping && displayedText.length > 0 ? 1 : 0,
            y: !isTyping && displayedText.length > 0 ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-base md:text-lg text-slate-500 leading-relaxed font-light hover:translate-x-2 transition-transform duration-300 cursor-default">
            Welcome to a space where your personality gets to sparkle. This isn't just a shop. It's a little mood
            sanctuary stitched in shimmer. Everything here is meant to reflect something in you — a thought, a vibe, a
            daydream.
          </p>

          {/* Enhanced emotional punchline with matching gradient */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: showTwinkle ? 1 : 0,
              scale: showTwinkle ? 1 : 0.95,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Soft glow background */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(ellipse, rgba(194, 151, 212, 0.15), transparent 70%)",
                filter: "blur(20px)",
              }}
              animate={{
                opacity: showTwinkle ? [0, 0.8, 0.4] : 0,
                scale: showTwinkle ? [0.8, 1.2, 1] : 0.8,
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.p
              className="text-xl md:text-2xl font-serif italic text-center leading-relaxed hover:translate-x-2 transition-transform duration-300 cursor-default relative z-10 px-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 500,
                background: "linear-gradient(135deg, #C697D4 0%, #FFAEC0 50%, #ACD8D5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "300% 300%",
                filter: "drop-shadow(0 0 8px rgba(194, 151, 212, 0.3))",
                textShadow: "0 0 20px rgba(194, 151, 212, 0.2)",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                scale: showTwinkle ? [1, 1.02, 1] : 1,
              }}
              transition={{
                backgroundPosition: {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            >
              It's not just jewellery. It's your personality, in sparkles.
            </motion.p>

            {/* Repositioned sparkles - moved MUCH lower and completely outside text area */}
            {showTwinkle && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`twinkle-${i}`}
                    className="absolute text-sm z-0"
                    style={{
                      left: `${5 + Math.random() * 10}%`, // Left side sparkles
                      top: `${120 + Math.random() * 20}%`, // WAY below the text (120%+)
                      color: "#C697D4",
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.2, 0.5],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 1.2,
                      ease: "easeInOut",
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`twinkle-right-${i}`}
                    className="absolute text-sm z-0"
                    style={{
                      left: `${85 + Math.random() * 10}%`, // Right side sparkles
                      top: `${120 + Math.random() * 20}%`, // WAY below the text (120%+)
                      color: "#C697D4",
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.2, 0.5],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: (i + 3) * 1.2,
                      ease: "easeInOut",
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Enhanced "Start the Story" button with magical hover effects */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: !isTyping && displayedText.length > 0 ? 1 : 0,
            y: !isTyping && displayedText.length > 0 ? 0 : 20,
          }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              className="relative"
              animate={{
                scale: isHovering ? 1.05 : 1,
                y: isHovering ? -2 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <FlowerButton
                onClick={handleStartStory}
                size="sm"
                className="relative px-5 py-1.5 rounded-full text-sm shadow-lg transition-all duration-500 border-none overflow-hidden group"
                style={{
                  background: isHovering
                    ? "linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 50%, #E9D5FF 100%)"
                    : "linear-gradient(135deg, #E8D5F2 0%, #F0E6FF 50%, #DDD6FE 100%)",
                  color: isHovering ? "#6B46C1" : "#7C3AED",
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  boxShadow: isHovering
                    ? "0 12px 35px rgba(220, 214, 254, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 0 20px rgba(196, 156, 207, 0.4)"
                    : "0 8px 25px rgba(220, 214, 254, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
                  transform: isHovering ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {/* Enhanced shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: isHovering ? ["0%", "100%"] : "-100%",
                  }}
                  transition={{
                    duration: isHovering ? 0.8 : 0,
                    ease: "easeInOut",
                    repeat: isHovering ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 1.5,
                  }}
                />

                {/* Magical border glow */}
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(45deg, #C697D4, #FFAEC0, #ACD8D5, #C697D4)",
                      backgroundSize: "300% 300%",
                      padding: "1px",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #F3E8FF 0%, #FAF5FF 50%, #E9D5FF 100%)",
                      }}
                    />
                  </motion.div>
                )}

                <span className="relative z-10 flex items-center gap-2">
                  Start the Story
                  {/* Enhanced floating flower emoji */}
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: isHovering ? [1.1, 1.3, 1.1] : [1, 1.1, 1],
                    }}
                    transition={{
                      duration: isHovering ? 2 : 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.span
                      className="text-base"
                      style={{ color: "#C697D4" }}
                      animate={{
                        filter: isHovering
                          ? [
                              "brightness(1.2) drop-shadow(0 0 4px rgba(194, 151, 212, 0.8))",
                              "brightness(1.8) drop-shadow(0 0 12px rgba(194, 151, 212, 1))",
                              "brightness(1.2) drop-shadow(0 0 4px rgba(194, 151, 212, 0.8))",
                            ]
                          : [
                              "brightness(1) drop-shadow(0 0 2px rgba(194, 151, 212, 0.5))",
                              "brightness(1.5) drop-shadow(0 0 8px rgba(194, 151, 212, 0.8))",
                              "brightness(1) drop-shadow(0 0 2px rgba(194, 151, 212, 0.5))",
                            ],
                      }}
                      transition={{
                        duration: isHovering ? 2 : 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      🌸
                    </motion.span>
                  </motion.div>
                </span>
              </FlowerButton>
            </motion.div>

            {/* Enhanced floating petals with more variety */}
            {isHovering && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {/* Magical aura */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(232, 213, 242, 0.3) 0%, rgba(240, 230, 255, 0.1) 50%, transparent 70%)",
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Floating petals with enhanced variety */}
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={`petal-${i}`}
                    className="absolute"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      color: ["#FFAEC0", "#C697D4", "#ACD8D5", "#F8BBD9", "#E8D5F2"][i % 5],
                      fontSize: `${0.6 + Math.random() * 0.6}rem`,
                      zIndex: 20,
                    }}
                    initial={{ opacity: 0, y: 0, scale: 0, rotate: 0 }}
                    animate={{
                      y: [-10, -60 - Math.random() * 30],
                      x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 80],
                      rotate: [0, Math.random() * 720],
                      scale: [0, 1.2, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: Math.random() * 1,
                      ease: "easeOut",
                      delay: i * 0.1,
                    }}
                  >
                    {["🌸", "🌷", "🌺", "💮", "🪷", "✨", "💫", "🦋"][i % 8]}
                  </motion.div>
                ))}

                {/* Sparkle trail around button */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`sparkle-${i}`}
                    className="absolute text-xs"
                    style={{
                      left: `${50 + 40 * Math.cos((i / 8) * 2 * Math.PI)}%`,
                      top: `${50 + 40 * Math.sin((i / 8) * 2 * Math.PI)}%`,
                      color: "#FFD700",
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
