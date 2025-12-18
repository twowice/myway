'use server'

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function signUp(formData: SignUpFormData) {
  try {
    console.log('=== 회원가입 시작 ===')

    // ✅ 1. Zod 유효성 검사
    const validationResult = signUpSchema.safeParse(formData)
    
    if (!validationResult.success) {
      // ✅ 수정: errors → issues
      const errors = validationResult.error.issues.map((issue) => issue.message).join(', ')
      return { 
        success: false, 
        error: errors 
      }
    }

    const validData = validationResult.data

    // ✅ 2. 이메일 중복 체크
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', validData.email)
      .single()

    if (existingUser) {
      return { 
        success: false, 
        error: '이미 존재하는 이메일입니다.' 
      }
    }

    // ✅ 3. 전화번호 중복 체크 (선택사항)
    const { data: existingPhone } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', validData.phone.replace(/-/g, '')) // 하이픈 제거 후 비교
      .single()

    if (existingPhone) {
      return { 
        success: false, 
        error: '이미 등록된 전화번호입니다.' 
      }
    }

    // ✅ 4. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(validData.password, 10)

    // ✅ 5. 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name: validData.name,
        email: validData.email,
        password: hashedPassword,
        phone: validData.phone.replace(/-/g, ''), // 하이픈 제거 후 저장
        gender: validData.gender,
        birth_date: validData.birthDate,
        provider: 'email',
        is_profile_complete: true,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ 회원가입 실패:', error)
      return { 
        success: false, 
        error: '회원가입에 실패했습니다.' 
      }
    }

    console.log('✅ 회원가입 성공:', newUser)
    return { 
      success: true, 
      message: '회원가입이 완료되었습니다!' 
    }
  } catch (error) {
    console.error('❌ 예외 발생:', error)
    return { 
      success: false, 
      error: '회원가입 중 오류가 발생했습니다.' 
    }
  }
}