'use client';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { Segment } from '@/components/tabs/segment/segment';
import { Button } from '@/components/ui/button/button';
import Tab from '@/components/ui/tab';
import { NormalNotice, TopFixedlNotice } from '@/feature/more/noticeList';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export type NoticeType = 'normal' | 'update' | 'event' | 'policy';

export interface Notice {
   id: number;
   type: NoticeType;
   title: string;
   detail: string;
   date: string;
   isTopFixed?: boolean;
}

export const allNotices: Notice[] = [
   {
      id: 1,
      type: 'update',
      title: '여행 기록 기능 업데이트 안내',
      detail: '여행 기록을 더 편리하게 작성할 수 있도록 일정 저장 기능이 개선되었습니다.',
      date: '2025.12.15',
      isTopFixed: true,
   },
   {
      id: 2,
      type: 'policy',
      title: '이용약관 및 운영정책 변경 안내',
      detail: '서비스 운영 정책 일부가 변경되어 안내드립니다.',
      date: '2025.12.14',
      isTopFixed: true,
   },
   {
      id: 3,
      type: 'update',
      title: '지도 기반 경로 기록 기능 추가',
      detail: '이동 경로를 지도에서 확인할 수 있는 기능이 추가되었습니다.',
      date: '2025.12.13',
      isTopFixed: true,
   },
   {
      id: 4,
      type: 'event',
      title: '연말 여행 기록 이벤트 안내',
      detail: '연말 여행 기록을 남기면 추첨을 통해 혜택을 드립니다.',
      date: '2025.12.12',
      isTopFixed: true,
   },

   {
      id: 5,
      type: 'normal',
      title: '서비스 점검 일정 안내',
      detail: '안정적인 서비스 제공을 위해 시스템 점검이 진행됩니다.',
      date: '2025.12.11',
   },
   {
      id: 6,
      type: 'event',
      title: '겨울 축제 기록 이벤트',
      detail: '겨울 축제 여행 기록을 남기고 혜택을 받아보세요.',
      date: '2025.12.10',
   },
   {
      id: 7,
      type: 'update',
      title: '알림 설정 기능 개선',
      detail: '알림 설정 UI가 더 직관적으로 개선되었습니다.',
      date: '2025.12.09',
   },
   {
      id: 8,
      type: 'policy',
      title: '커뮤니티 이용 정책 안내',
      detail: '건강한 커뮤니티 운영을 위한 정책을 안내드립니다.',
      date: '2025.12.08',
   },
   {
      id: 9,
      type: 'normal',
      title: '파티 모집 기능 이용 안내',
      detail: '파티 모집 시 운영 정책을 준수해 주세요.',
      date: '2025.12.07',
   },
   {
      id: 10,
      type: 'update',
      title: '프로필 편집 기능 업데이트',
      detail: '프로필 편집 화면이 개선되었습니다.',
      date: '2025.12.06',
   },

   {
      id: 11,
      type: 'normal',
      title: '이미지 업로드 제한 안내',
      detail: '이미지 업로드 용량 제한이 적용됩니다.',
      date: '2025.12.05',
   },
   {
      id: 12,
      type: 'event',
      title: '첫 여행 기록 이벤트',
      detail: '첫 여행 기록 작성 시 혜택을 드립니다.',
      date: '2025.12.04',
   },
   {
      id: 13,
      type: 'update',
      title: '파티 채팅 기능 베타 오픈',
      detail: '파티원 간 채팅 기능이 베타로 오픈되었습니다.',
      date: '2025.12.03',
   },
   {
      id: 14,
      type: 'policy',
      title: '개인정보 처리방침 변경 안내',
      detail: '개인정보 처리방침이 일부 변경되었습니다.',
      date: '2025.12.02',
   },
   {
      id: 15,
      type: 'normal',
      title: '로그인 오류 해결 안내',
      detail: '일부 사용자에게 발생하던 로그인 오류가 해결되었습니다.',
      date: '2025.12.01',
   },

   {
      id: 16,
      type: 'event',
      title: '가을 여행 기록 챌린지 종료',
      detail: '가을 여행 기록 챌린지가 종료되었습니다.',
      date: '2025.11.30',
   },
   {
      id: 17,
      type: 'update',
      title: 'UI 디자인 개선 안내',
      detail: '일부 화면의 UI 디자인이 개선되었습니다.',
      date: '2025.11.29',
   },
   {
      id: 18,
      type: 'normal',
      title: '푸시 알림 지연 현상 안내',
      detail: '일시적인 서버 문제로 알림이 지연될 수 있습니다.',
      date: '2025.11.28',
   },
   {
      id: 19,
      type: 'policy',
      title: '신고 처리 기준 안내',
      detail: '신고 처리 기준에 대해 안내드립니다.',
      date: '2025.11.27',
   },
   { id: 20, type: 'event', title: '친구 초대 이벤트', detail: '친구 초대 시 혜택을 드립니다.', date: '2025.11.26' },

   {
      id: 21,
      type: 'normal',
      title: '고객센터 운영 시간 안내',
      detail: '고객센터 운영 시간은 평일 10시~18시입니다.',
      date: '2025.11.25',
   },
   {
      id: 22,
      type: 'update',
      title: '검색 기능 성능 개선',
      detail: '검색 속도와 정확도가 개선되었습니다.',
      date: '2025.11.24',
   },
   {
      id: 23,
      type: 'policy',
      title: '게시글 관리 정책 안내',
      detail: '게시글 관리 정책을 확인해 주세요.',
      date: '2025.11.23',
   },
   {
      id: 24,
      type: 'event',
      title: '주말 여행 추천 이벤트',
      detail: '추천 여행지를 확인하고 참여해 보세요.',
      date: '2025.11.22',
   },
   {
      id: 25,
      type: 'normal',
      title: '일부 기능 일시 제한 안내',
      detail: '점검으로 일부 기능이 제한됩니다.',
      date: '2025.11.21',
   },

   {
      id: 26,
      type: 'update',
      title: '여행 통계 기능 추가',
      detail: '여행 기록을 통계로 확인할 수 있습니다.',
      date: '2025.11.20',
   },
   {
      id: 27,
      type: 'event',
      title: '여행 사진 공유 이벤트',
      detail: '여행 사진을 공유하고 혜택을 받아보세요.',
      date: '2025.11.19',
   },
   {
      id: 28,
      type: 'normal',
      title: '서버 안정화 작업 안내',
      detail: '서버 안정화를 위한 작업이 진행됩니다.',
      date: '2025.11.18',
   },
   {
      id: 29,
      type: 'policy',
      title: '위치 정보 이용 안내',
      detail: '위치 정보 이용 정책을 안내드립니다.',
      date: '2025.11.17',
   },
   {
      id: 30,
      type: 'update',
      title: '마이페이지 기능 개선',
      detail: '마이페이지 구성이 개선되었습니다.',
      date: '2025.11.16',
   },

   {
      id: 31,
      type: 'normal',
      title: '앱 이용 시 유의사항 안내',
      detail: '서비스 이용 시 유의사항을 확인해 주세요.',
      date: '2025.11.15',
   },
   {
      id: 32,
      type: 'event',
      title: '테마 여행 기록 이벤트',
      detail: '테마 여행 기록 이벤트에 참여해 보세요.',
      date: '2025.11.14',
   },
   {
      id: 33,
      type: 'update',
      title: '다크모드 지원 안내',
      detail: '다크모드 기능이 추가되었습니다.',
      date: '2025.11.13',
   },
   {
      id: 34,
      type: 'policy',
      title: '계정 이용 제한 정책 안내',
      detail: '계정 이용 제한 기준을 안내드립니다.',
      date: '2025.11.12',
   },
   {
      id: 35,
      type: 'normal',
      title: '공지사항 이용 안내',
      detail: '공지사항을 통해 주요 소식을 전달드립니다.',
      date: '2025.11.11',
   },

   {
      id: 36,
      type: 'update',
      title: '지도 UI 개선',
      detail: '지도 화면의 사용성이 개선되었습니다.',
      date: '2025.11.10',
   },
   {
      id: 37,
      type: 'event',
      title: '사진 많이 올리기 이벤트',
      detail: '사진 업로드 이벤트에 참여해 보세요.',
      date: '2025.11.09',
   },
   {
      id: 38,
      type: 'normal',
      title: '시스템 안정화 완료 안내',
      detail: '시스템 안정화 작업이 완료되었습니다.',
      date: '2025.11.08',
   },
   {
      id: 39,
      type: 'policy',
      title: '콘텐츠 운영 정책 안내',
      detail: '콘텐츠 운영 정책을 안내드립니다.',
      date: '2025.11.07',
   },
   {
      id: 40,
      type: 'update',
      title: 'UX 개선 업데이트',
      detail: '사용자 경험 개선을 위한 업데이트가 진행되었습니다.',
      date: '2025.11.06',
   },

   {
      id: 41,
      type: 'normal',
      title: '공지사항 UI 개선',
      detail: '공지사항 화면이 개선되었습니다.',
      date: '2025.11.05',
   },
   {
      id: 42,
      type: 'event',
      title: '리뷰 작성 이벤트',
      detail: '여행 리뷰를 작성하고 혜택을 받아보세요.',
      date: '2025.11.04',
   },
   {
      id: 43,
      type: 'update',
      title: '필터 기능 추가',
      detail: '공지사항 필터 기능이 추가되었습니다.',
      date: '2025.11.03',
   },
   {
      id: 44,
      type: 'policy',
      title: '운영 정책 정비 안내',
      detail: '운영 정책이 전반적으로 정비되었습니다.',
      date: '2025.11.02',
   },
   {
      id: 45,
      type: 'normal',
      title: '서비스 이용 안내',
      detail: '서비스 이용 방법을 안내드립니다.',
      date: '2025.11.01',
   },

   {
      id: 46,
      type: 'event',
      title: '월간 여행 기록 이벤트',
      detail: '월간 여행 기록 이벤트가 진행 중입니다.',
      date: '2025.10.31',
   },
   {
      id: 47,
      type: 'update',
      title: '성능 최적화 업데이트',
      detail: '앱 전반의 성능이 개선되었습니다.',
      date: '2025.10.30',
   },
   {
      id: 48,
      type: 'normal',
      title: '일부 기능 점검 안내',
      detail: '일부 기능 점검이 예정되어 있습니다.',
      date: '2025.10.29',
   },
   {
      id: 49,
      type: 'policy',
      title: '약관 변경 사전 공지',
      detail: '약관 변경에 대한 사전 안내입니다.',
      date: '2025.10.28',
   },
   {
      id: 50,
      type: 'normal',
      title: '공지사항 서비스 안내',
      detail: '공지사항 서비스를 통해 소식을 전달합니다.',
      date: '2025.10.27',
   },
];

