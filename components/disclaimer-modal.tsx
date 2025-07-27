"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  // Get current date for the "Last Updated" field
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-purple-100">
                <div>
                  <h2 className="text-2xl font-serif text-purple-800">Fleurene Jewelry – Website Disclaimer</h2>
                  <p className="text-sm text-gray-500">Last Updated: {currentDate}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-purple-700" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6 flex-grow">
                <div className="prose prose-sm max-w-none prose-purple space-y-6">
                  <p>
                    Welcome to Fleurene Jewelry (www.fleurenejewelry.com). By using our website, purchasing our
                    products, or engaging with our brand in any way, you agree to the terms and conditions of this
                    disclaimer. If you do not agree, please do not use our site or services.
                  </p>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">1. General Information Only</h3>
                    <p>
                      All information provided on this website is for general informational and aesthetic purposes only.
                      Fleurene Jewelry makes every effort to ensure that the information is accurate and up to date, but
                      we do not guarantee the completeness, accuracy, or reliability of any content, product, or service
                      featured.
                    </p>
                    <p>We reserve the right to modify, update, or remove information at any time without notice.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">
                      2. Handmade Products – Variations & Imperfections
                    </h3>
                    <p>All Fleurene Jewelry items are handmade in small batches, which means:</p>
                    <ul>
                      <li>
                        Slight variations in color, shape, size, or texture are normal and part of the charm of handmade
                        craftsmanship.
                      </li>
                      <li>No two items will ever be exactly the same.</li>
                      <li>These variations are not considered defects and will not qualify for returns.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">3. Returns, Exchanges, and Refund Policy</h3>
                    <p>
                      Fleurene Jewelry is a small handmade business, and as such, we do not offer returns or exchanges.
                      This policy helps us keep operations sustainable, maintain fair pricing, and respect the
                      time-intensive nature of handcrafted jewelry.
                    </p>
                    <p>
                      That said, your satisfaction is important to us. If your order arrives damaged or if there has
                      been an error on our part, please contact us within 7 days of delivery at:
                    </p>
                    <p>📧 hello@fleurenejewelry.com</p>
                    <p>
                      We will assess the situation and, where appropriate, offer a replacement, repair, or partial
                      refund at our discretion.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">4. Product Descriptions and Images</h3>
                    <p>We aim to describe and photograph all products as accurately as possible. However:</p>
                    <ul>
                      <li>Colors may appear slightly different depending on your device screen or lighting.</li>
                      <li>Product dimensions are approximate.</li>
                      <li>
                        Some materials may age or change slightly over time (e.g., oxidization of metals or fading of
                        dyed elements).
                      </li>
                      <li>
                        Fleurene Jewelry reserves the right to make design updates or discontinue products at any time.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">5. Allergy and Skin Sensitivity Notice</h3>
                    <p>Our pieces may contain components such as:</p>
                    <ul>
                      <li>Plated metals (gold/silver),</li>
                      <li>Brass,</li>
                      <li>Stainless steel,</li>
                      <li>Elastic cords,</li>
                      <li>Resin,</li>
                      <li>Natural or glass beads.</li>
                    </ul>
                    <p>
                      It is your responsibility to read the materials listed and assess any potential allergic
                      reactions. Fleurene Jewelry will not be held liable for skin irritations, allergic reactions, or
                      injuries resulting from wearing our jewelry.
                    </p>
                    <p>
                      If you have sensitive skin, we recommend consulting with your healthcare provider before
                      purchasing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">
                      6. Shipping, Delivery & International Orders
                    </h3>
                    <p>We offer local and international shipping. Please note:</p>
                    <ul>
                      <li>
                        Fleurene Jewelry is not liable for delays, loss, or damage caused by third-party couriers or
                        customs.
                      </li>
                      <li>
                        Buyers are responsible for all customs duties, VAT, and taxes associated with international
                        shipments.
                      </li>
                      <li>
                        We provide tracking where possible, but once an order has left our premises, it is beyond our
                        control.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">7. Use at Your Own Risk</h3>
                    <p>
                      Jewelry and accessories may contain small parts or fragile materials. By purchasing from Fleurene
                      Jewelry, you acknowledge and accept the following:
                    </p>
                    <ul>
                      <li>Items may not be suitable for children and should be kept out of their reach.</li>
                      <li>
                        Fleurene Jewelry is not responsible for injuries or harm resulting from misuse, breakage, or
                        improper care of our products.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">8. Intellectual Property</h3>
                    <p>
                      All content on this website, including product photos, names, designs, logos, descriptions, and
                      written copy, is the intellectual property of Fleurene Jewelry and may not be copied, reproduced,
                      or used without express written permission.
                    </p>
                    <p>
                      Any unauthorized use of our intellectual property will be pursued to the full extent of applicable
                      laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">9. Limitation of Liability</h3>
                    <p>To the fullest extent permitted by law:</p>
                    <ul>
                      <li>
                        Fleurene Jewelry shall not be liable for any direct, indirect, incidental, consequential, or
                        punitive damages arising from your use of this website or our products.
                      </li>
                      <li>
                        This includes, but is not limited to, allergic reactions, lost or damaged shipments, or misuse
                        of products.
                      </li>
                      <li>You agree to use our website and products at your own risk.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">10. Privacy Policy</h3>
                    <p>
                      We respect your privacy. Personal information collected through the site (e.g., email sign-ups,
                      purchases) will be used only for fulfilling orders, communications, and improving your shopping
                      experience. We will never sell or share your personal data with third parties, except where
                      required for order fulfillment or legal compliance.
                    </p>
                    <p>Please refer to our Privacy Policy for more detail.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">11. External Links</h3>
                    <p>
                      From time to time, we may include links to external websites (e.g., suppliers, payment gateways,
                      or partners). These sites are not under our control. Fleurene Jewelry is not responsible for the
                      content, security, or privacy policies of third-party websites.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">12. Legal Jurisdiction</h3>
                    <p>
                      Fleurene Jewelry is a South African-based business. All legal matters, claims, or disputes will be
                      governed by the laws of the Republic of South Africa, regardless of where you are accessing our
                      website from.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-purple-700">13. Contact</h3>
                    <p>If you have any questions about this disclaimer, please contact us at:</p>
                    <p>Fleurene Jewelry</p>
                    <p>📧 Email: hello@fleurenejewelry.com</p>
                    <p>🌍 Website: www.fleurenejewelry.com</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-purple-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
