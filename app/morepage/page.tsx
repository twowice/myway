'use client';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { Segment } from '@/components/tabs/segment/segment';
import { Button } from '@/components/ui/button/button';
import Tab from '@/components/ui/tab';
import { NoticeList } from '@/feature/more/noticeList';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import MorePanel from '@/components/header/panels/morepanel';
import { Notice, NoticeType } from '@/types/more/notice';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { supabase } from '@/lib/clientSupabase';

export default function MoreContent({ children }: { children?: React.ReactNode }) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const isDetailNotice = pathname.startsWith('/morepage/notice/');
   const isDetailPolicy = pathname.startsWith('/morepage/policy/');

   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 15;

   //supabase
   const [notices, setNotices] = useState<Notice[]>([]);
   const [loading, setLoading] = useState(true);

   // 공지사항 탭 내의 세부 필터 상태 (전체, 일반 등)
   const [noticeFilter, setNoticeFilter] = useState<NoticeType | 'all'>('all');

   const tabFromUrl = searchParams.get('tab');
   const [selectedTab, setSelectedTab] = useState(
      isDetailNotice ? 'notice' : isDetailPolicy ? 'policy' : tabFromUrl || 'alarm',
   );

   // Supabase에서 공지사항 가져오기
   useEffect(() => {
      fetchNotices();

      // 실시간 구독: 공지사항이 추가/수정/삭제되면 자동으로 목록 업데이트
      const channel = supabase
         .channel('notices-list-changes')
         .on(
            'postgres_changes',
            {
               event: '*', // INSERT, UPDATE, DELETE 모두 감지
               schema: 'public',
               table: 'notices',
            },
            payload => {
               console.log('공지사항 변경 감지:', payload);
               // 변경사항이 있으면 목록 다시 가져오기
               fetchNotices();
            },
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
      };
   }, []);

   const fetchNotices = async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from('notices')
            .select('*')
            .order('is_top_fixed', { ascending: false }) // 상단 고정 먼저
            .order('created_at', { ascending: false }); // 그 다음 최신순

         if (error) {
            console.error('공지사항 조회 실패:', error);
            return;
         }

         // Supabase 데이터를 Notice 타입으로 변환
         const formattedNotices: Notice[] = (data || []).map(item => ({
            id: item.id,
            type: item.category as NoticeType,
            title: item.title,
            detail: item.detail,
            date: new Date(item.created_at).toLocaleDateString('ko-KR'),
            isTopFixed: item.is_top_fixed,
         }));

         setNotices(formattedNotices);
      } catch (error) {
         console.error('공지사항 조회 중 오류:', error);
      } finally {
         setLoading(false);
      }
   };

   // 1. 데이터 필터링 로직 (부모에서 계산)
   const filteredNotices = useMemo(() => {
      if (noticeFilter === 'all') return notices;
      return notices.filter(n => n.type === noticeFilter);
   }, [noticeFilter, notices]);

   const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

   const pagedNotices = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredNotices.slice(start, start + itemsPerPage);
   }, [currentPage, filteredNotices]);

   // 탭이나 필터 변경 시 페이지 초기화
   useEffect(() => {
      setCurrentPage(1);
   }, [selectedTab, noticeFilter]);

   useEffect(() => {
      if (isDetailNotice) {
         setSelectedTab('notice');
      } else if (isDetailPolicy) {
         setSelectedTab('policy');
      } else if (tabFromUrl) {
         setSelectedTab(tabFromUrl);
      }
   }, [isDetailNotice, tabFromUrl, isDetailPolicy]);

   return (
      <MorePanel>
         <div className="bg-white w-full h-full flex flex-col overflow-hidden">
            {/* 헤더 */}
            <div className="shrink-0  mb-2">
               <p className="text-[24px] font-semibold">더보기</p>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
               <Tab
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  items={[
                     {
                        value: 'alarm',
                        label: '알림 설정',
                        content: (
                           <div className="flex flex-col h-full">
                              <div className="overflow-y-auto">
                                 <div className="flex flex-col gap-4">
                                    <div className="text-xl flex flex-col gap-3">
                                       알림 설정
                                       <div className="flex flex-col gap-2 text-base">
                                          신고 알림
                                          <RadioComponent
                                             options={[
                                                { value: 'set', label: '설정' },
                                                { value: 'unset', label: '해제' },
                                             ]}
                                             className="flex text-base [&_label]:text-base [&_span]:text-base"
                                          />
                                       </div>
                                       <div className="flex flex-col gap-2 text-base">
                                          파티 신청완료 알림
                                          <RadioComponent
                                             options={[
                                                { value: 'set', label: '설정' },
                                                { value: 'unset', label: '해제' },
                                             ]}
                                             className="flex text-base [&_label]:text-base [&_span]:text-base"
                                          />
                                       </div>
                                       <div className="flex flex-col gap-2 text-base">
                                          파티 신청 알림
                                          <RadioComponent
                                             options={[
                                                { value: 'set', label: '설정' },
                                                { value: 'unset', label: '해제' },
                                             ]}
                                             className="flex text-base [&_label]:text-base [&_span]:text-base"
                                          />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <Button variant={'secondary'} size={'lg'} className="w-full shrink-0 mt-4">
                                 저장
                              </Button>
                           </div>
                        ),
                     },
                     {
                        value: 'notice',
                        label: '공지사항',
                        content: isDetailNotice ? (
                           <div className="h-full overflow-y-auto">{children}</div>
                        ) : (
                           <div className="flex flex-col h-full min-h-0">
                              <div className="flex-1 min-h-0 h-full">
                                 <Segment
                                    onValueChange={val => setNoticeFilter(val as any)}
                                    contents={[
                                       {
                                          value: 'all',
                                          title: '전체',
                                          content: (
                                             <div className="h-full overflow-y-auto">
                                                <NoticeList data={pagedNotices} />
                                             </div>
                                          ),
                                       },
                                       {
                                          value: 'normal',
                                          title: '일반',
                                          content: (
                                             <div className="h-full overflow-y-auto">
                                                <NoticeList data={pagedNotices} />
                                             </div>
                                          ),
                                       },
                                       {
                                          value: 'update',
                                          title: '업데이트',
                                          content: (
                                             <div className="h-full overflow-y-auto">
                                                <NoticeList data={pagedNotices} />
                                             </div>
                                          ),
                                       },
                                       {
                                          value: 'event',
                                          title: '이벤트',
                                          content: (
                                             <div className="h-full overflow-y-auto">
                                                <NoticeList data={pagedNotices} />
                                             </div>
                                          ),
                                       },
                                       {
                                          value: 'policy',
                                          title: '이용정책',
                                          content: (
                                             <div className="h-full overflow-y-auto">
                                                <NoticeList data={pagedNotices} />
                                             </div>
                                          ),
                                       },
                                    ]}
                                 />
                              </div>
                           </div>
                        ),
                     },
                     {
                        value: 'policy',
                        label: '이용약관 및 정책',
                        content: isDetailPolicy ? (
                           <div className="h-full overflow-y-auto">{children}</div>
                        ) : (
                           <div className="h-full overflow-y-auto">
                              <div className="flex flex-col gap-2">
                                 <Button
                                    variant={'icon-right'}
                                    className="w-full"
                                    onClick={() => router.push('/morepage/policy/4')}
                                 >
                                    <Icon24 name="go" className="text-secondary" />
                                    이용약관(서비스 약관)
                                 </Button>
                                 <Button
                                    variant={'icon-right'}
                                    className="w-full"
                                    onClick={() => router.push('/morepage/policy/1')}
                                 >
                                    <Icon24 name="go" className="text-secondary" />
                                    개인정보 처리방침
                                 </Button>
                                 <Button
                                    variant={'icon-right'}
                                    className="w-full"
                                    onClick={() => router.push('/morepage/policy/2')}
                                 >
                                    <Icon24 name="go" className="text-secondary" />
                                    위치 기반 서비스 이용 약관
                                 </Button>
                                 <Button
                                    variant={'icon-right'}
                                    className="w-full"
                                    onClick={() => router.push('/morepage/policy/3')}
                                 >
                                    <Icon24 name="go" className="text-secondary" />
                                    커뮤니티 운영 정책
                                 </Button>
                              </div>
                           </div>
                        ),
                     },
                  ]}
               />
            </div>
            {/* 페이지네이션 영역: 탭 하단에 고정 */}
            {selectedTab === 'notice' && !isDetailNotice && totalPages > 0 && (
               <div className="flex items-center justify-center shrink-0 h-14 mt-4">
                  <EllipsisPagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     handlePageChange={setCurrentPage}
                  />
               </div>
            )}
            {/* 버전 정보 */}
            <div className="flex items-center justify-between text-gray-600 shrink-0 p-4 border-t mt-4">
               <p>버전정보 v.1.00.0</p>
               <p>최신 버전</p>
            </div>
         </div>
      </MorePanel>
   );
}