export const allPolicys: Notice[] = [
   {
      id: 1,
      title: '개인정보 처리방침',
      detail: `
[Myway] 개인정보 처리방침

[Myway]는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
본 개인정보 처리방침은 서비스 이용 과정에서 수집되는 개인정보의 항목, 이용 목적, 보관 및 보호 조치 등을 안내합니다.

제1조 (수집하는 개인정보 항목)
회사는 회원가입, 서비스 이용 과정에서 다음과 같은 개인정보를 수집할 수 있습니다.
- 필수정보: 이메일, 비밀번호, 닉네임
- 선택정보: 프로필 이미지, 관심 지역, 여행 기록 정보
- 서비스 이용 과정에서 자동 수집되는 정보: 접속 로그, 기기 정보, IP 주소

제2조 (개인정보의 이용 목적)
회사는 수집한 개인정보를 다음 목적을 위해 사용합니다.
- 회원 관리 및 본인 확인
- 서비스 제공 및 기능 개선
- 고객 문의 대응 및 공지사항 전달
- 서비스 이용 분석 및 통계

제3조 (개인정보의 보관 및 이용 기간)
회원의 개인정보는 원칙적으로 회원 탈퇴 시 지체 없이 파기됩니다.
다만, 관련 법령에 따라 보관이 필요한 경우에는 해당 기간 동안 보관됩니다.

제4조 (개인정보의 제3자 제공)
회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다.
단, 법령에 따라 요구되는 경우에는 예외로 합니다.

제5조 (개인정보 보호 조치)
회사는 개인정보의 안전성을 확보하기 위해 기술적·관리적 보호 조치를 취하고 있습니다.

본 방침은 2025년 12월 9일부터 적용됩니다.
`,
   },
   {
      id: 2,
      title: '위치 기반 서비스 이용 약관',
      detail: `
[Myway] 위치 기반 서비스 이용 약관

본 약관은 [Myway]가 제공하는 위치 기반 서비스와 관련하여 회사와 회원 간의 권리·의무를 규정합니다.

제1조 (위치 정보의 수집)
회사는 다음 목적을 위해 위치 정보를 수집·이용할 수 있습니다.
- 지도 기반 경로 생성 및 저장
- 주변 이벤트 및 파티 정보 제공
- 여행 기록 자동 위치 태깅

제2조 (위치 정보 이용 및 보관)
위치 정보는 서비스 제공을 위한 최소한의 범위에서 이용되며,
이용 목적 달성 후 즉시 파기됩니다.

제3조 (이용자의 권리)
회원은 언제든지 위치 정보 이용 동의를 철회할 수 있으며,
철회 시 위치 기반 서비스 이용이 제한될 수 있습니다.

제4조 (보호 조치)
회사는 위치 정보 보호를 위해 관련 법령이 정한 보호 조치를 준수합니다.

본 약관은 2025년 12월 9일부터 적용됩니다.
`,
   },
   {
      id: 3,
      title: '커뮤니티 운영 정책',
      detail: `
[Myway] 커뮤니티 운영 정책

본 정책은 서비스 내 커뮤니티, 파티, 댓글, 채팅 등 이용 시 적용됩니다.

제1조 (기본 원칙)
- 모든 이용자는 서로를 존중해야 합니다.
- 불쾌감을 주는 표현이나 행위는 허용되지 않습니다.

제2조 (금지 행위)
다음 행위는 서비스 이용이 제한될 수 있습니다.
- 욕설, 혐오, 차별 표현
- 허위 정보 유포 및 사기 행위
- 광고, 홍보 목적의 반복 게시
- 타인 사칭 또는 개인정보 침해

제3조 (신고 및 제재)
회사는 신고 접수 또는 자체 모니터링을 통해 위반 콘텐츠를 조치할 수 있습니다.
조치에는 게시물 삭제, 이용 제한, 계정 정지 등이 포함될 수 있습니다.

제4조 (운영 정책 변경)
운영 정책은 서비스 운영상 필요에 따라 변경될 수 있으며,
변경 시 사전 공지를 통해 안내합니다.
`,
   },
   {
      id: 4,
      title: '이용약관(서비스 약관)',
      detail: `
[Myway] 이용약관(서비스 약관)

본 약관은 [Myway] 서비스 이용과 관련하여 회사와 회원 간의 기본적인 사항을 규정합니다.

- 회원은 본 약관에 동의함으로써 서비스를 이용할 수 있습니다.
- 회사는 안정적인 서비스 제공을 위해 노력합니다.
- 회원은 서비스 이용 시 관련 법령과 본 약관을 준수해야 합니다.
- 회사는 서비스 운영상 필요 시 일부 기능을 변경하거나 중단할 수 있습니다.

본 약관은 2025년 12월 9일부터 적용됩니다.
`,
   },
];

