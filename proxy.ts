import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const authRequiredPaths = ['/loginpage/additionalinfo']
const protectedPaths = ['/adminpage', '/mypage', '/partypage']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const requiresAuth = authRequiredPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )
  const isProtectedPath = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!requiresAuth && !isProtectedPath) {
    return NextResponse.next()
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL('/loginpage', req.nextUrl.origin))
  }

  if (isProtectedPath && !session.user.isProfileComplete) {
    return NextResponse.redirect(
      new URL('/loginpage/additionalinfo', req.nextUrl.origin)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
