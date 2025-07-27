"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useWhisper } from "./whisper-context"

export default function WhisperMessage() {
  const { activeWhisper, hideWhisper } = useWhisper()

  return (
    <AnimatePresence>
      {activeWhisper && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute pointer-events-auto"
            style={{
              left: activeWhisper.x,
              top: activeWhisper.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -20,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <div
              className="
                bg-white/95 backdrop-blur-sm
                border border-purple-200/50
                rounded-2xl px-6 py-4 max-w-xs
                shadow-lg shadow-purple-100/50
                cursor-pointer
              "
              onClick={hideWhisper}
            >
              <motion.p
                className="
                  text-purple-700 text-sm leading-relaxed
                  font-serif italic text-center
                "
                style={{ fontFamily: "Cormorant, serif" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {activeWhisper.message}
              </motion.p>

              {/* Sparkle decorations */}
              <motion.div
                className="absolute -top-2 -right-2 text-yellow-400"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>

              <motion.div
                className="absolute -bottom-1 -left-1 text-pink-400"
                animate={{
                  rotate: [360, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                🌸
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
