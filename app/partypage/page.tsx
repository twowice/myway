'use client';

import { CheckboxComponent } from '@/components/basic/checkbox';
import { Icon24 } from '@/components/icons/icon24';
import { PartyRow } from '@/components/partyrow/PartyRow';
import { TwoFunctionPopup } from '@/components/popup/twofunction';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/searchBar';
import { parties } from '@/dummy/party';
import { useState } from 'react';

export default function Party() {
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [selectedParty, setSelectedParty] = useState<any>(null);

   const handleParty = (party: any, index: number) => {
      setSelectedParty({ ...party, index });
      setIsDrawerOpen(true);
   };

   const addParty = () => {
      setSelectedParty(null);
      setIsDrawerOpen(true);
   };

   const handleSave = () => {
      if (selectedParty) {
         console.log('파티 수정:', selectedParty);
      } else {
         console.log('새 파티 생성');
      }
      setIsDrawerOpen(false);
   };

   const handleCancel = () => {
      setIsDrawerOpen(false);
      setSelectedParty(null);
   };
   return (
      <div className="bg-white p-4 w-full flex flex-col gap-6">
         <p className="text-[32px]">안녕하세요, 00님</p>
         <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between">
               <h1 className="text-[24px] font-semibold">파티 모집</h1>
               <Button className="flex items-center" onClick={addParty}>
                  새 파티
                  <Icon24 name="add" className="text-secondary" />
               </Button>
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
            {parties.length === 0 ? (
               <div className="flex items-center justify-center text-foreground/60 font-semibold">
                  존재하는 파티가 없습니다.
               </div>
            ) : (
               parties.map((party, index) => {
                  const isFull = party.current_members === party.max_members;
                  return (
                     <div
                        key={index}
                        className={isFull ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        onClick={() => !isFull && handleParty(party, index)}
                     >
                        <PartyRow
                           index={index}
                           partyName={party.partyName}
                           current_members={party.current_members}
                           max_members={party.max_members}
                        />
                     </div>
                  );
               })
            )}
         </div>
         {/* 파티 생성 팝업 */}
         {isDrawerOpen && <div></div>}
         {/* 파티 정보 팝업 */}
      </div>
   );
}
