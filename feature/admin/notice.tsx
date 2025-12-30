'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { TableComponent } from './table';
import { useEffect, useMemo, useState } from 'react';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { AddNotice } from './addNoticeDialog';
import { NoticeData, NoticeDisplayData } from '@/types/userReport';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/clientSupabase';
import { EditNotice } from './editNoticeDialog';

export default function Notice() {
   const [notices, setNotices] = useState<NoticeData[]>([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [sortFilter, setSortFilter] = useState('title');
   const [addDate, setAddDate] = useState('');
   const [editDate, setEditDate] = useState('');
   const [searchText, setSearchText] = useState('');
   const [selectedNotice, setSelectedNotice] = useState<NoticeData | null>(null);
   const [isEditOpen, setIsEditOpen] = useState(false);

   useEffect(() => {
      fetchNotices();
   }, []);

   const fetchNotices = async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from('notices')
            .select('*')
            .order('is_top_fixed', { ascending: false })
            .order('created_at', { ascending: false });

         if (error) throw error;
         setNotices(data || []);
      } catch (error) {
         console.error('공지사항 조회 실패:', error);
         alert('공지사항 목록을 불러오는데 실패하였습니다.');
      } finally {
         setLoading(false);
      }
   };

   const convertToDisplayData = (notice: NoticeData): NoticeDisplayData => {
      return {
         id: notice.id!,
         category: getCategoryLabel(notice.category),
         title: notice.title,
         created_at: new Date(notice.created_at!).toLocaleDateString('ko-KR'),
         is_top_fixed: notice.is_top_fixed,
      };
   };

   const getCategoryLabel = (category: string): string => {
      const labels: Record<string, string> = {
         normal: '일반',
         update: '업데이트',
         event: '이벤트',
         policy: '이용정책',
      };
      return labels[category] || category;
   };

   useEffect(() => {
      setCurrentPage(1);
   }, [categoryFilter, sortFilter, searchText]);

   const filterData = useMemo(() => {
      const displayData = notices.map(convertToDisplayData);
      return (
         displayData
            // 카테고리
            .filter(notice => (categoryFilter === 'all' ? true : notice.category === categoryFilter))
            // 검색
            .filter(notice => {
               if (!searchText) return true;
               const field = sortFilter as keyof NoticeDisplayData;
               return String(notice[field] ?? '')
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
            })
            // 게시날짜
            .filter(notice => {
               if (!addDate) return true;
               const noticeDate = new Date(notice.created_at).toISOString().split('T')[0];
               return noticeDate === addDate;
            })
            // 수정날짜
            .filter(notice => {
               if (!editDate) return true;
               const originalNotice = notices.find(n => n.id === notice.id);
               if (!originalNotice?.updated_at) return false;
               const noticeEditDate = new Date(originalNotice.updated_at).toISOString().split('T')[0];
               return noticeEditDate === editDate;
            })
      );
   }, [categoryFilter, sortFilter, searchText, notices, addDate, editDate]);

   const itemsPerPage = 11;
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
      setCategoryFilter('all');
      setSortFilter('name');
      setSearchText('');
      setCurrentPage(1);
   };

   const handleAddNotice = async (formData: any) => {
      try {
         const noticeData: Partial<NoticeData> = {
            category: formData.category,
            is_top_fixed: formData.isTopFixed,
            title: formData.title,
            content: formData.content,
         };

         const { data: newNotice, error } = await supabase.from('notices').insert([noticeData]).select().single();

         if (error) throw error;

         setNotices(prev => [newNotice, ...prev]);
         setCurrentPage(1);
      } catch (error) {
         console.error('공지사항 등록 실패:', error);
         alert('공지사항 등록에 실패했습니다.');
         throw error;
      }
   };

   const handleRowClick = (displayNotice: NoticeDisplayData) => {
      const originalNotice = notices.find(n => n.id === displayNotice.id);
      if (originalNotice) {
         setSelectedNotice(originalNotice);
         setIsEditOpen(true);
      }
   };

   const handleEditNotice = async (formData: any, originalNotice: NoticeData) => {
      try {
         const noticeData: Partial<NoticeData> = {
            category: formData.category,
            is_top_fixed: formData.isTopFixed,
            title: formData.title,
            content: formData.content,
            updated_at: new Date().toISOString(),
         };
         const { error } = await supabase.from('notices').update(noticeData).eq('id', originalNotice.id);

         if (error) throw error;

         const { data: updatedNotice } = await supabase
            .from('notices')
            .select('*')
            .eq('id', originalNotice.id)
            .single();

         setNotices(prev => prev.map(notice => (notice.id === originalNotice.id ? updatedNotice : notice)));
      } catch (error) {
         console.error('공지사항 수정 실패:', error);
         alert('공지사항 수정에 실패했습니다.');
         throw error;
      }
   };

   const handleDeleteNotice = async (noticeId: number) => {
      try {
         const { error } = await supabase.from('notices').delete().eq('id', noticeId);

         if (error) throw error;

         setNotices(prev => prev.filter(notice => notice.id !== noticeId));

         const remainItems = notices.filter(n => n.id !== noticeId).length;
         const newTotalPages = Math.ceil(remainItems / itemsPerPage);
         if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
         }
      } catch (error) {
         console.error('공지사항 삭제 실패:', error);
         alert('공지사항 삭제에 실패했습니다.');
         throw error;
      }
   };

   const handleCloseEdit = () => {
      setIsEditOpen(false);
      setSelectedNotice(null);
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
         </div>
      );
   }

   return (
      <div className="flex flex-1 flex-col gap-6 w-full h-full">
         <div className="text-foreground font-semibold text-2xl">공지사항 관리</div>

         <div className="flex justify-end">
            <AddNotice onAddNotice={handleAddNotice} />
         </div>

         <div className="flex flex-col p-4 gap-4 border rounded-md shrink-0 w-full">
            <div className="flex flex-col gap-4 xl:flex-row">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">카테고리</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'all', label: '전체' },
                           { value: '일반', label: '일반' },
                           { value: '업데이트', label: '업데이트' },
                           { value: '이벤트', label: '이벤트' },
                           { value: '이용정책', label: '이용정책' },
                           { value: '기타', label: '기타' },
                        ]}
                        className="w-full"
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">기간</div>
                  <div className="flex gap-2 items-center flex-wrap w-full">
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-xs text-foreground/50 font-semibold gap-4">게시날짜</div>
                        <Input
                           type="date"
                           className="h-10 w-full"
                           value={addDate}
                           onChange={e => setAddDate(e.target.value)}
                        />
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-xs text-foreground/50 font-semibold gap-4">수정날짜</div>
                        <Input
                           type="date"
                           className="h-10 w-full"
                           value={editDate}
                           onChange={e => setEditDate(e.target.value)}
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
                           { value: 'title', label: '제목' },
                           { value: 'category', label: '카테고리' },
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
               <TableComponent<NoticeDisplayData>
                  columns={[
                     {
                        key: 'title',
                        label: '제목',
                        align: 'left',
                        render: (value, row) => (
                           <div className="flex items-center gap-2">
                              {row.is_top_fixed && (
                                 <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded">고정</span>
                              )}
                              <span>{value}</span>
                           </div>
                        ),
                     },
                     { key: 'category', label: '카테고리' },
                     { key: 'created_at', label: '등록일' },
                  ]}
                  data={currentData}
                  onRowClick={handleRowClick}
               />
            </div>
         </div>

         <div className="flex justify-center items-center shrink-0">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>

         <EditNotice
            notice={selectedNotice}
            isOpen={isEditOpen}
            onClose={handleCloseEdit}
            onEditNotice={handleEditNotice}
            onDeleteNotice={handleDeleteNotice}
         />
      </div>
   );
}
