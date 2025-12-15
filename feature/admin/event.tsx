'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Icon24 } from '@/components/icons/icon24';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { useMemo, useState } from 'react';

interface TableData {
   name: string;
   host: string;
   period: string;
   operating_hours: string;
   price: string;
   location: string;
   state: string;
}

const allEvents: TableData[] = [
   {
      name: '봄맞이 꽃 축제',
      host: '서울시',
      period: '2025-03-01 ~ 2025-03-31',
      operating_hours: '09:00 ~ 18:00',
      price: '무료',
      location: '여의도 공원',
      state: '진행중',
   },
   {
      name: '여름 음악 페스티벌',
      host: '문화재단',
      period: '2025-07-15 ~ 2025-07-17',
      operating_hours: '14:00 ~ 22:00',
      price: '50,000원',
      location: '올림픽공원',
      state: '예정',
   },
   {
      name: '가을 푸드 트럭 축제',
      host: '강남구청',
      period: '2025-09-10 ~ 2025-09-12',
      operating_hours: '11:00 ~ 20:00',
      price: '무료',
      location: '코엑스 광장',
      state: '예정',
   },
   {
      name: '겨울 빛 축제',
      host: '관광공사',
      period: '2024-12-01 ~ 2024-12-31',
      operating_hours: '17:00 ~ 23:00',
      price: '15,000원',
      location: '청계천',
      state: '종료',
   },
   {
      name: '크리스마스 마켓',
      host: '명동상인회',
      period: '2024-12-15 ~ 2024-12-25',
      operating_hours: '10:00 ~ 22:00',
      price: '무료',
      location: '명동 거리',
      state: '취소',
   },
   {
      name: '한강 불꽃축제',
      host: '서울시',
      period: '2025-10-05 ~ 2025-10-05',
      operating_hours: '19:00 ~ 21:00',
      price: '무료',
      location: '여의도 한강공원',
      state: '예정',
   },
   {
      name: '서울 재즈 페스티벌',
      host: '문화재단',
      period: '2025-05-20 ~ 2025-05-22',
      operating_hours: '16:00 ~ 22:00',
      price: '80,000원',
      location: '올림픽공원',
      state: '예정',
   },
   {
      name: '서울 국제 영화제',
      host: '영화진흥위원회',
      period: '2025-10-01 ~ 2025-10-10',
      operating_hours: '10:00 ~ 22:00',
      price: '12,000원',
      location: '광화문 시네마',
      state: '예정',
   },
   {
      name: '강남 페스티벌',
      host: '강남구청',
      period: '2025-08-15 ~ 2025-08-17',
      operating_hours: '12:00 ~ 21:00',
      price: '무료',
      location: '강남역 광장',
      state: '예정',
   },
   {
      name: '한강 마라톤 대회',
      host: '마라톤협회',
      period: '2025-04-20 ~ 2025-04-20',
      operating_hours: '06:00 ~ 12:00',
      price: '30,000원',
      location: '반포 한강공원',
      state: '예정',
   },
   {
      name: '서울 빛초롱 축제',
      host: '종로구청',
      period: '2025-11-01 ~ 2025-11-30',
      operating_hours: '18:00 ~ 23:00',
      price: '무료',
      location: '청계천 일대',
      state: '예정',
   },
   {
      name: '전통주 페스티벌',
      host: '농림축산식품부',
      period: '2025-09-25 ~ 2025-09-27',
      operating_hours: '13:00 ~ 20:00',
      price: '20,000원',
      location: 'DDP',
      state: '예정',
   },
];

export default function Event() {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;
   const totalPages = useMemo(() => {
      return Math.ceil(allEvents.length / itemsPerPage);
   }, [itemsPerPage]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return allEvents.slice(startIndex, endIndex);
   }, [currentPage, itemsPerPage]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };
   return (
      <div className="flex w-full h-full flex-col gap-8">
         <div>이벤트 관리</div>
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
                     <div className="w-16">상태</div>
                     <div className="w-50">
                        <ComboboxComponent
                           options={[
                              { value: 'all', label: '전체' },
                              { value: 'progress', label: '진행 중' },
                              { value: 'non_progress', label: '미진행' },
                              { value: 'previous_reservation', label: '예약접수' },
                              { value: 'cancel', label: '취소' },
                              { value: 'end', label: '종료' },
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
                              { value: 'name', label: '이벤트 명' },
                              { value: 'host', label: '주최' },
                              { value: 'period', label: '기간' },
                              { value: 'operating_hours', label: '운영시간' },
                              { value: 'price', label: '가격' },
                              { value: 'location', label: '이벤트 장소' },
                              { value: 'state', label: '이벤트 상태' },
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
                     { key: 'name', label: '이벤트 명' },
                     { key: 'host', label: '주최' },
                     { key: 'period', label: '기간' },
                     { key: 'operating_hours', label: '운영 시간' },
                     { key: 'price', label: '가격' },
                     { key: 'location', label: '이벤트 장소' },
                     {
                        key: 'state',
                        label: '이벤트 상태',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === '진행중'
                                    ? 'bg-green-100 text-green-800'
                                    : value === '예정'
                                      ? 'bg-blue-100 text-blue-800'
                                      : value === '종료'
                                        ? 'bg-gray-100 text-gray-800'
                                        : value === '취소'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
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
