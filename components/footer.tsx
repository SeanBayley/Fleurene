"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DisclaimerModal from "./disclaimer-modal"
import TermsModal from "./terms-modal"

export default function Footer() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  return (
    <footer className="py-12 bg-white border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4 md:mb-0">© 2024 Fleurene. Made with ✨ and 💜</p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-purple-600">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:text-purple-800 hover:underline transition-colors"
            >
              Disclaimer
            </button>
            <button
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-purple-800 hover:underline transition-colors"
            >
              Terms & Conditions
            </button>
            <a href="#" className="hover:text-purple-800 hover:underline transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-800 hover:underline transition-colors">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>

      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </footer>
  )
}
