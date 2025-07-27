"use client"

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Flower {
  id: number
  x: number
  y: number
  emoji: string
  angle: number
  distance: number
}

interface FlowerExplosionContextType {
  triggerExplosion: (x: number, y: number) => void
}

const FlowerExplosionContext = createContext<FlowerExplosionContextType | undefined>(undefined)

export function useFlowerExplosion() {
  const context = useContext(FlowerExplosionContext)
  if (!context) {
    throw new Error("useFlowerExplosion must be used within a FlowerExplosionProvider")
  }
  return context
}

export function FlowerExplosionProvider({ children }: { children: React.ReactNode }) {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  const triggerExplosion = useCallback((x: number, y: number) => {
    // Prevent too many simultaneous explosions
    if (flowers.length > 30) {
      return
    }

    const flowerEmojis = ["🌸", "✨", "🌺", "🌷", "💐", "🌹", "💫", "🦋"]
    const newFlowers: Flower[] = []

    // Reduced from 60 to 15 flowers to save memory
    for (let i = 0; i < 15; i++) {
      const angle = (i * 24) * (Math.PI / 180) // Deterministic angles
      const distance = 80 + (i * 10) // Deterministic distances

      newFlowers.push({
        id: Date.now() + i,
        x,
        y,
        emoji: flowerEmojis[i % flowerEmojis.length],
        angle,
        distance,
      })
    }

    setFlowers((prev) => [...prev, ...newFlowers])

    // Clear flowers after animation with proper cleanup
    const timeout = setTimeout(() => {
      setFlowers((prev) => prev.filter((flower) => !newFlowers.includes(flower)))
    }, 2800) // Extended to match animation duration

    timeoutRefs.current.push(timeout)
  }, [flowers.length])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <FlowerExplosionContext.Provider value={{ triggerExplosion }}>
      {children}

      {/* Render flowers in a portal-like way */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence mode="popLayout">
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              className="absolute text-2xl" // Restored larger size
              style={{
                left: flower.x - 10, // Reduced from 12
                top: flower.y - 10, // Reduced from 12
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              animate={{
                x: Math.cos(flower.angle) * flower.distance,
                y: Math.sin(flower.angle) * flower.distance,
                opacity: 0,
                scale: 0.3, // Reduced from 0.2
                rotate: flower.angle * 57.3, // Convert to degrees deterministically
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
              duration: 2.5, // Slowed down for better visual effect
                ease: "easeOut",
              }}
            >
              {flower.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </FlowerExplosionContext.Provider>
  )
}
