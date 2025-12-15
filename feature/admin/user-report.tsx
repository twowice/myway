'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useMemo, useState } from 'react';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';

interface TableData {
   user_name: string;
   phone_number: string;
   reporter_name: string;
   report_date: string;
   report_category: string;
   sanction_type: string;
   sanction_period: string;
   is_processed: boolean; // 신고 처리 여부
}

const allUserReports: TableData[] = [
   {
      user_name: '김철수',
      phone_number: '010-1234-5678',
      reporter_name: '이영희',
      report_date: '2025-01-15',
      report_category: '부정적인 언어',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-15 ~ 2025-01-22',
      is_processed: true,
   },
   {
      user_name: '박민수',
      phone_number: '010-2345-6789',
      reporter_name: '최지현',
      report_date: '2025-01-14',
      report_category: '도배',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-14 ~ 2025-01-21',
      is_processed: true,
   },
   {
      user_name: '정수진',
      phone_number: '010-3456-7890',
      reporter_name: '강민호',
      report_date: '2025-01-13',
      report_category: '광고',
      sanction_type: '미정',
      sanction_period: '-',
      is_processed: false,
   },
   {
      user_name: '홍길동',
      phone_number: '010-4567-8901',
      reporter_name: '윤서연',
      report_date: '2025-01-12',
      report_category: '사기',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-12 ~ 2025-01-19',
      is_processed: true,
   },
   {
      user_name: '이동욱',
      phone_number: '010-5678-9012',
      reporter_name: '김나연',
      report_date: '2025-01-11',
      report_category: '기타',
      sanction_type: '미정',
      sanction_period: '-',
      is_processed: false,
   },
   {
      user_name: '최준호',
      phone_number: '010-6789-0123',
      reporter_name: '박서준',
      report_date: '2025-01-10',
      report_category: '부정적인 언어',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-10 ~ 2025-01-17',
      is_processed: true,
   },
   {
      user_name: '강다은',
      phone_number: '010-7890-1234',
      reporter_name: '정하늘',
      report_date: '2025-01-09',
      report_category: '도배',
      sanction_type: '미정',
      sanction_period: '-',
      is_processed: false,
   },
   {
      user_name: '신예은',
      phone_number: '010-8901-2345',
      reporter_name: '조민수',
      report_date: '2025-01-08',
      report_category: '광고',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-08 ~ 2025-01-15',
      is_processed: true,
   },
   {
      user_name: '한지우',
      phone_number: '010-9012-3456',
      reporter_name: '송유진',
      report_date: '2025-01-07',
      report_category: '사기',
      sanction_type: '미정',
      sanction_period: '-',
      is_processed: false,
   },
   {
      user_name: '오세훈',
      phone_number: '010-0123-4567',
      reporter_name: '임채원',
      report_date: '2025-01-06',
      report_category: '부정적인 언어',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-06 ~ 2025-01-13',
      is_processed: true,
   },
   {
      user_name: '서민아',
      phone_number: '010-1111-2222',
      reporter_name: '노승우',
      report_date: '2025-01-05',
      report_category: '기타',
      sanction_type: '미정',
      sanction_period: '-',
      is_processed: false,
   },
   {
      user_name: '백현우',
      phone_number: '010-3333-4444',
      reporter_name: '하은비',
      report_date: '2025-01-04',
      report_category: '도배',
      sanction_type: '7일 계정정지',
      sanction_period: '2025-01-04 ~ 2025-01-11',
      is_processed: true,
   },
];

export default function UserReport() {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;

   const totalPages = useMemo(() => {
      return Math.ceil(allUserReports.length / itemsPerPage);
   }, [itemsPerPage]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allUserReports.slice(startIndex, endIndex);
   }, [currentPage, itemsPerPage]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   return (
      <div className="flex w-full h-full flex-col gap-8">
         <div>사용자 신고 관리</div>

         <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col w-full gap-5">
               <div className="flex flex-col p-4 gap-4 border rounded-md">
                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">카테고리</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'negative', label: '부정적인 언어' },
                              { value: 'spamming', label: '도배' },
                              { value: 'advertisement', label: '광고' },
                              { value: 'fraud', label: '사기' },
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
                              { value: 'Account_suspension_7days', label: '7일 계정정지' },
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
                              { value: 'user_name', label: '사용자 명' },
                              { value: 'phone_number', label: '전화번호' },
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
               <TableComponent<TableData>
                  columns={[
                     { key: 'user_name', label: '사용자 명', width: 'w-[100px]' },
                     { key: 'phone_number', label: '전화번호', width: 'w-[130px]' },
                     { key: 'report_date', label: '신고 접수날짜', width: 'w-[120px]' },
                     { key: 'sanction_period', label: '제재 기간', width: 'w-[170px]' },
                     {
                        key: 'sanction_type',
                        label: '제재 유형',
                        width: 'w-[120px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '7일 계정정지' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                     { key: 'reporter_name', label: '신고자 명', width: 'w-[100px]' },
                     {
                        key: 'report_category',
                        label: '카테고리',
                        width: 'w-[120px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '부정적인 언어'
                                    ? 'bg-red-100 text-red-800'
                                    : value === '도배'
                                      ? 'bg-orange-100 text-orange-800'
                                      : value === '광고'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : value === '사기'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
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
                        render: value => (
                           <Button variant={value ? 'secondary' : 'default'} size="sm" className="h-8 px-3 text-xs">
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
