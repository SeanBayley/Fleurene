"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FlowerBasketProps {
  isOpen: boolean
  onClose: () => void
  items: Array<{
    id: number
    name: string
    price: string
    image: string
    quantity: number
  }>
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
}

export default function FlowerBasket({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: FlowerBasketProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const price = Number.parseFloat(item.price.replace(/[$R]/g, ""))
    return sum + price * item.quantity
  }, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Flower Basket Modal */}
          <motion.div
            className="fixed right-4 top-4 bottom-4 w-96 z-50"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <Card className="h-full relative overflow-hidden bg-gradient-to-br from-purple-50/95 via-white/95 to-pink-50/95 backdrop-blur-xl border-2 border-purple-200/50 shadow-2xl">
              {/* Magical border effect */}
              <motion.div
                className="absolute inset-0 border-2 border-purple-300/40 rounded-lg"
                animate={{
                  borderColor: [
                    "rgba(196, 181, 253, 0.4)",
                    "rgba(251, 207, 232, 0.6)",
                    "rgba(212, 197, 240, 0.5)",
                    "rgba(196, 181, 253, 0.4)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Floating magical elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-purple-300/30"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      fontSize: "12px",
                    }}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, 10, -5, 0],
                      rotate: [0, 360],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 1,
                      ease: "easeInOut",
                    }}
                  >
                    {["🌸", "🌺", "🌷", "🌹", "🌻", "🌼", "🌿", "🍃"][i % 8]}
                  </motion.div>
                ))}
              </div>

              <CardContent className="h-full flex flex-col p-6 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="relative"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="text-3xl">🧺</div>
                      <motion.div
                        className="absolute -top-1 -right-1 text-sm"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        🌸
                      </motion.div>
                    </motion.div>
                    <div>
                      <h2
                        className="text-2xl font-serif text-gray-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Your Flower Basket
                      </h2>
                      <p className="text-sm text-gray-600">
                        {totalItems} magical treasure{totalItems !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 hover:bg-purple-100/50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                  <AnimatePresence>
                    {items.length === 0 ? (
                      <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <motion.div
                          className="text-6xl mb-4"
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        >
                          🧺
                        </motion.div>
                        <p className="text-gray-500 italic">Your flower basket is empty</p>
                        <p className="text-sm text-gray-400 mt-2">Add some magical treasures to get started!</p>
                      </motion.div>
                    ) : (
                      items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 50, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -50, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group relative"
                        >
                          <Card className="relative overflow-hidden bg-gradient-to-br from-white/80 to-purple-50/60 border border-purple-200/40 shadow-md hover:shadow-lg transition-all duration-300">
                            {/* Item magical glow */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />

                            <CardContent className="p-4">
                              <div className="flex gap-3">
                                <div className="relative">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <motion.div
                                    className="absolute -top-1 -right-1 text-xs"
                                    animate={{
                                      rotate: [0, 10, -10, 0],
                                      scale: [1, 1.1, 1],
                                    }}
                                    transition={{
                                      duration: 3,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "easeInOut",
                                      delay: index * 0.5,
                                    }}
                                  >
                                    🌸
                                  </motion.div>
                                </div>

                                <div className="flex-1">
                                  <h3 className="font-serif text-gray-800 text-sm font-medium">{item.name}</h3>
                                  <p className="text-purple-600 font-semibold text-sm">{item.price}</p>

                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-6 h-6 p-0 border-purple-200 hover:bg-purple-50"
                                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-6 h-6 p-0 border-purple-200 hover:bg-purple-50"
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1"
                                      onClick={() => onRemoveItem(item.id)}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <motion.div
                    className="border-t border-purple-200/50 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-serif text-lg text-gray-800">Total:</span>
                      <span className="font-bold text-xl text-purple-600">R{totalPrice.toFixed(2)}</span>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full relative overflow-hidden text-white shadow-lg hover:shadow-xl transition-all duration-500"
                        style={{
                          background: "linear-gradient(45deg, #C4B5FD, #A78BFA, #8B5CF6, #7C3AED)",
                          backgroundSize: "300% 300%",
                        }}
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                        <div className="relative z-10 flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Checkout Your Garden</span>
                          <motion.span
                            animate={{
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            🌸
                          </motion.span>
                        </div>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
