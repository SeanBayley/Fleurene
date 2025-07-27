"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WhisperState {
  id: string
  message: string
  x: number
  y: number
}

interface WhisperContextType {
  activeWhisper: WhisperState | null
  showWhisper: (message: string, x: number, y: number) => void
  hideWhisper: () => void
}

const WhisperContext = createContext<WhisperContextType | undefined>(undefined)

export function WhisperProvider({ children }: { children: ReactNode }) {
  const [activeWhisper, setActiveWhisper] = useState<WhisperState | null>(null)

  const showWhisper = (message: string, x: number, y: number) => {
    // Ensure we have a valid message
    const validMessage = message && message.trim() ? message.trim() : "You are magic ✨"

    const id = `whisper-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    setActiveWhisper({ id, message: validMessage, x, y })

    // Auto-hide after 6 seconds
    setTimeout(() => {
      setActiveWhisper((prev) => (prev?.id === id ? null : prev))
    }, 6000)
  }

  const hideWhisper = () => {
    setActiveWhisper(null)
  }

  return (
    <WhisperContext.Provider value={{ activeWhisper, showWhisper, hideWhisper }}>{children}</WhisperContext.Provider>
  )
}

export function useWhisper() {
  const context = useContext(WhisperContext)
  if (context === undefined) {
    throw new Error("useWhisper must be used within a WhisperProvider")
  }
  return context
}
