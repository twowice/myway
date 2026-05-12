'use client';

import { Icon24 } from '@/components/icons/icon24';
import { useEffect } from 'react';
import { WeatherIcon } from './weatherIcon';
import { Button } from '@/components/ui/button/button';

type DailyWeather = {
   date: string;
   maxTemp: number;
   minTemp: number;
   weathercode: number;
   precipitation: number;
};

type Props = {
   weeklyWeather: DailyWeather[] | null;
   locationName: string;
   onClose: () => void;
};

const WeeklyWeatherModal = ({ weeklyWeather, locationName, onClose }: Props) => {
   useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
         if (e.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
   }, [onClose]);

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
         className="fixed bottom-[195px] lg:bottom-[145px] ml-5 w-100 max-w-[500px] max-h-[700px] overflow-auto rounded-2xl bg-[#F1F5FA] shadow-[0_4px_20px_rgba(0,0,0,0.15)] cursor-auto pointer-events-auto"
         style={{ zIndex: 30 }}
      >
         <div className="flex items-center justify-between p-4">
            <p className="text-xl font-bold">{locationName || '위치 정보'}</p>
            <Button
               onClick={onClose}
               className="border-none bg-transparent text-foreground cursor-pointer w-10 hover:bg-gray-200 transition-colors duration-200"
            >
               <Icon24 name="closeblack" />
            </Button>
         </div>

         <div className="px-3">
            <div className="flex items-center justify-between bg-[#dce3eb] py-2 rounded-md">
               <div className="w-20 text-center text-sm font-semibold">날짜</div>
               <div className="w-15 text-center text-sm font-semibold">날씨</div>
               <div className="w-[70px] text-center text-sm font-semibold">강수량</div>
               <div className="w-[90px] text-center text-sm font-semibold">기온</div>
            </div>

            {weeklyWeather?.map((day, index) => (
               <div
                  key={day.date}
                  className={`flex items-center justify-between py-3 ${
                     index < weeklyWeather.length - 1 ? 'border-b border-[#dce3eb]' : ''
                  }`}
               >
                  <div className="w-20 text-center text-xs text-[#04152F]">{formatDate(day.date)}</div>

                  <div className="w-15 justify-center flex">
                     <WeatherIcon weatherCode={day.weathercode} className="w-8 h-8" />
                  </div>

                  <div className="w-[70px] text-center text-xs text-[#04152F]">
                     {day.precipitation > 0 ? `${day.precipitation}mm` : '-'}
                  </div>

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
