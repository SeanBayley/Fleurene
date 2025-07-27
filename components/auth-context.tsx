"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  profile: any | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (firstName: string, lastName: string) => Promise<{ error: any }>
  saveQuizResult: (
    primaryArchetype: string,
    archetypeBreakdown: Record<string, number>,
    answers: string[],
    questionCount: number,
  ) => Promise<{ error: any }>
  getUserQuizResults: () => Promise<{ data: any[]; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error)
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        // Set profile to null explicitly on error
        setProfile(null)
      } else if (error && error.code === "PGRST116") {
        console.log("No profile found for user (PGRST116):", userId)
        setProfile(null)
      } else if (data) {
        console.log("Profile loaded successfully:", data)
        setProfile(data)
      } else {
        console.log("No profile data returned for user:", userId)
        setProfile(null)
      }
    } catch (error) {
      console.error("Exception while fetching profile:", error)
      setProfile(null)
    } finally {
      console.log('Profile fetch completed, setting loading to false')
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (firstName: string, lastName: string) => {
    if (!user) return { error: "No user logged in" }

    const { error } = await supabase
      .from("user_profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (!error) {
      setProfile((prev: any) => (prev ? { ...prev, first_name: firstName, last_name: lastName } : null))
    }

    return { error }
  }

  const saveQuizResult = async (
    primaryArchetype: string,
    archetypeBreakdown: Record<string, number>,
    answers: string[],
    questionCount: number,
  ) => {
    if (!user) return { error: "No user logged in" }

    const { error } = await supabase.from("quiz_results").insert({
      user_id: user.id,
      primary_archetype: primaryArchetype,
      archetype_breakdown: archetypeBreakdown,
      question_count: questionCount,
      answers: answers,
    })

    return { error }
  }

  const getUserQuizResults = async () => {
    if (!user) return { data: [], error: "No user logged in" }

    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    return { data: data || [], error }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    saveQuizResult,
    getUserQuizResults,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
