import { CheckboxComponent } from '@/components/basic/checkbox';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { PhotoInputContainer } from '@/components/photo/photo';
import { OneFunctionPopup } from '@/components/popup/onefunction';
import { Button } from '@/components/ui/button/button';
import { useState } from 'react';

interface AddEventProps {
   onAddEvent: (formData: any) => Promise<void>;
}

export function AddEvent({ onAddEvent }: AddEventProps) {
   const [eventName, setEventName] = useState('');
   const [eventImages, setEventImages] = useState<string[]>(null);
   const [eventIntro, setEventIntro] = useState('');
   const [eventHomepage, setEventHomepage] = useState('');
   const [hosts, setHosts] = useState<string[]>(['']); //주최사 배열
   const [endDate, setEndDate] = useState('');
   const [endTime, setEndTime] = useState('');
   const [startDate, setStartDate] = useState('');
   const [startTime, setStartTime] = useState('');
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

   const resetForm = () => {
      setEventName('');
      setEventImages(null);
      setEventIntro('');
      setEventHomepage('');
      setHosts(['']);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
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
   };

   const handleAdd = async () => {
      if (!eventName.trim()) {
         alert('이벤트 명을 입력해주세요.');
         return;
      }
      if (!startDate || !endDate) {
         alert('이벤트 기간을 입력해주세요.');
         return;
      }

      const formData = {
         eventName,
         eventImages,
         eventIntro,
         eventHomepage,
         hosts: hosts.filter(h => h.trim()),
         startDate,
         endDate,
         startTime,
         endTime,
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
      };

      try {
         await onAddEvent(formData);
         setIsOpen(false);
         resetForm();
         alert('이벤트가 등록되었습니다.');
      } catch (error) {
         console.error('이벤트 등록 실패:', error);
      }

      // API
   };

   const handleHostAdd = () => {
      setHosts(prev => [...prev, '']);
   };

   const handleHostChange = (index: number, value: string) => {
      setHosts(prev => {
         const newHosts = [...prev];
         newHosts[index] = value;
         return newHosts;
      });
   };

   const handleHostDelete = (index: number) => {
      if (hosts.length <= 1) {
         alert('주최사는 최소 1개 이상 입력해야합니다.');
         return;
      }
      setHosts(prev => prev.filter((_, i) => i !== index));
   };

   const handleAddressSearch = () => {
      //API
      console.log('주소 검색');
   };

   return (
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
                  <label className="text-sm font-semibold">이벤트 이미지</label>
                  <PhotoInputContainer
                     initImages={eventImages}
                     uploadImage={images => {
                        setEventImages(images);
                        return 5;
                     }}
                     autoScroll={true}
                  />
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
                           <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                              {index === hosts.length - 1 && (
                                 <button type="button" className="hover:opacity-70" onClick={handleHostAdd}>
                                    <Icon24 name="plus" className="rounded-2xl" />
                                 </button>
                              )}
                              {hosts.length > 1 && (
                                 <button
                                    type="button"
                                    className="hover:opacity-70"
                                    onClick={() => handleHostDelete(index)}
                                 >
                                    <Icon24 name="minus" className="rounded-2xl" />
                                 </button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-semibold">운영 시간</label>
                  <div className="flex gap-2 items-center">
                     <input
                        type="time"
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="시간"
                     />
                     ~
                     <input
                        type="time"
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md"
                        placeholder="시간"
                     />
                  </div>
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
                     <label className="text-sm font-semibold">예약 접수</label>
                     <CheckboxComponent
                        options={[{ value: 'reservation', label: '예약접수 여부' }]}
                        className="w-32"
                        onValueChange={values => {
                           const enabled = values.includes('reservation');
                           setIsReservationEnabled(enabled);
                           if (!enabled) {
                              setReservationStartDate('');
                              setReservationEndDate('');
                           }
                        }}
                     />
                  </div>
                  <div className="flex gap-2 items-center">
                     <input
                        type="date"
                        value={reservationStartDate}
                        onChange={e => setReservationStartDate(e.target.value)}
                        disabled={!isReservationEnabled}
                        className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="연도. 월. 일"
                     />
                     ~
                     <input
                        type="date"
                        value={reservationEndDate}
                        disabled={!isReservationEnabled}
                        onChange={e => setReservationEndDate(e.target.value)}
                        className="flex-1 text-sm px-4 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                           placeholder="0으로 입력 시 무료로 설정됩니다."
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
                     onValueChange={value => setEventStatus(value)}
                  />
               </div>
            </div>
         }
         buttonTitle="등록하기"
         callback={handleAdd}
      />
   );
}
