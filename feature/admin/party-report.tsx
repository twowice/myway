'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useMemo, useState } from 'react';
import { TableComponent } from './table';
import { UserReportDialog } from './UserReportDialog';
import { PartyReportData } from '@/types/userReport';

const allPartyReports: PartyReportData[] = [
   {
      party_name: '홍대 크리스마스 마켓 투어',
      party_chairman_name: '김철수',
      user_name: '박지훈',
      report_date: '2025-01-15',
      party_dissolution_date: '2025-01-22',
      event_name: '크리스마스 마켓',
      sanction_content: '파티 내에서 부적절한 언어 사용 및 다른 참가자들을 불쾌하게 하는 행동이 발견되었습니다.',
      sanction_type: '파티 해산',
      reporter_name: '이영희',
      report_category: '부적절한 언어',
      add_opinion: '파티장이 여러 차례 경고를 무시했습니다.',
      is_processed: true,
   },
   {
      party_name: '성수동 팝업스토어 탐방',
      party_chairman_name: '박민수',
      user_name: '정다빈',
      report_date: '2025-01-14',
      party_dissolution_date: '-',
      event_name: '성수동 팝업 투어',
      sanction_content: '파티가 상업적 광고 목적으로 운영되고 있습니다.',
      sanction_type: '미정',
      reporter_name: '최지현',
      report_category: '광고',
      add_opinion: '계속해서 특정 브랜드를 홍보하고 있습니다.',
      is_processed: false,
   },
   {
      party_name: '한강 불꽃축제 관람',
      party_chairman_name: '정수진',
      user_name: '김도윤',
      report_date: '2025-01-13',
      party_dissolution_date: '2025-01-20',
      event_name: '한강 불꽃축제',
      sanction_content: '파티 내에서 사이비 종교 포교 활동이 진행되었습니다.',
      sanction_type: '파티 해산',
      reporter_name: '강민호',
      report_category: '사이비 포교 활동',
      add_opinion: '매우 불쾌했고 다른 참가자들도 피해를 입었습니다.',
      is_processed: true,
   },
   {
      party_name: '코엑스 푸드트럭 축제',
      party_chairman_name: '홍길동',
      user_name: '서지안',
      report_date: '2025-01-12',
      party_dissolution_date: '-',
      event_name: '코엑스 푸드 페스티벌',
      sanction_content: '파티 참가비를 받고 미허가 영리 활동을 진행했습니다.',
      sanction_type: '미정',
      reporter_name: '윤서연',
      report_category: '미허가 영리활동',
      add_opinion: '참가비를 환불받지 못했습니다.',
      is_processed: false,
   },
   {
      party_name: '여의도 벚꽃축제 모임',
      party_chairman_name: '이동욱',
      user_name: '문서윤',
      report_date: '2025-01-11',
      party_dissolution_date: '2025-01-18',
      event_name: '여의도 벚꽃축제',
      sanction_content: '파티 진행 중 불법 행위가 발생했습니다.',
      sanction_type: '파티 해산',
      reporter_name: '김나연',
      report_category: '불법 행위',
      add_opinion: '경찰에도 신고했습니다.',
      is_processed: true,
   },
   {
      party_name: 'DDP 라이트업 페스티벌',
      party_chairman_name: '최준호',
      user_name: '오지훈',
      report_date: '2025-01-10',
      party_dissolution_date: '-',
      event_name: 'DDP 라이트업',
      sanction_content: '공식 행사를 사칭하여 파티를 운영하고 있습니다.',
      sanction_type: '미정',
      reporter_name: '박서준',
      report_category: '사칭 목적 파티',
      add_opinion: '공식 행사인 줄 알고 참가했습니다.',
      is_processed: false,
   },
   {
      party_name: '잠실 롯데월드 할로윈 파티',
      party_chairman_name: '강다은',
      user_name: '김하린',
      report_date: '2025-01-09',
      party_dissolution_date: '2025-01-16',
      event_name: '롯데월드 할로윈',
      sanction_content: '파티 채팅방에서 지속적인 광고 메시지를 전송했습니다.',
      sanction_type: '파티 해산',
      reporter_name: '정하늘',
      report_category: '광고',
      add_opinion: '채팅방이 광고로 도배되어 불편했습니다.',
      is_processed: true,
   },
   {
      party_name: '광화문 광장 콘서트 관람',
      party_chairman_name: '신예은',
      user_name: '이준서',
      report_date: '2025-01-08',
      party_dissolution_date: '-',
      event_name: '광화문 광장 콘서트',
      sanction_content: '파티 운영 방식에 대한 불만이 제기되었습니다.',
      sanction_type: '미정',
      reporter_name: '조민수',
      report_category: '기타',
      add_opinion: '',
      is_processed: false,
   },
   {
      party_name: '명동 크래프트 맥주 페스티벌',
      party_chairman_name: '한지우',
      user_name: '정유나',
      report_date: '2025-01-07',
      party_dissolution_date: '2025-01-14',
      event_name: '명동 맥주 페스티벌',
      sanction_content: '파티장이 참가자들에게 부적절한 언어를 사용했습니다.',
      sanction_type: '파티 해산',
      reporter_name: '송유진',
      report_category: '부적절한 언어',
      add_opinion: '파티 분위기가 매우 불쾌했습니다.',
      is_processed: true,
   },
   {
      party_name: '이태원 월드 푸드 페스티벌',
      party_chairman_name: '오세훈',
      user_name: '김서연',
      report_date: '2025-01-06',
      party_dissolution_date: '-',
      event_name: '이태원 푸드 페스티벌',
      sanction_content: '상업적 목적의 광고 활동이 지속되고 있습니다.',
      sanction_type: '미정',
      reporter_name: '임채원',
      report_category: '광고',
      add_opinion: '파티가 아닌 영업 활동 같았습니다.',
      is_processed: false,
   },
   {
      party_name: '강남 K-POP 팝업스토어 투어',
      party_chairman_name: '서민아',
      user_name: '박현우',
      report_date: '2025-01-05',
      party_dissolution_date: '2025-01-12',
      event_name: 'K-POP 팝업스토어',
      sanction_content: '무허가로 유료 투어 프로그램을 운영했습니다.',
      sanction_type: '파티 해산',
      reporter_name: '노승우',
      report_category: '미허가 영리활동',
      add_opinion: '환불을 요청했지만 거부당했습니다.',
      is_processed: true,
   },
   {
      party_name: '서울랜드 빛축제 단체관람',
      party_chairman_name: '백현우',
      user_name: '윤하린',
      report_date: '2025-01-04',
      party_dissolution_date: '-',
      event_name: '서울랜드 빛축제',
      sanction_content: '파티 설명과 실제 내용이 달랐습니다.',
      sanction_type: '미정',
      reporter_name: '하은비',
      report_category: '기타',
      add_opinion: '',
      is_processed: false,
   },
];

