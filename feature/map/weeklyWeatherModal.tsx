'use client';

import { Icon24 } from '@/components/icons/icon24';
import { useEffect, useState } from 'react';
import { WeatherIcon } from './weatherIcon';
import { Button } from '@/components/ui/button/button';

type DailyWeather = {
   date: string;
   maxTemp: number;
   minTemp: number;
   weathercode: number;
   precipitation: number; //강수량
};

type Props = {
   weeklyWeather: DailyWeather[] | null;
   onClose: () => void;
   currentPosition?: { lat: number; lng: number } | null;
};

const WeeklyWeatherModal = ({ weeklyWeather, onClose, currentPosition }: Props) => {
   const [locationName, setLocationName] = useState<string>('주간 날씨');
   // 컴포넌트 마운트 시점의 위치를 고정
   const [fixedPosition] = useState(currentPosition);

   useEffect(() => {
      // ESC로 닫기
      const handleEsc = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
   }, [onClose]);

   useEffect(() => {
      if (!fixedPosition) {
         console.log('❌ fixedPosition 없음');
         return;
      }

      console.log('📍 fixedPosition:', fixedPosition);

      let retryCount = 0;
      const maxRetries = 10;

      const tryReverseGeocode = () => {
         console.log(`🔍 Naver 체크 (${retryCount + 1}/${maxRetries}):`, {
            window: typeof window !== 'undefined',
            naver: !!window.naver,
            maps: !!window.naver?.maps,
            Service: !!window.naver?.maps?.Service,
            reverseGeocode: !!window.naver?.maps?.Service?.reverseGeocode,
         });

         if (typeof window === 'undefined') {
            console.log('❌ window 없음 (SSR)');
            return;
         }

         if (!window.naver?.maps?.Service?.reverseGeocode) {
            if (retryCount < maxRetries) {
               retryCount++;
               setTimeout(tryReverseGeocode, 1000); // ⭐ 1초로 증가
            } else {
               console.warn('❌ Naver Service 로드 실패 - 좌표 표시');
               setLocationName(`${fixedPosition.lat.toFixed(4)}, ${fixedPosition.lng.toFixed(4)}`);
            }
            return;
         }

         console.log('✅ Naver Service 준비됨! API 호출 시작...');

         try {
            naver.maps.Service.reverseGeocode(
               {
                  coords: new naver.maps.LatLng(fixedPosition.lat, fixedPosition.lng),
                  orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(','),
               },
               function (status, response) {
                  console.log('📡 Geocoding 응답:', { status, response });

                  if (status === naver.maps.Service.Status.ERROR) {
                     console.error('❌ Reverse Geocoding 실패');
                     setLocationName('위치 정보');
                     return;
                  }

                  const result = response.v2;
                  const address = result.address;

                  console.log('📮 주소 정보:', address);

                  if (address && address.jibunAddress) {
                     const parts = address.jibunAddress.split(' ');
                     console.log('🔤 주소 분할:', parts);

                     const area2 = parts[1] || ''; // 구/군
                     const area3 = parts[2] || ''; // 동/읍/면

                     const displayName = area2 && area3 ? `${area2} ${area3}` : area2 || parts[0] || '현재 위치';

                     console.log('✅ 최종 표시 이름:', displayName);
                     setLocationName(displayName);
                  }
               },
            );
         } catch (error) {
            console.error('❌ Reverse Geocoding 에러:', error);
            setLocationName('위치 정보');
         }
      };

      // 첫 시도
      tryReverseGeocode();
   }, [fixedPosition]);

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = days[date.getDay()];
      return `${month}/${day} (${dayOfWeek})`;
   };

   const handleModalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
   };

   return (
      <div
         onClick={handleModalClick}
         className="fixed bottom-[140px] ml-5 w-100 max-w-[500px] max-h-[700px] overflow-auto rounded-2xl bg-[#F1F5FA] shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-auto pointer-events-auto"
         style={{ zIndex: 30 }}
      >
         {/* 헤더 */}
         <div className="flex items-center justify-between p-4">
            <p className="text-xl font-bold">{locationName}</p>
            <Button
               onClick={onClose}
               className="border-none bg-transparent text-foreground cursor-pointer w-10 hover:bg-gray-200 transition-colors duration-200"
            >
               <Icon24 name="closeblack" />
            </Button>
         </div>

         {/* 리스트 */}
         <div className="px-3">
            {/* 테이블 헤더 */}
            <div className="flex items-center justify-between bg-[#dce3eb] py-2 rounded-mdp">
               <div className="w-20 text-center text-sm font-semibold">날짜</div>
               <div className="w-15 text-center text-sm font-semibold">날씨</div>
               <div className="w-[70px] text-center text-sm font-semibold">강수량</div>
               <div className="w-[90px] text-center text-sm font-semibold">기온</div>
            </div>
            {weeklyWeather?.map((day, index) => (
               <div
                  key={index}
                  className={`flex items-center justify-between py-3 ${
                     index < weeklyWeather.length - 1 ? 'border-b border-[#dce3eb]' : ''
                  }`}
               >
                  {/* 날짜 */}
                  <div className="w-20 text-center text-xs text-[#04152F]">{formatDate(day.date)}</div>

                  {/* 아이콘 */}
                  <div className="w-15 justify-center flex">
                     <WeatherIcon weatherCode={day.weathercode} className="w-8 h-8" />
                  </div>

                  {/* 강수량 */}
                  <div className="w-[70px] text-center text-xs text-[#04152F]">
                     {day.precipitation > 0 ? `${day.precipitation}mm` : '-'}
                  </div>

                  {/* 온도 */}
                  <div className="w-[90px] text-center text-xs text-[#04152F]">
                     {day.minTemp}° / {day.maxTemp}°
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default WeeklyWeatherModal;
