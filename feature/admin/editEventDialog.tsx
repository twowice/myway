import { CheckboxComponent } from '@/components/basic/checkbox';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { PhotoInputContainer } from '@/components/photo/photo';
import { TwoFunctionPopup } from '@/components/popup/twofunction';
import { Button } from '@/components/ui/button/button';
import { useEffect, useState } from 'react';
import { AddressSearchDialog } from './addressSearchDialog';
import { supabase } from '@/lib/clientSupabase';

interface EditEventProps {
   event: any | null;
   isOpen: boolean;
   onClose: () => void;
   onEditEvent: (formData: any, originalEvent: any) => Promise<void>;
   onDeleteEvent: (eventId: number) => Promise<void>;
}

export function EditEvent({ event, isOpen, onClose, onEditEvent, onDeleteEvent }: EditEventProps) {
   const [eventName, setEventName] = useState('');
   const [eventImages, setEventImages] = useState<string[]>([]);
   const [eventIntro, setEventIntro] = useState('');
   const [eventHomepage, setEventHomepage] = useState('');
   const [eventSNS, setEventSNS] = useState('');
   const [hosts, setHosts] = useState<string[]>(['']);
   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
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
   const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
   const [playTime, setPlayTime] = useState('');
   const [phone, setPhone] = useState('');
   const [uploadingImage, setUploadingImage] = useState(false);

   // event 데이터가 변경될 때마다 폼 초기화
   useEffect(() => {
      if (event) {
         parseEventData(event);
      }
   }, [event]);

   const parseEventData = (eventData: any) => {
      //이벤트명
      setEventName(eventData.title || '');

      //이미지
      if (eventData.event_images && eventData.event_images.length > 0) {
         const imageUrls = eventData.event_images.map((img: any) => img.image_url);
         setEventImages(imageUrls);
      } else {
         setEventImages([]);
      }

      //이벤트 소개
      setEventIntro(eventData.overview || '');

      // 홈페이지
      setEventHomepage(eventData.homepage || '');

      // SNS
      setEventSNS(eventData.insta_url || '');

      // 전화번호
      setPhone(eventData.phone || '');

      // 주최사
      if (eventData.organizer) {
         setHosts([eventData.organizer]);
      } else {
         setHosts(['']);
      }

      // 이벤트 기간
      setStartDate(eventData.start_date || '');
      setEndDate(eventData.end_date || '');

      // 운영 시간
      setPlayTime(eventData.playtime || '');

      // 예약 접수 (DB에 없으면 false)
      setReservationStartDate('');
      setReservationEndDate('');
      setIsReservationEnabled(false);

      // 가격 - 모든 가격이 0이거나 null이면 무료로 설정
      const price = eventData.price || 0;
      const adultPriceValue = eventData.adult_price ?? price;
      const teenPriceValue = eventData.teen_price ?? price;
      const childPriceValue = eventData.child_price ?? price;

      // 숫자로 변환 후 비교 (문자열 "0"도 처리)
      const adultNum = Number(adultPriceValue) || 0;
      const teenNum = Number(teenPriceValue) || 0;
      const childNum = Number(childPriceValue) || 0;

      // 모든 가격이 0이면 무료로 설정
      const allPricesFree = adultNum === 0 && teenNum === 0 && childNum === 0;

      setIsFreeForAll(allPricesFree);
      setAdultPrice(String(adultNum));
      setTeenPrice(String(teenNum));
      setChildPrice(String(childNum));

      // 주소
      setRoadAddress(eventData.address || '');
      setDetailAddress(eventData.address2 || '');

      // ⭐ 상태 - DB에 저장된 값 사용 (날짜 기반 자동 계산 제거)
      setEventStatus(eventData.status || 'non_progress');
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
         alert('이미지 업로드 중 오류가 발생했습니다.');
         return 400;
      } finally {
         setUploadingImage(false);
      }
   };

   const handleEdit = async () => {
      if (!eventName.trim()) {
         alert('이벤트 명을 입력해주세요.');
         return;
      }
      if (!startDate || !endDate) {
         alert('이벤트 기간을 입력해주세요.');
         return;
      }

      if (uploadingImage) {
         alert('이미지 업로드 중입니다. 잠시만 기다려주세요.');
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

      try {
         await onEditEvent(formData, event);
         onClose();
      } catch (error) {
         console.error('이벤트 수정 실패:', error);
      }
   };

   // const handleHostAdd = () => {
   //    setHosts(prev => [...prev, '']);
   // };

   const handleHostChange = (index: number, value: string) => {
      const newHosts = [...hosts];
      newHosts[index] = value;
      setHosts(newHosts);
   };

   // const handleHostDelete = (index: number) => {
   //    if (hosts.length <= 1) {
   //       alert('주최사는 최소 1개 이상 입력해야합니다.');
   //       return;
   //    }
   //    setHosts(prev => prev.filter((_, i) => i !== index));
   // };

   const handleAddressSearch = () => {
      setIsAddressSearchOpen(true);
   };

   const handleSelectAddress = (roadAddr: string, jibunAddr: string) => {
      setRoadAddress(roadAddr);
   };

   const handleDelete = async () => {
      if (!event?.id) return;

      const confirmDelete = window.confirm('정말로 이 이벤트를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.');

      if (!confirmDelete) return;

      try {
         await onDeleteEvent(event.id);
         onClose();
      } catch (error) {
         console.error('이벤트 삭제 실패:', error);
      }
   };

   if (!event) return null;

   return (
      <>
         <TwoFunctionPopup
            className="max-w-[800px]!"
            open={isOpen}
            onOpenChange={open => {
               if (!open) onClose();
            }}
            dialogTrigger={<div />}
            title="이벤트 수정"
            body={
               <div className="flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-2">
                  {/* 이벤트 명 */}
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

                  {/* 이벤트 이미지 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 이미지</label>
                     <PhotoInputContainer initImages={eventImages} uploadImage={handleImageUpload} autoScroll={true} />
                  </div>

                  {/* 이벤트 소개 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 소개</label>
                     <textarea
                        value={eventIntro}
                        onChange={e => setEventIntro(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="이벤트 소개를 입력해주세요."
                     />
                  </div>

                  {/* 이벤트 홈페이지 */}
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

                  {/* 이벤트 주최 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 주최</label>
                     <div className="flex flex-col gap-2">
                        {hosts.map((host, index) => (
                           <div key={index} className="relative flex">
                              <input
                                 type="text"
                                 value={host}
                                 onChange={e => handleHostChange(index, e.target.value)}
                                 className="flex-1 text-sm px-4 py-2 border rounded-md pr-20"
                                 placeholder={`이벤트 주최사 ${index + 1}을 입력해주세요.`}
                              />
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 운영 시간 */}
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

                  {/* 이벤트 기간 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 기간</label>
                     <div className="flex gap-2 items-center">
                        <input
                           type="date"
                           value={startDate}
                           onChange={e => setStartDate(e.target.value)}
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                        />
                        <span>~</span>
                        <input
                           type="date"
                           value={endDate}
                           onChange={e => setEndDate(e.target.value)}
                           className="flex-1 text-sm px-4 py-2 border rounded-md"
                        />
                     </div>
                  </div>

                  {/* 가격 */}
                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">가격</label>
                        <CheckboxComponent
                           options={[{ value: 'for_free', label: '모두 무료로 설정' }]}
                           values={isFreeForAll ? ['for_free'] : []}
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
                              value={isFreeForAll || adultPrice === '0' ? '무료' : adultPrice}
                              onChange={e => setAdultPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={isFreeForAll}
                              className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                              placeholder="예: 15000"
                           />
                        </div>
                        <div className="flex flex-col text-sm gap-2 w-full">
                           청소년
                           <input
                              type="text"
                              value={isFreeForAll || teenPrice === '0' ? '무료' : teenPrice}
                              onChange={e => setTeenPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={isFreeForAll}
                              className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                              placeholder="예: 15000"
                           />
                        </div>
                        <div className="flex flex-col text-sm gap-2 w-full">
                           어린이
                           <input
                              type="text"
                              value={isFreeForAll || childPrice === '0' ? '무료' : childPrice}
                              onChange={e => setChildPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={isFreeForAll}
                              className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                              placeholder="0으로 입력 시 무료로 설정됩니다."
                           />
                        </div>
                     </div>
                  </div>

                  {/* 이벤트 장소 */}
                  <div className="flex flex-col gap-2 w-full">
                     <label className="text-sm font-semibold">이벤트 장소</label>
                     <div className="flex flex-col text-sm gap-2 w-full">
                        도로명 주소
                        <div className="flex gap-2">
                           <input
                              type="text"
                              value={roadAddress}
                              onChange={e => setRoadAddress(e.target.value)}
                              className="flex-1 text-sm px-4 py-2 border rounded-md"
                              placeholder="오른쪽 버튼을 통해 주소를 검색해 입력해주세요."
                              readOnly
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
                           placeholder="예: 00빌딩 3층"
                        />
                     </div>
                  </div>

                  {/* 이벤트 상태 */}
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
            leftTitle="삭제하기"
            rightTitle="수정하기"
            leftCallback={handleDelete}
            rightCallback={handleEdit}
            closeOnLeft={false}
            closeOnRight={false}
         />

         <AddressSearchDialog
            isOpen={isAddressSearchOpen}
            onOpenChange={setIsAddressSearchOpen}
            onSelectAddress={handleSelectAddress}
         />
      </>
   );
}
