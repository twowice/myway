// lib/auth.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false

      try {
        // email로 Supabase에서 기존 사용자 찾기
        const { data: existingUser, error: findError } = await supabase
          .from('users')
          .select('id, is_profile_complete, name, image_url, role')
          .eq('email', user.email)
          .maybeSingle()

        if (findError && findError.code !== 'PGRST116') {
          console.error('Error finding user:', findError)
          return false
        }

        if (existingUser) {
          // 기존 사용자 - Supabase UUID를 NextAuth에 적용
          user.id = existingUser.id
          user.name = existingUser.name || user.name
          user.image = existingUser.image_url || user.image
        } else {
          // 신규 사용자 - Supabase에 생성
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              email: user.email,
              name: user.name || user.email?.split('@')[0],
              image_url: user.image,
              provider: account.provider,
              is_profile_complete: false,  // 추가 정보 입력 필요
              role: 'user',  // 기본값은 user
            })
            .select('id')
            .single()

          if (insertError || !newUser) {
            console.error('User creation error:', insertError)
            return false
          }

          // 새로 생성된 UUID를 NextAuth에 적용
          user.id = newUser.id
        }

        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    
    async jwt({ token, user, trigger, session }) {
      // 최초 로그인 시 - user 객체에 Supabase UUID가 들어있음
      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, name, email, image_url, is_profile_complete, role')
          .eq('id', user.id)  // UUID로 조회
          .single()

        if (dbUser) {
          token.id = dbUser.id
          token.name = dbUser.name
          token.email = dbUser.email
          token.picture = dbUser.image_url
          token.isProfileComplete = dbUser.is_profile_complete
          token.role = dbUser.role  // role 추가
        }
      }

      // session update 시 (추가 정보 입력 완료 후)
      if (trigger === 'update' && session) {
        token.isProfileComplete =
          session.isProfileComplete ?? token.isProfileComplete
        const nextName = session.user?.name ?? session.name
        const nextEmail = session.user?.email ?? session.email
        const nextImage = session.user?.image ?? session.image

        if (nextName) token.name = nextName
        if (nextEmail) token.email = nextEmail
        if (nextImage) token.picture = nextImage
      }

      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
        session.user.isProfileComplete = token.isProfileComplete as boolean
        session.user.role = token.role as string  // role 추가
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
