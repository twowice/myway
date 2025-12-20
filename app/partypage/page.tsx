'use client';

import { CheckboxComponent } from '@/components/basic/checkbox';
import PartyPanel from '@/components/header/panels/partypanel';
import { Icon24 } from '@/components/icons/icon24';
import { EllipsisPagination } from '@/components/pagination/pagination';
import { PartyRow } from '@/components/partyrow/PartyRow';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/searchBar';
import { parties as initialParties } from '@/dummy/party';
import { PartyCreatePopup } from '@/feature/party/partyCreatePopup';
import { PartyDetailPopup } from '@/feature/party/partyDetailPopup';
import { useMemo, useState } from 'react';

export default function Party() {
   const [partyList, setPartyList] = useState(initialParties);
   const [selectedParty, setSelectedParty] = useState<any>(null);
   const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 16;
   const totalPages = Math.ceil(partyList.length / itemsPerPage);

   const pagedParty = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return partyList.slice(start, end);
   }, [currentPage, partyList]);

   const handleCreate = (create: any) => {
      console.log('파티 생성:', create);
      const newParty = {
         id: crypto.randomUUID(), //id 생성
         ...create,
         current_members: 0,
         max_members: parseInt(create.max_members),
         hostId: 'currentUser',
         host: '현재 유저',
      };
      setPartyList([...partyList, newParty]);
   };

   const handleApply = (updatedParty: any) => {
      console.log('파티 신청 완료:', updatedParty);
      if (selectedPartyId !== null) {
         const updatedList = [...partyList];
         updatedList[selectedPartyId] = updatedParty;
         setPartyList(updatedList);
      }
      setSelectedParty(null);
      setSelectedPartyId(null);
   };

   const handleWithdraw = (updatedParty: any) => {
      console.log('파티 철회 완료:', updatedParty);
      if (selectedPartyId !== null) {
         const updatedList = [...partyList];
         updatedList[selectedPartyId] = updatedParty;
         setPartyList(updatedList);
      }
      setSelectedParty(null);
      setSelectedPartyId(null);
   };

   const handleEdit = (updatedParty: any) => {
      console.log('파티 수정:', updatedParty);
      if (selectedPartyId !== null) {
         const updatedList = [...partyList];
         updatedList[selectedPartyId] = {
            ...updatedList[selectedPartyId],
            ...updatedParty,
         };
         setPartyList(updatedList);
         setSelectedParty({
            ...updatedList[selectedPartyId],
         });
      }
   };

   const handleSelect = (party: any, index: number) => {
      setSelectedParty(party);
      setSelectedPartyId(index);
   };

   const handleDetailClose = () => {
      setSelectedParty(null);
      setSelectedPartyId(null);
   };

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   const handleDelete = (partyId: string) => {
      setPartyList(prev => prev.filter(p => p.id !== partyId));
      setSelectedParty(null);
      setSelectedPartyId(null);
   };

   return (
      <PartyPanel>
         <div className="bg-white w-full h-full flex flex-col gap-6">
            {/* 헤더 */}
            <div className="shrink-0">
               <p className="text-[32px]">안녕하세요, 00님</p>
            </div>

            {/* 컨트롤 영역 */}
            <div className="shrink-0 flex flex-col gap-2">
               <div className="flex flex-row justify-between">
                  <h1 className="text-[24px] font-semibold">파티 모집</h1>
                  <PartyCreatePopup
                     trigger={
                        <Button className="flex items-center">
                           새 파티
                           <Icon24 name="add" className="text-secondary" />
                        </Button>
                     }
                     onSave={handleCreate}
                  />
               </div>
               <SearchBar />
               <div className="p-2">
                  <CheckboxComponent
                     options={[
                        { value: 'applicable', label: '신청 가능' },
                        { value: 'applicable_deadline', label: '신청 마감' },
                     ]}
                  />
               </div>
            </div>

            {/* 파티 목록 - 스크롤 영역 */}
            <div className="flex-1 flex flex-col gap-2">
               {pagedParty.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center text-foreground/60 font-semibold">
                     존재하는 파티가 없습니다.
                  </div>
               ) : (
                  pagedParty.map((party, index) => {
                     const isFull = party.current_members === party.max_members;
                     const actualIndex = (currentPage - 1) * itemsPerPage + index;
                     const isSelected = selectedPartyId === actualIndex;
                     return (
                        <PartyDetailPopup
                           key={party.id}
                           party={party}
                           trigger={
                              <div
                                 className={isFull ? 'opacity-50' : 'cursor-pointer'}
                                 onClick={() => handleSelect(party, actualIndex)}
                              >
                                 <PartyRow
                                    index={actualIndex}
                                    partyName={party.partyName}
                                    current_members={party.current_members}
                                    max_members={party.max_members}
                                    isSelected={isSelected}
                                 />
                              </div>
                           }
                           currentUserId="currentUser"
                           onApply={handleApply}
                           onWithdraw={handleWithdraw}
                           onEdit={handleEdit}
                           onDelete={handleDelete}
                           onClose={handleDetailClose}
                        />
                     );
                  })
               )}
            </div>

            {/* 페이지네이션 - 하단 고정 */}
            <div className="shrink-0 flex items-center justify-center h-14">
               {totalPages > 0 && (
                  <EllipsisPagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     handlePageChange={handlePageChange}
                  />
               )}
            </div>
         </div>
      </PartyPanel>
   );
}
