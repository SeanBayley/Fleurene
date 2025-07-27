"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function ConnectionTest() {
  const [connectionInfo, setConnectionInfo] = useState<{
    url: string
    connected: boolean
    error?: string
  } | null>(null)

  useEffect(() => {
    // Get URL from environment variable
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Environment variable not set'

    // Test connection with a simple query that doesn't require tables
    const testConnection = async () => {
      try {
        // Simple connection test - this will work even without tables
        const { data, error } = await supabase.from("_").select("*").limit(1)
        
        // If we get a "relation does not exist" error, that means connection is working
        // but tables aren't created yet
        if (error && error.code === "42P01") {
          setConnectionInfo({
            url,
            connected: true,
            error: "✅ Connected! Database tables need to be created.",
          })
        } else if (error) {
          setConnectionInfo({
            url,
            connected: false,
            error: error.message,
          })
        } else {
          setConnectionInfo({
            url,
            connected: true,
          })
        }
      } catch (err) {
        setConnectionInfo({
          url,
          connected: false,
          error: "Connection failed",
        })
      }
    }

    testConnection()
  }, [])

  if (!connectionInfo) return <div>Testing connection...</div>

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">Supabase Connection</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>URL:</strong> {connectionInfo.url}
        </div>
        <div>
          <strong>Status:</strong>
          <span className={connectionInfo.connected ? "text-green-600" : "text-red-600"}>
            {connectionInfo.connected ? " ✅ Connected" : " ❌ Not Connected"}
          </span>
        </div>
        {connectionInfo.error && (
          <div className={connectionInfo.connected ? "text-green-600" : "text-red-600"}>
            <strong>Info:</strong> {connectionInfo.error}
          </div>
        )}
      </div>
    </div>
  )
}
