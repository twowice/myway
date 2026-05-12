// src/components/header/slidepanel.tsx
'use client';

import { TextSkeleton } from '@/components/ui/text-skeleton';
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
            setUserName('게스트');
            return;
         }


         // ⭐ Option 1: NextAuth 세션에서 바로 이름 가져오기 (권장)
         if (session.user.name) {
            setUserName(session.user.name);
            return;
         }

         const displayName = session.user.name || session.user.email?.split('@')[0] || '사용자';

         setUserName(displayName);
      } catch (error) {
         console.error('❌ 전체 프로세스 실패:', error);
         setUserName('게스트');
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         {/* 패널 본체 - 절대 언마운트되지 않음! */}
         <div
            data-panel-root="true"
            data-panel-open={isopen ? 'true' : 'false'}
            className={clsx(
               'fixed inset-y-0 left-0 z-40 w-full bg-white shadow-2xl lg:left-16 lg:max-w-150',
               'transition-all duration-300 ease-out',
               isopen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
            )}
         >
            <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b sticky top-0 bg-white z-10">
               <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  {loading ? (
                     <TextSkeleton />
                  ) : (
                     <span>
                        안녕하세요,{' '}
                        <span className={userName === '게스트' ? 'text-gray-500' : 'text-primary'}>{userName}</span>님!
                     </span>
                  )}
               </h2>
               <button onClick={onclose} className="cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-3.5rem)] md:h-[calc(100%-4rem)] p-4 md:p-6 pb-20 md:pb-6">{children}</div>
         </div>
      </>
   );
}
