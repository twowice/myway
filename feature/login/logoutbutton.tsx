'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/loginpage' })
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      로그아웃
    </button>
  )
}