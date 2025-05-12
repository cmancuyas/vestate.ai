import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/signup']

export function middleware(request: NextRequest) {
  const isPublic = PUBLIC_ROUTES.includes(request.nextUrl.pathname)
  const token = request.cookies.get('sb-access-token')?.value

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile',
    '/settings',
  ],
}