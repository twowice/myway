// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isProfileComplete: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    isProfileComplete?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isProfileComplete?: boolean
  }
}