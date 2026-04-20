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
            <main className="lg:ms-20 ms-16 lg:me-4 me-2 min-h-screen">{children}</main>
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

          <main className="grow flex min-h-screen relative overflow-hidden ms-16 lg:ms-20">
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

            <div className={cn(leftWidthClass, 'relative z-30 overflow-auto shrink-0')}>
              {children}
            </div>
          </main>
        </ToastProvider>
      </AppProviders>
    </AppDocument>
  );
}
