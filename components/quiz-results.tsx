"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { getArchetypeDetails } from "@/lib/quiz-utils"

interface QuizResultsProps {
  primaryArchetype: string
  archetypeBreakdown: Record<string, number>
  answers: string[]
  questionCount: number
  onRestart: () => void
}

// Helper function to wrap text in canvas
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const words = text.split(' ')
  let line = ''
  let lines = 0

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + ' '
      y += lineHeight
      lines++
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
  return (lines + 1) * lineHeight
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
    const name = prompt("Enter your name for the certificate:", "")
    if (!name) return

    // Get the sign-off message based on archetype
    let signOffMessage = ''
    switch (primaryArchetype) {
      case 'The Timeless Romantic':
        signOffMessage = '💌 "You\'ve been officially licensed to fall in love with strangers, sunsets, and your own reflection."'
        break
      case 'The Grounded Stylist':
        signOffMessage = '🪞 "Certified calm, collected, and better dressed than everyone in the group chat."'
        break
      case 'The Natural Creative':
        signOffMessage = '🌿 "You are now legally allowed to call your mess \'an aesthetic.\'"'
        break
      case 'The Intentional Dresser':
        signOffMessage = '📐 "Approved for silent power moves and outfits that could run a boardroom or ruin an ex."'
        break
      case 'The Sentimental Dreamer':
        signOffMessage = '🌙 "Officially qualified to cry over earrings and look stunning doing it."'
        break
      case 'The Playful Explorer':
        signOffMessage = '🎨 "Granted full permission to start trends, ignore rules, and wear glitter like sunscreen."'
        break
      case 'The Confident Maximalist':
        signOffMessage = '💋 "Certified to enter every room like it\'s a runway and an apology is never required."'
        break
      case 'The Free Spirit':
        signOffMessage = '🔥 "Unbothered. Unplanned. Unstoppable. This certificate cannot be revoked."'
        break
      case 'The Magnetic Minimalist':
        signOffMessage = '🖤 "Dangerously understated. This confirms you slay without even trying."'
        break
      case 'The Visionary Dresser':
        signOffMessage = '🧬 "Trend forecaster. Reality bender. Style prophet. Your certificate just caught up to you."'
        break
      default:
        signOffMessage = '✨ "You\'ve been officially certified as a unique and beautiful spirit."'
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 1600
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get archetype details
    const archetypeDetails = getArchetypeDetails(primaryArchetype)

    // Create a softer pastel gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#FFE6F0')    // Baby pink
    gradient.addColorStop(0.2, '#F0E6FF')  // Soft lavender
    gradient.addColorStop(0.4, '#E6F5FF')  // Sky blue
    gradient.addColorStop(0.6, '#E6FFFA')  // Mint blue
    gradient.addColorStop(0.8, '#FFE6FF')  // Light rose
    gradient.addColorStop(1, '#FFF0F5')    // Soft rose
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // "FLEURENE" with elegant styling
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(177, 156, 217, 0.4)'
    ctx.shadowBlur = 20
    ctx.font = 'italic bold 95px "Playfair Display"'
    ctx.fillStyle = 'rgba(177, 156, 217, 0.85)'
    ctx.fillText('FLEURENE', canvas.width/2, 180)
    
    // "JEWELRY" with refined styling
    ctx.font = 'normal 65px "Playfair Display"'
    ctx.fillStyle = 'rgba(200, 162, 200, 0.8)'
    ctx.fillText('JEWELRY', canvas.width/2, 260)
    
    // "AESTHETIC RISK" with gradient styling
    const riskGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    riskGradient.addColorStop(0, 'rgba(212, 165, 165, 1)')  // Solid rose
    riskGradient.addColorStop(0.5, 'rgba(200, 162, 200, 1)') // Solid mauve
    riskGradient.addColorStop(1, 'rgba(212, 165, 165, 1)')
    ctx.fillStyle = riskGradient
    ctx.font = 'bold 75px "Playfair Display"'
    ctx.fillText('AESTHETIC RISK', canvas.width/2, 350)
    
    // "CERTIFICATE" with ethereal styling
    ctx.font = 'italic bold 85px "Playfair Display"'
    ctx.fillStyle = 'rgba(177, 156, 217, 0.85)'
    ctx.fillText('CERTIFICATE', canvas.width/2, 440)

    // Add subtitle with more space
    ctx.shadowBlur = 0
    ctx.font = '40px "Playfair Display"'
    ctx.fillStyle = 'rgba(74, 74, 74, 0.7)'
    ctx.fillText('OFFICIAL AESTHETIC RISK IDENTITY', canvas.width/2, 580)

    // Add "Awarded to" with soft styling
    ctx.font = 'italic 55px "Playfair Display"'
    ctx.fillStyle = 'rgba(200, 162, 200, 0.8)'
    ctx.fillText('Awarded to:', canvas.width/2, 680)

    // Create gradient for the name
    const nameGradient = ctx.createLinearGradient(canvas.width/2 - 200, 780, canvas.width/2 + 200, 780)
    nameGradient.addColorStop(0, 'rgba(212, 165, 165, 0.9)')  // Soft rose
    nameGradient.addColorStop(0.3, 'rgba(200, 162, 200, 0.9)') // Lavender
    nameGradient.addColorStop(0.6, 'rgba(177, 156, 217, 0.9)') // Lilac
    nameGradient.addColorStop(1, 'rgba(180,156 ,250, 0.9)')  // Back to rose

    // Add name with gradient styling
    ctx.font = 'bold 110px "Playfair Display"'
    ctx.fillStyle = nameGradient
    ctx.fillText(name, canvas.width/2, 780)

    // Add archetype with dreamy styling
    ctx.font = 'bold 75px "Playfair Display"'
    ctx.fillStyle = 'rgba(177, 156, 217, 0.8)'
    ctx.fillText(primaryArchetype, canvas.width/2, 920)

    // Add risk level and description
    if (archetypeDetails) {
      ctx.font = 'bold 50px "Playfair Display"'
      ctx.fillStyle = 'rgba(74, 74, 74, 0.8)'
      const riskLevel = archetypeDetails.riskType.split('–')[0].trim()
      ctx.fillText(riskLevel, canvas.width/2, 1020)

      // Add the actual risk description
      ctx.font = 'italic 35px "Playfair Display"'
      ctx.fillStyle = 'rgba(200, 162, 200, 0.9)'
      const riskDescription = archetypeDetails.riskType.split('–')[1].trim()
      ctx.fillText(riskDescription, canvas.width/2, 1090)

      // Add "In One Word:" with formatting
      ctx.font = 'italic 40px "Playfair Display"'
      ctx.fillStyle = 'rgba(74, 74, 74, 0.7)'
      ctx.fillText('In One Word:', canvas.width/2, 1170)
      ctx.font = 'bold 40px "Playfair Display"'
      ctx.fillText(archetypeDetails.inAWord, canvas.width/2, 1220)
    }

    // Add decorative elements before sign-off
    ctx.fillStyle = 'rgba(177, 156, 217, 0.4)'
    ctx.font = '30px "Playfair Display"'
    ctx.fillText('✧ ⋆ ❅ ⋆ ✧', canvas.width/2, 1300)

    // Add sign-off message with darker lavender color
    ctx.font = 'italic 32px "Playfair Display"'
    ctx.fillStyle = 'rgba(177, 156, 217, 0.95)' // Darker lavender
    ctx.textAlign = 'center'

    // Add decorative elements
    ctx.fillStyle = 'rgba(177, 156, 217, 0.7)'
    ctx.font = '30px "Playfair Display"'
    ctx.fillText('✧ ⋆ ❅ ⋆ ✧', canvas.width/2, 1300)

    // Add sign-off message with text wrapping
    ctx.font = 'italic 32px "Playfair Display"'
    ctx.fillStyle = 'rgba(177, 156, 217, 0.95)' // Darker lavender
    const messageHeight = wrapText(ctx, signOffMessage, canvas.width/2, 1350, canvas.width - 200, 40)

    // Add decorative elements after
    ctx.fillStyle = 'rgba(177, 156, 217, 0.7)'
    ctx.fillText('✧ ⋆ ❅ ⋆ ✧', canvas.width/2, 1350 + messageHeight + 30)

    // Add date with elegant styling
    ctx.font = '35px "Playfair Display"'
    ctx.fillStyle = 'rgba(74, 74, 74, 0.7)'
    const date = new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    ctx.fillText(date, canvas.width/2, 1350 + messageHeight + 80)

    // Add certified text with romantic flourish
    ctx.font = 'bold 50px "Playfair Display"'
    ctx.fillStyle = 'rgba(200, 162, 200, 0.9)' // Soft mauve
    ctx.fillText('✧ FLEURENE CERTIFIED ✧', canvas.width/2, 1570)

    // Add delicate star border
    for (let i = 0; i < 30; i++) {
      const x = 80 + i * (canvas.width - 160)/29
      const stars = ['✧', '·']
      stars.forEach((star: string, j: number) => {
        ctx.font = j === 0 ? '18px "Playfair Display"' : '12px "Playfair Display"'
        ctx.fillStyle = j === 0 ? 'rgba(177, 156, 217, 0.5)' : 'rgba(200, 162, 200, 0.5)'
        ctx.fillText(star, x, 70)
        ctx.fillText(star, x, canvas.height - 70)
      })
    }

    // Create download link
    const link = document.createElement('a')
    link.download = `Fleurene-Certificate-${name.replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
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
          {archetypeBreakdown && Object.entries(archetypeBreakdown)
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
