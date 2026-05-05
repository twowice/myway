'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import Header from '@/components/header/header';
import AuthSessionProvider from '@/components/providers/sessionprovider';
import MapCanvas from '@/components/ui/Map/mapCanvars';
import MapScriptLoader from '@/components/ui/Map/mapScriptLoader';
import MapSection from '@/components/ui/Map/MapSection';
import { ToastProvider } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';
import { panelstore } from '@/stores/panelstore';

import './globals.css';
import Providers from './providers';

const appHead = (
  <head>
    <title>Myway | 쉽고 빠른 축제 플랫폼</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
);

function AppDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      {appHead}
      <body>{children}</body>
    </html>
  );
}

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </Providers>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { openpanel } = panelstore();

  if (path.startsWith('/admin')) {
    return (
      <AppDocument>
        <AppProviders>
          <div className="flex min-h-screen justify-start">{children}</div>
        </AppProviders>
      </AppDocument>
    );
  }

  if (path.startsWith('/loginpage') || path.startsWith('/signup') || path.startsWith('/testpage')) {
    return (
      <AppDocument>
        <AppProviders>
          <main className="w-full h-screen">{children}</main>
        </AppProviders>
      </AppDocument>
    );
  }

  const isEventDetailPage = path.startsWith('/eventpage/') && path !== '/eventpage';
  if (isEventDetailPage) {
    return (
      <AppDocument>
        <AppProviders>
          <ToastProvider>
            <MapScriptLoader />
            <Header />
            {/* 반응형 수정: 모바일 하단 탭바 전환 시 왼쪽 사이드바 여백을 제거하고, 탭바 높이만큼 아래 여백을 확보합니다. */}
            <main className="min-h-[calc(100dvh-4rem)] md:min-h-screen md:ms-14 lg:ms-16 me-0 md:me-2 lg:me-4 pb-16 md:pb-0">{children}</main>
          </ToastProvider>
        </AppProviders>
      </AppDocument>
    );
  }

  const isEventListPage = path === '/';
  const isMainMenu0 = isEventListPage;
  const shouldShowMap = !isMainMenu0 || isEventListPage;
  const leftWidthClass = isEventListPage ? 'w-0' : isMainMenu0 ? 'w-full' : 'w-0';

  return (
    <AppDocument>
      <AppProviders>
        <ToastProvider>
          {shouldShowMap && <MapScriptLoader />}
          <Header />

          {/* 반응형 수정: 모바일에서는 왼쪽 여백을 없애고 지도 높이를 하단 탭바 위까지만 사용합니다. */}
          <main className="grow flex h-[calc(100dvh-4rem)] md:h-auto md:min-h-screen relative overflow-hidden ms-0 md:ms-14 lg:ms-16 mb-16 md:mb-0">
            <div className="relative flex-1 min-w-0">
              {shouldShowMap && <MapCanvas />}

              {shouldShowMap && (
                <div
                  className={cn(
                    // 반응형 수정: 모바일 패널은 전체 화면으로 덮기 때문에 지도를 옆으로 밀지 않습니다.
                    openpanel === null ? 'ms-0' : 'ms-0 md:ms-150',
                    'absolute inset-0 z-10 w-full h-full pointer-events-none'
                  )}
                >
                  <MapSection />
                </div>
              )}
            </div>

            <div className={cn(leftWidthClass, 'relative z-30 overflow-auto shrink-0')}>
              {children}
            </div>
          </main>
        </ToastProvider>
      </AppProviders>
    </AppDocument>
  );
}
