'use client';
import { useWeather } from '@/types/weather';
import Map from './Map';
import { NaverMap } from '@/types/maptype';
import { getPM10Level, getPM25Level, useAirQuality } from '@/types/airquality';
import { useWeeklyWeather } from '@/types/weeklyWeather';
import { useState } from 'react';
import WeeklyWeatherModal from '@/feature/weeklyWeatherModal';

const MapSection = () => {
   const { weather, fetchWeather } = useWeather();
   const { airQuality, fetchAirQuality } = useAirQuality();
   const { weeklyWeather, fetchWeeklyWeather } = useWeeklyWeather();
   const [showWeeklyModal, setShowWeeklyModal] = useState(false);
   const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);

   const handleMapLoad = (map: NaverMap) => {
      //초기 날씨 & 미세먼지
      const center = map.getCenter();
      const lat = center.lat();
      const lng = center.lng();

      setCurrentPosition({ lat, lng });
      fetchWeather(lat, lng);
      fetchAirQuality(lat, lng);

      //지도 이동시 업데이트
      naver.maps.Event.addListener(map, 'idle', () => {
         const newCenter = map.getCenter();
         const newLat = newCenter.lat();
         const newLng = newCenter.lng();

         setCurrentPosition({ lat: newLat, lng: newLng });
         fetchWeather(newLat, newLng);
         fetchAirQuality(newLat, newLng);
      });
   };

   const handleWeatherClick = () => {
      if (showWeeklyModal) {
         setShowWeeklyModal(false);
      } else {
         if (currentPosition) {
            fetchWeeklyWeather(currentPosition.lat, currentPosition.lng);
            setShowWeeklyModal(true);
         }
      }
   };

   const pm10Level = airQuality ? getPM10Level(airQuality.pm10) : null;
   const pm25Level = airQuality ? getPM25Level(airQuality.pm2_5) : null;

   return (
      <div className="w-full h-screen relative">
         <Map onLoad={handleMapLoad} />
         {/*날씨정보 */}
         {weather && (
            <div
               onClick={handleWeatherClick}
               className="absolute bottom-5 left-5 bg-[#F1F5FA] rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-[100px] w-[150px] h-[100px] flex gap-2 items-center justify-center cursor-pointer"
            >
               {/* 날씨 & 온도 */}
               <div className="flex items-center justify-center flex-col">
                  <div className="w-12 h-12 border border-black">
                     {/* <Icon24 weathercode={weather.weathercode} /> */}
                  </div>
                  <div className="text-base">{Math.round(weather.temperature)}°C</div>
               </div>
               {/* // 미세먼지 */}
               {airQuality && pm10Level && pm25Level && (
                  <div className="flex flex-col gap-3 w-[60px]">
                     {/* 미세먼지 PM10 */}
                     <div
                        className="w-full flex-1 text-center text-base rounded-[3px]"
                        style={{ borderRight: `3px solid ${pm25Level.color}` }}
                     >
                        미세
                     </div>

                     {/* 초미세먼지 PM25 */}
                     <div
                        className="w-full flex-1 text-center text-base rounded-[3px]"
                        style={{ borderRight: `3px solid ${pm25Level.color}` }}
                     >
                        초미세
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* 주간날씨모달 */}
         {showWeeklyModal && weeklyWeather && (
            <WeeklyWeatherModal weeklyWeather={weeklyWeather} onClose={() => setShowWeeklyModal(false)} />
         )}
      </div>
   );
};

export default MapSection;
