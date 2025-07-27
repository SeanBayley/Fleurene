"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Flower {
  id: number
  x: number
  y: number
  emoji: string
  angle: number
  distance: number
}

export default function GlobalFlowerExplosion() {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [isClient, setIsClient] = useState(false)
  const lastExplosionTime = useRef(0)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleClick = (event: MouseEvent) => {
      // Throttle explosions to prevent memory overload
      const now = Date.now()
      if (now - lastExplosionTime.current < 500) { // 500ms throttle
        return
      }
      lastExplosionTime.current = now

      // Don't create explosion if clicking on buttons or interactive elements
      const target = event.target as HTMLElement
      if (target.closest("button") || target.closest("a") || target.closest("input")) {
        return
      }

      // Prevent too many flowers at once
      if (flowers.length > 20) {
        return
      }

      const flowerEmojis = ["🌸", "🌺", "🌷", "🌻", "🌼", "💐", "🌹", "✨", "💫"]
      const newFlowers: Flower[] = []

      // Reduced from 15 to 8 flowers
      const flowerCount = 8

      for (let i = 0; i < flowerCount; i++) {
        const angle = (i * 45) * (Math.PI / 180) // Deterministic angles (45 degrees apart)
        const distance = 60 + (i * 8) // Deterministic distances

        newFlowers.push({
          id: Date.now() + i,
          x: event.clientX,
          y: event.clientY,
          emoji: flowerEmojis[i % flowerEmojis.length],
          angle,
          distance,
        })
      }

      setFlowers((prev) => [...prev, ...newFlowers])

      // Clear flowers after animation with proper cleanup
      const timeout = setTimeout(() => {
        setFlowers((prev) => prev.filter((flower) => !newFlowers.includes(flower)))
      }, 2200) // Extended to match animation duration

      timeoutRefs.current.push(timeout)
    }

    document.addEventListener("click", handleClick, { passive: true })
    return () => {
      document.removeEventListener("click", handleClick)
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [isClient, flowers.length])

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence mode="popLayout">
        {flowers.map((flower) => (
          <motion.div
            key={flower.id}
            className="absolute text-xl" // Restored larger size
            style={{
              left: flower.x - 8, // Reduced from 10
              top: flower.y - 8, // Reduced from 10
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
              scale: 0.3,
              rotate: flower.angle * 57.3, // Convert to degrees deterministically
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 2, // Slowed down for better visual effect
              ease: "easeOut",
            }}
          >
            {flower.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
