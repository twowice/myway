//////////////////////////////////////
//                                  //
//           TAG 공통 모듈           //
//                                  //
//////////////////////////////////////
/*  
    *** 예시 사용법 ***
    <Tag label="#축제" />
    <Tag label="#행사" removable onRemove={handleRemove} />
*/

import React from 'react';

interface TagProps {
   label: string; // Tag의 이름 설정
   removable?: boolean; // 삭제 여부 (removable가 있다면 삭제 버튼 활성화)
   onRemove?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // 삭제 후 부모창 이벤트 요소 확인
   className?: string;
   ariaLabel?: string; // 상태 알림
}

export default function Tag({ label, removable = false, onRemove, className = '', ariaLabel }: TagProps) {
   return (
      <span
         role="status"
         aria-label={ariaLabel ?? `tag-${label}`}
         className={[
            'inline-flex items-center gap-4',
            'px-4 py-2 rounded-[20px]',
            'text-white text-[16px] font-regular leading-none',
            'select-none',
            className,
            'bg-[var(--primary)]',
         ].join(' ')}
      >
         <span className="leading-none">{label}</span>

         {removable && (
            <button
               type="button"
               aria-label={`Remove ${label}`}
               onClick={e => {
                  e.stopPropagation();
                  onRemove?.(e);
               }}
               className={[
                  'ml-1',
                  'flex h-5 w-5 items-center justify-center rounded-full',
                  'bg-transparent hover:bg-white/20',
                  'focus:outline-none focus:ring-2 focus:ring-white/40',
               ].join(' ')}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="text-white"
               >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
               </svg>
            </button>
         )}
      </span>
   );
}
