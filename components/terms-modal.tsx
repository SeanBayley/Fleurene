"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-purple-100">
              <h2 className="text-2xl font-semibold text-purple-900">Terms and Conditions – Fleurene Jewelry</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-purple-900 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
              <p className="text-sm text-gray-500 mb-4">Effective Date: {currentDate}</p>

              <p className="mb-6">
                Please read these Terms and Conditions carefully before using the Fleurene Jewelry website
                (www.fleurenejewelry.com) or purchasing any of our products. By accessing or using the website, you
                agree to be bound by these Terms.
              </p>

              <p className="mb-6">
                If you do not agree with any part of these Terms, please do not use our site or services.
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">1. Overview</h3>
                <p>
                  These Terms govern the use of our website and the purchase of products from Fleurene Jewelry ("we",
                  "us", "our"). Fleurene Jewelry is a small handmade jewelry brand based in South Africa.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">2. Eligibility</h3>
                <p>
                  You must be at least 18 years old to purchase from our website. By using the site, you represent that
                  you are of legal age and have the authority to enter into these Terms.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">3. Handmade Products</h3>
                <p className="mb-2">Each piece is handmade and often made-to-order. As a result:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Slight variations in color, design, or texture are to be expected.</li>
                  <li>No two items are guaranteed to be exactly alike.</li>
                  <li>These variations are not considered defects.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">4. Orders & Payment</h3>
                <p className="mb-2">
                  All prices listed are in [insert currency] and are inclusive/exclusive of VAT (adjust depending on
                  your tax registration).
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Payment must be received in full before orders are processed.</li>
                  <li>We reserve the right to cancel or refuse any order at our discretion.</li>
                  <li>You are responsible for providing accurate shipping and contact information.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">5. Returns & Refunds</h3>
                <p className="mb-2">Due to the nature of our business:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    All sales are final. We do not accept returns, exchanges, or cancellations once an order has been
                    confirmed.
                  </li>
                  <li>
                    If your item arrives damaged or incorrect, please contact us within 7 days of receiving it. We may
                    offer a replacement or store credit at our discretion.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">6. Shipping</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>We aim to dispatch items within the timeframe stated at checkout.</li>
                  <li>Delivery timeframes are estimates only.</li>
                  <li>We are not liable for delays, loss, or damage during shipping.</li>
                  <li>Buyers are responsible for any customs duties or taxes for international shipments.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">7. Intellectual Property</h3>
                <p className="mb-2">
                  All content on this website—including images, text, product designs, branding, and logos—is the
                  intellectual property of Fleurene Jewelry and is protected by copyright and trademark laws.
                </p>
                <p className="mb-2">You may not:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Copy, distribute, or commercially exploit our content;</li>
                  <li>Use our brand name or likeness without written permission.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">8. Prohibited Uses</h3>
                <p className="mb-2">You agree not to use this website or our products for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Illegal, abusive, or fraudulent activity;</li>
                  <li>Uploading malicious code or spam;</li>
                  <li>Harvesting personal data;</li>
                  <li>Infringing on intellectual property rights.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">9. Limitation of Liability</h3>
                <p className="mb-2">To the fullest extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    We will not be liable for any indirect, incidental, special, or consequential damages arising from
                    your use of the website or our products.
                  </li>
                  <li>
                    This includes, but is not limited to, allergic reactions, loss of income, or third-party damages.
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">10. Force Majeure</h3>
                <p>
                  We shall not be liable for any failure or delay caused by circumstances beyond our reasonable control,
                  including natural disasters, courier delays, internet outages, or civil unrest.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">11. Privacy</h3>
                <p>
                  Your privacy is important to us. Personal data is collected and used in line with our Privacy Policy,
                  which can be found on our website.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">12. Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the Republic of South Africa. Any disputes arising from these
                  Terms or our products shall be handled exclusively in South African courts.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">13. Changes to Terms</h3>
                <p>
                  We reserve the right to update or change these Terms at any time. Changes will be posted on this page.
                  Continued use of the website indicates your acceptance of any changes.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">14. Contact Information</h3>
                <p className="mb-2">For questions or support, please contact:</p>
                <p className="mb-1">📧 [your email]</p>
                <p className="mb-1">🌍 www.fleurenejewelry.com</p>
                <p>📍 [optional: Business location or PO Box]</p>
              </div>
            </div>

            <div className="border-t border-purple-100 p-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
