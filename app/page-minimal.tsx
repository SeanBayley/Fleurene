"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"

export default function HomeMinimal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-25 via-purple-25 to-blue-25">
      <Navigation />
      <main className="relative z-10 pt-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">FJ - Minimal Test Page</h1>
          <p className="text-center text-gray-600">
            This is a minimal version to test if the main page components are causing issues.
          </p>
          <div className="mt-8 text-center">
            <a href="/admin" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
              Go to Admin Dashboard
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 