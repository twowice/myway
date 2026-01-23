// app/api/user/updateprofile/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'  // ← 이걸 import!

const supabase = getSupabaseAdminClient()  // ← Admin 클라이언트 사용!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, name, email, gender, phone, birthDate } = body

    if (!userId) {
      return NextResponse.json({ error: '사용자 ID가 필요합니다.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        gender,
        phone: phone.replace(/-/g, ''),
        birth_date: birthDate,
        is_profile_complete: true,
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: '프로필 업데이트 실패', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}