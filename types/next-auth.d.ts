// types/next-auth.d.ts
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      isProfileComplete: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    isProfileComplete?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isProfileComplete: boolean
  }
}