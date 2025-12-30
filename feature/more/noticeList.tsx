import { Icon24 } from '@/components/icons/icon24';
import { BadgeComponent } from './badge';
import { useRouter } from 'next/navigation';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { Notice, NoticeType } from '@/types/more/notice';
import { useMemo, useState } from 'react';

type NoticeProps = {
   notice: Notice;
};

export function NormalNotice({ notice }: NoticeProps) {
   const router = useRouter();
   const handleClick = () => {
      router.push(`/morepage/notice/${notice.id}`);
   };
   return (
      <div className="flex p-2 gap-2 items-center border-b" onClick={handleClick}>
         <BadgeComponent type={notice.type} />
         <p className="flex-1 truncate">{notice.title}</p>
         <p className="shrink-0 text-foreground/60">{notice.date}</p>
      </div>
   );
}
export function NormalNoticeDetail({ notice }: NoticeProps) {
   return (
      <div className="flex flex-col gap-2 border-b">
         <BadgeComponent type={notice.type} />
         <p className="flex-1 truncate">{notice.title}</p>
         <p className="shrink-0 text-foreground/60">{notice.date}</p>
      </div>
   );
}
export function TopFixedlNotice({ notice }: NoticeProps) {
   const router = useRouter();
   const handleClick = () => {
      router.push(`/morepage/notice/${notice.id}`);
   };
   return (
      <div className="flex p-2 gap-1 items-center border-b bg-primary/30" onClick={handleClick}>
         <Icon24 name="pinned" />
         <BadgeComponent type={notice.type} />
         <p className="flex-1 truncate">{notice.title}</p>
         <p className="shrink-0 text-foreground/60">{notice.date}</p>
      </div>
   );
}

export const NoticeList = ({ data }: { data: Notice[] }) => {
   return (
      <div className="flex flex-col h-full min-h-0">
         <div className="flex-1 overflow-y-auto min-h-0">
            {data.length > 0 ? (
               data.map(notice =>
                  notice.isTopFixed ? (
                     <TopFixedlNotice key={notice.id} notice={notice} />
                  ) : (
                     <NormalNotice key={notice.id} notice={notice} />
                  ),
               )
            ) : (
               <div className="flex items-center justify-center h-full font-semibold">
                  <p className="text-gray-400">등록된 공지사항이 없습니다.</p>
               </div>
            )}
         </div>
      </div>
   );
};
