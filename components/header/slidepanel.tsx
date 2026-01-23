// src/components/header/slidepanel.tsx
'use client';

import { supabase } from '@/lib/clientSupabase';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

interface slidepanelprops {
   isopen: boolean;
   onclose: () => void;
   title: string;
   children: ReactNode;
}

export default function SlidePanel({ isopen, onclose, title, children }: slidepanelprops) {
   const [userName, setUserName] = useState<string>('게스트');
   const [loading, setLoading] = useState(true);

   const { data: session, status } = useSession();

   useEffect(() => {
      console.log('🔍 [1] NextAuth 세션 상태:', status);
      console.log('🔍 [2] NextAuth 세션 데이터:', session);

      if (status === 'loading') {
         setLoading(true);
         return;
      }

      fetchUserInfo();
   }, [status, session]);

   const fetchUserInfo = async () => {
      try {
         setLoading(true);

         if (status === 'unauthenticated' || !session?.user) {
            console.log('ℹ️ [3] 로그인 안함');
            setUserName('게스트');
            return;
         }

         console.log('✅ [4] NextAuth 로그인된 사용자:', {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
         });

         // ⭐ Option 1: NextAuth 세션에서 바로 이름 가져오기 (권장)
         if (session.user.name) {
            console.log('✅ [5] NextAuth 세션에서 이름 가져옴:', session.user.name);
            setUserName(session.user.name);
            return;
         }

         // ⭐ Option 2: users 테이블에서 이름 가져오기 (세션에 없을 때)
         console.log('🔍 [6] users 테이블 조회 시작');

         const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name')
            .eq('id', session.user.id)
            .single();

         console.log('🔍 [7] users 테이블 결과:', {
            hasData: !!userData,
            userName: userData?.name,
            error: userError,
         });

         if (userError) {
            console.error('⚠️ users 테이블 조회 실패:', userError);
            setUserName(session.user.email?.split('@')[0] || '사용자');
            return;
         }

         const displayName = userData?.name || session.user.email?.split('@')[0] || '사용자';

         console.log('✅ [8] 최종 사용자 이름:', displayName);
         setUserName(displayName);
      } catch (error) {
         console.error('❌ 전체 프로세스 실패:', error);
         setUserName('게스트');
      } finally {
         setLoading(false);
         console.log('🏁 fetchUserInfo 완료');
      }
   };

   return (
      <>
         {/* 패널 본체 - 절대 언마운트되지 않음! */}
         <div
            data-panel-root="true"
            data-panel-open={isopen ? 'true' : 'false'}
            className={clsx(
               'fixed inset-y-0 left-16 lg:left-20 z-40 w-full max-w-100 md:max-w-150 bg-white shadow-2xl',
               'transition-all duration-300 ease-out',
               isopen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
            )}
         >
            <div className="h-16 flex items-center justify-between px-6 border-b sticky top-0 bg-white z-10">
               <h2 className="text-xl font-bold text-gray-800">
                  {loading ? (
                     <span className="text-gray-400">로딩 중...</span>
                  ) : (
                     <span>
                        안녕하세요,{' '}
                        <span className={userName === '게스트' ? 'text-gray-500' : 'text-primary'}>{userName}</span>님!
                     </span>
                  )}
               </h2>
               <button onClick={onclose} className="p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-4rem)] p-6">{children}</div>
         </div>
      </>
   );
}
