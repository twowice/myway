'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AdditionalInfoPage() {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    phone: '',
    birthDate: '',
  })
  const [loading, setLoading] = useState(false)
  const [hasEmailFromProvider, setHasEmailFromProvider] = useState(false) // ✅ 추가

  // 소셜 로그인 정보를 기본값으로 설정
  useEffect(() => {
    if (session?.user) {
      const email = session.user.email || ''
      
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: email,
      }))
      
      // ✅ 소셜 로그인에서 이메일을 받아왔는지 확인
      setHasEmailFromProvider(!!email)
    }
  }, [session])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/loginpage')
    }
    if (status === 'authenticated' && session?.user.isProfileComplete) {
      router.push('/')
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/user/updateprofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user.id,
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          phone: formData.phone,
          birthDate: formData.birthDate,
        }),
      })

      if (response.ok) {
        await update({ 
          isProfileComplete: true,
          name: formData.name,
          email: formData.email,
        })
        
        window.location.href = '/'
      } else {
        const errorData = await response.json()
        console.error('서버 에러:', errorData)
        alert('정보 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-4 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">추가 정보 입력</h1>
        <p className="text-gray-600 mb-6">서비스 이용을 위해 추가 정보가 필요합니다.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-1">이름 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="홍길동"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              이메일 *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="example@email.com"
              className={`w-full p-2 border rounded ${
                hasEmailFromProvider 
                  ? 'bg-gray-100 cursor-not-allowed' 
                  : ''
              }`}
              disabled={hasEmailFromProvider} // ✅ 이메일 있으면 수정 불가
              required
            />
            {hasEmailFromProvider && (
              <p className="text-xs text-gray-500 mt-1">
                소셜 로그인으로 인증된 이메일은 수정할 수 없습니다.
              </p>
            )}
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-medium mb-1">성별 *</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-medium mb-1">전화번호 *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="010-1234-5678"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-medium mb-1">생년월일 *</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '처리 중...' : '완료'}
          </button>
        </form>
      </div>
    </div>
  )
}