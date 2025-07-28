"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import WelcomeSection from "@/components/welcome-section"
import HeroSection from "@/components/hero-section"
import StorySection from "@/components/story-section"
import QuizSection from "@/components/quiz-section"
import MagicQuote from "@/components/magic-quote"
import FeaturedCollections from "@/components/featured-collections"
import JournalSection from "@/components/journal-section"
import CommunityJournalSection from "@/components/community-journal-section"
import Newsletter from "@/components/newsletter"
import Footer from "@/components/footer"
import FloatingElements from "@/components/floating-elements"
import StoryModal from "@/components/story-modal"
import JournalModal from "@/components/journal-modal"
import GlobalFlowerExplosion from "@/components/global-flower-explosion"
import GiftGuideTrigger from "@/components/gift-guide-trigger"
import MoodMirrorTrigger from "@/components/mood-mirror-trigger"
import { FlowerExplosionProvider } from "@/components/flower-explosion-context"
import QuizModal from "@/components/quiz-modal"

export default function Home() {
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showJournalModal, setShowJournalModal] = useState(false)

  return (
    <FlowerExplosionProvider>
      <div className="min-h-screen bg-gradient-to-br from-pink-25 via-purple-25 to-blue-25 relative overflow-x-hidden">
        {/* Magical Background Orbs */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <motion.div
            className="absolute top-1/4 left-1/10 w-80 h-80 bg-pink-50/20 rounded-full blur-3xl"
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -40, 60, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-3/5 right-1/6 w-96 h-96 bg-purple-50/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 40, 0],
              y: [0, 50, -30, 0],
              scale: [1, 0.8, 1.3, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: -8 }}
          />
          <motion.div
            className="absolute bottom-1/10 left-1/5 w-72 h-72 bg-blue-50/20 rounded-full blur-3xl"
            animate={{
              x: [0, 40, -50, 0],
              y: [0, -30, 40, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: -15 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-50/15 rounded-full blur-3xl"
            animate={{
              x: [0, -35, 45, 0],
              y: [0, 35, -25, 0],
              scale: [1, 1.15, 0.85, 1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: -12 }}
          />
        </div>

        <GlobalFlowerExplosion />
        <FloatingElements />
        <Navigation />
        <GiftGuideTrigger />
        <MoodMirrorTrigger />

        <main className="relative z-10">
          <WelcomeSection />
          <HeroSection onStartStory={() => setShowStoryModal(true)} />
          <MagicQuote />
          <div id="story-section">
            <StorySection onStartStory={() => setShowStoryModal(true)} />
          </div>
          <CommunityJournalSection />
          <QuizSection />
          <div id="journal-section">
            <JournalSection onOpenJournal={() => setShowJournalModal(true)} />
          </div>
          <Newsletter />
        </main>

        <Footer />

        <AnimatePresence>
          {showStoryModal && <StoryModal onClose={() => setShowStoryModal(false)} />}
          {showQuizModal && <QuizModal questionCount={10} onClose={() => setShowQuizModal(false)} />}
          {showJournalModal && <JournalModal isOpen={showJournalModal} onClose={() => setShowJournalModal(false)} />}
        </AnimatePresence>
      </div>
    </FlowerExplosionProvider>
  )
} 