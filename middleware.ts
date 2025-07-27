import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporarily disable middleware - let admin pages handle auth
  // This allows the React auth context to properly manage authentication
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 