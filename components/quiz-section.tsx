"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FlowerExplosion from "@/components/flower-explosion"
import QuizModal from "@/components/quiz-modal"
import WhisperIcon from "@/components/whisper-icon"

export default function QuizSection() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedLength, setSelectedLength] = useState<number | null>(null)

  const handleStartQuiz = (length: number) => {
    setSelectedLength(length)
    setShowQuiz(true)
  }

  return (
    <>
      <section
        id="quiz-section"
        className="py-20 bg-gradient-to-br from-lavender-25/50 via-rose-25/50 to-sky-25/50 relative overflow-hidden"
      >
        {/* Background whisper icons - positioned far from any text */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Only extreme corners - away from all text */}
          <WhisperIcon icon="🔮" className="absolute top-[1%] left-[1%] z-0" size="small" />
          <WhisperIcon icon="⭐" className="absolute top-[1%] right-[1%] z-0" size="small" />
          <WhisperIcon icon="🌟" className="absolute bottom-[1%] left-[1%] z-0" size="small" />
          <WhisperIcon icon="💫" className="absolute bottom-[1%] right-[1%] z-0" size="small" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-light text-slate-700 mb-2 relative z-10">
              Find Your Jewelry Personality
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "60%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                animate={{
                  background: [
                    "linear-gradient(to right, rgb(233, 213, 255), rgb(251, 207, 232), rgb(233, 213, 255))",
                    "linear-gradient(to right, rgb(251, 207, 232), rgb(196, 231, 255), rgb(251, 207, 232))",
                    "linear-gradient(to right, rgb(196, 231, 255), rgb(233, 213, 255), rgb(196, 231, 255))",
                    "linear-gradient(to right, rgb(233, 213, 255), rgb(251, 207, 232), rgb(233, 213, 255))",
                  ],
                }}
                transition={{
                  background: {
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
              />
            </h2>
            <p className="text-base md:text-lg text-slate-500 mb-12 font-poppins font-light relative z-10">
              Discover your unique style archetype through our magical quiz
            </p>

            <div className="mb-8 relative z-10">
              <h3 className="text-xl font-dancing text-slate-600 mb-8">Choose Your Journey Length</h3>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  { length: 10, title: "Quick Magic", subtitle: "10 Questions" },
                  { length: 20, title: "Deep Dive", subtitle: "20 Questions" },
                  { length: 30, title: "Full Journey", subtitle: "30 Questions" },
                ].map((option, index) => (
                  <FlowerExplosion key={option.length}>
                    <motion.div
                      className="bg-gradient-to-br from-white/80 via-purple-50/50 to-pink-50/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-purple-100/50 hover:border-purple-200/80 hover:scale-105 relative z-10"
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      onClick={() => handleStartQuiz(option.length)}
                    >
                      <div className="relative">
                        <div className="text-3xl mb-3">{index === 0 ? "🌸" : index === 1 ? "✨" : "🌺"}</div>
                        <motion.div
                          className="absolute -top-2 -right-2 text-base opacity-60"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          ✨
                        </motion.div>
                        <h4 className="text-lg font-serif text-slate-700 mb-2">{option.title}</h4>
                        <p className="text-purple-400 font-medium text-sm">{option.subtitle}</p>
                      </div>
                    </motion.div>
                  </FlowerExplosion>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showQuiz && selectedLength && <QuizModal questionCount={selectedLength} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </>
  )
}