export default function PartyReport() {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;

   const totalPages = useMemo(() => {
      return Math.ceil(allPartyReports.length / itemsPerPage);
   }, [itemsPerPage]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allPartyReports.slice(startIndex, endIndex);
   }, [currentPage, itemsPerPage]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleReportProcess = (partyName: string) => {
      console.log(`신고 처리: ${partyName}`);
   };

   return (
      <div className="flex w-full h-full flex-col gap-6">
         <div className="text-2xl font-semibold">파티 신고 관리</div>

         <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col w-full gap-5">
               <div className="flex flex-col p-4 gap-4 border rounded-md">
                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">카테고리</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'cult_activity', label: '사이비 포교 활동' },
                              { value: 'unauthorized_commercial', label: '미허가 영리활동' },
                              { value: 'inappropriate_language', label: '부적절한 언어' },
                              { value: 'impersonation', label: '사칭 목적 파티' },
                              { value: 'illegal_activity', label: '불법 행위' },
                              { value: 'advertisement', label: '광고' },
                              { value: 'etc', label: '기타' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">제재 유형</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'party_dissolution', label: '파티 해산' },
                              { value: 'party_restore', label: '파티 복구' },
                              { value: 'undetermined', label: '미정' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">신고 기간</div>
                     <div className="flex-1 h-full border"></div>
                  </div>

                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">분류</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'party_name', label: '파티 명' },
                              { value: 'party_chairman_name', label: '파티 생성자 명' },
                              { value: 'reporter_name', label: '신고자 명' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">검색</div>
                     <div className="flex-1">
                        <SearchBar />
                     </div>
                  </div>

                  <div className="flex justify-end gap-4">
                     <Button variant={'secondary'} size={'lg'}>
                        초기화
                     </Button>
                     <Button variant={'default'} size={'lg'}>
                        검색
                     </Button>
                  </div>
               </div>
            </div>

            <div className="flex-1 min-h-0">
               <TableComponent<PartyReportData>
                  columns={[
                     { key: 'party_name', label: '파티 명', width: 'w-[120px]' },
                     { key: 'party_chairman_name', label: '파티장 명', width: 'w-[100px]' },
                     { key: 'report_date', label: '신고 접수날짜', width: 'w-[130px]' },
                     { key: 'party_dissolution_date', label: '파티 해산 날짜', width: 'w-[130px]' },
                     { key: 'reporter_name', label: '신고자 명', width: 'w-[100px]' },
                     {
                        key: 'report_category',
                        label: '신고 사유',
                        width: 'w-[140px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '사이비 포교 활동'
                                    ? 'bg-red-100 text-red-800'
                                    : value === '미허가 영리활동'
                                      ? 'bg-orange-100 text-orange-800'
                                      : value === '부적절한 언어'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : value === '불법 행위'
                                          ? 'bg-purple-100 text-purple-800'
                                          : value === '광고'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                     {
                        key: 'sanction_type',
                        label: '제재 유형',
                        width: 'w-[100px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '파티 해산' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                     {
                        key: 'is_processed',
                        label: '제재관리',
                        width: 'w-[110px]',
                        render: (value, row) => <UserReportDialog reportData={row} type="party-report" />,
                     },
                  ]}
                  data={currentData}
                  itemsPerPage={12}
               />
            </div>
         </div>

         <div className="flex justify-center">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>
      </div>
   );
}
