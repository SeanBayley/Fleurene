import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { action, email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'signup':
        // Test signup with email confirmation
        result = await supabaseServer.auth.signUp({
          email,
          password: 'test-password-123',
          options: {
            data: {
              first_name: 'Test',
              last_name: 'User'
            }
          }
        })
        break

      case 'reset-password':
        // Test password reset email
        result = await supabaseServer.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
        })
        break

      case 'magic-link':
        // Test magic link email
        result = await supabaseServer.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
          }
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: signup, reset-password, or magic-link' },
          { status: 400 }
        )
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${action} email sent successfully to ${email}`,
      data: result.data
    })

  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email testing endpoint',
    availableActions: ['signup', 'reset-password', 'magic-link'],
    usage: 'POST with { action: "signup|reset-password|magic-link", email: "user@example.com" }'
  })
} 