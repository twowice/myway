'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useEffect, useMemo, useState } from 'react';
import { TableComponent } from './table';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { UserReportDialog } from './UserReportDialog';
import { UserReportData } from '@/types/userReport';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/clientSupabase';

export default function UserReport() {
   const [reports, setReports] = useState<UserReportData[]>([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [reportDate, setReportDate] = useState('');
   const [sortFilter, setSortFilter] = useState('user_name');
   const [searchText, setSearchText] = useState('');

   useEffect(() => {
      fetchReports();
   }, []);

   const fetchReports = async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from('user_reports')
            .select('*')
            .order('created_at', { ascending: false });

         if (error) throw error;

         const reportsWithPeriod = (data || []).map(report => ({
            ...report,
            sanction_period: calculateSactionPeriod(report),
         }));
         setReports(reportsWithPeriod);
      } catch (error) {
         console.error('신고 조회 실패:', error);
         alert('신고 목록을 불러오는데 실패하였습니다.');
      } finally {
         setLoading(false);
      }
   };

   const calculateSactionPeriod = (report: UserReportData): string => {
      if (!report.sanction_start_date || !report.sanction_end_date) {
         return '-';
      }
      const start = new Date(report.sanction_start_date).toLocaleDateString('ko-KR');
      const end = new Date(report.sanction_end_date).toLocaleDateString('ko-KR');
      return `${start}~${end}`;
   };

   const getSanctionTypeLabel = (type: string): string => {
      const labels: Record<string, string> = {
         account_suspended_7days: '7일 계정정지',
         account_suspended_14days: '14일 계정정지',
         account_suspended_30days: '30일 계정정지',
         account_suspended_permmanent: '영구 계정정지',
         undetermined: '미정',
      };
      return labels[type] || type;
   };
   useEffect(() => {
      setCurrentPage(1);
   }, [categoryFilter, sortFilter, searchText, reportDate, typeFilter]);

   const filterData = useMemo(() => {
      return (
         reports
            // 카테고리
            .filter(report => (categoryFilter === 'all' ? true : report.report_category === categoryFilter))
            // 제재 유형
            .filter(report => (typeFilter === 'all' ? true : report.sanction_type === typeFilter))
            // 검색
            .filter(report => {
               if (!searchText) return true;
               const field = sortFilter as keyof UserReportData;
               return String(report[field] ?? '')
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
            })
            // 신고 날짜
            .filter(report => {
               if (!reportDate) return true;
               const reportDay = new Date(report.report_date).toISOString().split('T')[0];
               return reportDay === reportDate; // 날짜만 비교
            })
      );
   }, [categoryFilter, typeFilter, sortFilter, searchText, reportDate, reports]);

   const itemsPerPage = 12;
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
      setSortFilter('user_name');
      setTypeFilter('all');
      setSearchText('');
      setReportDate('');
      setCurrentPage(1);
   };

   const handleUpdateReport = async (reportId: number, updateData: Partial<UserReportData>) => {
      try {
         const { error } = await supabase
            .from('user_reports')
            .update({
               ...updateData,
               updated_at: new Date().toISOString(),
            })
            .eq('id', reportId);

         if (error) throw error;

         setReports(prev =>
            prev.map(report =>
               report.id === reportId
                  ? { ...report, ...updateData, sanction_period: calculateSactionPeriod({ ...report, ...updateData }) }
                  : report,
            ),
         );
         alert('제재 정보가 업데이트되었습니다.');
      } catch (error) {
         console.error('신고 업데이트 실패:', error);
         alert('업데이트에 실패했습니다.');
         throw error;
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-full">
            <p>로딩 중...</p>
         </div>
      );
   }
   return (
      <div className="flex  w-full h-full flex-col  gap-6">
         <div className="text-foreground font-semibold text-2xl">사용자 신고 관리</div>

         <div className="flex flex-col p-4 gap-4 border rounded-md shrink-0 w-full">
            <div className="flex flex-col gap-4 xl:flex-row">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">카테고리</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'all', label: '전체' },
                           { value: '부정적인 언어', label: '부정적인 언어' },
                           { value: '도배', label: '도배' },
                           { value: '광고', label: '광고' },
                           { value: '사기', label: '사기' },
                           { value: '기타', label: '기타' },
                        ]}
                        className="w-full"
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">제재 유형</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'all', label: '전체' },
                           { value: 'account_suspended_7days', label: '7일 계정정지' },
                           { value: 'account_suspended_14days', label: '14일 계정정지' },
                           { value: 'account_suspended_30days', label: '30일 계정정지' },
                           { value: 'account_suspended_permanent', label: '영구 계정정지' },
                           { value: 'undetermined', label: '미정' },
                        ]}
                        className="w-full"
                        value={typeFilter}
                        onValueChange={setTypeFilter}
                     />
                  </div>
               </div>
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">신고 날짜</div>
                  <Input
                     type="date"
                     className="h-10 w-full"
                     value={reportDate}
                     onChange={e => setReportDate(e.target.value)}
                  />
               </div>
            </div>
            <div className="flex flex-col xl:flex-row gap-4">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">분류</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'user_name', label: '사용자 명' },
                           { value: 'phone_number', label: '전화번호' },
                           { value: 'reporter_name', label: '신고자 명' },
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
               <TableComponent<UserReportData>
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
                                 value === '7일 계정정지'
                                    ? 'bg-red-100 text-red-800'
                                    : value === '14일 계정정지'
                                      ? 'bg-orange-100 text-orange-800'
                                      : value === '30일 계정정지'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : value === '영구 계정정지'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
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
                        render: (value, row) => <UserReportDialog reportData={row} type="user-report" />,
                     },
                  ]}
                  data={currentData}
                  itemsPerPage={itemsPerPage}
               />
            </div>
         </div>

         <div className="flex justify-center shrink-0 items-center">
            <EllipsisPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
         </div>
      </div>
   );
}
