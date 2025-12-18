'use client';

import { useRouter } from 'next/navigation';
import MoreContent from '../../page';
import { Button } from '@/components/ui/button';
import { Icon24 } from '@/components/icons/icon24';
import { NormalNoticeDetail } from '@/feature/more/noticeList';
import { use } from 'react';
import { allNotices } from '@/dummy/more';

export default function NoticeDetail({ params }: { params: Promise<{ id: string }> }) {
   const router = useRouter();
   const { id } = use(params);
   const notice = allNotices.find(n => n.id === Number(id));

   const handleBack = () => {
      router.push('/morepage?tab=notice');
   };

   if (!notice) {
      return (
         <MoreContent>
            <div className="flex flex-col h-full px-6 pt-4">
               <Button onClick={handleBack} variant={'ghost'} className="justify-start w-10 p-0 shrink-0">
                  <Icon24 name="back" className="text-foreground" />
               </Button>
               <div className="flex justify-center items-center flex-1">
                  <p className="text-gray-400">상세내용이 없습니다.</p>
               </div>
            </div>
         </MoreContent>
      );
   }

   return (
      <MoreContent>
         <div className="flex flex-col h-full px-6 pt-4">
            <Button onClick={handleBack} variant={'ghost'} className="justify-start w-10 p-0 shrink-0 mb-3">
               <Icon24 name="back" className="text-foreground" />
            </Button>
            <div className="flex-1 overflow-y-auto min-h-0">
               <div className="flex flex-col gap-3">
                  <NormalNoticeDetail notice={notice} />
                  <div className="whitespace-pre-wrap pb-4">{notice.detail}</div>
               </div>
            </div>
         </div>
      </MoreContent>
   );
}
