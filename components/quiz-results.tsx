"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

interface QuizResultsProps {
  primaryArchetype: string
  archetypeBreakdown: Record<string, number>
  answers: string[]
  questionCount: number
  onRestart: () => void
}

export default function QuizResults({
  primaryArchetype,
  archetypeBreakdown,
  answers,
  questionCount,
  onRestart,
}: QuizResultsProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const { user, saveQuizResult } = useAuth()

  // Auto-save quiz results when user is logged in
  useEffect(() => {
    if (user && primaryArchetype) {
      handleSaveResults()
    }
  }, [user, primaryArchetype])

  const handleSaveResults = async () => {
    if (!user) {
      setSaveMessage("Sign in to save your results!")
      return
    }

    setIsSaving(true)
    try {
      const { error } = await saveQuizResult(primaryArchetype, archetypeBreakdown, answers, questionCount)

      if (error) {
        setSaveMessage("Error saving results. Please try again.")
        console.error("Save error:", error)
      } else {
        setSaveMessage("Results saved successfully! ✨")
      }
    } catch (error) {
      setSaveMessage("Error saving results. Please try again.")
      console.error("Save error:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const downloadCertificate = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, "#fdf2f8")
    gradient.addColorStop(1, "#f3e8ff")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Title
    ctx.fillStyle = "#7c3aed"
    ctx.font = "bold 36px serif"
    ctx.textAlign = "center"
    ctx.fillText("Fleurene Jewelry Personality", 400, 100)

    // Archetype
    ctx.fillStyle = "#ec4899"
    ctx.font = "bold 48px serif"
    ctx.fillText(primaryArchetype, 400, 200)

    // Description
    ctx.fillStyle = "#374151"
    ctx.font = "24px sans-serif"
    ctx.fillText("Your magical jewelry personality has been revealed!", 400, 300)

    // Date
    ctx.font = "18px sans-serif"
    ctx.fillText(`Discovered on ${new Date().toLocaleDateString()}`, 400, 450)

    // Signature
    ctx.font = "italic 20px serif"
    ctx.fillText("~ Fleurene Collection ~", 400, 520)

    // Download
    const link = document.createElement("a")
    link.download = `fleurene-${primaryArchetype.toLowerCase()}-certificate.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const getArchetypeDescription = (archetype: string) => {
    const descriptions: Record<string, string> = {
      "Free Spirit": "You dance to your own rhythm and embrace life's beautiful chaos with grace and wonder.",
      "Romantic Dreamer": "You see magic in everyday moments and believe in the power of love and beauty.",
      "Mystical Wanderer": "You're drawn to the mysterious and find wisdom in ancient symbols and hidden meanings.",
      "Nature Lover": "You find peace in natural beauty and feel most alive when connected to the earth.",
      "Creative Soul": "You express your inner world through art and see beauty as a form of self-expression.",
    }
    return descriptions[archetype] || "You have a unique and beautiful spirit that shines through everything you do."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-xl border border-pink-200"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Jewelry Personality
          </h2>
          <Sparkles className="w-8 h-8 text-pink-600" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          {primaryArchetype}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600 leading-relaxed"
        >
          {getArchetypeDescription(primaryArchetype)}
        </motion.p>
      </div>

      {/* Archetype Breakdown */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Your Personality Blend
        </h4>
        <div className="space-y-3">
          {Object.entries(archetypeBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([archetype, percentage]) => (
              <div key={archetype} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-32">{archetype}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-12">{percentage}%</span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Save Status */}
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-green-700">Saving your results...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-green-700">
                  {saveMessage || "Your results have been saved to your profile! ✨"}
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700">Sign in to save your results and track your jewelry journey!</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          onClick={downloadCertificate}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Certificate
        </Button>

        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Take Quiz Again
        </Button>
      </motion.div>
    </motion.div>
  )
}
