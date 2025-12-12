import { useCallback, useState } from 'react';

type AirQualityData = {
   pm10: number; // 미세먼지
   pm2_5: number; // 초미세먼지
};
type AirQualityLevel = {
   level: string;
   color: string;
};

//미세먼지 등급 판정
export const getPM10Level = (pm10: number): AirQualityLevel => {
   if (pm10 <= 30) return { level: '좋음', color: '#34C759' };
   if (pm10 <= 80) return { level: '보통', color: '#FFCC00' };
   if (pm10 <= 150) return { level: '나쁨', color: '#FF8D28' };
   return { level: '매우나쁨', color: '#FF383C' };
};

export const getPM25Level = (pm25: number): AirQualityLevel => {
   if (pm25 <= 30) return { level: '좋음', color: '#34C759' };
   if (pm25 <= 80) return { level: '보통', color: '#FFCC00' };
   if (pm25 <= 150) return { level: '나쁨', color: '#FF8D28' };
   return { level: '매우나쁨', color: '#FF383C' };
};

export const useAirQuality = () => {
   const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
   const [loading, setLoading] = useState(false);

   const fetchAirQuality = useCallback(async (lat: number, lng: number) => {
      setLoading(true);
      try {
         const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5`;
         const response = await fetch(url);
         const data = await response.json();

         setAirQuality({
            pm10: data.current.pm10,
            pm2_5: data.current.pm2_5,
         });
      } catch (error) {
         console.error('Failed to fetch air quality:', error);
      } finally {
         setLoading(false);
      }
   }, []);
   return { airQuality, loading, fetchAirQuality };
};
