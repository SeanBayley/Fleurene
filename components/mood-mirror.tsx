"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, RefreshCw, Heart, Music, Star } from "lucide-react"
import { moods, type MoodData } from "@/lib/mood-data"

interface MoodMirrorProps {
  isOpen: boolean
  onClose: () => void
}

export default function MoodMirror({ isOpen, onClose }: MoodMirrorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodData | null>(null)
  const [selectedSong, setSelectedSong] = useState<{ title: string; artist: string } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleMoodSelect = (mood: MoodData) => {
    setSelectedMood(mood)
    // Select a random song and store it
    const randomIndex = Math.floor(Math.random() * mood.songs.length)
    setSelectedSong(mood.songs[randomIndex])
    setShowResult(true)
  }

  const handleMirrorAgain = () => {
    setSelectedMood(null)
    setSelectedSong(null)
    setShowResult(false)
  }

  const handleClose = () => {
    setSelectedMood(null)
    setSelectedSong(null)
    setShowResult(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative max-w-2xl w-full max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Smaller, Elegant Modal */}
          <div className="relative bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-3xl shadow-2xl border-4 border-purple-200/60 overflow-hidden">
            {/* Properly Distributed Floating Flowers Background */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Soft background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-purple-50/40 to-pink-50/40"></div>

              {/* Fixed flower distribution - using fixed positions */}
              {[
                { x: 10, y: 15, flower: "🌸" },
                { x: 85, y: 20, flower: "🌺" },
                { x: 15, y: 45, flower: "🌷" },
                { x: 75, y: 50, flower: "🌹" },
                { x: 25, y: 75, flower: "💐" },
                { x: 90, y: 80, flower: "🌻" },
                { x: 5, y: 85, flower: "🌸" },
                { x: 60, y: 25, flower: "🌺" },
                { x: 40, y: 60, flower: "🌷" },
                { x: 80, y: 10, flower: "🌹" },
                { x: 50, y: 85, flower: "💐" },
                { x: 30, y: 30, flower: "🌻" },
              ].map((item, i) => (
                <motion.div
                  key={`flower-${i}`}
                  className="absolute text-2xl opacity-30"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 20 - 10, 0],
                    y: [0, Math.random() * 20 - 10, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 15,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 10,
                    ease: "easeInOut",
                  }}
                >
                  {item.flower}
                </motion.div>
              ))}

              {/* Fixed sparkle positions */}
              {[
                { x: 20, y: 25 },
                { x: 70, y: 35 },
                { x: 45, y: 15 },
                { x: 15, y: 65 },
                { x: 85, y: 55 },
                { x: 35, y: 80 },
                { x: 65, y: 70 },
                { x: 55, y: 40 },
              ].map((pos, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                  animate={{
                    scale: [0, 0.5, 0],
                    opacity: [0, 0.4, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-20"
            >
              <X size={18} className="text-purple-600" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-6">
              {/* Header with Mirror Icon */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block p-3 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mb-4"
                >
                  <div className="text-2xl">🪞</div>
                </motion.div>

                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Fleurene Mood Mirror
                </h2>
                {!showResult && <p className="text-purple-600/80 text-sm">How are you feeling today? 💖</p>}
              </div>

              {/* Content Area */}
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                {!showResult ? (
                  /* Mood Selection - Simple Grid */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-3 gap-3"
                  >
                    {moods.map((mood, index) => (
                      <motion.button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood)}
                        className="group p-4 bg-white/70 hover:bg-white/90 rounded-xl border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 shadow-sm hover:shadow-md"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <div className="text-2xl mb-2">{mood.emoji}</div>
                        <div className="text-xs font-medium text-purple-700 leading-tight">{mood.name}</div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  /* Mood Result - Clean Display */
                  selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      {/* Main Result */}
                      <div className="bg-white/80 rounded-2xl p-6 border border-purple-200/50 shadow-lg">
                        <div className="text-5xl mb-4">{selectedMood.emoji}</div>
                        <h3 className="text-xl font-bold text-purple-700 mb-4">{selectedMood.name}</h3>

                        {/* Quote */}
                        <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-200/40 mb-4">
                          <Heart size={16} className="mx-auto text-purple-500 mb-2" />
                          <p className="text-sm font-medium text-purple-800 italic">"{selectedMood.quote}"</p>
                        </div>

                        {/* Message */}
                        <div className="bg-pink-50/60 rounded-xl p-4 border border-pink-200/40">
                          <p className="text-sm text-purple-700 leading-relaxed">{selectedMood.message}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Product */}
                        <div className="bg-white/70 rounded-lg p-3 border border-purple-200/40">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="text-sm">✨</div>
                            <h4 className="font-semibold text-purple-700 text-xs">Perfect Match</h4>
                          </div>
                          <p className="text-xs text-purple-600">{selectedMood.product}</p>
                        </div>

                        {/* Song */}
                        <div className="bg-white/70 rounded-lg p-3 border border-purple-200/40">
                          <div className="flex items-center gap-1 mb-1">
                            <Music size={14} className="text-purple-500" />
                            <h4 className="font-semibold text-purple-700 text-xs">Mood Song</h4>
                          </div>
                          <p className="text-xs text-purple-600">
                            "{selectedSong?.title}" by {selectedSong?.artist}
                          </p>
                        </div>

                        {/* Colors - BEAUTIFUL SPINNING WHEEL */}
                        <div className="bg-gradient-to-br from-white/90 to-purple-50/80 rounded-xl p-4 border-2 border-purple-300/60 shadow-lg">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <Star size={16} className="text-purple-500" />
                            <h4 className="font-bold text-purple-700 text-sm">Your Colors</h4>
                            <Star size={16} className="text-purple-500" />
                          </div>

                          {/* Spinning Color Wheel - FIXED */}
                          <div className="flex justify-center items-center">
                            <div className="relative w-32 h-32">
                              {/* Outer decorative ring */}
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-purple-200/40"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 60,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              />

                              {/* Color circles arranged in a wheel - FIXED POSITIONING */}
                              {selectedMood.colors.map((color, index) => {
                                const totalColors = selectedMood.colors.length
                                const angle = (index * 360) / totalColors
                                const radius = 50 // Distance from center

                                // Convert angle to radians and calculate position
                                const radian = (angle * Math.PI) / 180
                                const x = Math.cos(radian) * radius
                                const y = Math.sin(radian) * radius

                                return (
                                  <motion.div
                                    key={`color-${index}-${color}`}
                                    className="absolute w-12 h-12"
                                    style={{
                                      left: `calc(50% + ${x}px - 24px)`, // 24px = half of w-12
                                      top: `calc(50% + ${y}px - 24px)`, // 24px = half of h-12
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                      delay: 0.3 + index * 0.2,
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                  >
                                    {/* Glow effect */}
                                    <div
                                      className="absolute inset-0 rounded-full blur-sm opacity-50"
                                      style={{ backgroundColor: color }}
                                    />
                                    {/* Main color circle */}
                                    <motion.div
                                      className="relative w-12 h-12 rounded-full border-3 border-white shadow-xl"
                                      style={{ backgroundColor: color }}
                                      whileHover={{ scale: 1.1 }}
                                      animate={{
                                        boxShadow: [
                                          `0 4px 15px ${color}40`,
                                          `0 6px 20px ${color}60`,
                                          `0 4px 15px ${color}40`,
                                        ],
                                      }}
                                      transition={{
                                        boxShadow: {
                                          duration: 3,
                                          repeat: Number.POSITIVE_INFINITY,
                                          ease: "easeInOut",
                                        },
                                      }}
                                    />
                                    {/* Individual sparkle */}
                                    <motion.div
                                      className="absolute -top-1 -right-1 text-xs"
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 4,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                        delay: index * 0.5,
                                      }}
                                    >
                                      ✨
                                    </motion.div>
                                  </motion.div>
                                )
                              })}

                              {/* Center sparkle */}
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center text-xl"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 8,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              >
                                💫
                              </motion.div>
                            </div>
                          </div>

                          {/* Color harmony text */}
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-xs text-purple-600/80 text-center mt-3 font-medium"
                          >
                            Your perfect color harmony 💫
                          </motion.p>
                        </div>
                      </div>

                      {/* Mirror Again Button */}
                      <button
                        onClick={handleMirrorAgain}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
                      >
                        <RefreshCw size={16} />
                        Mirror Again ✨
                      </button>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #c084fc, #f472b6);
          border-radius: 10px;
        }
      `}</style>
    </AnimatePresence>
  )
}
