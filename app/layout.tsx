'use client';

import Header from '@/components/header/header';
import MapSection from '@/components/ui/Map/MapSection';
import MapScriptLoader from '@/components/ui/Map/mapScriptLoader';
import MapCanvas from '@/components/ui/Map/mapCanvars';

import './globals.css';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mainmenu } from '@/components/header/headermenu';
import { panelstore } from '@/stores/panelstore';
import { useMemo } from 'react';
import AuthSessionProvider from '@/components/providers/sessionprovider';
import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
   const path = usePathname();
   const { openpanel } = panelstore();

   // 전체 너비가 필요한 페이지들
   const fullwidthpages = ['/loginpage', '/signup', '/admin'];
   const isfullwidth = fullwidthpages.some(page => path.startsWith(page));

   //관리자 주소를 입력해주세요
   if (path.startsWith('/admin')) {
      return (
         <html lang="ko">
            <body>
               <AuthSessionProvider>
                  <div className="flex min-h-screen justify-start">{children}</div>
               </AuthSessionProvider>
            </body>
         </html>
      );
   }

   // 로그인/회원가입 페이지는 Header 없이 전체 화면
   if (path.startsWith('/loginpage') || path.startsWith('/signup')) {
      return (
         <html lang="ko">
            <body>
               <AuthSessionProvider>
                  <main className="w-full h-screen">{children}</main>
               </AuthSessionProvider>
            </body>
         </html>
      );
   }

   return (
      <html lang="ko">
         <body>
            <AuthSessionProvider>
               <ToastProvider>
                  <MapScriptLoader />
                  <Header />
                  <main className="grow flex flex-row min-h-screen relative overflow-hidden ms-16 lg:ms-20 h-full">
                     {path !== '/' && (
                        <div
                           className={cn(
                              path.startsWith(mainmenu[0].href) ? 'w-full' : 'w-0',
                              'relative z-30 overflow-auto shrink-0',
                           )}
                        >
                           {children}
                        </div>
                     )}
                     {!path.startsWith(mainmenu[0].href) && <MapCanvas />}
                     {!path.startsWith(mainmenu[0].href) && (
                        <div
                           className={cn(
                              openpanel === null ? 'ms-0' : 'ms-100 lg:ms-150 md:ms-150',
                              'absolute inset-0 z-10 w-full h-full pointer-events-none',
                           )}
                        >
                           <MapSection />
                        </div>
                     )}
                  </main>
               </ToastProvider>
            </AuthSessionProvider>
         </body>
      </html>
   );
}
