import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  console.log('=== API 시작 ===')
  
  try {
    const body = await request.json()
    console.log('1. 받은 데이터:', body)
    
    const { userId, name, email, gender, phone, birthDate } = body
    console.log('2. 파싱된 데이터:', { userId, name, email, gender, phone, birthDate })

    const updateData = {
      name,
      email,
      gender,
      phone,
      birth_date: birthDate,
      is_profile_complete: true,
    }
    console.log('3. 업데이트할 데이터:', updateData)

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()

    console.log('4. Supabase 응답 데이터:', data)
    console.log('5. Supabase 에러:', error)

    if (error) {
      console.error('❌ Supabase 에러 발생:', error)
      return NextResponse.json({ 
        error: error.message,
        details: error 
      }, { status: 500 })
    }

    console.log('✅ 업데이트 성공')
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('❌ API 예외 발생:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}