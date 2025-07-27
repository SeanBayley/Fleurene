"use client"

import { motion } from "framer-motion"
import FlowerButton from "@/components/flower-button"
import WhisperIcon from "@/components/whisper-icon"
import Image from "next/image"

interface HeroSectionProps {
  onStartStory: () => void
}

export default function HeroSection({ onStartStory }: HeroSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background whisper icons - positioned far from any text and more spaced out */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Extreme corners only - far from any text */}
        <WhisperIcon icon="🌙" className="absolute top-[1%] right-[1%] z-0" size="small" />
        <WhisperIcon icon="✨" className="absolute top-[1%] left-[1%] z-0" size="small" />
        <WhisperIcon icon="🦋" className="absolute bottom-[1%] right-[1%] z-0" size="small" />
        <WhisperIcon icon="💌" className="absolute bottom-[1%] left-[1%] z-0" size="small" />

        {/* Far right edge only - image area only */}
        <WhisperIcon icon="🌸" className="absolute top-[30%] right-[1%] z-0" size="small" />
        <WhisperIcon icon="🌺" className="absolute top-[70%] right-[1%] z-0" size="small" />
      </div>

      {/* Much slower magical background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft shimmer background - much slower */}
        <motion.div
          className="absolute inset-0 opacity-15"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(194, 151, 212, 0.12) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 70%, rgba(255, 174, 192, 0.12) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(172, 216, 213, 0.12) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(194, 151, 212, 0.12) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 45, // Much slower: 45 seconds
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Much slower grouped floating elements around key areas */}
        {/* Title area sparkles - slower */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`title-sparkle-${i}`}
            className="absolute text-xs opacity-30"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${15 + (i * 3)}%`,
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              rotate: [0, 360],
              scale: [0.6, 1, 0.6],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 25 + (i * 5), // Much slower: 25-40 seconds
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 8,
            }}
          >
            {["✨", "⭐", "💫"][i % 3]}
          </motion.div>
        ))}

        {/* Button area butterflies and flowers - slower */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`button-element-${i}`}
            className="absolute text-base opacity-20"
            style={{
              left: `${25 + (i * 7)}%`,
              top: `${60 + (i * 5)}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, 8, 0],
              rotate: [0, 10, -10, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 30 + (i * 7), // Much slower: 30-50 seconds
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 10,
            }}
          >
            {["🦋", "🌸", "🌷"][i % 3]}
          </motion.div>
        ))}

        {/* Image area floating elements - slower */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`image-element-${i}`}
            className="absolute text-base opacity-15"
            style={{
              left: `${70 + (i * 7)}%`,
              top: `${30 + (i * 13)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
              scale: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 35 + (i * 8), // Much slower: 35-60 seconds
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 12,
            }}
          >
            {["🌸", "🌺", "✨", "🦋"][i % 4]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left relative z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-2xl md:text-3xl font-serif font-light leading-tight cursor-default relative z-10"
              whileHover={{ x: 8 }}
            >
              <motion.span
                className="bg-gradient-to-r from-[#C697D4] via-[#FFAEC0] to-[#ACD8D5] bg-clip-text text-transparent relative"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(194, 151, 212, 0.3))",
                  textShadow: "0 0 20px rgba(194, 151, 212, 0.2)",
                  backgroundSize: "300% 300%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Jewelry for the free-spirited
              </motion.span>
              <motion.span
                className="inline-block ml-2 text-xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.span>

              {/* Subtle shimmer overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
                style={{ clipPath: "inset(0)" }}
              />
            </motion.h1>

            <motion.p
              className="text-sm md:text-base leading-loose max-w-lg mx-auto lg:mx-0 cursor-default relative z-10"
              style={{ color: "#9D8DAE", lineHeight: "1.9", fontSize: "1.05rem" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.span
                className="inline-block hover:translate-x-2 transition-transform duration-300"
                whileHover={{ x: 8 }}
              >
                Crafted to express your quiet magic.
              </motion.span>{" "}
              <motion.span
                className="inline-block hover:translate-x-2 transition-transform duration-300"
                whileHover={{ x: 8 }}
              >
                Each piece tells a story of dreams, wildflowers, and the beautiful moments that make you uniquely you.
              </motion.span>
            </motion.p>

            {/* Handwritten message - moved between paragraph and buttons */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
            >
              <motion.p
                className="text-base italic cursor-default"
                style={{
                  fontFamily: "'Cormorant', serif",
                  fontSize: "1.15rem",
                  color: "#B28AD8",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textShadow: "0 1px 2px rgba(178, 138, 216, 0.1)",
                }}
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
              >
                I hope my jewellery adds a little joy to your day, just like it does to mine.
                <motion.span
                  className="inline-block ml-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.span>
              </motion.p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.div
                className="relative overflow-hidden rounded-full"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(194, 151, 212, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FlowerButton
                  size="lg"
                  className="relative text-gray-600 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #FADCE6 0%, #EBDCFB 100%)",
                    boxShadow: "0 4px 15px rgba(194, 151, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: "linear-gradient(45deg, #FADCE6, #F5D0E8, #EBDCFB, #E0C6F9, #FADCE6)",
                      backgroundSize: "300% 300%",
                    }}
                    whileHover={{
                      opacity: 1,
                      backgroundPosition: ["0% 50%", "100% 50%", "200% 50%"],
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      backgroundPosition: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                    }}
                  />

                  <span className="relative z-10">Explore Your Story in Beads</span>
                </FlowerButton>
              </motion.div>

              <motion.div
                className="relative overflow-hidden rounded-full"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 10px 25px rgba(194, 151, 212, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <FlowerButton
                  variant="outline"
                  size="lg"
                  className="relative text-gray-600 px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm border-pink-200 overflow-hidden"
                  onClick={() => {
                    document.getElementById("quiz-section")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  style={{
                    background: "linear-gradient(135deg, #FADCE6 0%, #EBDCFB 100%)",
                    boxShadow: "0 4px 15px rgba(194, 151, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {/* Animated gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    style={{
                      background: "linear-gradient(45deg, #FADCE6, #F5D0E8, #EBDCFB, #E0C6F9, #FADCE6)",
                      backgroundSize: "300% 300%",
                    }}
                    whileHover={{
                      opacity: 1,
                      backgroundPosition: ["0% 50%", "100% 50%", "200% 50%"],
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      backgroundPosition: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                    }}
                  />

                  <span className="relative z-10">Find Your Vibe</span>
                </FlowerButton>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-lavender-200/30">
              <Image
                src="/images/hero-flowers.jpg"
                alt="Dreamy purple pansies in golden sunlight - capturing the magical essence of Fleurene jewelry"
                width={600}
                height={400}
                priority={true}
                quality={85}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli+ZfIhbDGLofHLHjQlbIicYkE="
              />

              {/* Enhanced magical overlay that complements the purple flowers */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-transparent to-pink-100/20 pointer-events-none"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Floating Sparkles that complement the image */}
              <motion.div
                className="absolute top-1/4 left-1/4 text-xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 20, 0],
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>

              <motion.div
                className="absolute top-3/5 right-1/4 text-xl"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, -20, 0],
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                🌸
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 left-1/3 text-xl"
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 15, 0],
                  scale: [1, 1.25, 1],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 3,
                }}
              >
                💫
              </motion.div>

              {/* Additional sparkles that match the dreamy aesthetic */}
              <motion.div
                className="absolute top-1/6 right-1/3 text-base"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 360],
                  scale: [0.8, 1.1, 0.8],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                🦋
              </motion.div>

              <motion.div
                className="absolute bottom-1/6 right-1/6 text-base"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, -180, 0],
                  scale: [0.9, 1.2, 0.9],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 7,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 4,
                }}
              >
                🌷
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
