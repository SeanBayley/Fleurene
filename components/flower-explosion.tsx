"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FlowerExplosionProps {
  children: React.ReactNode
  onExplode?: () => void
}

interface Flower {
  id: number
  x: number
  y: number
  emoji: string
  angle: number
  distance: number
}

export default function FlowerExplosion({ children, onExplode }: FlowerExplosionProps) {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  const triggerExplosion = (clientX: number, clientY: number) => {
    console.log("🌸 EXPLOSION TRIGGERED!", { clientX, clientY })

    const flowerEmojis = ["🌸", "✨", "🌺", "🌷", "💐", "🌹", "💫", "🦋", "🧚‍♀️", "🌙", "⭐", "💖", "💕"]
    const newFlowers: Flower[] = []

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * 360 * (Math.PI / 180)
      const distance = Math.random() * 250 + 80

      newFlowers.push({
        id: Date.now() + i + Math.random(),
        x: clientX,
        y: clientY,
        emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
        angle,
        distance,
      })
    }

    setFlowers(newFlowers)
    console.log("🌸 Created flowers:", newFlowers.length)

    // Call the onExplode callback if provided
    if (onExplode) {
      onExplode()
    }

    // Clear flowers after animation
    setTimeout(() => {
      setFlowers([])
      console.log("🌸 Cleared flowers")
    }, 2000)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("🌸 CLICK DETECTED on wrapper!")
    e.preventDefault()
    e.stopPropagation()

    // Get click position
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    console.log("🌸 Click position:", { centerX, centerY })

    // Trigger explosion
    triggerExplosion(centerX, centerY)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("🌸 MOUSE DOWN detected!")
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative inline-block cursor-pointer"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        style={{ zIndex: 1 }}
      >
        {children}
      </div>

      {/* Render flowers in a portal-like way */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              className="absolute text-xl"
              style={{
                left: flower.x - 12,
                top: flower.y - 12,
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
                scale: 0.2,
                rotate: Math.random() * 720 - 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
            >
              {flower.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
