'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Maximize2, Minimize2 } from 'lucide-react';

/* ===========================
    Event Title
=========================== */
interface EventTitleProps {
  count: number;
}

export function EventTitle({ count }: EventTitleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isDetailPage = pathname.startsWith('/eventpage/detail');

  const handleToggleView = () => {
    if (isDetailPage) {
      // 페이지형 → 패널형
      router.push('/');
    } else {
      // 패널형 → 페이지형
      router.push('/eventpage/detail');
    }
  };

  return (
    <div
      className="
        flex items-center gap-2
      "
    >
      {/* 제목 */}
      <p
        className="
          font-normal text-[#04152F]
          text-[20px]
          md:text-[32px]
        "
      >
        전국 축제 콘텐츠
      </p>

      {/* 카운트 */}
      <span
        className="
          font-normal text-[var(--primary)]
          text-[20px]
          md:text-[32px]
        "
      >
        {count}
      </span>

      {/* 축소 확대 버튼 */}
      <button
        onClick={handleToggleView}
        aria-label={isDetailPage ? '패널로 축소' : '페이지로 확장'}
        title={isDetailPage ? '패널로 보기' : '전체 페이지로 보기'}
        className="
          cursor-pointer 
          mt-0 md:mt-1
          shrink-0
          flex items-center justify-center
          w-6 h-6 md:w-8 md:h-8
          rounded-md
          border border-[#E5E7EB]
          text-[#64748B]
          hover:text-[var(--primary)]
          hover:bg-[#F4F6FA]
          transition
        "
      >
        {isDetailPage ? (
          <Minimize2 className="w-4 h-4 md:w-5 md:h-5"/>
        ) : (
          <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>
    </div>
  );
}
