// lib/auth.ts - 새 버전 (Supabase Auth + NextAuth 통합)
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // anon key 사용
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })

        if (error || !data.user) return null

        // public.users에서 프로필 정보 가져오기
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('name, image_url, is_profile_complete')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') return null  // no row

        return {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.email?.split('@')[0],
          image: profile?.image_url,
          isProfileComplete: profile?.is_profile_complete ?? false,
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'credentials') {
        // 소셜 로그인
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        if (!existing && user.email) {
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            image_url: user.image,
            provider: account?.provider,
            is_profile_complete: false,
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isProfileComplete = user.isProfileComplete ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isProfileComplete = token.isProfileComplete as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/loginpage',
  },
  session: {
    strategy: "jwt",
  },
})