'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('한국어')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.')
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'kakao' | 'naver') => {
    await signIn(provider, { callbackUrl: '/loginpage/callback' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-6">
        {/* 로고 - 크기 증가 */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-1">
            <svg width="60" height="40" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.29102 0C2.49429 0 2.68666 0.0629354 2.84766 0.170898L3.47754 3.09766L3.5625 3.49316H4.20703L5.57812 7.47656C5.8839 8.36482 7.13541 8.37973 7.46191 7.49902L7.72559 6.78711C7.80753 6.56588 7.80847 6.32253 7.72852 6.10059L6.78809 3.49316H13.042L12.0889 6.09277C12.006 6.3189 12.0081 6.56788 12.0938 6.79297L12.377 7.53906C12.7101 8.41329 13.9545 8.39174 14.2578 7.50684L16.5967 0.675781C16.7352 0.271872 17.115 0.000352107 17.542 0H18.8486C19.5525 0 20.0361 0.707597 19.7803 1.36328L15.168 13.1865C15.0181 13.5701 14.6482 13.8223 14.2363 13.8223H12.8232C12.419 13.8219 12.054 13.5787 11.8994 13.2051L10.8438 10.6543C10.5024 9.82946 9.33385 9.83122 8.99512 10.6572L7.95117 13.2021C7.79723 13.5773 7.43186 13.8221 7.02637 13.8223H5.59668C5.18445 13.822 4.81442 13.5688 4.66504 13.1846L0.0683594 1.3623C-0.186132 0.707032 0.298056 0.00034257 1.00098 0H2.29102ZM8.62109 7.7168C8.30983 7.71719 8.05673 8.27979 8.05664 8.97363C8.05664 9.66764 8.30977 10.2301 8.62109 10.2305C8.93229 10.2298 9.18457 9.66745 9.18457 8.97363C9.18448 8.27998 8.93224 7.71751 8.62109 7.7168ZM11.2363 7.7168C10.9251 7.71734 10.6719 8.27982 10.6719 8.97363C10.6719 9.66755 10.9251 10.2299 11.2363 10.2305C11.5476 10.2299 11.7998 9.66753 11.7998 8.97363C11.7998 8.27984 11.5475 7.71738 11.2363 7.7168Z" fill="#0077D4"/>
              <path d="M3.49609 12.3945L3.23926 13.1416C3.10036 13.5448 2.7194 13.8161 2.29297 13.8164H1.00293C0.30008 13.816 -0.184127 13.1093 0.0703125 12.4541L1.79785 8.00781L3.49609 12.3945ZM19.7822 12.4531C20.0377 13.1085 19.5539 13.8159 18.8506 13.8164H17.5439C17.1171 13.816 16.7372 13.5444 16.5986 13.1406L16.3457 12.4023L18.0469 8.00586L19.7822 12.4531ZM3.5625 3.48535H9.21289C9.5968 3.87526 10.2467 3.87542 10.6309 3.48535H16.2842L17.5088 6.62598L15.8428 10.9326L14.2598 6.30957C13.9565 5.4249 12.7133 5.40373 12.3799 6.27734L12.0957 7.02344C12.0101 7.2485 12.008 7.49753 12.0908 7.72363L13.8252 12.4531C14.0638 13.1052 13.581 13.7961 12.8867 13.7969H12.085C11.6524 13.7966 11.268 13.5177 11.1338 13.1064L10.8691 12.2939C10.5691 11.3742 9.26795 11.3743 8.96777 12.2939L8.70215 13.1064C8.56805 13.5175 8.18428 13.7964 7.75195 13.7969H6.96094C6.26876 13.7963 5.78598 13.1093 6.02051 12.458L7.73047 7.71582C7.8103 7.49403 7.80935 7.25037 7.72754 7.0293L7.46387 6.31738C7.13737 5.4368 5.886 5.45185 5.58008 6.33984L4 10.9287L2.33496 6.62695L3.56055 3.47656L3.5625 3.48535Z" fill="#0077D4"/>
            </svg>
            <h2 className="text-5xl font-bold text-primary">Myway</h2>
          </div>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">아이디</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="아이디를 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="비밀번호를 입력해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* 회원가입 링크 */}
          <div className="text-right">
            <a
              href="/signup"
              className="text-sm text-foreground/70 hover:underline"
            >
              회원가입
            </a>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 disabled:bg-gray-400 transition-colors"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-3">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Google로 시작하기</span>
          </button>

          {/* Kakao */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md bg-[#FEE500] hover:bg-[#FDD835] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#000000"
                d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.6 2.1-.7 2.5-.1.5.2.5.4.4.3-.1 2.4-1.6 3.1-2.1.5.1 1 .1 1.5.1 5.5 0 10-3.6 10-8S17.5 3 12 3z"
              />
            </svg>
            <span className="text-gray-900 font-medium">Kakao로 시작하기</span>
          </button>

          {/* Naver */}
          <button
            onClick={() => handleSocialLogin('naver')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md bg-[#03C75A] hover:bg-[#02B350] transition-colors"
          >
            <span className="text-white font-bold text-xl">N</span>
            <span className="text-white font-medium">Naver로 시작하기</span>
          </button>
        </div>

        {/* 하단 푸터 */}
        <div className="mt-12 text-center text-xs text-gray-500 space-x-3">
          <a href="#" className="hover:underline">Myway</a>
          <a href="#" className="hover:underline">소개</a>
          <a href="#" className="hover:underline">블로그</a>
          <a href="#" className="hover:underline">채용 정보</a>
          <a href="#" className="hover:underline">도움말</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">개인정보처리방침</a>
        </div>
        
        {/* 언어 선택 드롭다운 */}
        <div className="mt-2 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border-none bg-transparent text-gray-500 text-xs cursor-pointer focus:outline-none"
          >
            <option value="한국어">한국어</option>
            <option value="English">English</option>
          </select>
          <span>© 2025 Myway from Twowice</span>
        </div>
      </div>
    </div>
  )
}