"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface StoryModalProps {
  onClose: () => void
}

export default function StoryModal({ onClose }: StoryModalProps) {
  const [currentChapter, setCurrentChapter] = useState(1)
  const [mood, setMood] = useState("dreamy")

  const moodColors = {
    dreamy: "from-purple-200/80 via-blue-200/80 to-purple-200/80",
    peaceful: "from-green-100/80 via-pink-100/80 to-green-100/80",
    passionate: "from-pink-200/80 via-red-200/80 to-pink-200/80",
    mysterious: "from-blue-200/80 via-purple-200/80 to-blue-200/80",
  }

  const chapters = [
    {
      id: 1,
      title: "Meet the Maker",
      label: "Opening Bud",
      content: (
        <div className="space-y-6">
          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Hi, I'm Shereen — part analyst, full-time dreamer, and the sentimental heart behind Fleurene.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            I've always felt things a little too much — and honestly, I wouldn't have it any other way. I believe moods
            deserve outfits, and feelings deserve accessories. On bubbly, sunshiney days, I reach for pinks and pastels
            and daisy beads that giggle with me. On deeper, introspective days, it's deep reds and smoky blacks — a bit
            more serious, a bit more grounded.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Jewelry, for me, is never just decoration. It's expression. It's memory. It's therapy with sparkle.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            And flowers? They've always spoken to me. I love them — their softness, their symbolism, their quiet drama.
            There's something about a blooming petal that feels like an emotion in motion. That's why I've always
            resonated so deeply with floral-inspired jewelry. It feels alive — like it's blooming on you.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Fleurene began because I couldn't find pieces that felt like me — not just the me I was every day, but the
            different versions of me that showed up depending on how I felt. And if I felt that way, I knew others did
            too.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            So I started creating them. Little floral fantasies, moody sparkle spells, and dainty tokens of joy —
            handmade with intention, emotion, and a lot of heart.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Fleurene is my creative rebellion — a gentle place where soft meets strong, logic meets whimsy, and jewelry
            tells your story back to you.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "The Bloom",
      label: "Blossoms Phase",
      content: (
        <div className="space-y-6">
          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            "Fleur" means flower — and Fleurene is my personal garden. Now it's yours too.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            This is a space for hopeless romantics, overthinkers, sentimental souls, and anyone who wants to wear their
            heart — and mood — on their sleeve. It's a garden for growing your aesthetic, whatever season you're in.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Whether you're in full bloom or just watering the roots — there's something here for you.
          </p>

          <p className="text-xl font-serif italic text-purple-600 hover:translate-x-2 transition-transform duration-300 cursor-default">
            Come as you are. Leave a little sparklier.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "Jewelry That Feels Like You",
      label: "Full Bloom",
      content: (
        <div className="space-y-6">
          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Jewelry should tell a story — your story.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Whether you're crying to vintage love songs, color-coding your chaos, or romanticizing your grocery run like
            it's a Parisian short film, Fleurene isn't just about wearing something pretty. It's about feeling seen.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Here, your jewelry mirrors your moods.
            <br />
            Your sparkle. Your storm. Your softness.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Some days you're dainty and pastel. Other days you're bold, fierce, and dipped in noir.
            <br />
            And that's exactly how it should be.
          </p>

          <p className="hover:translate-x-2 transition-transform duration-300 cursor-default">
            Fleurene is your emotional accessory drawer — a love letter to your complexity, your contradictions, your
            becoming.
          </p>

          <p className="text-xl font-serif italic text-purple-600 hover:translate-x-2 transition-transform duration-300 cursor-default">
            ✨ Pick your piece. Wear your feeling. Let your jewelry speak for you (with just the right amount of
            shimmer).
          </p>
        </div>
      ),
    },
  ]

  const currentChapterData = chapters.find((ch) => ch.id === currentChapter)

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Mood Selector */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-60">
        {[
          { id: "dreamy", emoji: "🌸", label: "Dreamy & Soft" },
          { id: "peaceful", emoji: "🌷", label: "Peaceful & Light" },
          { id: "passionate", emoji: "🌹", label: "Passionate & Warm" },
          { id: "mysterious", emoji: "🌺", label: "Mysterious & Deep" },
        ].map((moodOption) => (
          <motion.button
            key={moodOption.id}
            className={`w-12 h-12 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xl transition-all duration-300 ${
              mood === moodOption.id ? "scale-110" : "hover:scale-105"
            }`}
            style={{
              background:
                mood === moodOption.id
                  ? "linear-gradient(135deg, rgba(177, 156, 217, 0.9), rgba(200, 162, 200, 0.9))"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9))",
            }}
            onClick={() => setMood(moodOption.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={moodOption.label}
          >
            {moodOption.emoji}
          </motion.button>
        ))}
      </div>

      <motion.div
        className={`bg-gradient-to-br ${moodColors[mood as keyof typeof moodColors]} backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </Button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center group"
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentChapterData?.label}
            </motion.span>

            <motion.h3
              className="text-3xl md:text-4xl font-serif text-gray-800 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:translate-x-2 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {currentChapterData?.title}
            </motion.h3>

            <motion.div className="text-left text-gray-700 leading-relaxed space-y-4 max-w-3xl mx-auto group">
              <div className="space-y-6">{currentChapterData?.content}</div>
            </motion.div>

            <div className="flex justify-center gap-4 mt-8">
              {currentChapter > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentChapter(currentChapter - 1)}
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <span className="mr-2">🌸</span> Previous Chapter
                </Button>
              )}

              {currentChapter < chapters.length ? (
                <Button
                  onClick={() => setCurrentChapter(currentChapter + 1)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  Continue the Story <span className="ml-2">🌸</span>
                </Button>
              ) : (
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  Begin Your Journey <span className="ml-2">✨</span>
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
