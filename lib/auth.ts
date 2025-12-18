// lib/auth.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import NaverProvider from "next-auth/providers/naver"
import KakaoProvider from "next-auth/providers/kakao"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .eq('provider', 'email')
          .single()

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image_url || user.profile_image,
          isProfileComplete: user.is_profile_complete ?? false,
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('=== SignIn Callback 시작 ===')
      console.log('User:', user)
      console.log('Account:', account)
      console.log('Provider:', account?.provider)
      
      if (!account) {
        console.log('Account가 없음, true 반환')
        return true
      }

      if (account.provider !== 'credentials') {
        console.log('소셜 로그인 처리 시작')
        
        try {
          const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          console.log('기존 사용자 조회:', existingUser)
          console.log('조회 에러:', selectError)

          if (!existingUser) {
            console.log('신규 사용자 생성 시도')
            
            const insertData = {
              email: user.email,
              name: user.name,
              image_url: user.image,
              provider: account.provider,
              is_profile_complete: false,
            }
            
            console.log('Insert 데이터:', insertData)
            
            const { data: newUser, error } = await supabase
              .from('users')
              .insert(insertData)
              .select()
              .single()

            console.log('생성된 사용자:', newUser)
            console.log('생성 에러:', error)

            if (error) {
              console.error('❌ 사용자 생성 실패:', error)
              return false
            }
            
            if (newUser) {
              user.id = newUser.id  // ✅ 중요: 새로 생성된 user의 id 설정
              user.isProfileComplete = false
              console.log('✅ 사용자 생성 성공, ID:', newUser.id)
            }
          } else {
            console.log('✅ 기존 사용자 로그인')
            user.id = existingUser.id  // ✅ 중요: 기존 user의 id 설정
            user.isProfileComplete = existingUser.is_profile_complete ?? false
            console.log('기존 사용자 ID:', existingUser.id)
          }
        } catch (error) {
          console.error('❌ SignIn Callback 예외 발생:', error)
          return false
        }
      }

      console.log('=== SignIn Callback 성공, Final User ID:', user.id, '===')
      return true
    },
    async jwt({ token, user, trigger, session }) {
      console.log('=== JWT Callback 시작 ===')
      console.log('Token:', token)
      console.log('User:', user)
      
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.isProfileComplete = user.isProfileComplete ?? false
        console.log('✅ JWT에 사용자 정보 저장, ID:', user.id)
      }
      
      if (trigger === 'update' && session) {
        // ✅ 세션 업데이트 시 모든 정보 반영
        if (session.isProfileComplete !== undefined) {
          token.isProfileComplete = session.isProfileComplete
        }
        if (session.name) {
          token.name = session.name
        }
        if (session.email) {
          token.email = session.email
        }
        console.log('✅ JWT 업데이트:', session)
      }
      
      console.log('=== JWT Callback 완료, Token ID:', token.id, '===')
      return token
    },
    async session({ session, token }) {
      console.log('=== Session Callback 시작 ===')
      console.log('Token:', token)
      
      if (session.user) {
        // ✅ token의 정보를 session에 복사
        session.user.id = token.id as string  // token.sub 대신 token.id 사용
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.isProfileComplete = token.isProfileComplete as boolean ?? false
        
        console.log('✅ Session에 사용자 정보 설정, ID:', session.user.id)
      }
      
      console.log('=== Session Callback 완료 ===')
      return session
    }
  },
  pages: {
    signIn: '/loginpage',
  },
  session: {
    strategy: 'jwt',
  },
  debug: true,
})