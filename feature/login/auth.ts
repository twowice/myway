// feature/login/auth.ts - 새 버전
'use server'

import { createClient } from '@supabase/supabase-js'
import { signUpSchema } from '@/lib/validations/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signUp(formData: any) {
  const validation = signUpSchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: validation.error.issues.map(i => i.message).join(', ') }
  }

  const { data: validData } = validation

  // 이메일 중복 체크 (Supabase Auth에서 자동 처리되지만 안전하게)
  const { data: existing } = await supabase
    .from('users')
    .select('email')
    .eq('email', validData.email)
    .maybeSingle()

  if (existing) {
    return { success: false, error: '이미 존재하는 이메일입니다.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email: validData.email,
    password: validData.password,
    options: {
      data: {
        name: validData.name,
        phone: validData.phone.replace(/-/g, ''),
        gender: validData.gender,
        birth_date: validData.birthDate,
        provider: 'email',
      }
    }
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // 트리거가 public.users 생성 + meta_data로 일부 값 채워줌
  // 모든 정보 입력됐으니 프로필 완성으로 업데이트
  if (data.user) {
    await supabase
      .from('users')
      .update({ is_profile_complete: true })
      .eq('id', data.user.id)
  }

  return { success: true, message: '회원가입 성공! 이메일 확인 후 로그인해주세요.' }
}