const NoticeList = ({ data, filterType }: { data: Notice[]; filterType: 'all' | NoticeType }) => {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 18;

   // 1. 먼저 필터링을 수행합니다.
   const filteredNotices = useMemo(() => {
      if (filterType === 'all') return data;
      return data.filter(notice => notice.type === filterType);
   }, [data, filterType]);

   // 2. 필터링된 데이터를 기반으로 페이지네이션 계산
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
      <div className="flex flex-col min-h-0 h-[calc(100vh-300px)]">
         {/* flex-1: 남은 공간을 모두 차지 (리스트가 짧아도 공간을 확보하여 페이지네이션을 아래로 밈)
         overflow-y-auto: 리스트가 길어지면 이 영역 내부에서만 스크롤 발생
      */}
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

export default function MoreContent({ children }: { children?: React.ReactNode }) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const isDetailNotice = pathname.startsWith('/morepage/notice/');
   const isDetailPolicy = pathname.startsWith('/morepage/policy/');

   // URL 파라미터에서 tab 읽기
   const tabFromUrl = searchParams.get('tab');
   const [selectedTab, setSelectedTab] = useState(
      isDetailNotice ? 'notice' : isDetailPolicy ? 'policy' : tabFromUrl || 'alarm',
   );

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
      <div className="px-6 py-4 flex flex-col gap-6 h-screen overflow-hidden">
         <div className="text-2xl shrink-0">안녕하세요, 예빈님</div>
         <div className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="font-semibold text-2xl shrink-0">더보기</div>
            <div className="flex-1 min-h-0">
               <Tab
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  items={[
                     {
                        value: 'alarm',
                        label: '알림 설정',
                        content: (
                           <div className="flex flex-col gap-4 h-full">
                              <div className="text-xl flex flex-col gap-3 flex-1 overflow-y-auto">
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
                              <Button variant={'secondary'} size={'lg'} className="w-full shrink-0">
                                 저장
                              </Button>
                           </div>
                        ),
                     },
                     {
                        value: 'notice',
                        label: '공지사항',
                        content: isDetailNotice ? (
                           <div className="h-full overflow-hidden">{children}</div>
                        ) : (
                           <div className="flex flex-col h-full">
                              <Segment
                                 contents={[
                                    {
                                       value: 'all',
                                       title: '전체',
                                       content: <NoticeList data={allNotices} filterType="all" />,
                                    },
                                    {
                                       value: 'normal',
                                       title: '일반',
                                       content: <NoticeList data={allNotices} filterType="normal" />,
                                    },
                                    {
                                       value: 'update',
                                       title: '업데이트',
                                       content: <NoticeList data={allNotices} filterType="update" />,
                                    },
                                    {
                                       value: 'event',
                                       title: '이벤트',
                                       content: <NoticeList data={allNotices} filterType="event" />,
                                    },
                                    {
                                       value: 'policy',
                                       title: '이용정책',
                                       content: <NoticeList data={allNotices} filterType="policy" />,
                                    },
                                 ]}
                              />
                           </div>
                        ),
                     },
                     {
                        value: 'policy',
                        label: '이용약관 및 정책',
                        content: isDetailPolicy ? (
                           <div className="h-full overflow-hidden">{children}</div>
                        ) : (
                           <div className="flex flex-col gap-1">
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
                        ),
                     },
                  ]}
               />
            </div>
            {/* 버전 정보 */}
            <div className="flex items-center justify-between text-gray-600 shrink-0">
               <p>버전정보 v.1.00.0</p>
               <p>최신 버전</p>
            </div>
         </div>
      </div>
   );
}
