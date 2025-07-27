"use client"
import { motion } from "framer-motion"
import FlowerButton from "@/components/flower-button"

interface JournalSectionProps {
  onOpenJournal: () => void
}

export default function JournalSection({ onOpenJournal }: JournalSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-25 via-pink-25 to-rose-50 relative overflow-hidden">
      {/* Magical Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Enchanted Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Magical Sparkles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 12 + 8}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          >
            <span className="text-yellow-300 drop-shadow-lg">✨</span>
          </motion.div>
        ))}

        {/* Floating Magical Creatures */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`creature-${i}`}
            className="absolute text-2xl opacity-40 drop-shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 6,
            }}
          >
            {["🧚‍♀️", "🦋", "🌸", "🍄", "🌙", "⭐", "🌿", "🌺", "🕊️", "💫", "🦢", "🌹", "🔮", "🌟", "🎭"][i]}
          </motion.div>
        ))}

        {/* Magical Orbs with Glow */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 120 + 60}px`,
              height: `${Math.random() * 120 + 60}px`,
              background: `radial-gradient(circle, ${
                [
                  "rgba(251, 191, 36, 0.3)",
                  "rgba(244, 114, 182, 0.3)",
                  "rgba(167, 139, 250, 0.3)",
                  "rgba(52, 211, 153, 0.3)",
                  "rgba(96, 165, 250, 0.3)",
                  "rgba(251, 113, 133, 0.3)",
                  "rgba(196, 181, 253, 0.3)",
                  "rgba(252, 165, 165, 0.3)",
                ][i]
              }, transparent)`,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.6, 0.2],
              x: [0, 30, -20, 0],
              y: [0, -25, 15, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Floating Pages */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`page-${i}`}
            className="absolute text-3xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              rotate: [0, 15, -15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 4,
            }}
          >
            📜
          </motion.div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        {/* Enchanted Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="relative inline-block mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* Magical Title Decorations */}
            <motion.div
              className="absolute -top-8 -left-8 text-4xl"
              animate={{
                rotate: [0, 20, -20, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              🧚‍♀️
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-10 text-3xl"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 15, -15, 0],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: -2 }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-2xl"
              animate={{
                y: [0, -8, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              🌸
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-serif bg-gradient-to-r from-purple-600 via-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
              The Enchanted Journal
            </h2>
          </motion.div>

          <motion.p
            className="text-xl text-purple-500 mb-8 font-light italic drop-shadow-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Where dreams take flight & hearts whisper their deepest secrets ✨
          </motion.p>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-purple-200/50 shadow-2xl relative overflow-hidden">
              {/* Card magical effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-rose-50/50 rounded-3xl" />
              <div className="relative z-10">
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Step into your magical sanctuary, dear soul. Let your thoughts bloom like wildflowers in an enchanted
                  meadow.
                </p>
                <p className="text-purple-500 text-lg font-light italic mb-4">
                  This is your sacred garden of words. 🌸
                </p>
                <p className="text-gray-500 text-base">
                  Capture moments, weave stories, create mood boards, and share your magic with kindred spirits
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Feature Showcase */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: "✍️",
              title: "Weave Your Story",
              description: "Craft enchanting tales with magical writing prompts",
              gradient: "from-pink-300 via-rose-200 to-pink-300",
              glow: "shadow-pink-200/50",
            },
            {
              icon: "🖼️",
              title: "Mood Boards",
              description: "Create visual stories with magical image collections",
              gradient: "from-purple-300 via-pink-200 to-purple-300",
              glow: "shadow-purple-200/50",
            },
            {
              icon: "📖",
              title: "Gather Wisdom",
              description: "Collect quotes and words that dance with your soul",
              gradient: "from-blue-300 via-purple-200 to-blue-300",
              glow: "shadow-blue-200/50",
            },
            {
              icon: "🌍",
              title: "Sprinkle Magic",
              description: "Share your light with fellow dreamers worldwide",
              gradient: "from-green-300 via-blue-200 to-green-300",
              glow: "shadow-green-200/50",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-md rounded-3xl p-6 border border-white/40 hover:border-white/60 transition-all duration-500 relative overflow-hidden group ${feature.glow} shadow-xl hover:shadow-2xl`}
              whileHover={{ y: -12, scale: 1.05, rotateY: 5 }}
              initial={{ opacity: 0, y: 30, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 1.2 + index * 0.15 }}
              viewport={{ once: true }}
            >
              {/* Card magical sparkles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-xs opacity-40"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 3,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="text-4xl mb-4 drop-shadow-lg"
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.7,
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg font-semibold text-purple-800 mb-3 drop-shadow-sm">{feature.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Magical Call to Action */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            {/* Button magical aura */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-400/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Floating sparkles around button */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-lg opacity-60"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.3, 0.8],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 3,
                }}
              >
                {["✨", "🌟", "💫", "⭐", "🌸", "🧚‍♀️", "🦋", "💎"][i]}
              </motion.div>
            ))}

            <FlowerButton
              onClick={onOpenJournal}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-purple-300/50 transform hover:scale-110 relative z-10 border border-white/20"
            >
              <span className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  🧚‍♀️
                </motion.span>
                Open My Enchanted Journal
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  ✨
                </motion.span>
              </span>
            </FlowerButton>
          </div>
        </motion.div>

        {/* Enchanted Quote */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-purple-200/50 shadow-xl relative overflow-hidden">
            {/* Quote decorative elements */}
            <div className="absolute -top-4 -left-4 text-purple-300 text-6xl font-serif opacity-30">"</div>
            <div className="absolute -bottom-8 -right-4 text-purple-300 text-6xl font-serif opacity-30">"</div>

            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              className="relative z-10"
            >
              <p className="text-purple-500 italic text-lg mb-3 leading-relaxed">
                "In every heart there is a room, a sanctuary safe and strong, to heal the wounds from lovers past, until
                a new one comes along"
              </p>
              <p className="text-gray-500 text-sm">- Billy Joel</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
