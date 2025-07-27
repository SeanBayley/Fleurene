"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const isMouseActiveRef = useRef(false)
  const lastUpdateTime = useRef(0)

  // Set client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check for reduced motion preference
  useEffect(() => {
    if (!isClient) return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isClient])

  // Set initial visibility if mouse is supported
  useEffect(() => {
    if (!isClient) return
    
    // Show cursor immediately if we're on a desktop device with a mouse
    const hasMouseSupport = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (hasMouseSupport) {
      setIsVisible(true)
      isMouseActiveRef.current = true
    }
  }, [isClient])

  // Throttled mouse move handler using requestAnimationFrame with throttling
  const updateCursorPosition = useCallback((e: MouseEvent) => {
    const now = Date.now()
    // Throttle to 60fps max to reduce CPU usage
    if (now - lastUpdateTime.current < 16) {
      return
    }
    lastUpdateTime.current = now

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const x = e.clientX - 12
      const y = e.clientY - 12
      setPosition({ x, y })
    })
  }, [])

  useEffect(() => {
    if (!isClient) return

    let hideTimeout: NodeJS.Timeout

    const handleMouseMove = (e: MouseEvent) => {
      // Always show cursor on movement
      if (!isVisible) {
        setIsVisible(true)
      }
      
      isMouseActiveRef.current = true
      updateCursorPosition(e)
      
      // Clear any existing hide timeout
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    }

    const handleMouseLeave = () => {
      // Only hide when mouse leaves the document completely
      isMouseActiveRef.current = false
      hideTimeout = setTimeout(() => {
        setIsVisible(false)
      }, 500) // Increased delay to prevent flickering
    }

    const handleMouseEnter = () => {
      // Clear timeout and show immediately when mouse enters
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      isMouseActiveRef.current = true
      setIsVisible(true)
    }

    // Show cursor on any interaction
    const handleInteraction = () => {
      if (!isVisible) {
        setIsVisible(true)
      }
      isMouseActiveRef.current = true
    }

    // Add event listeners with passive option for better performance
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true })
    document.addEventListener("mousedown", handleInteraction, { passive: true })
    document.addEventListener("click", handleInteraction, { passive: true })

    return () => {
      // Clean up animation frame and timeout
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
      
      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mousedown", handleInteraction)
      document.removeEventListener("click", handleInteraction)
    }
  }, [updateCursorPosition, isVisible, isClient])

  // Don't render on server side
  if (!isClient) {
    return null
  }

  // Restored beautiful animations for the cursor
  const animationProps = prefersReducedMotion 
    ? {
        // Minimal animation for reduced motion
        animate: { 
          opacity: isVisible ? 1 : 0,
          x: position.x,
          y: position.y
        },
        transition: { 
          opacity: { duration: 0.15, ease: "easeOut" },
          x: { duration: 0, ease: "linear" },
          y: { duration: 0, ease: "linear" }
        }
      }
    : {
        // Full animation for users who are okay with motion
        animate: {
          opacity: isVisible ? 1 : 0,
          x: position.x,
          y: position.y,
          rotate: isVisible ? [0, 5, -5, 0] : 0,
          scale: isVisible ? [1, 1.05, 1] : 1,
        },
        transition: {
          opacity: { duration: 0.15, ease: "easeOut" },
          x: { duration: 0, ease: "linear" },
          y: { duration: 0, ease: "linear" },
          rotate: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatDelay: 0.5,
          },
          scale: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatDelay: 0.5,
          }
        }
      }

  return (
    <motion.div
      ref={cursorRef}
      className="custom-cursor fixed pointer-events-none z-[10000] text-2xl select-none"
      style={{
        willChange: 'transform, opacity',
      }}
      {...animationProps}
      initial={{ opacity: 0, x: 0, y: 0 }}
    >
      🌸
    </motion.div>
  )
}
