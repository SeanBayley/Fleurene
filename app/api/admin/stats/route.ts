import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No auth token' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Create a client-side Supabase client to verify the user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin using server client
    const { data: profile, error: profileError } = await supabaseServer
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Fetch all user profiles using server client (bypasses RLS)
    const { data: profiles, error: profilesError } = await supabaseServer
      .from('user_profiles')
      .select('id, email, first_name, last_name, role, created_at')
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    // Fetch quiz results using server client
    const { data: quizResults, error: quizError } = await supabaseServer
      .from('quiz_results')
      .select('id')

    if (quizError) {
      console.error('Error fetching quiz results:', quizError)
      // Don't fail the whole request if quiz results fail
    }

    // Fetch orders count using server client
    const { data: orders, error: ordersError } = await supabaseServer
      .from('orders')
      .select('id')

    if (ordersError) {
      console.error('Error fetching orders:', ordersError)
      // Don't fail the whole request if orders fail
    }

    // Calculate stats
    const totalProfiles = profiles?.length || 0
    const adminUsers = profiles?.filter(p => p.role === 'admin').length || 0
    const recentSignups = profiles?.filter(p => {
      const createdAt = new Date(p.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return createdAt > weekAgo
    }).length || 0

    // Get recent users (last 5)
    const recentUsers = profiles?.slice(0, 5).map(p => ({
      id: p.id,
      email: p.email,
      first_name: p.first_name,
      last_name: p.last_name,
      role: p.role,
      created_at: p.created_at
    })) || []

    const stats = {
      totalUsers: totalProfiles,
      totalProfiles,
      totalQuizResults: quizResults?.length || 0,
      recentSignups,
      adminUsers,
      totalOrders: orders?.length || 0
    }

    return NextResponse.json({
      stats,
      recentUsers,
      success: true
    })

  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 