// feature/login/withdrawbutton.tsx
'use client'

import { withdrawUser } from '@/feature/login/withdraw'
import { signOut } from 'next-auth/react'

export default function WithdrawButton() {
  const handleWithdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) {
      return
    }

    try {
      await withdrawUser()
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      alert('탈퇴 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <button
      onClick={handleWithdraw}
      className="w-full py-2 text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
    >
      회원탈퇴
    </button>
  )
}