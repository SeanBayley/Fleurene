"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import GiftGuideModal from "./gift-guide-modal"

export default function GiftGuideTrigger() {
  const [showModal, setShowModal] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("section")
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
        const scrollPosition = window.scrollY + window.innerHeight

        // Show floating button when user scrolls past hero section
        setShowFloatingButton(scrollPosition > heroBottom + 200)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {showFloatingButton && !showModal && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Button
              onClick={() => setShowModal(true)}
              className="relative px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #FADCE6 0%, #EBDCFB 100%)",
                color: "#6B5B95",
                border: "2px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 8px 25px rgba(235, 220, 251, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }}
            >
              {/* Magical glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(230, 220, 255, 0.4), transparent 70%)",
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              <span className="relative z-10 flex items-center gap-2 font-medium">
                <motion.span
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
                  🧚‍♀️
                </motion.span>
                Not sure where to start?
              </span>

              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{
                  x: "100%",
                  transition: { duration: 0.8, ease: "easeInOut" },
                }}
              />

              {/* Floating sparkles */}
              <motion.div
                className="absolute -top-1 -right-1 text-xs"
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 180, 360],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>

              <motion.div
                className="absolute -bottom-1 -left-1 text-xs"
                animate={{
                  y: [0, 5, 0],
                  rotate: [360, 180, 0],
                  scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                🌸
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gift Guide Modal */}
      <GiftGuideModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
