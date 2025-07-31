"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { quizQuestions } from "@/lib/quiz-data"
import { calculateResults } from "@/lib/quiz-utils"
import QuizResults from "@/components/quiz-results"

interface QuizModalProps {
  questionCount: number
  onClose: () => void
}

// Unique gradient colors for each archetype
const archetypeGradients: Record<string, string> = {
  "The Timeless Romantic": "from-rose-200 via-pink-100 to-rose-200",
  "The Grounded Stylist": "from-sage-200 via-green-100 to-sage-200",
  "The Natural Creative": "from-amber-200 via-yellow-100 to-amber-200",
  "The Intentional Dresser": "from-slate-200 via-gray-100 to-slate-200",
  "The Sentimental Dreamer": "from-wisteria-200 via-lilac-100 to-wisteria-200",
  "The Playful Explorer": "from-orange-200 via-coral-100 to-orange-200",
  "The Confident Maximalist": "from-fuchsia-200 via-pink-100 to-fuchsia-200",
  "The Free Spirit": "from-red-200 via-orange-100 to-red-200",
  "The Magnetic Minimalist": "from-gray-200 via-slate-100 to-gray-200",
  "The Visionary Dresser": "from-indigo-200 via-blue-100 to-indigo-200",
}

export default function QuizModal({ questionCount, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)

  // IMPORTANT: Slice the questions at the start and keep them consistent
  const selectedQuestions = quizQuestions.slice(0, questionCount)
  const progress = ((currentQuestion + 1) / questionCount) * 100

  // Debug logging
  useEffect(() => {
    console.log("=== QUIZ STATE UPDATED ===")
    console.log("Question count requested:", questionCount)
    console.log("Current question index:", currentQuestion)
    console.log("Current answers:", answers)
    console.log("Answers length:", answers.length)
  }, [questionCount, currentQuestion, answers])

  const handleAnswer = (archetype: string) => {
    // CRITICAL: Prevent adding more answers than questions
    if (answers.length >= questionCount) {
      console.error("Attempted to add answer beyond question count!")
      return
    }

    // Prevent double-clicks or race conditions
    if (isProcessingAnswer) {
      console.log("Already processing an answer, ignoring...")
      return
    }

    setIsProcessingAnswer(true)
    console.log(`\n=== HANDLING ANSWER ===`)
    console.log(`Question ${currentQuestion + 1}/${questionCount}: Selected ${archetype}`)

    // Add the new answer
    const newAnswers = [...answers, archetype]
    console.log("New answers array:", newAnswers)
    console.log("New answers length:", newAnswers.length)
    setAnswers(newAnswers)

    // Check if we've reached the end
    if (newAnswers.length >= questionCount) {
      console.log("QUIZ COMPLETE!")
      console.log("Final answers:", newAnswers)
      console.log("Final answer count:", newAnswers.length)
      console.log("Expected question count:", questionCount)

      setTimeout(() => {
        setShowResults(true)
        setIsProcessingAnswer(false)
      }, 300)
    } else {
      console.log("Moving to next question...")
      setTimeout(() => {
        setCurrentQuestion((prev) => Math.min(prev + 1, questionCount - 1))
        setIsProcessingAnswer(false)
      }, 300)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      // Remove the last answer
      setAnswers((prev) => prev.slice(0, -1))
    }
  }

  const handleClose = () => {
    console.log("Close button clicked!")
    onClose()
  }

  if (showResults) {
    // Calculate results from answers
    const results = calculateResults(answers.slice(0, questionCount), questionCount)
    const primaryArchetype = results[0]?.archetype || "Unknown"
    
    // Convert results to archetype breakdown format
    const archetypeBreakdown: Record<string, number> = {}
    results.forEach(result => {
      archetypeBreakdown[result.archetype] = result.percentage
    })

    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          // Close modal if clicking on backdrop
          if (e.target === e.currentTarget) {
            handleClose()
          }
        }}
      >
        <motion.div
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - Fixed positioning at top right */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </Button>

          <QuizResults
            primaryArchetype={primaryArchetype}
            archetypeBreakdown={archetypeBreakdown}
            answers={answers.slice(0, questionCount)}
            questionCount={questionCount}
            onRestart={() => {
              console.log("Restarting quiz...")
              setCurrentQuestion(0)
              setAnswers([])
              setShowResults(false)
              setIsProcessingAnswer(false)
            }}
          />
        </motion.div>
      </motion.div>
    )
  }

  // Safety check - don't render if we're beyond the question count
  if (currentQuestion >= questionCount) {
    console.error("ERROR: Current question index out of bounds!", {
      currentQuestion,
      questionCount,
    })
    return null
  }

  const currentQuestionData = selectedQuestions[currentQuestion]

  if (!currentQuestionData) {
    console.error("ERROR: No question data found!", {
      currentQuestion,
      selectedQuestionsLength: selectedQuestions.length,
    })
    return null
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - Fixed positioning at top right */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full w-10 h-10 p-0 flex items-center justify-center shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Header - Centered navigation */}
        <div className="flex flex-col items-center justify-center mb-6 relative pt-4">
          {/* Question counter */}
          <div className="flex items-center gap-4 mb-2">
            {currentQuestion > 0 && (
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-wisteria-500 hover:text-wisteria-600 hover:bg-pink-50 text-sm"
              >
                ← Previous
              </Button>
            )}
            <div className="text-base font-serif text-wisteria-600 bg-pink-50/50 px-3 py-1 rounded-full">
              Question {currentQuestion + 1} of {questionCount}
            </div>
          </div>

          {/* Decorative element */}
          <div className="flex items-center gap-2 text-wisteria-300 text-xs">
            <span>✦</span>
            <span className="w-12 h-px bg-pink-200"></span>
            <span>✦</span>
            <span className="w-12 h-px bg-pink-200"></span>
            <span>✦</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-pink-100 rounded-full h-2 mb-6">
          <motion.div
            className="bg-gradient-to-r from-pink-300 via-wisteria-300 to-lilac-300 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            {/* Decorative elements */}
            <div className="flex justify-center mb-3">
              <motion.div
                className="text-xl text-wisteria-300"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            </div>

            {/* Question text with enhanced styling */}
            <div className="relative">
              <motion.div
                className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-pink-200 text-2xl opacity-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                "
              </motion.div>
              <motion.div
                className="absolute -right-4 bottom-0 text-pink-200 text-2xl opacity-50"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                "
              </motion.div>
              <h3 className="text-xl md:text-2xl font-serif text-gray-800 mb-6 text-center leading-relaxed px-6">
                {currentQuestionData.question}
              </h3>
            </div>

            <div className="grid gap-3">
              {currentQuestionData.options.map((option, index) => {
                // Get the specific gradient for this archetype
                const gradient = archetypeGradients[option.archetype] || "from-pink-100 via-wisteria-100 to-lilac-100"

                return (
                  <motion.button
                    key={index}
                    className={`text-left p-4 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:${gradient} border border-pink-100 hover:border-wisteria-200 transition-all duration-300 group hover:shadow-lg`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.archetype)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    disabled={isProcessingAnswer}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {option.emoji}
                      </span>
                      <div>
                        <p className="text-gray-800 text-base leading-relaxed">{option.text}</p>
                        <p className="text-wisteria-500 text-xs mt-1 italic">{option.archetype}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
