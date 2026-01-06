'use client';

import { useRouter } from 'next/navigation';
import MoreContent from '../../page';
import { Button } from '@/components/ui/button';
import { Icon24 } from '@/components/icons/icon24';
import { NormalNoticeDetail } from '@/feature/more/noticeList';
import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/clientSupabase';
import { Notice } from '@/types/more/notice';

export default function NoticeDetail({ params }: { params: Promise<{ id: string }> }) {
   const router = useRouter();
   const { id } = use(params);
   const [notice, setNotice] = useState<Notice | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchNotice();

      const channel = supabase
         .channel('notices')
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'notices',
               filter: `id=eq.${id}`,
            },
            payload => {
               console.log('변경 감지!', payload);
               if (payload.eventType === 'DELETE') {
                  router.push('/morepage?tab=notice');
               } else if (payload.eventType === 'UPDATE') {
                  fetchNotice();
               }
            },
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
      };
   }, [id, router]);

   const fetchNotice = async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase.from('notices').select('*').eq('id', id).single();

         if (error) {
            console.error('공지사항 조회 실패:', error);
            setNotice(null);
            return;
         }

         setNotice({
            id: data.id,
            type: data.type,
            title: data.title,
            content: data.content,
            date: new Date(data.created_at).toLocaleDateString('ko-KR'),
            isTopFixed: data.is_top_fixed,
            created_at: data.created_at,
            updated_at: data.updated_at,
            author_id: data.author_id,
            author_name: data.author_name,
         });
      } catch (error) {
         console.error('공지사항 조회 중 오류:', error);
         setNotice(null);
      } finally {
         setLoading(false);
      }
   };
   const handleBack = () => {
      router.push('/morepage?tab=notice');
   };

   if (loading) {
      return (
         <MoreContent>
            <div className="flex flex-col h-full px-6 pt-4">
               <Button onClick={handleBack} variant={'ghost'} className="justify-start w-10 p-0 shrink-0">
                  <Icon24 name="back" className="text-foreground" />
               </Button>
               <div className="flex justify-center items-center flex-1">
                  <p className="text-muted-foreground">로딩 중...</p>
               </div>
            </div>
         </MoreContent>
      );
   }

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
                  <div className="whitespace-pre-wrap pb-4" dangerouslySetInnerHTML={{ __html: notice.content }} />
               </div>
            </div>
         </div>
      </MoreContent>
   );
}
