import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Create user account
    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Registration failed' },
        { status: 400 }
      )
    }

    // Create user profile (this should be handled by the trigger, but let's ensure it exists)
    const { error: profileError } = await supabaseServer
      .from('user_profiles')
      .upsert({
        id: data.user.id,
        email: data.user.email!,
        first_name: first_name || null,
        last_name: last_name || null,
        role: 'customer' // Default role
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        role: 'customer',
        first_name: first_name || null,
        last_name: last_name || null
      },
      message: 'Registration successful. Please check your email to verify your account.'
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 