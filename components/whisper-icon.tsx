"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWhisper } from "./whisper-context"
import { getRandomWhisper } from "@/lib/whisper-quotes"

interface WhisperIconProps {
  icon: string
  className?: string
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  size?: "small" | "medium" | "large"
}

export default function WhisperIcon({
  icon,
  className = "",
  position = "top-right",
  size = "small",
}: WhisperIconProps) {
  const { showWhisper, hideWhisper, activeWhisper } = useWhisper()
  const [randomValues, setRandomValues] = useState({ x: 0, y: 0, delay: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Set random values only on client side
    setRandomValues({
      x: (Math.random() - 0.5) * 30, // -15 to 15
      y: (Math.random() - 0.5) * 20, // -10 to 10
      delay: Math.random() * 15, // 0 to 15 seconds
    })
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (!isClient) return
    
    e.preventDefault()
    e.stopPropagation()

    if (activeWhisper) {
      hideWhisper()
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    let x = rect.left + rect.width / 2
    let y = rect.top + rect.height / 2

    // Add boundary checking to keep whisper messages on screen
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const messageWidth = 300 // Approximate width of whisper message
    const messageHeight = 100 // Approximate height of whisper message

    // Adjust x position if too close to right edge
    if (x + messageWidth / 2 > viewportWidth - 20) {
      x = viewportWidth - messageWidth / 2 - 20
    }
    // Adjust x position if too close to left edge
    if (x - messageWidth / 2 < 20) {
      x = messageWidth / 2 + 20
    }

    // Adjust y position if too close to bottom
    if (y + messageHeight / 2 > viewportHeight - 20) {
      y = viewportHeight - messageHeight / 2 - 20
    }
    // Adjust y position if too close to top
    if (y - messageHeight / 2 < 20) {
      y = messageHeight / 2 + 20
    }

    const message = getRandomWhisper()
    console.log("Whisper clicked:", { position, icon, message, x, y }) // Debug log

    // Add validation to ensure message exists
    if (message && message.trim()) {
      showWhisper(message, x, y)
    } else {
      showWhisper("You are magic ✨", x, y)
    }
  }

  // Better positioning with more spacing
  const positionClasses = {
    "top-left": "top-8 left-8",
    "top-right": "top-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "bottom-right": "bottom-8 right-8",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  }

  // Size classes
  const sizeClasses = {
    small: "w-8 h-8 text-lg",
    medium: "w-10 h-10 text-xl",
    large: "w-12 h-12 text-2xl",
  }

  if (!isClient) {
    return null
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        cursor-pointer select-none
        rounded-full pointer-events-auto
        fixed z-30
        ${sizeClasses[size]}
        ${positionClasses[position]}
        ${className}
      `}
      style={{
        background:
          "radial-gradient(circle, rgba(196, 156, 207, 0.08) 0%, rgba(255, 174, 192, 0.04) 70%, transparent 100%)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(196, 156, 207, 0.1)",
        boxShadow: "0 2px 8px rgba(196, 156, 207, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
      whileHover={{
        scale: 1.15,
        boxShadow: "0 4px 15px rgba(196, 156, 207, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        background:
          "radial-gradient(circle, rgba(196, 156, 207, 0.15) 0%, rgba(255, 174, 192, 0.08) 70%, transparent 100%)",
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 0.8,
        scale: 1,
        // Use client-side random values
        rotate: [0, 3, -3, 0],
        y: [0, randomValues.y * 0.8, -randomValues.y * 0.8, 0],
        x: [0, randomValues.x * 0.6, -randomValues.x * 0.6, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay: 0.2 },
        scale: { duration: 0.5, delay: 0.2, type: "spring", damping: 20 },
        rotate: {
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: randomValues.delay,
        },
        y: {
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: randomValues.delay + 3,
        },
        x: {
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: randomValues.delay + 6,
        },
      }}
    >
      {/* Subtle pulsing ring effect */}
      <motion.div
        className="absolute inset-0 rounded-full border border-purple-200/30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: randomValues.delay,
        }}
      />

      {/* Reduced sparkle particles */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-[0.6rem]"
          style={{
            left: `${16 + Math.cos(i * Math.PI) * 12}px`,
            top: `${16 + Math.sin(i * Math.PI) * 12}px`,
            color: "#C697D4",
          }}
          animate={{
            scale: [0, 0.6, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            delay: randomValues.delay + i * 3,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Main icon with gentle rotation */}
      <motion.span
        className="relative z-10 filter drop-shadow-sm"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotate: {
            duration: 25, // Very slow rotation
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: randomValues.delay,
          },
          scale: {
            duration: 8, // Gentle breathing
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: randomValues.delay + 2,
          },
        }}
      >
        {icon}
      </motion.span>
    </motion.button>
  )
}
