import { OneFunctionPopup } from '@/components/popup/onefunction';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/searchBar';
import { useState } from 'react';

interface AddressSearchDialogProps {
   isOpen: boolean;
   onOpenChange: (open: boolean) => void;
   onSelectAddress: (roadAddress: string, jibunAddress: string) => void;
}

interface PlaceResult {
   name: string;
   roadAddress: string;
   jibunAddress: string;
   x: string;
   y: string;
}

export function AddressSearchDialog({ isOpen, onOpenChange, onSelectAddress }: AddressSearchDialogProps) {
   const [searchQuery, setSearchQuery] = useState('');
   const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

   const handleSearch = async () => {
      if (!searchQuery.trim()) {
         alert('검색어를 입력해주세요.');
         return;
      }
      setIsSearching(true);

      try {

         const response = await fetch('/api/map/search/places', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchQuery }),
         });


         if (!response.ok) {
            throw new Error('주소 검색에 실패했습니다.');
         }

         const data = await response.json();

         if (data.places && data.places.length > 0) {

            // API 응답 필드명 매핑
            const results: PlaceResult[] = data.places.map((place: any, index: number) => {
               const mapped = {
                  name: place.name || '',
                  roadAddress: place.road_address || place.roadAddress || '',
                  jibunAddress: place.address || place.jibunAddress || '',
                  x: place.x || '',
                  y: place.y || '',
               };

               if (index < 3) {
               }

               return mapped;
            });


            setSearchResults(results);
            setSelectedIndex(null);
         } else {
            setSearchResults([]);
            alert('검색 결과가 없습니다.');
         }
      } catch (error) {
         console.error('❌ [프론트] 검색 실패:', error);
         alert('주소 검색 중 오류가 발생했습니다.');
         setSearchResults([]);
      } finally {
         setIsSearching(false);
      }
   };

   const handleSelectAddress = () => {
      if (selectedIndex === null) {
         alert('주소를 선택해주세요.');
         return;
      }

      const selected = searchResults[selectedIndex];
      onSelectAddress(selected.roadAddress, selected.jibunAddress);
      handleClose();
   };

   const handleClose = () => {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedIndex(null);
      onOpenChange(false);
   };


   return (
      <OneFunctionPopup
         width="!max-w-[600px]"
         open={isOpen}
         onOpenChange={open => {
            if (!open) handleClose();
         }}
         dialogTrigger={<div />}
         title="주소 검색"
         body={
            <div className="flex flex-col gap-4">
               {/* 검색 */}
               <div className="flex gap-2">
                  <div className="flex-1">
                     <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              handleSearch();
                           }
                        }}
                        placeholder="도로명, 지번, 건물명으로 검색"
                     />
                  </div>
                  <Button variant={'default'} size={'lg'} onClick={handleSearch} disabled={isSearching}>
                     {isSearching ? '검색 중...' : '검색'}
                  </Button>
               </div>
               {/* 검색 결과 */}
               <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                     <div className="flex flex-col gap-2">
                        <div className="text-sm text-foreground/70 font-medium">
                           검색 결과 ({searchResults.length}건) {/* 이 숫자 확인! */}
                        </div>
                        {searchResults.map((result, index) => (
                           <div
                              key={index}
                              onClick={() => setSelectedIndex(index)}
                              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                                 selectedIndex === index
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
                           >
                              <div className="flex flex-col gap-1">
                                 <div className="font-semibold text-sm">{result.name}</div>
                                 <div className="text-xs text-foreground/70">
                                    <div className="flex gap-1">
                                       <span className="font-medium">도로명:</span>
                                       <span>{result.roadAddress || '정보 없음'}</span>
                                    </div>
                                    <div className="flex gap-1">
                                       <span className="font-medium">지번:</span>
                                       <span>{result.jibunAddress || '정보 없음'}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="flex items-center justify-center py-10 text-sm text-foreground/50">
                        {isSearching ? '검색 중입니다...' : '검색 결과가 없습니다.'}
                     </div>
                  )}
               </div>
            </div>
         }
         buttonTitle="선택하기"
         callback={handleSelectAddress}
      />
   );
}
