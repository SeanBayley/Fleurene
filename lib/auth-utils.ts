import { NextRequest } from 'next/server'
import { supabaseServer } from './supabase-server'

export interface AuthUser {
  id: string
  email: string
  role: 'customer' | 'admin'
  first_name?: string
  last_name?: string
}

/**
 * Verify user authentication from request headers
 */
export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the JWT token
    const { data: { user }, error } = await supabaseServer.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabaseServer
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      role: profile.role || 'customer',
      first_name: profile.first_name,
      last_name: profile.last_name
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return user
}

/**
 * Create API response for authentication errors
 */
export function createAuthErrorResponse(message: string, status: number = 401) {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
} 