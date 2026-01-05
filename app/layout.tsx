'use client';

import Header from '@/components/header/header';
import MapSection from '@/components/ui/Map/MapSection';
import MapScriptLoader from '@/components/ui/Map/mapScriptLoader';
import MapCanvas from '@/components/ui/Map/mapCanvars';

import './globals.css';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { panelstore } from '@/stores/panelstore';
import AuthSessionProvider from '@/components/providers/sessionprovider';
import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const openpanel = panelstore(state => state.openpanel);
  const isPanel = openpanel !== null;

  /** =========================
   *  페이지 타입 판별
   ========================= */
  const isAdminPage = path.startsWith('/admin');
  const isAuthPage =
    path.startsWith('/loginpage') ||
    path.startsWith('/signup') ||
    path.startsWith('/testpage');

  const isEventDetailPage = path.startsWith('/eventpage/');

  /** =========================
   *  관리자 페이지
   ========================= */
  if (isAdminPage) {
    return (
      <html lang="ko">
        <body>
          <AuthSessionProvider>
            <div className="flex min-h-screen">{children}</div>
          </AuthSessionProvider>
        </body>
      </html>
    );
  }

  /** =========================
   *  로그인 / 회원가입
   ========================= */
  if (isAuthPage) {
    return (
      <html lang="ko">
        <body>
          <AuthSessionProvider>
            <main className="w-full min-h-screen">
              {children}
            </main>
          </AuthSessionProvider>
        </body>
      </html>
    );
  }

  /** =========================
   *  이벤트 상세 페이지 (패널 ❌, 지도 ❌)
   ========================= */
  if (isEventDetailPage) {
    return (
      <html lang="ko">
        <body>
          <AuthSessionProvider>
            <ToastProvider>
              <Header />
              <main className="w-full min-h-screen">
                {children}
              </main>
            </ToastProvider>
          </AuthSessionProvider>
        </body>
      </html>
    );
  }

  /** =========================
   *  기본 페이지 (패널 + 지도)
   ========================= */
  return (
    <html lang="ko">
      <body>
        <AuthSessionProvider>
          <ToastProvider>
            <MapScriptLoader />
            <Header />

            <main
               className={cn(
                  'grow flex min-h-screen relative',
                  isEventDetailPage
                     ? 'overflow-y-auto'
                     : 'overflow-hidden flex-row ms-16 lg:ms-20'
               )}
               >

              {/* 좌측 콘텐츠 영역 */}
              {path !== '/' && (
                <div
                  className={cn(
                    'relative z-30 overflow-auto shrink-0'
                  )}
                >
                  {children}
                </div>
              )}

              {/* 지도 */}
              {isPanel && <MapCanvas />}

              {/* 지도 위 패널 */}
              {isPanel && (
                <div
                  className={cn(
                    'absolute inset-0 z-10 w-full h-full pointer-events-none',
                    'ms-100 md:ms-150 lg:ms-150'
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
