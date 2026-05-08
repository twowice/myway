// lib/auth.ts
import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import { createClient } from '@supabase/supabase-js'
import { decryptText } from '@/lib/crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.providerAccountId) return false

      try {
        const providerKey = `${account.provider}:${account.providerAccountId}`

        const { data: existingUser, error: findError } = await supabase
          .from('users')
          .select('id, is_profile_complete, name, image_url, role')
          .eq('provider', providerKey)
          .maybeSingle()

        if (findError && findError.code !== 'PGRST116') {
          console.error('Error finding user:', findError)
          return false
        }

        if (existingUser) {
          user.id = existingUser.id
          user.name = decryptText(existingUser.name) || user.name
          user.image = existingUser.image_url || user.image
          return true
        }

        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            email: user.email ?? null,
            name: user.name || user.email?.split('@')[0] || null,
            image_url: user.image ?? null,
            provider: providerKey,
            is_profile_complete: false,
            role: 'user',
          })
          .select('id')
          .single()

        if (insertError || !newUser) {
          console.error('User creation error:', insertError)
          return false
        }

        user.id = newUser.id
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, name, email, image_url, is_profile_complete, role')
          .eq('id', user.id)
          .single()

        if (dbUser) {
          token.id = dbUser.id
          token.name = decryptText(dbUser.name)
          token.email = decryptText(dbUser.email)
          token.picture = dbUser.image_url
          token.isProfileComplete = dbUser.is_profile_complete
          token.role = dbUser.role
        }
      }

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
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/loginpage',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24시간
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24시간
  },
})
