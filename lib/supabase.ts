import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseAdmin: SupabaseClient | null = null;

export const getSupabaseAdminClient = () => {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or service role key is missing from environment variables.');
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseAdmin;
}

// 기존의 export는 유지하되, 서버 전용 클라이언트임을 명확히 하기 위해 getSupabaseAdminClient 사용을 권장
export const supabase = getSupabaseAdminClient();