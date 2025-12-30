'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { useEffect, useMemo, useState } from 'react';
import { AddEvent } from './addEventDialog';
import { EventData, EventDisplayData, EventImage } from '@/types/userReport';
import { Input } from '@/components/ui/input';
import { EditEvent } from './editEventDialog';
import { supabase } from '@/lib/clientSupabase';

export default function Event() {
   const [events, setEvents] = useState<EventData[]>([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [statusFilter, setStatusFilter] = useState('all');
   const [sortFilter, setSortFilter] = useState('name');
   const [searchText, setSearchText] = useState('');
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
   const [isEditOpen, setIsEditOpen] = useState(false);

   //초기 데이터 로드
   useEffect(() => {
      fetchEvents();

      // 실시간 구독
      const channel = supabase
         .channel('events-changes')
         .on(
            'postgres_changes',
            {
               event: '*',
               schema: 'public',
               table: 'events',
            },
            payload => {
               console.log('이벤트 변경 감지:', payload);
               fetchEvents();
            },
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
      };
   }, []);

   const fetchEvents = async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from('events')
            .select(
               `
               *,
               event_images (
                  id,
                  image_url,
                  is_main
               )
            `,
            )
            .order('created_at', { ascending: false });

         if (error) throw error;
         setEvents(data || []);
      } catch (error) {
         console.error('이벤트 조회 실패:', error);
         alert('이벤트 목록을 불러오는데 실패하였습니다.');
      } finally {
         setLoading(false);
      }
   };

   const convertToDisplayData = (event: EventData): EventDisplayData => {
      const today = new Date();
      const start = new Date(event.start_date);
      const end = new Date(event.end_date);

      let state = '예정';
      if (today >= start && today <= end) {
         state = '진행중';
      } else if (today > end) {
         state = '종료';
      }

      let priceDisplay = '무료';
      if (event.price && event.price > 0) {
         priceDisplay = `${event.price.toLocaleString()}원`;
      }

      let operatingHours = '-';
      if (event.playtime) {
         const playTime = event.playtime || '00:00';
         operatingHours = `${playTime}`;
      }

      return {
         id: event.id!,
         name: event.title,
         host: event.organizer || '-',
         period: `${event.start_date} ~ ${event.end_date}`,
         operating_hours: operatingHours,
         price: priceDisplay,
         location: event.address ? `${event.address}${event.address2 ? ' ' + event.address2 : ''}` : '-',
         state,
         phone: event.phone || '-',
         insta_url: event.insta_url || '-',
      };
   };
   useEffect(() => {
      setCurrentPage(1);
   }, [statusFilter, sortFilter, searchText, startDate, endDate]);

   const filterData = useMemo(() => {
      const displayData = events.map(convertToDisplayData);
      return (
         displayData
            //상태
            .filter(event => (statusFilter === 'all' ? true : event.state === statusFilter))
            //검색어 + 분류
            .filter(event => {
               if (!searchText) return true;
               const field = sortFilter as keyof EventDisplayData;
               const value = String(event[field]).toLowerCase();

               if (field === 'operating_hours') {
                  return value.replace(/:/g, '').includes(searchText.replace(/:/g, '').toLowerCase());
               }

               return value.includes(searchText.toLowerCase());
            })
            // 기간
            .filter(event => {
               if (!startDate && !endDate) return true;
               const [start, end] = event.period.split('~').map(v => v.trim());
               const eventStart = new Date(start);
               const eventEnd = new Date(end || start);
               const filterStart = startDate ? new Date(startDate) : null;
               const filterEnd = endDate ? new Date(endDate) : null;

               if (filterStart && filterEnd) {
                  return eventEnd >= filterStart && eventStart <= filterEnd;
               }

               if (filterStart) return eventEnd >= filterStart;
               if (filterEnd) return eventStart <= filterEnd;
               return true;
            })
      );
   }, [events, statusFilter, sortFilter, searchText, startDate, endDate]);

   const itemsPerPage = 10;
   const totalPages = useMemo(() => {
      return Math.ceil(filterData.length / itemsPerPage);
   }, [filterData.length]);

   const currentData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filterData.slice(startIndex, endIndex);
   }, [currentPage, filterData]);

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleSearch = () => setCurrentPage(1);
   const handleReset = () => {
      setStatusFilter('all');
      setSortFilter('title');
      setSearchText('');
      setStartDate('');
      setEndDate('');
      setCurrentPage(1);
   };

   const handleAddEvents = async (formData: any) => {
      try {
         const eventData: Partial<EventData> = {
            title: formData.eventName,
            start_date: formData.startDate,
            playtime: formData.playTime,
            end_date: formData.endDate,
            address: formData.roadAddress,
            address2: formData.detailAddress,
            homepage: formData.eventHomepage,
            overview: formData.eventIntro,
            price: formData.isFreeForAll ? 0 : Number(formData.adultPrice) || 0,
            organizer: formData.organizer || '',
            content_id: Date.now(),
            phone: formData.phone || '',
            insta_url: formData.insta_url || '',
         };
         const { data: newEvent, error: eventError } = await supabase
            .from('events')
            .insert([eventData])
            .select()
            .single();

         if (eventError) throw eventError;

         if (formData.eventImages && formData.eventImages.length > 0) {
            const imageData: Partial<EventImage>[] = formData.eventImages.map((base64: string, index: number) => ({
               event_id: newEvent.id,
               image_url: base64, // Base64 문자열
               is_main: index === 0,
            }));

            const { error: imageError } = await supabase.from('event_images').insert(imageData);

            if (imageError) throw imageError;

            const { data: eventWithImages } = await supabase
               .from('events')
               .select(
                  `
                  *,
                  event_images (
                     id,
                     image_url,
                     is_main
                  )
               `,
               )
               .eq('id', newEvent.id)
               .single();

            // 로컬 업뎃
            setEvents(prev => [eventWithImages, ...prev]);
         } else {
            setEvents(prev => [newEvent, ...prev]);
         }
         setCurrentPage(1);
      } catch (error) {
         console.error('이벤트 등록 실패:', error);
         alert('이벤트 등록에 실패했습니다.');
         throw error;
      }
   };

   const handleRowClick = (displayEvent: EventDisplayData) => {
      const originalEvent = events.find(e => e.id === displayEvent.id);
      if (originalEvent) {
         console.log('📋 선택된 이벤트 (이미지 포함):', originalEvent);
         setSelectedEvent(originalEvent);
         setIsEditOpen(true);
      }
   };

   const handleEditEvents = async (formData: any, originalEvent: EventData) => {
      try {
         // 이벤트 데이터 업데이트
         const eventData: Partial<EventData> = {
            title: formData.eventName,
            start_date: formData.startDate,
            playtime: formData.playTime,
            end_date: formData.endDate,
            address: formData.roadAddress,
            address2: formData.detailAddress,
            homepage: formData.eventHomepage,
            overview: formData.eventIntro,
            price: formData.isFreeForAll ? 0 : Number(formData.adultPrice) || 0,
            organizer: formData.orgainzer || '',
            phone: formData.phone || '',
            insta_url: formData.insta_url || '',
         };

         const { error: eventError } = await supabase.from('events').update(eventData).eq('id', originalEvent.id);

         if (eventError) throw eventError;

         // 기존 이미지 삭제 (CASCADE로 자동 삭제됨)
         if (formData.eventImages && formData.eventImages.length > 0) {
            // 기존 이미지 삭제
            await supabase.from('event_images').delete().eq('event_id', originalEvent.id);

            // 새 이미지 삽입
            const imageData: Partial<EventImage>[] = formData.eventImages.map((url: string, index: number) => ({
               event_id: originalEvent.id,
               image_url: url,
               is_main: index === 0,
            }));

            const { error: imageError } = await supabase.from('event_images').insert(imageData);

            if (imageError) throw imageError;
         } else {
            //이미지 없으면 기존 이미지 삭제
            await supabase.from('event_images').delete().eq('event_id', originalEvent.id);
         }

         // 전체 목록 다시 조회
         fetchEvents();
         alert('이벤트가 수정되었습니다.');
      } catch (error) {
         console.error('이벤트 수정 실패:', error);
         alert('이벤트 수정에 실패했습니다.');
         throw error;
      }
   };

   const handleDeleteEvents = async (eventId: number) => {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      try {
         const { error: eventError } = await supabase.from('events').delete().eq('id', eventId);

         if (eventError) throw eventError;

         setEvents(prev => prev.filter(event => event.id !== eventId));

         const remainItems = events.filter(e => e.id !== eventId).length;
         const newTotalPages = Math.ceil(remainItems / itemsPerPage);
         if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
         }

         alert('이벤트가 삭제되었습니다.');
      } catch (error) {
         console.error('이벤트 삭제 실패:', error);
         alert('이벤트 삭제에 실패했습니다.');
         throw error;
      }
   };
   const handleCloseEdit = () => {
      setIsEditOpen(false);
      setSelectedEvent(null);
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-6 w-full h-full">
         <div className="text-foreground font-semibold text-2xl">이벤트 관리</div>

         <div className="flex justify-end">
            <AddEvent onAddEvent={handleAddEvents} />
         </div>
         <div className="flex flex-col p-4 gap-4 border rounded-md shrink-0 w-full">
            <div className="flex flex-col gap-4 xl:flex-row">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">상태</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'all', label: '전체' },
                           { value: '진행중', label: '진행중' },
                           { value: '예정', label: '예정' },
                           { value: '예약접수', label: '예약접수' },
                           { value: '취소', label: '취소' },
                           { value: '종료', label: '종료' },
                        ]}
                        className="w-full"
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">기간</div>
                  <div className="flex gap-2 items-center flex-wrap w-full">
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-xs text-foreground/50 font-semibold w-10 gap-4">시작일</div>
                        <Input
                           type="date"
                           className="h-10 w-full"
                           value={startDate}
                           onChange={e => setStartDate(e.target.value)}
                        />
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-xs text-foreground/50 font-semibold w-10 gap-4">종료일</div>
                        <Input
                           type="date"
                           className="h-10 w-full"
                           value={endDate}
                           onChange={e => setEndDate(e.target.value)}
                        />
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-4">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">분류</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'name', label: '이벤트 명' },
                           { value: 'host', label: '주최' },
                           { value: 'period', label: '기간' },
                           { value: 'operating_hours', label: '운영시간' },
                           { value: 'phone', label: '전화번호' },
                           { value: 'price', label: '가격' },
                           { value: 'location', label: '이벤트 장소' },
                           { value: 'state', label: '이벤트 상태' },
                        ]}
                        className="w-full"
                        value={sortFilter}
                        onValueChange={setSortFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">검색</div>
                  <div className="flex-1">
                     <SearchBar value={searchText} onChange={setSearchText} />
                  </div>
               </div>
            </div>
            <div className="flex justify-end gap-4">
               <Button variant={'secondary'} size={'lg'} onClick={handleReset}>
                  초기화
               </Button>
               <Button variant={'default'} size={'lg'} onClick={handleSearch}>
                  검색
               </Button>
            </div>
         </div>
         <div className="flex-1 min-h-0 relative overflow-hidden">
            <div className="absolute inset-0 overflow-auto">
               <TableComponent<EventDisplayData>
                  columns={[
                     {
                        key: 'name',
                        label: '이벤트 명',
                        align: 'left',
                        className: 'max-w-[200px] whitespace-normal break-words',
                     },
                     { key: 'host', label: '주최', className: 'max-w-[120px] whitespace-normal break-words' },
                     { key: 'period', label: '기간', className: 'max-w-[180px] whitespace-normal break-words' },
                     {
                        key: 'operating_hours',
                        label: '운영시간',
                        className: 'max-w-[100px] whitespace-normal break-words',
                     },
                     { key: 'phone', label: '전화번호', className: 'max-w-[120px] whitespace-normal break-words' },
                     { key: 'price', label: '가격', className: 'max-w-[80px]' },
                     {
                        key: 'location',
                        label: '이벤트 장소',
                        align: 'left',
                        className: 'max-w-[250px] whitespace-normal break-words',
                     },
                     {
                        key: 'state',
                        label: '이벤트 상태',
                        className: 'max-w-[100px]',
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
                                          : value === '예약접수' && 'bg-yellow-100 text-yellow-800'
                              }`}
                           >
                              {value}
                           </span>
                        ),
                     },
                  ]}
                  data={currentData}
                  onRowClick={handleRowClick}
               />
            </div>
         </div>
         <div className="flex justify-center items-center shrink-0">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>

         <EditEvent
            event={selectedEvent}
            isOpen={isEditOpen}
            onClose={handleCloseEdit}
            onEditEvent={handleEditEvents}
            onDeleteEvent={handleDeleteEvents}
         />
      </div>
   );
}
