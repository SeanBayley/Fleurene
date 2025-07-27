"use client"

import { motion } from "framer-motion"

export default function MagicQuote() {
  return (
    <section className="py-20 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(251, 207, 232, 0.8), rgba(233, 213, 255, 0.8), rgba(196, 231, 255, 0.8))",
            "linear-gradient(45deg, rgba(233, 213, 255, 0.8), rgba(196, 231, 255, 0.8), rgba(254, 215, 215, 0.8))",
            "linear-gradient(45deg, rgba(196, 231, 255, 0.8), rgba(254, 215, 215, 0.8), rgba(251, 207, 232, 0.8))",
            "linear-gradient(45deg, rgba(251, 207, 232, 0.8), rgba(233, 213, 255, 0.8), rgba(196, 231, 255, 0.8))",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center group">
        <motion.blockquote
          className="text-xl md:text-3xl font-serif italic text-gray-700 leading-relaxed mb-6 font-light hover:translate-x-2 transition-transform duration-300 cursor-default"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          "She believed she could, so she did... with a little magic on her wrist"
        </motion.blockquote>

        <motion.cite
          className="text-sm md:text-base text-gray-600 font-medium hover:translate-x-2 transition-transform duration-300 cursor-default"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          — The Fleurene Philosophy
        </motion.cite>
      </div>
    </section>
  )
}
