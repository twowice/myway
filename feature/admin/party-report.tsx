'use client';

import { ComboboxComponent } from '@/components/basic/combo';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { Button } from '@/components/ui/button/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useEffect, useMemo, useState } from 'react';
import { TableComponent } from './table';
import { UserReportDialog } from './UserReportDialog';
import { PartyReportData } from '@/types/userReport';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/clientSupabase';

export default function PartyReport() {
   const [reports, setReports] = useState<PartyReportData[]>([]);
   const [loading, setLoading] = useState(true);
   const [currentPage, setCurrentPage] = useState(1);
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [partyDate, setPartyDate] = useState('');
   const [sortFilter, setSortFilter] = useState('party_name');
   const [searchText, setSearchText] = useState('');
   const reportCategoryLabels: Record<string, string> = {
      cult_activity: '사이비 포교 활동',
      unauthorized_commercial: '미허가 영리활동',
      inappropriate_language: '부적절한 언어',
      impersonation: '사칭 목적 파티',
      illegal_activity: '불법 행위',
      advertisementetc: '광고',
      etc: '기타',
   };
   const reportCategoryValuesByLabel: Record<string, string> = Object.fromEntries(
      Object.entries(reportCategoryLabels).map(([value, label]) => [label, value]),
   );

   const normalizeReportCategory = (value?: string | null) => {
      if (!value) return 'etc';
      if (reportCategoryLabels[value]) return value;
      return reportCategoryValuesByLabel[value] ?? value;
   };

   const getReportCategoryLabel = (value?: string | null) => {
      const normalized = normalizeReportCategory(value);
      return reportCategoryLabels[normalized] ?? value ?? '-';
   };

   const toDateKey = (value: string) => new Date(value).toLocaleDateString('sv-SE');

   useEffect(() => {
      fetchReports();
   }, []);

   const fetchReports = async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from('party_reports')
            .select('*')
            .order('created_at', { ascending: false });

         if (error) throw error;
         const normalized = (data ?? []).map(report => ({
            ...report,
            report_category: normalizeReportCategory(report.report_category),
         }));
         setReports(normalized);
      } catch (error) {
         console.error('파티 신고 조회 실패:', error);
         alert('파티 신고 목록을 불러오는데 실패하였습니다.');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      setCurrentPage(1);
   }, [categoryFilter, sortFilter, searchText, partyDate, typeFilter]);

   const filterData = useMemo(() => {
      return (
         reports
            // 카테고리
            .filter(party => (categoryFilter === 'all' ? true : party.report_category === categoryFilter))
            // 제재 유형
            .filter(party => (typeFilter === 'all' ? true : party.sanction_type === typeFilter))
            // 검색
            .filter(party => {
               if (!searchText) return true;
               const field = sortFilter as keyof PartyReportData;
               return String(party[field] ?? '')
                  .toLowerCase()
                  .includes(searchText.toLowerCase());
            })
            // 신고 날짜
            .filter(party => {
               if (!partyDate) return true;
               if (!party.report_date) return false;
               return toDateKey(party.report_date) === partyDate;
            })
      );
   }, [categoryFilter, typeFilter, sortFilter, searchText, partyDate, reports]);

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
      setSortFilter('party_name');
      setTypeFilter('all');
      setSearchText('');
      setPartyDate('');
      setCurrentPage(1);
   };

   const handleUpdateReport = async (reportId: number, updateData: Partial<PartyReportData>) => {
      try {
         const targetReport = reports.find(report => report.id === reportId);
         const partyId = targetReport?.party_id;

         const { error } = await supabase
            .from('party_reports')
            .update({
               ...updateData,
               updated_at: new Date().toISOString(),
            })
            .eq('id', reportId);

         if (error) throw error;

         const sanctionType = updateData.sanction_type;
         if (partyId && (sanctionType === 'party_dissolution' || sanctionType === 'party_restore')) {
            if (sanctionType === 'party_dissolution') {
               const { error: partyError } = await supabase
                  .from('parties')
                  .update({ status: 'disbanded' })
                  .eq('id', partyId);
               if (partyError) throw partyError;
            } else {
               const { data: party, error: partyFetchError } = await supabase
                  .from('parties')
                  .select('gathering_date')
                  .eq('id', partyId)
                  .single();
               if (partyFetchError) throw partyFetchError;

               const gatheringDate = party?.gathering_date ? new Date(party.gathering_date) : null;
               const nextStatus =
                  gatheringDate && !Number.isNaN(gatheringDate.getTime()) && gatheringDate < new Date()
                     ? 'closed'
                     : 'open';

               const { error: partyUpdateError } = await supabase
                  .from('parties')
                  .update({ status: nextStatus })
                  .eq('id', partyId);
               if (partyUpdateError) throw partyUpdateError;
            }
         }

         // 로컬 상태 업데이트
         setReports(prev => prev.map(report => (report.id === reportId ? { ...report, ...updateData } : report)));

         alert('제재 정보가 업데이트되었습니다.');
      } catch (error) {
         console.error('파티 신고 업데이트 실패:', error);
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
      <div className="flex flex-col gap-6 w-full h-full">
         <div className="text-foreground font-semibold text-2xl">파티 신고 관리</div>

         <div className="flex flex-col p-4 gap-4 border rounded-md shrink-0 w-full">
            <div className="flex flex-col gap-4 xl:flex-row">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">카테고리</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'all', label: '전체' },
                           { value: 'cult_activity', label: '사이비 포교 활동' },
                           { value: 'unauthorized_commercial', label: '미허가 영리활동' },
                           { value: 'inappropriate_language', label: '부적절한 언어' },
                           { value: 'impersonation', label: '사칭 목적 파티' },
                           { value: 'illegal_activity', label: '불법 행위' },
                           { value: 'advertisementetc', label: '광고' },
                           { value: 'etc', label: '기타' },
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
                           { value: 'party_dissolution', label: '파티 해산' },
                           { value: 'party_restore', label: '파티 복구' },
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
                  <div className="flex-1">
                     <Input
                        type="date"
                        className="h-10 w-full"
                        value={partyDate}
                        onChange={e => setPartyDate(e.target.value)}
                     />
                  </div>
               </div>
            </div>
            <div className="flex flex-col gap-4 xl:flex-row">
               <div className="flex gap-4 text-base font-normal items-center xl:flex-1">
                  <div className="w-16 shrink-0">분류</div>
                  <div className="flex-1">
                     <ComboboxComponent
                        options={[
                           { value: 'party_name', label: '파티 명' },
                           { value: 'party_chairman_name', label: '파티장 명' },
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

            <div className="flex gap-4 justify-end xl:flex-1">
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
               <TableComponent<PartyReportData>
                  columns={[
                     { key: 'party_name', label: '파티 명', width: 'w-[120px]' },
                     { key: 'party_chairman_name', label: '파티장 명', width: 'w-[100px]' },
                     {
                        key: 'report_date',
                        label: '신고 접수날짜',
                        width: 'w-[150px]',
                        render: value => {
                           if (!value) return '-';
                           const date = new Date(value);
                           return date.toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                           });
                        },
                     },
                     {
                        key: 'party_dissolution_date',
                        label: '파티 해산 날짜',
                        width: 'w-[150px]',
                        render: value => {
                           if (!value) return '-';
                           const date = new Date(value);
                           return date.toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                           });
                        },
                     },
                     { key: 'reporter_name', label: '신고자 명', width: 'w-[100px]' },
                     {
                        key: 'report_category',
                        label: '카테고리',
                        width: 'w-[140px]',
                        render: value => (
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 value === 'cult_activity'
                                    ? 'bg-red-100 text-red-800'
                                    : value === 'unauthorized_commercial'
                                      ? 'bg-orange-100 text-orange-800'
                                      : value === 'inappropriate_language'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : value === 'illegal_activity'
                                          ? 'bg-purple-100 text-purple-800'
                                          : value === 'advertisementetc'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {getReportCategoryLabel(value)}
                           </span>
                        ),
                     },
                     {
                        key: 'sanction_type',
                        label: '제재 유형',
                        width: 'w-[100px]',
                        render: value => {
                           let displayText = '미정';
                           let colorClass = 'bg-gray-100 text-gray-800';

                           if (value === 'party_dissolution') {
                              displayText = '파티 해산';
                              colorClass = 'bg-red-100 text-red-800';
                           } else if (value === 'party_restore') {
                              displayText = '파티 복구';
                              colorClass = 'bg-green-100 text-green-800';
                           }

                           return (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                                 {displayText}
                              </span>
                           );
                        },
                     },
                     {
                        key: 'is_processed',
                        label: '제재관리',
                        width: 'w-[110px]',
                        render: (value, row) => (
                           <UserReportDialog reportData={row} type="party-report" onUpdate={handleUpdateReport} />
                        ),
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
