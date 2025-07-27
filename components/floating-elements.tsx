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

              // Reduced from 8 to 4 petals with pseudo-random positioning
        for (let i = 0; i < 4; i++) {
        newElements.push({
          id: Date.now() + i,
            emoji: petals[i % petals.length],
            x: 10 + (Math.sin(i * 2.3) * 30 + 30), // Pseudo-random but deterministic
          y: -10,
            duration: 8 + (Math.cos(i * 1.7) * 4 + 4), // Pseudo-random duration
          delay: i * 0.5,
        })
      }

              // Reduced from 3 to 2 butterflies with pseudo-random positioning
        for (let i = 0; i < 2; i++) {
        newElements.push({
          id: Date.now() + 100 + i,
          emoji: butterflies[0],
          x: -10,
            y: 20 + (Math.sin(i * 3.1) * 50 + 50), // Pseudo-random positioning
            duration: 15 + (Math.cos(i * 2.4) * 5 + 5), // Pseudo-random duration
          delay: i * 3,
        })
      }

      // Reduced from 4 to 2 hearts
      for (let i = 0; i < 2; i++) {
        newElements.push({
          id: Date.now() + 200 + i,
          emoji: hearts[i % hearts.length],
          x: 10 + (i * 50), // Deterministic positioning
          y: 20 + (i * 30), // Deterministic positioning
          duration: 4 + (i * 1), // Deterministic duration
          delay: i * 1.5,
        })
      }

      setElements(newElements)
    }

    createElements()
    // Increased interval from 10 seconds to 30 seconds to reduce memory usage
    const interval = setInterval(createElements, 30000)

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
          className="absolute text-3xl opacity-70"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            }}
            animate={{
            y: ["0%", "110vh"],
            x: [
              `${element.x}%`,
              `${element.x + (15 * Math.sin(element.id * 0.1))}%`, // Pseudo-random movement
              `${element.x - (10 * Math.cos(element.id * 0.15))}%`,
              `${element.x + (12 * Math.sin(element.id * 0.2))}%`,
            ],
            rotate: [0, 360 * Math.sin(element.id * 0.05), 720], // Pseudo-random rotation
            opacity: [0, 0.7, 0.5, 0],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              ease: "easeInOut",
            // Removed repeat to let elements finish and clean up
            }}
          >
            {element.emoji}
          </motion.div>
        ))}
    </div>
  )
}
