// src/components/header/Header.tsx
'use client';

import { Icon36 } from '@/components/icons/icon36';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

const mainMenu = [
  { name: '이벤트',    icon: 'event',     href: '/event' },
  { name: '여행 기록', icon: 'record',    href: '/record' },
  { name: '파티 모집', icon: 'matching',  href: '/party' },
  { name: '마이페이지',   icon: 'profile',   href: '/mypage' },
  { name: '더보기',    icon: 'more',      href: '/more' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 현재 페이지에 맞는 메뉴 찾기
  const currentMenu = mainMenu.find(item => item.href === pathname);

  // 열려있는 패널 이름 (null이면 닫힘)
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  // 페이지 이동 시 자동으로 패널 열기
  useEffect(() => {
    if (currentMenu) {
      setOpenPanel(currentMenu.name);
    } else {
      setOpenPanel(null);
    }
  }, [pathname]);

  const handleMenuClick = (href: string, name: string) => {
    router.push(href);
    setOpenPanel(name);
  };

  const closePanel = () => {
    setOpenPanel(null);
  };

  return (
    <>
      {/* ==================== 사이드바 ==================== */}
      <aside className="fixed inset-y-0 left-0 z-50 w-16 lg:w-20 bg-[#F1F5FA] border-r border-gray-200 shadow-2xl">
        <div className="flex flex-col h-full">

          {/* 로고 */}
          <div
            className="h-16 flex items-center justify-center border-b border-gray-200 px-4 cursor-pointer select-none group shrink-0"
            onClick={() => router.push('/')}
          >
            <div className="flex flex-col items-center gap-1">
              <svg width="22" height="17" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                   className="transition-all duration-300 group-hover:scale-110">
                <path d="M2.29102 0C2.49429 0 2.68666 0.0629354 2.84766 0.170898L3.47754 3.09766L3.5625 3.49316H4.20703L5.57812 7.47656C5.8839 8.36482 7.13541 8.37973 7.46191 7.49902L7.72559 6.78711C7.80753 6.56588 7.80847 6.32253 7.72852 6.10059L6.78809 3.49316H13.042L12.0889 6.09277C12.006 6.3189 12.0081 6.56788 12.0938 6.79297L12.377 7.53906C12.7101 8.41329 13.9545 8.39174 14.2578 7.50684L16.5967 0.675781C16.7352 0.271872 17.115 0.000352107 17.542 0H18.8486C19.5525 0 20.0361 0.707597 19.7803 1.36328L15.168 13.1865C15.0181 13.5701 14.6482 13.8223 14.2363 13.8223H12.8232C12.419 13.8219 12.054 13.5787 11.8994 13.2051L10.8438 10.6543C10.5024 9.82946 9.33385 9.83122 8.99512 10.6572L7.95117 13.2021C7.79723 13.5773 7.43186 13.8221 7.02637 13.8223H5.59668C5.18445 13.822 4.81442 13.5688 4.66504 13.1846L0.0683594 1.3623C-0.186132 0.707032 0.298056 0.00034257 1.00098 0H2.29102ZM8.62109 7.7168C8.30983 7.71719 8.05673 8.27979 8.05664 8.97363C8.05664 9.66764 8.30977 10.2301 8.62109 10.2305C8.93229 10.2298 9.18457 9.66745 9.18457 8.97363C9.18448 8.27998 8.93224 7.71751 8.62109 7.7168ZM11.2363 7.7168C10.9251 7.71734 10.6719 8.27982 10.6719 8.97363C10.6719 9.66755 10.9251 10.2299 11.2363 10.2305C11.5476 10.2299 11.7998 9.66753 11.7998 8.97363C11.7998 8.27984 11.5475 7.71738 11.2363 7.7168Z" fill="#0077D4"/>
                <path d="M3.49609 12.3945L3.23926 13.1416C3.10036 13.5448 2.7194 13.8161 2.29297 13.8164H1.00293C0.30008 13.816 -0.184127 13.1093 0.0703125 12.4541L1.79785 8.00781L3.49609 12.3945ZM19.7822 12.4531C20.0377 13.1085 19.5539 13.8159 18.8506 13.8164H17.5439C17.1171 13.816 16.7372 13.5444 16.5986 13.1406L16.3457 12.4023L18.0469 8.00586L19.7822 12.4531ZM3.5625 3.48535H9.21289C9.5968 3.87526 10.2467 3.87542 10.6309 3.48535H16.2842L17.5088 6.62598L15.8428 10.9326L14.2598 6.30957C13.9565 5.4249 12.7133 5.40373 12.3799 6.27734L12.0957 7.02344C12.0101 7.2485 12.008 7.49753 12.0908 7.72363L13.8252 12.4531C14.0638 13.1052 13.581 13.7961 12.8867 13.7969H12.085C11.6524 13.7966 11.268 13.5177 11.1338 13.1064L10.8691 12.2939C10.5691 11.3742 9.26795 11.3743 8.96777 12.2939L8.70215 13.1064C8.56805 13.5175 8.18428 13.7964 7.75195 13.7969H6.96094C6.26876 13.7963 5.78598 13.1093 6.02051 12.458L7.73047 7.71582C7.8103 7.49403 7.80935 7.25037 7.72754 7.0293L7.46387 6.31738C7.13737 5.4368 5.886 5.45185 5.58008 6.33984L4 10.9287L2.33496 6.62695L3.56055 3.47656L3.5625 3.48535Z" fill="#0077D4"/>
              </svg>
              <h1 className="text-xl font-bold text-[#007DE4] tracking-tight">Myway</h1>
            </div>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 overflow-y-auto px-1 py-8 scrollbar-hide">
            <div className="space-y-12">
              {mainMenu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.href, item.name)}
                    className={clsx(
                      'w-full flex flex-col items-center gap-2 py-3 rounded-2xl transition-all duration-200 hover:scale-105',
                      isActive && 'scale-110'
                    )}
                  >
                    <Icon36
                      name={item.icon}
                      className={clsx(
                        'w-8 h-8 lg:w-9 lg:h-9 transition-colors',
                        isActive ? 'text-[#007DE4]' : 'text-[#04152F]'
                      )}
                    />
                    <span className={clsx(
                      'text-[11px] lg:text-xs font-medium',
                      isActive ? 'text-[#007DE4]' : 'text-[#04152F]'
                    )}>
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* 로그인 버튼 */}
          <div className="p-2 border-t border-gray-200 shrink-0">
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="w-full py-3 text-center text-base font-medium text-[#04152F] hover:text-[#007DE4] transition-colors"
            >
              {isLoggedIn ? '로그아웃' : '로그인'}
            </button>
          </div>
        </div>
      </aside>

      {/* ==================== 슬라이드 패널 (메인 위에 살짝 떠서 나옴) ==================== */}
      <div
        className={clsx(
          'fixed inset-y-0 left-16 lg:left-20 z-20', // z-20으로 낮춰서 main 위에만 살짝 뜸
          'w-full max-w-96',
          'bg-white shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          openPanel ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 패널 헤더 */}
        <div className="h-16 flex items-center justify-between px-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">{openPanel || '메뉴'}</h2>
          <button
            onClick={closePanel}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 패널 콘텐츠 */}
        <div className="h-full overflow-y-auto p-6 pb-24">

        </div>
      </div>
    </>
  );
}