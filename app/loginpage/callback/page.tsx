'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallback() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('현재 세션:', session)
      console.log('사용자 role:', session.user.role)
      
      // role이 admin인 경우 adminpage로 이동
      if (session.user.role === 'admin') {
        router.push('/adminpage')
      }
      // 프로필이 완성되지 않은 경우 추가 정보 입력 페이지로 이동
      else if (!session.user.isProfileComplete) {
        router.push('/loginpage/additionalinfo')
      }
      // 일반 사용자는 홈으로 이동
      else {
        router.push('/')
      }
    }
  }, [session, status, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">로그인 처리 중...</p>
      </div>
    </div>
  )
}