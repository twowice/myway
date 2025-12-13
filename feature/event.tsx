'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Icon24 } from '@/components/icons/icon24';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';

export default function Event() {
   return (
      <div className="flex w-full flex-col gap-6">
         <div>이벤트 관리</div>
         <div className="flex flex-col w-full gap-5">
            <div className="flex justify-end">
               <Button variant={'add'} size={'lg'}>
                  <Icon24 name="plus" className="text-primary-foreground" />
                  신규 등록
               </Button>
            </div>
            <div className="flex flex-col p-4 gap-4 border rounded-md">
               <div className="flex gap-4">
                  <ComboboxComponent
                     options={[
                        { value: 'all', label: '전체' },
                        { value: 'progress', label: '진행 중' },
                        { value: 'non_progress', label: '미진행' },
                        { value: 'previous_reservation', label: '예약접수' },
                        { value: 'cancel', label: '취소' },
                        { value: 'end', label: '종료' },
                     ]}
                     className="flex flex-1"
                  />
                  <div className="flex flex-1 border border-solid border-black"></div>
               </div>
               <div className="flex gap-4">
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
                     className="flex flex-1"
                  />
                  <div className="flex flex-1">
                     <SearchBar className="w-full" />
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
      </div>
   );
}
