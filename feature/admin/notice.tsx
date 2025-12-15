'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Icon24 } from '@/components/icons/icon24';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { TableComponent } from './table';
import { useMemo, useState } from 'react';
import { EllipsisPagination } from '@/components/pagination/pagination';

interface TableData {
   name: string;
   add_date: string;
   edit_date: string;
   top_fixed: boolean;
   category: string;
}

const allNotices: TableData[] = [
   {
      name: '[공지] 2025년 설날 연휴 운영 안내',
      add_date: '2025-01-15',
      edit_date: '2025-01-16',
      top_fixed: true,
      category: '일반',
   },
   {
      name: '[업데이트] 새로운 기능이 추가되었습니다',
      add_date: '2025-01-10',
      edit_date: '2025-01-12',
      top_fixed: true,
      category: '업데이트',
   },
   {
      name: '[이벤트] 신규 회원 가입 이벤트 진행중',
      add_date: '2025-01-08',
      edit_date: '2025-01-08',
      top_fixed: false,
      category: '이벤트',
   },
   {
      name: '[정책] 개인정보 처리방침 변경 안내',
      add_date: '2025-01-05',
      edit_date: '2025-01-07',
      top_fixed: false,
      category: '이용정책',
   },
   {
      name: '[공지] 서비스 점검 안내 (1월 20일)',
      add_date: '2025-01-03',
      edit_date: '2025-01-03',
      top_fixed: false,
      category: '일반',
   },
   {
      name: '[업데이트] 모바일 앱 버전 2.5.0 업데이트',
      add_date: '2024-12-28',
      edit_date: '2024-12-30',
      top_fixed: false,
      category: '업데이트',
   },
   {
      name: '[이벤트] 연말 감사 프로모션 안내',
      add_date: '2024-12-20',
      edit_date: '2024-12-20',
      top_fixed: false,
      category: '이벤트',
   },
   {
      name: '[공지] 고객센터 운영시간 변경 안내',
      add_date: '2024-12-15',
      edit_date: '2024-12-18',
      top_fixed: false,
      category: '일반',
   },
   {
      name: '[정책] 서비스 이용약관 개정 안내',
      add_date: '2024-12-10',
      edit_date: '2024-12-10',
      top_fixed: false,
      category: '이용정책',
   },
   {
      name: '[업데이트] 새로운 결제 시스템 도입 안내',
      add_date: '2024-12-05',
      edit_date: '2024-12-06',
      top_fixed: false,
      category: '업데이트',
   },
   {
      name: '[기타] 파트너사 제휴 안내',
      add_date: '2024-12-01',
      edit_date: '2024-12-01',
      top_fixed: false,
      category: '기타',
   },
   {
      name: '[공지] 시스템 보안 강화 작업 완료',
      add_date: '2024-11-25',
      edit_date: '2024-11-27',
      top_fixed: false,
      category: '일반',
   },
];

export default function Notice() {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;

   const totalPages = useMemo(() => {
      return Math.ceil(allNotices.length / itemsPerPage);
   }, [itemsPerPage]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allNotices.slice(startIndex, endIndex);
   }, [currentPage, itemsPerPage]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   return (
      <div className="flex w-full h-full flex-col gap-8">
         <div>공지사항 관리</div>

         <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col w-full gap-5">
               <div className="flex justify-end">
                  <Button variant={'add'} size={'lg'}>
                     <Icon24 name="plus" className="text-primary-foreground" />
                     신규 등록
                  </Button>
               </div>

               <div className="flex flex-col p-4 gap-4 border rounded-md">
                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">카테고리</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'normal', label: '일반' },
                              { value: 'update', label: '업데이트' },
                              { value: 'event', label: '이벤트' },
                              { value: 'policy', label: '이용정책' },
                              { value: 'etc', label: '기타' },
                           ]}
                           className="w-full"
                        />
                     </div>
                     <div className="w-16">기간</div>
                     <div className="flex-1 h-full border"></div>
                  </div>

                  <div className="flex gap-4 text-base font-normal items-center">
                     <div className="w-16">분류</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'title', label: '제목' },
                              { value: 'content', label: '내용' },
                              { value: 'category', label: '카테고리' },
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
                     { key: 'name', label: '제목' },
                     { key: 'add_date', label: '게시날짜' },
                     { key: 'edit_date', label: '수정날짜' },
                     { key: 'top_fixed', label: '상단 고정 유무' },
                     { key: 'category', label: '카테고리' },
                  ]}
                  data={currentData}
               />
            </div>
         </div>

         <div className="flex justify-center">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>
      </div>
   );
}
