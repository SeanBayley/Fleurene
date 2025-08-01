"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/components/cart/cart-provider'
import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import { EnchantedButton } from '@/components/ui/enchanted-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, ShoppingCart, CreditCard, MapPin, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { analytics } from '@/lib/analytics'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(price)
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
}

const CHECKOUT_STEPS = [
  { id: 1, title: 'Cart Review', icon: ShoppingCart },
  { id: 2, title: 'Shipping', icon: MapPin },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Confirmation', icon: Package }
]

// Component that handles search params (needs Suspense)
function CheckoutWithSearchParams() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, profile } = useAuth()
  const { items, totalItems, totalPrice, totalSavings, validateCart, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [cartErrors, setCartErrors] = useState<string[]>([])
  const [saveShippingInfo, setSaveShippingInfo] = useState(false)
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })

  // Function to load shipping info from user profile
  const loadShippingInfo = async () => {
    if (!user || !profile) return
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('shipping_address1, shipping_address2, shipping_city, shipping_state, shipping_zip_code, shipping_country, phone')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error loading shipping info:', error)
        return
      }

      if (data) {
        setShippingInfo(prev => ({
          ...prev,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: user.email || '',
          phone: data.phone || '',
          address1: data.shipping_address1 || '',
          address2: data.shipping_address2 || '',
          city: data.shipping_city || '',
          state: data.shipping_state || '',
          zipCode: data.shipping_zip_code || '',
          country: data.shipping_country || 'US'
        }))
      }
    } catch (error) {
      console.error('Error loading shipping info:', error)
    }
  }

  // Load shipping info from user profile when logged in
  useEffect(() => {
    loadShippingInfo()
  }, [user, profile])

  // Load shipping info when reaching step 2 (shipping)
  useEffect(() => {
    if (currentStep === 2) {
      loadShippingInfo()
    }
  }, [currentStep])

  // Track checkout start when component mounts
  useEffect(() => {
    if (items.length > 0) {
      analytics.trackCheckoutStart(totalPrice, totalItems)
    }
  }, [])

  // Check for payment status on mount
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const orderId = searchParams.get('order')
    
    if (paymentStatus === 'cancelled' && orderId) {
      toast.error('Payment was cancelled. You can try again below.')
      setCurrentStep(3) // Show payment step
    } else if (paymentStatus === 'failed' && orderId) {
      toast.error('Payment failed. Please try again or contact support.')
      setCurrentStep(3) // Show payment step
    }
  }, [searchParams])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items.length, router])

  // Validate cart on mount
  useEffect(() => {
    const checkCart = async () => {
      const validation = await validateCart()
      if (!validation.isValid) {
        setCartErrors(validation.errors)
      }
    }
    checkCart()
  }, [validateCart])

  const handleStepChange = (step: number) => {
    if (step <= currentStep + 1) {
      setCurrentStep(step)
    }
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Save shipping info to user profile if logged in and checkbox is checked
      if (user && saveShippingInfo) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            shipping_address1: shippingInfo.address1,
            shipping_address2: shippingInfo.address2,
            shipping_city: shippingInfo.city,
            shipping_state: shippingInfo.state,
            shipping_zip_code: shippingInfo.zipCode,
            shipping_country: shippingInfo.country,
            phone: shippingInfo.phone
          })
          .eq('id', user.id)

        if (error) {
          console.error('Error saving shipping info:', error)
          toast.error('Failed to save shipping information')
        } else {
          toast.success('Shipping information saved for future orders')
        }
      }

      setCurrentStep(3) // Move to payment step
    } catch (error) {
      console.error('Error in shipping submit:', error)
      toast.error('An error occurred while processing your information')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    // Allow both logged-in and guest users to place orders

    setIsLoading(true)

    try {
      // Create the order first
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingInfo,
          subtotal: totalPrice,
          taxAmount,
          shippingAmount: shippingCost,
          totalAmount: finalTotal,
          discountAmount: totalSavings
        })
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.details 
          ? `${result.error}: ${result.details}`
          : result.error || 'Failed to create order'
        throw new Error(errorMessage)
      }

      // Order created successfully, now initialize Payfast payment
      const paymentResponse = await fetch('/api/payments/payfast/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: result.order.id,
          amount: finalTotal,
          description: `Order #${result.order.order_number}`,
          email: shippingInfo.email,
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName
        })
      })

      const paymentResult = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Failed to initialize payment')
      }

      // Track purchase attempt
      analytics.trackPageView('payment_initiated')
      
      // Clear the cart before redirecting to payment
      await clearCart()
      
      // Create and submit the payment form
      submitPayfastForm(paymentResult.paymentUrl, paymentResult.paymentData)
      
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const submitPayfastForm = (paymentUrl: string, paymentData: Record<string, any>) => {
    // Create a form and submit it to Payfast
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = paymentUrl
    form.style.display = 'none'

    console.log('Submitting to Payfast with data:', paymentData)

    // Add all payment data as hidden inputs - CRITICAL: Send exact same data used for signature
    Object.keys(paymentData).forEach(key => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = paymentData[key].toString() // Ensure string conversion matches signature generation
      form.appendChild(input)
    })

    // Add form to document and submit
    document.body.appendChild(form)
    form.submit()
  }

  const calculateShipping = () => {
    // Simple shipping calculation - free over R75
    return totalPrice >= 75 ? 0 : 10
  }

  const calculateTax = () => {
    // Simple tax calculation - 8.5%
    return totalPrice * 0.085
  }

  const shippingCost = calculateShipping()
  const taxAmount = calculateTax()
  const finalTotal = totalPrice + shippingCost + taxAmount

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart to checkout</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {CHECKOUT_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < CHECKOUT_STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 mx-4" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartErrors.length > 0 && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <h4 className="font-medium text-red-800 mb-2">Cart Issues:</h4>
                      <ul className="text-sm text-red-700">
                        {cartErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-md">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ShoppingCart className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.variant && (
                            <p className="text-sm text-gray-600">
                              {Object.entries(item.variant.options)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <EnchantedButton
                      onClick={() => setCurrentStep(2)}
                      disabled={cartErrors.length > 0}
                    >
                      Continue to Shipping
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </EnchantedButton>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address1">Address *</Label>
                      <Input
                        id="address1"
                        required
                        value={shippingInfo.address1}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, address1: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address2">Apartment, suite, etc.</Label>
                      <Input
                        id="address2"
                        value={shippingInfo.address2}
                        onChange={(e) => setShippingInfo(prev => ({ ...prev, address2: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Province/State *</Label>
                        <Input
                          id="state"
                          required
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        />
                      </div>
                    </div>

                    {user && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveShippingInfo"
                          checked={saveShippingInfo}
                          onCheckedChange={(checked) => setSaveShippingInfo(!!checked)}
                        />
                        <Label htmlFor="saveShippingInfo" className="text-sm text-gray-600">
                          Save shipping information for future orders
                        </Label>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Cart
                      </Button>
                      <EnchantedButton type="submit" disabled={isLoading}>
                        Continue to Payment
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </EnchantedButton>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                          <span>{formatPrice(totalPrice)}</span>
                        </div>
                        {totalSavings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>You save</span>
                            <span>-{formatPrice(totalSavings)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>
                            {shippingCost === 0 ? (
                              <Badge variant="secondary" className="text-xs">FREE</Badge>
                            ) : (
                              formatPrice(shippingCost)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{formatPrice(taxAmount)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatPrice(finalTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information Review */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Shipping Information</h4>
                      <div className="text-sm space-y-1">
                        <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p>{shippingInfo.email}</p>
                        {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                        <p>{shippingInfo.address1}</p>
                        {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
                        <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                      </div>
                    </div>

                    {/* Guest Checkout Notice */}
                    {!user && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">Guest Checkout</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          You're checking out as a guest. You can still place your order and track it using your email address.
                        </p>
                        <div className="text-sm text-blue-600">
                          <p>• Order confirmation will be sent to: <strong>{shippingInfo.email}</strong></p>
                          <p>• You can track your order using your email address</p>
                          <p>• Create an account later to save your information for future orders</p>
                        </div>
                      </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Payment Method</h4>
                      <div className="grid gap-3">
                        <div className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                          <input
                            type="radio"
                            id="payfast"
                            name="paymentMethod"
                            value="payfast"
                            defaultChecked
                            className="h-4 w-4 text-blue-600"
                          />
                          <label htmlFor="payfast" className="flex items-center space-x-2">
                            <CreditCard className="h-5 w-5 text-gray-600" />
                            <span>Payfast (Credit Card, EFT, QR Code)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Shipping
                      </Button>
                      <EnchantedButton
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating Order...
                          </>
                        ) : (
                          <>
                            Pay {formatPrice(finalTotal)}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </EnchantedButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Order Confirmation */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-green-800">Order Placed Successfully!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you for your order. We'll send you a confirmation email shortly.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                      <h4 className="font-medium mb-2">What's Next?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• You'll receive an order confirmation email</li>
                        <li>• We'll process your payment through Payfast</li>
                        <li>• Once payment is confirmed, we'll prepare your order</li>
                        <li>• You'll receive shipping updates via email</li>
                      </ul>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Link href="/">
                        <Button>
                          Continue Shopping
                        </Button>
                      </Link>
                      {user ? (
                        <Link href="/account/orders">
                          <Button variant="outline">
                            View My Orders
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/auth?redirect=/account/orders">
                          <Button variant="outline">
                            Create Account
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You save</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <Badge variant="secondary" className="text-xs">FREE</Badge>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                {totalPrice >= 75 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}

                <div className="text-xs text-gray-600">
                  <p>• Secure checkout with SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense wrapper
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutWithSearchParams />
    </Suspense>
  )
} 