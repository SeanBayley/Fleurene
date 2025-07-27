"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface FloatingElement {
  id: number
  emoji: string
  x: number
  y: number
  duration: number
  delay: number
}

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const createElements = () => {
      const petals = ["🌸", "🌺", "🌼", "🌻"]
      const butterflies = ["🦋"]
      const hearts = ["💜", "💖", "💕"]

      const newElements: FloatingElement[] = []

      // Only 2 petals with deterministic positioning
      for (let i = 0; i < 2; i++) {
        newElements.push({
          id: i,
          emoji: petals[i % petals.length],
          x: 15 + (i * 30), // Deterministic positioning
          y: -10,
          duration: 12 + (i * 2), // Deterministic duration
          delay: i * 2,
        })
      }

      // Only 1 butterfly with deterministic positioning
      newElements.push({
        id: 10,
        emoji: butterflies[0],
        x: -10,
        y: 30,
        duration: 20,
        delay: 1,
      })

      // Only 1 heart with deterministic positioning
      newElements.push({
        id: 20,
        emoji: hearts[0],
        x: 60,
        y: 20,
        duration: 8,
        delay: 0.5,
      })

      setElements(newElements)
    }

    createElements()
    // Much longer interval - only recreate every 2 minutes
    const interval = setInterval(createElements, 120000)

    return () => clearInterval(interval)
  }, [isClient])

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute text-2xl opacity-60"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: ["0%", "110vh"],
            x: [
              `${element.x}%`,
              `${element.x + 5}%`,
              `${element.x - 3}%`,
              `${element.x + 2}%`,
            ],
            rotate: [0, 180, 360],
            opacity: [0, 0.6, 0.4, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 5, // 5 second pause between loops
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  )
}
