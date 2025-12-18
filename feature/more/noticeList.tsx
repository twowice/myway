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

export const NoticeList = ({ data, filterType }: { data: Notice[]; filterType: 'all' | NoticeType }) => {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 16;

   const filteredNotices = useMemo(() => {
      if (filterType === 'all') return data;
      return data.filter(notice => notice.type === filterType);
   }, [data, filterType]);

   const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

   const pagedNotices = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredNotices.slice(start, end);
   }, [currentPage, filteredNotices]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   return (
      <div className="flex flex-col h-full min-h-0 gap-3">
         <div className="flex-1 overflow-y-auto min-h-0">
            {pagedNotices.length > 0 ? (
               pagedNotices.map(notice =>
                  notice.isTopFixed ? (
                     <TopFixedlNotice key={notice.id} notice={notice} />
                  ) : (
                     <NormalNotice key={notice.id} notice={notice} />
                  ),
               )
            ) : (
               <div className="flex items-center justify-center h-full text-gray-400">등록된 공지사항이 없습니다.</div>
            )}
         </div>

         {/* pagination 영역 - 항상 동일한 높이 유지 */}
         <div className="flex items-center justify-center shrink-0 h-14">
            {totalPages > 0 && (
               <EllipsisPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
               />
            )}
         </div>
      </div>
   );
};
