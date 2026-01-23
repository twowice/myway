// types/next-auth.d.ts
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
      id: string
      email: string
      name: string
      image?: string
      isProfileComplete: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    isProfileComplete?: boolean
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isProfileComplete: boolean
    role: string
  }
}