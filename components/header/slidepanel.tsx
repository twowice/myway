// src/components/header/slidepanel.tsx
'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface slidepanelprops {
  isopen: boolean;
  onclose: () => void;
  title: string;
  children: ReactNode;
}

export default function SlidePanel({ isopen, onclose, title, children }: slidepanelprops) {
  return (
    <>

      {/* 패널 본체 - 절대 언마운트되지 않음! */}
      <div
        data-panel-root="true"
        data-panel-open={isopen ? "true" : "false"}
        className={clsx(
          'fixed inset-y-0 left-16 lg:left-20 z-40 w-full max-w-100 md:max-w-150 bg-white shadow-2xl',
          'transition-all duration-300 ease-out',
          isopen 
            ? 'translate-x-0' 
            : '-translate-x-full pointer-events-none'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onclose} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-4rem)] p-6 pb-24">
          {children}
        </div>
      </div>
    </>
  );
}
