// loginpage/additionalinfo/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LoadingBounce } from '@/components/status/LoadingBounce'

export default function AdditionalInfoPage() {
  // 휴대전화 포맷 변경
  const onlyNumbers = (value: string) => value.replace(/\D/g, '')
  const formatPhoneNumber = (value: string) => {
    const numbers = onlyNumbers(value).slice(0, 11)

    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    }

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
  }


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
  const [hasEmailFromProvider, setHasEmailFromProvider] = useState(false)

  // 소셜 로그인 정보를 기본값으로 설정
  useEffect(() => {
    if (session?.user) {
      const email = session.user.email || ''

      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        email: email,
      }))

      setHasEmailFromProvider(!!email)
    }
  }, [session])

  // 권한 체크 및 리다이렉트
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
          userId: session?.user.id,  // UUID 전달
          name: formData.name,
          email: formData.email,
          gender: formData.gender,
          phone: formData.phone,
          birthDate: formData.birthDate,
        }),
      })

      const responseData = await response.json()

      if (response.ok) {
        // 세션 업데이트
        await update({
          isProfileComplete: true,
          name: formData.name,
          email: formData.email,
        })

        // 메인 페이지로 이동
        window.location.href = '/'
      } else {
        console.error('서버 에러:', responseData)
        alert(`정보 저장에 실패했습니다: ${responseData.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return <LoadingBounce />
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#090f1f]">
      <div className="pointer-events-none absolute inset-0">
        <span className="firework firework-1" />
        <span className="firework firework-2" />
        <span className="firework firework-3" />
        <span className="firework firework-4" />
        <span className="firework firework-5" />
      </div>

      <div className="relative z-10 max-w-md w-full mx-4 p-6 bg-white/90 backdrop-blur-md rounded-lg shadow"
      >

        <h1 className="text-2xl font-bold mb-4">추가 정보 입력</h1>
        <p className="text-gray-600 mb-6">서비스 이용을 위해 추가 정보가 필요합니다.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium mb-1">이름 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              className={`w-full p-2 border rounded ${hasEmailFromProvider
                  ? 'bg-gray-100 cursor-not-allowed'
                  : ''
                }`}
              disabled={hasEmailFromProvider}
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
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
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
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? (
              <span
                aria-label="처리 중"
                className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
              />
            ) : (
              '완료'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .firework {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          opacity: 0;
          animation: firework-burst 2.8s ease-out infinite;
        }

        .firework-1 {
          left: 18%;
          top: 22%;
          background: #60a5fa;
          box-shadow:
            0 -48px #60a5fa,
            34px -34px #facc15,
            48px 0 #f472b6,
            34px 34px #34d399,
            0 48px #a78bfa,
            -34px 34px #fb7185,
            -48px 0 #38bdf8,
            -34px -34px #f97316;
        }

        .firework-2 {
          left: 78%;
          top: 18%;
          background: #f472b6;
          animation-delay: 0.45s;
          box-shadow:
            0 -42px #f472b6,
            30px -30px #93c5fd,
            42px 0 #fde047,
            30px 30px #4ade80,
            0 42px #c084fc,
            -30px 30px #fb923c,
            -42px 0 #22d3ee,
            -30px -30px #fda4af;
        }

        .firework-3 {
          left: 66%;
          top: 70%;
          background: #34d399;
          animation-delay: 0.9s;
          box-shadow:
            0 -52px #34d399,
            37px -37px #f9a8d4,
            52px 0 #60a5fa,
            37px 37px #facc15,
            0 52px #fb7185,
            -37px 37px #a78bfa,
            -52px 0 #2dd4bf,
            -37px -37px #fdba74;
        }

        .firework-4 {
          left: 30%;
          top: 76%;
          background: #facc15;
          animation-delay: 1.35s;
          box-shadow:
            0 -40px #facc15,
            28px -28px #38bdf8,
            40px 0 #fb7185,
            28px 28px #86efac,
            0 40px #c084fc,
            -28px 28px #f97316,
            -40px 0 #93c5fd,
            -28px -28px #f0abfc;
        }

        .firework-5 {
          left: 50%;
          top: 34%;
          background: #a78bfa;
          animation-delay: 1.8s;
          box-shadow:
            0 -46px #a78bfa,
            33px -33px #fda4af,
            46px 0 #22d3ee,
            33px 33px #fde047,
            0 46px #4ade80,
            -33px 33px #fb923c,
            -46px 0 #60a5fa,
            -33px -33px #f472b6;
        }

        @keyframes firework-burst {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          52% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}