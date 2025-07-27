import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client-side Supabase client - ONLY for authentication
// All data operations should go through API routes
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

// Types for our application
export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export interface QuizResult {
  id: string
  user_id: string
  primary_archetype: string
  archetype_breakdown: Record<string, number>
  question_count: number
  answers: Record<string, any>
  completed_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  favorite_collections: string[]
  style_preferences: Record<string, any>
  newsletter_subscribed: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  subcategory: string | null
  status: 'active' | 'inactive' | 'draft'
  stock_quantity: number
  images: string[]
  created_at: string
  updated_at: string
}

// API Helper Functions
export class ApiClient {
  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('supabase.auth.token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Authentication
  static async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return response.json()
  }

  static async register(email: string, password: string, first_name?: string, last_name?: string) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, first_name, last_name })
    })
    return response.json()
  }

  // Products (Public)
  static async getProducts(params?: { category?: string; search?: string; limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const response = await fetch(`/api/products?${searchParams}`)
    return response.json()
  }

  // Admin Products
  static async getAdminProducts() {
    const response = await fetch('/api/admin/products', {
      headers: this.getAuthHeaders()
    })
    return response.json()
  }

  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify(productData)
    })
    return response.json()
  }
}
