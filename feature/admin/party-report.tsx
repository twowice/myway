'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useMemo, useState } from 'react';
import { TableComponent } from './table';

interface TableData {
   party_name: string;
   party_chairman_name: string;
   report_date: string;
   party_dissolution_date: string;
   sanction_type: string;
   party_reporter_name: string;
   report_category: string;
   is_processed: boolean;
}

const allPartyReports: TableData[] = [
   {
      party_name: '홍대 크리스마스 마켓 투어',
      party_chairman_name: '김철수',
      report_date: '2025-01-15',
      party_dissolution_date: '2025-01-22',
      sanction_type: '파티 해산',
      party_reporter_name: '이영희',
      report_category: '부적절한 언어',
      is_processed: true,
   },
   {
      party_name: '성수동 팝업스토어 탐방',
      party_chairman_name: '박민수',
      report_date: '2025-01-14',
      party_dissolution_date: '-',
      sanction_type: '미정',
      party_reporter_name: '최지현',
      report_category: '광고',
      is_processed: false,
   },
   {
      party_name: '한강 불꽃축제 관람',
      party_chairman_name: '정수진',
      report_date: '2025-01-13',
      party_dissolution_date: '2025-01-20',
      sanction_type: '파티 해산',
      party_reporter_name: '강민호',
      report_category: '사이비 포교 활동',
      is_processed: true,
   },
   {
      party_name: '코엑스 푸드트럭 축제',
      party_chairman_name: '홍길동',
      report_date: '2025-01-12',
      party_dissolution_date: '-',
      sanction_type: '미정',
      party_reporter_name: '윤서연',
      report_category: '미허가 영리활동',
      is_processed: false,
   },
   {
      party_name: '여의도 벚꽃축제 모임',
      party_chairman_name: '이동욱',
      report_date: '2025-01-11',
      party_dissolution_date: '2025-01-18',
      sanction_type: '파티 해산',
      party_reporter_name: '김나연',
      report_category: '불법 행위',
      is_processed: true,
   },
   {
      party_name: 'DDP 라이트업 페스티벌',
      party_chairman_name: '최준호',
      report_date: '2025-01-10',
      party_dissolution_date: '-',
      sanction_type: '미정',
      party_reporter_name: '박서준',
      report_category: '사칭 목적 파티',
      is_processed: false,
   },
   {
      party_name: '잠실 롯데월드 할로윈 파티',
      party_chairman_name: '강다은',
      report_date: '2025-01-09',
      party_dissolution_date: '2025-01-16',
      sanction_type: '파티 해산',
      party_reporter_name: '정하늘',
      report_category: '광고',
      is_processed: true,
   },
   {
      party_name: '광화문 광장 콘서트 관람',
      party_chairman_name: '신예은',
      report_date: '2025-01-08',
      party_dissolution_date: '-',
      sanction_type: '미정',
      party_reporter_name: '조민수',
      report_category: '기타',
      is_processed: false,
   },
   {
      party_name: '명동 크래프트 맥주 페스티벌',
      party_chairman_name: '한지우',
      report_date: '2025-01-07',
      party_dissolution_date: '2025-01-14',
      sanction_type: '파티 해산',
      party_reporter_name: '송유진',
      report_category: '부적절한 언어',
      is_processed: true,
   },
   {
      party_name: '이태원 월드 푸드 페스티벌',
      party_chairman_name: '오세훈',
      report_date: '2025-01-06',
      party_dissolution_date: '-',
      sanction_type: '미정',
      party_reporter_name: '임채원',
      report_category: '광고',
      is_processed: false,
   },
   {
      party_name: '강남 K-POP 팝업스토어 투어',
      party_chairman_name: '서민아',
      report_date: '2025-01-05',
      party_dissolution_date: '2025-01-12',
      sanction_type: '파티 해산',
      party_reporter_name: '노승우',
      report_category: '미허가 영리활동',
      is_processed: true,
   },
   {
      party_name: '서울랜드 빛축제 단체관람',
      party_chairman_name: '백현우',
      report_date: '2025-01-04',
      party_dissolution_date: '-',
      sanction_type: '미정',
      party_reporter_name: '하은비',
      report_category: '기타',
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
      <div className="flex w-full h-full flex-col gap-8">
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
                              { value: 'dissolution', label: '파티 해산' },
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
                              { value: 'party_reporter_name', label: '신고자 명' },
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
               <TableComponent<TableData>
                  columns={[
                     { key: 'party_name', label: '파티 명', width: 'w-[120px]' },
                     { key: 'party_chairman_name', label: '파티장 명', width: 'w-[100px]' },
                     { key: 'report_date', label: '신고 접수날짜', width: 'w-[130px]' },
                     { key: 'party_dissolution_date', label: '파티 해산 날짜', width: 'w-[130px]' },
                     { key: 'party_reporter_name', label: '신고자 명', width: 'w-[100px]' },
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
                        render: (value, row) => (
                           <Button
                              variant={value ? 'secondary' : 'default'}
                              size="sm"
                              onClick={() => !value && handleReportProcess(row.party_name)}
                              className="h-8 px-3 text-xs"
                           >
                              {value ? '제재 완료' : '신고 처리'}
                           </Button>
                        ),
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
