// src/components/header/page.tsx
'use client';

import { Icon24 } from '@/components/icons/icon24';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const menuItems = [
  { name: '이벤트', icon: 'notify', href: '/event' },
  { name: '여행 기록', icon: 'calendar', href: '/trip' },
  { name: '파티 모집', icon: 'users', href: '/party' },
  { name: '마이페이지', icon: 'user', href: '/mypage' },
  { name: '더보기', icon: 'menu', href: '/more' },
  { name: '로그인', icon: 'login', href: '/login' },
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={clsx(
          'fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full bg-white">
          {/* 여기 수정됨! 닫는 태그 추가 */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-600">Myway</h1>
          </div>
          {/* 여기까지 */}

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-4 px-4 py-3.5 mb-1 rounded-xl relative transition-all',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-red-500 rounded-xl -z-10 shadow-lg" />
                  )}
                  <Icon24 name={item.icon as any} className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">{item.name}</span>
                  {isActive && <Icon24 name="go" className="w-5 h-5 ml-auto" />}
                </a>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-200">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <Icon24 name="pinned" className="w-7 h-7" />
      </button>
    </>
  );
}