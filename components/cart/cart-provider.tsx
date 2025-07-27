"use client"

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useAuth } from '@/components/auth-context'
import { supabase } from '@/lib/supabase'

// Types
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  comparePrice?: number
  quantity: number
  image?: string
  slug: string
  sku?: string
  maxQuantity?: number
  variant?: {
    id: string
    name: string
    options: Record<string, string> // e.g., { size: "M", color: "Blue" }
  }
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  totalSavings: number
  isOpen: boolean
  isLoading: boolean
}

export interface CartContextType extends CartState {
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  
  // UI Actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Validation
  validateCart: () => Promise<{ isValid: boolean; errors: string[] }>
}

// Cart Actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_OPEN'; payload: boolean }

// Cart Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
      
    case 'SET_ITEMS': {
      const items = action.payload
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const totalSavings = items.reduce((sum, item) => {
        if (item.comparePrice && item.comparePrice > item.price) {
          return sum + ((item.comparePrice - item.price) * item.quantity)
        }
        return sum
      }, 0)
      
      return {
        ...state,
        items,
        totalItems,
        totalPrice,
        totalSavings
      }
    }
    
    case 'ADD_ITEM': {
      const newItem = action.payload
      const existingItemIndex = state.items.findIndex(
        item => item.productId === newItem.productId && 
        item.variantId === newItem.variantId
      )
      
      let updatedItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.maxQuantity || 99) }
            : item
        )
      } else {
        // Add new item
        updatedItems = [...state.items, newItem]
      }
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const totalSavings = updatedItems.reduce((sum, item) => {
        if (item.comparePrice && item.comparePrice > item.price) {
          return sum + ((item.comparePrice - item.price) * item.quantity)
        }
        return sum
      }, 0)
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
        totalSavings
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const totalSavings = updatedItems.reduce((sum, item) => {
        if (item.comparePrice && item.comparePrice > item.price) {
          return sum + ((item.comparePrice - item.price) * item.quantity)
        }
        return sum
      }, 0)
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
        totalSavings
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, Math.min(action.payload.quantity, item.maxQuantity || 99)) }
          : item
      ).filter(item => item.quantity > 0) // Remove items with 0 quantity
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const totalSavings = updatedItems.reduce((sum, item) => {
        if (item.comparePrice && item.comparePrice > item.price) {
          return sum + ((item.comparePrice - item.price) * item.quantity)
        }
        return sum
      }, 0)
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
        totalSavings
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        totalSavings: 0
      }
      
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload }
      
    default:
      return state
  }
}

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalSavings: 0,
  isOpen: false,
  isLoading: false
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCartFromStorage()
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.items.length > 0) {
      saveCartToStorage()
    }
  }, [state.items])

  // Sync with database when user logs in
  useEffect(() => {
    if (user) {
      syncCartWithDatabase()
    }
  }, [user])

  // Storage functions
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('fj-cart', JSON.stringify(state.items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('fj-cart')
      if (savedCart) {
        const items = JSON.parse(savedCart) as CartItem[]
        dispatch({ type: 'SET_ITEMS', payload: items })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }

  const syncCartWithDatabase = async () => {
    if (!user) return

    try {
      // TODO: Implement database cart sync in Phase 5
      // For now, just keep localStorage cart
      console.log('Cart sync with database - coming in Phase 5')
    } catch (error) {
      console.error('Failed to sync cart with database:', error)
    }
  }

  // Actions
  const addItem = async (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Validate stock availability
      const isAvailable = await validateStock(item.productId, item.variantId, quantity)
      
      if (!isAvailable) {
        throw new Error('Product is out of stock')
      }

      const cartItem: CartItem = {
        ...item,
        id: `${item.productId}-${item.variantId || 'default'}`,
        quantity
      }

      dispatch({ type: 'ADD_ITEM', payload: cartItem })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeItem = async (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId })
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId)
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const item = state.items.find(item => item.id === itemId)
      if (item) {
        const isAvailable = await validateStock(item.productId, item.variantId, quantity)
        
        if (!isAvailable) {
          throw new Error('Requested quantity not available')
        }
      }

      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
    } catch (error) {
      console.error('Failed to update quantity:', error)
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem('fj-cart')
  }

  // UI Actions
  const openCart = () => dispatch({ type: 'SET_OPEN', payload: true })
  const closeCart = () => dispatch({ type: 'SET_OPEN', payload: false })
  const toggleCart = () => dispatch({ type: 'SET_OPEN', payload: !state.isOpen })

  // Validation
  const validateStock = async (productId: string, variantId?: string, quantity = 1): Promise<boolean> => {
    try {
      // Check product stock from database
      const { data: product, error } = await supabase
        .from('products')
        .select('stock_quantity, track_quantity, allow_backorder')
        .eq('id', productId)
        .single()

      if (error) {
        console.error('Stock validation error:', error)
        return false
      }

      if (!product) {
        console.error('Product not found:', productId)
        return false
      }

      // If not tracking quantity or allowing backorders, always allow
      if (!product.track_quantity || product.allow_backorder) {
        return true
      }

      // Check if we have enough stock
      const hasStock = product.stock_quantity >= quantity
      console.log('Stock validation:', { productId, quantity, available: product.stock_quantity, hasStock })
      
      return hasStock
    } catch (error) {
      console.error('Stock validation error:', error)
      return true // Allow on error to prevent blocking
    }
  }

  const validateCart = async (): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = []

    for (const item of state.items) {
      const isAvailable = await validateStock(item.productId, item.variantId, item.quantity)
      
      if (!isAvailable) {
        errors.push(`${item.name} is no longer available in the requested quantity`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const contextValue: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    validateCart
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

// Hook
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 