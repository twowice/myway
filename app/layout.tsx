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
import AuthSessionProvider from '@/components/providers/sessionprovider';
import { ToastProvider } from '@/contexts/ToastContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { openpanel } = panelstore();

  // 관리자
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

  // 로그인/회원가입
  if (path.startsWith('/loginpage') || path.startsWith('/signup') || path.startsWith('/testpage')) {
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

  // 이벤트 상세: 지도/패널 없음
  const isEventDetailPage = path.startsWith('/eventpage/') && path !== '/eventpage';
  if (isEventDetailPage) {
    return (
      <html lang="ko">
        <body>
          <AuthSessionProvider>
            <ToastProvider>
              <Header />
              <main className="lg:ms-20 ms-16 lg:me-4 me-2 min-h-screen">
                {children}
              </main>
            </ToastProvider>
          </AuthSessionProvider>
        </body>
      </html>
    );
  }

  // 기본 로직
  const isMainMenu0 = path.startsWith(mainmenu[0].href);
  const isEventListPage = path === '/eventpage';

  // /eventpage(list)는 패널 닫혀도 지도 유지
  const shouldShowMap = !isMainMenu0 || isEventListPage;

  // /eventpage는 children이 레이아웃 폭을 먹으면 지도 안 보임 → w-0로 고정
  // (패널은 SlidePanel이 overlay로 띄우기 때문에 children은 렌더만 되면 됨)
  const leftWidthClass = isEventListPage
    ? 'w-0' // 이벤트페이지(list)는 지도 우선
    : isMainMenu0
    ? 'w-full'
    : 'w-0';

  return (
    <html lang="ko">
      <body>
        <AuthSessionProvider>
          <ToastProvider>
            {shouldShowMap && <MapScriptLoader />}
            <Header />

            <main className="grow flex min-h-screen relative overflow-hidden ms-16 lg:ms-20">
              {/* 지도 영역: 항상 flex-1로 공간 확보 */}
              <div className="relative flex-1 min-w-0">
                {shouldShowMap && <MapCanvas />}

                {shouldShowMap && (
                  <div
                    className={cn(
                      openpanel === null ? 'ms-0' : 'ms-100 lg:ms-150 md:ms-150',
                      'absolute inset-0 z-10 w-full h-full pointer-events-none'
                    )}
                  >
                    <MapSection />
                  </div>
                )}
              </div>

              {/* 좌측 컨텐츠 영역 (이벤트 list에서는 w-0로 공간 차지 X) */}
              {path !== '/' && (
                <div className={cn(leftWidthClass, 'relative z-30 overflow-auto shrink-0')}>
                  {children}
                </div>
              )}
            </main>
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}