"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import WhisperIcon from "@/components/whisper-icon"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background whisper icons - positioned far from any text */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Only extreme corners - away from all text */}
        <WhisperIcon icon="💌" className="absolute top-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="✨" className="absolute top-[1%] right-[1%] z-0" size="small" />
        <WhisperIcon icon="🌸" className="absolute bottom-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="💫" className="absolute bottom-[1%] right-[1%] z-0" size="small" />
      </div>

      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(135deg, rgba(251, 207, 232, 0.9), rgba(233, 213, 255, 0.9))",
            "linear-gradient(135deg, rgba(233, 213, 255, 0.9), rgba(254, 215, 215, 0.9))",
            "linear-gradient(135deg, rgba(254, 215, 215, 0.9), rgba(251, 207, 232, 0.9))",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center group">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-light text-white mb-6 hover:translate-x-2 transition-transform duration-300 cursor-default relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Join Our Magical Circle
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light hover:translate-x-2 transition-transform duration-300 cursor-default relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Be the first to discover new collections, get styling tips, and receive your personal jewelry personality
          reading
        </motion.p>

        {!isSubmitted ? (
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Input
              type="email"
              placeholder="Enter your email for a touch of magic"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/90 border-white/50 placeholder:text-slate-400 text-slate-700 font-poppins"
              required
            />
            <Button
              type="submit"
              className="bg-white text-rose-400 hover:bg-gray-50 px-8 whitespace-nowrap font-poppins font-medium"
            >
              Get My Reading ✨
            </Button>
          </motion.form>
        ) : (
          <motion.div
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-lg mx-auto mb-6 relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-cormorant text-white mb-2">Welcome to the Magic!</h3>
            <p className="text-white/90 font-poppins">Your jewelry personality reading is on its way! ✨</p>
          </motion.div>
        )}

        <motion.p
          className="text-white/80 text-sm font-poppins relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          viewport={{ once: true }}
        >
          Plus, enjoy 15% off your first order and exclusive access to limited collections
        </motion.p>
      </div>
    </section>
  )
}
