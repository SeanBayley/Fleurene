"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"

interface User {
  email: string
  name: string
  id: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, name: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fleurene_user")
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const signIn = (email: string, name: string) => {
    const newUser = { email, name, id: Date.now().toString() }
    setUser(newUser)
    localStorage.setItem("fleurene_user", JSON.stringify(newUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("fleurene_user")
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useSimpleAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useSimpleAuth must be used within SimpleAuthProvider")
  return context
}
