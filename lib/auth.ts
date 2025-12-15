import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Naver from "next-auth/providers/naver"
import Kakao from "next-auth/providers/kakao"

// 관리자 이메일 리스트
const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/loginpage',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // 관리자 체크
        const isAdmin = adminEmails.includes(user.email || '');
        
        return {
          ...token,
          accessToken: account.access_token,
          provider: account.provider,
          role: isAdmin ? 'admin' : 'user', // 역할 추가
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          provider: token.provider as string,
          role: token.role as string, // 세션에 역할 추가
        },
        accessToken: token.accessToken as string,
      }
    },
  },
})