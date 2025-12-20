// feature/login/withdraw.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { auth } from '@/lib/auth'  // 당신의 NextAuth auth

// service_role 키로 관리자 권한 클라이언트
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // .env.local에 반드시 있어야 함
)

// 일반 클라이언트 (provider 확인용)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function withdrawUser() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('로그인이 필요합니다.')
  }

  const userId = session.user.id as string

  // public.users에서 provider 확인 (소셜인지 이메일인지)
  const { data: userProfile, error: fetchError } = await supabase
    .from('users')
    .select('provider')
    .eq('id', userId)
    .single()

  if (fetchError || !userProfile) {
    throw new Error('회원 정보를 찾을 수 없습니다.')
  }

  // 이메일 유저라면 Supabase Auth에서도 삭제 시도 (실패해도 무시)
  if (userProfile.provider === 'email') {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) {
      console.warn('Supabase Auth 삭제 실패 (소셜 유저라 예상됨):', authError.message)
      // 실패해도 아래에서 public.users 삭제하니까 문제없음
    }
  }

  // 모든 경우 public.users는 무조건 삭제
  const { error: deleteError } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', userId)

  if (deleteError) {
    console.error('public.users 삭제 실패:', deleteError)
    throw new Error('탈퇴 처리 중 오류가 발생했습니다.')
  }

  return { success: true, message: '회원 탈퇴가 완료되었습니다.' }
}