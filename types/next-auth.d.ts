import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      provider?: string
      role?: string  // 추가
    } & DefaultSession["user"]
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    provider?: string
    role?: string  // 추가
  }
}