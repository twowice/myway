'use client'

import SocialLoginButton from './socialloginbutton'

export default function LoginForm() {
  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">로그인</h1>
        <p className="text-gray-600">소셜 계정으로 간편하게 로그인하세요</p>
      </div>

      <div className="space-y-3">
        <SocialLoginButton 
          provider="google" 
          label="Google로 계속하기" 
        />
        <SocialLoginButton 
          provider="kakao" 
          label="카카오로 계속하기" 
        />
        <SocialLoginButton 
          provider="naver" 
          label="네이버로 계속하기" 
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <div className="text-center">
        <a 
          href="/signup" 
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          이메일로 회원가입
        </a>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        <p>
          로그인 시{' '}
          <a href="/terms" className="underline hover:text-gray-700">
            이용약관
          </a>
          {' '}및{' '}
          <a href="/privacy" className="underline hover:text-gray-700">
            개인정보처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}