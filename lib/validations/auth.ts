import { z } from 'zod'

// 전화번호 정규표현식 (010-1234-5678 또는 01012345678)
const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/

// 비밀번호 정규표현식 (최소 8자, 영문+숫자+특수문자)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다.')
    .max(20, '이름은 최대 20자까지 가능합니다.'),
  
  email: z
    .string()
    .email('올바른 이메일 형식이 아닙니다.')
    .toLowerCase(),
  
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .regex(
      passwordRegex,
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
    ),
  
  passwordConfirm: z
    .string(),
  
  phone: z
    .string()
    .regex(phoneRegex, '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'),
  
  // ✅ 방법 1: string + refine으로 변경
  gender: z
    .string()
    .refine((val) => ['male', 'female'].includes(val), {
      message: '성별을 선택해주세요.',
    }),
  
  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 14 && age <= 120
    }, '만 14세 이상만 가입 가능합니다.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
})

export type SignUpFormData = z.infer<typeof signUpSchema>