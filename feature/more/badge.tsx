import { Badge } from '@/components/ui/badge';
import { NoticeType } from '@/types/more/notice';

type Notices = {
   type: NoticeType;
};

export function BadgeComponent({ type }: Notices) {
   const badgeMap: Record<NoticeType, { label: string; className: string }> = {
      normal: {
         label: '일반',
         className: 'rounded-md text-xs px-2 py-1 w-15',
      },
      update: {
         label: '업데이트',
         className: 'rounded-md text-xs bg-[#1CDCC9]  px-2 py-1  w-15',
      },
      event: {
         label: '이벤트',
         className: 'rounded-md text-xs bg-[#143495]  px-2 py-1  w-15',
      },
      policy: {
         label: '이용정책',
         className: 'rounded-md text-xs bg-foreground  px-2 py-1  w-15',
      },
   };
   const badge = badgeMap[type] || {
      label: type || '일반',
   };
   return <Badge>{badge.label}</Badge>;
}
