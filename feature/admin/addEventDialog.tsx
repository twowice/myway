import { CheckboxComponent } from '@/components/basic/checkbox';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { PhotoInputContainer } from '@/components/photo/photo';
import { OneFunctionPopup } from '@/components/popup/onefunction';
import { Button } from '@/components/ui/button/button';
import { useState } from 'react';
import { AddressSearchDialog } from './addressSearchDialog';
import { supabase } from '@/lib/clientSupabase';
import { useToast } from '@/contexts/ToastContext';

interface AddEventProps {
   onAddEvent: (formData: any) => Promise<void>;
}

export function AddEvent({ onAddEvent }: AddEventProps) {
   const { showToast } = useToast();

   const [eventName, setEventName] = useState('');
   const [eventImages, setEventImages] = useState<string[]>([]);
   const [eventIntro, setEventIntro] = useState('');
   const [eventSNS, setEventSNS] = useState('');
   const [eventHomepage, setEventHomepage] = useState('');
   const [hosts, setHosts] = useState<string[]>(['']); //주최사 배열
   const [endDate, setEndDate] = useState('');
   const [startDate, setStartDate] = useState('');
   const [playTime, setPlayTime] = useState('');
   const [reservationStartDate, setReservationStartDate] = useState('');
   const [reservationEndDate, setReservationEndDate] = useState('');
   const [isReservationEnabled, setIsReservationEnabled] = useState(false);
   const [adultPrice, setAdultPrice] = useState('');
   const [teenPrice, setTeenPrice] = useState('');
   const [childPrice, setChildPrice] = useState('');
   const [isFreeForAll, setIsFreeForAll] = useState(false);
   const [roadAddress, setRoadAddress] = useState('');
   const [detailAddress, setDetailAddress] = useState('');
   const [eventStatus, setEventStatus] = useState('non_progress');
   const [isOpen, setIsOpen] = useState(false);
   const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
   const [phone, setPhone] = useState('');
   const [uploadingImage, setUploadingImage] = useState(false);

   const resetForm = () => {
      setEventName('');
      setEventImages([]);
      setEventIntro('');
      setEventHomepage('');
      setEventSNS('');
      setHosts(['']);
      setStartDate('');
      setEndDate('');
      setPlayTime('');
      setReservationStartDate('');
      setReservationEndDate('');
      setIsReservationEnabled(false);
      setAdultPrice('');
      setTeenPrice('');
      setChildPrice('');
      setIsFreeForAll(false);
      setRoadAddress('');
      setDetailAddress('');
      setEventStatus('non_progress');
      setPhone('');
   };

   const handleAdd = async () => {
      if (!eventName.trim()) {
         showToast('이벤트 명을 입력해주세요.');
         return;
      }
      if (!startDate || !endDate) {
         showToast('이벤트 기간을 입력해주세요.');
         return;
      }

      if (uploadingImage) {
         showToast('이미지 업로드 중입니다. 잠시만 기다려주세요.');
         return;
      }


      const formData = {
         eventName,
         eventImages: eventImages.length > 0 ? eventImages : [],
         eventIntro,
         eventHomepage,
         organizer: hosts.filter(h => h.trim())[0] || '',
         startDate,
         endDate,
         playTime,
         reservationStartDate,
         reservationEndDate,
         isReservationEnabled,
         adultPrice,
         teenPrice,
         childPrice,
         isFreeForAll,
         roadAddress,
         detailAddress,
         eventStatus,
         phone,
         insta_url: eventSNS,
      };

      // API
      try {
         await onAddEvent(formData);
         setIsOpen(false);
         resetForm();
      } catch (error) {
         console.error('이벤트 등록 실패:', error);
      }
   };

   /**
    * ⭐ File을 Supabase Storage에 업로드하고 URL 반환
    */
   const handleImageUpload = async (file: File): Promise<number> => {
      try {
         setUploadingImage(true);


         // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
         const fileExt = file.name.split('.').pop();
         const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
         const filePath = `events/${fileName}`;

         // Supabase Storage에 업로드
         const { data, error } = await supabase.storage.from('event_images').upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
         });

         if (error) {
            console.error('❌ Storage 업로드 에러:', error);
            throw error;
         }

         // Public URL 생성
         const { data: publicUrlData } = supabase.storage.from('event_images').getPublicUrl(filePath);

         const publicUrl = publicUrlData.publicUrl;


         // State에 URL 저장
         setEventImages(prev => {
            const newImages = [...prev, publicUrl];
            return newImages;
         });

         return 200;
      } catch (error) {
         console.error('❌ 이미지 처리 에러:', error);
         showToast('이미지 업로드 중 오류가 발생했습니다.');
         return 400;
      } finally {
         setUploadingImage(false);
      }
   };

   // const handleHostAdd = () => {
   //    setHosts(prev => [...prev, '']);
   // };

   const handleHostChange = (index: number, value: string) => {
      setHosts(prev => {
         const newHosts = [...prev];
         newHosts[index] = value;
         return newHosts;
      });
   };

   const handleAddressSearch = () => {
      setIsAddressSearchOpen(true);
   };

   const handleSelectAddress = (roadAddr: string, jibunAddr: string) => {
      setRoadAddress(roadAddr);
   };

   return (
      <>
         <OneFunctionPopup
            width="!max-w-[800px]"
            open={isOpen}
            onOpenChange={setIsOpen}
            dialogTrigger={
               <Button variant={'add'} size={'lg'}>
                  <Icon24 name="plus" className="text-primary-foreground" />
                  신규 등록
               </Button>
            }
            title="신규 등록"
            body={
               <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-2">
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 명</label>
                     <input
                        type="text"
                        value={eventName}
                        onChange={e => setEventName(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="이벤트 명을 입력해주세요."
                     />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">
                        이벤트 이미지 {uploadingImage && <span className="text-blue-500 ml-2">(업로드 중...)</span>}
                     </label>
                     <PhotoInputContainer initImages={eventImages} uploadImage={handleImageUpload} autoScroll={true} />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 소개</label>
                     <textarea
                        value={eventIntro}
                        onChange={e => setEventIntro(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="이벤트 소개를 입력해주세요."
                     />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 홈페이지</label>
                     <input
                        type="text"
                        value={eventHomepage}
                        onChange={e => setEventHomepage(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="이벤트 홈페이지를 입력해주세요."
                     />
                  </div>
                  {/* 이벤트 인스타 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 SNS</label>
                     <input
                        type="text"
                        value={eventSNS}
                        onChange={e => setEventSNS(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="SNS URL을 입력해주세요."
                     />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 주최</label>
                     <div className="flex flex-col gap-2">
                        {hosts.map((host, index) => (
                           <div key={index} className="relative flex">
                              <input
                                 type="text"
                                 value={host}
                                 onChange={e => handleHostChange(index, e.target.value)}
                                 className="flex-1 text-sm px-4 py-2 border rounded-md"
                                 placeholder={`이벤트 주최사 ${index + 1} 을 입력해주세요.`}
                              />
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">운영 시간</label>
                     <div className="flex gap-2 items-center">
                        <input
                           type="text"
                           value={playTime}
                           onChange={e => setPlayTime(e.target.value)}
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="운영시간을 입력해주세요."
                        />
                     </div>
                  </div>
                  {/* 전화번호 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">전화번호</label>
                     <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="전화번호를 입력해주세요."
                     />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 기간</label>
                     <div className="flex gap-2 items-center">
                        <input
                           type="date"
                           value={startDate}
                           onChange={e => setStartDate(e.target.value)}
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="연도. 월. 일"
                        />
                        ~
                        <input
                           type="date"
                           value={endDate}
                           onChange={e => setEndDate(e.target.value)}
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="연도. 월. 일"
                        />
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">가격</label>
                        <CheckboxComponent
                           options={[{ value: 'for_free', label: '모두 무료로 설정' }]}
                           className="w-32"
                           onValueChange={values => {
                              const isFree = values.includes('for_free');
                              setIsFreeForAll(isFree);
                              if (isFree) {
                                 setAdultPrice('0');
                                 setTeenPrice('0');
                                 setChildPrice('0');
                              }
                           }}
                        />
                     </div>
                     <div className="flex gap-3">
                        <div className="flex flex-col text-sm gap-2 w-full">
                           어른
                           <input
                              type="text"
                              value={adultPrice}
                              onChange={e => setAdultPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={isFreeForAll}
                              className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="예: 15000"
                           />
                        </div>
                        <div className="flex flex-col text-sm gap-2 w-full">
                           청소년
                           <input
                              type="text"
                              value={teenPrice}
                              onChange={e => setTeenPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={isFreeForAll}
                              className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="예: 15000"
                           />
                        </div>
                        <div className="flex flex-col text-sm gap-2 w-full">
                           초등학생
                           <input
                              type="text"
                              value={childPrice}
                              onChange={e => setChildPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={isFreeForAll}
                              className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="예: 15000"
                           />
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 장소명</label>
                     <div className="flex flex-col text-sm gap-2 w-full">
                        도로명 주소
                        <div className="flex gap-2">
                           <input
                              type="text"
                              value={roadAddress}
                              onChange={e => setRoadAddress(e.target.value)}
                              className="flex-1 text-sm px-4 py-2 border rounded-md"
                              placeholder="오른쪽 버튼을 통해 주소를 검색해 입력해주세요."
                           />
                           <Button variant={'default'} size={'lg'} onClick={handleAddressSearch}>
                              주소 검색
                           </Button>
                        </div>
                     </div>
                     <div className="flex flex-col text-sm gap-2 w-full">
                        상세 주소
                        <input
                           type="text"
                           value={detailAddress}
                           onChange={e => setDetailAddress(e.target.value)}
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                           placeholder="예 : 00빌딩 3층"
                        />
                     </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 상태</label>
                     <RadioComponent
                        options={[
                           { value: 'non_progress', label: '미진행' },
                           { value: 'progress', label: '진행중' },
                        ]}
                        value={eventStatus}
                        onValueChange={value => setEventStatus(value)}
                     />
                  </div>
               </div>
            }
            buttonTitle="등록하기"
            callback={handleAdd}
         />

         <AddressSearchDialog
            isOpen={isAddressSearchOpen}
            onOpenChange={setIsAddressSearchOpen}
            onSelectAddress={handleSelectAddress}
         />
      </>
   );
}
