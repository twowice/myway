import { useCallback, useState } from 'react';

type WeatherData = {
   temperature: number;
   weathercode: number;
   windspeed: number;
};

export const useWeather = () => {
   const [weather, setWeather] = useState<WeatherData | null>(null);
   const [loading, setLoading] = useState(false);

   const fetchWeather = useCallback(async (lat: number, lng: number) => {
      setLoading(true);
      try {
         const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
         const response = await fetch(url);
         const data = await response.json();

         setWeather({
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
            windspeed: data.current_weather.windspeed,
         });
      } catch (error) {
         console.error('Failed to fetch weather:', error);
      } finally {
         setLoading(false);
      }
   }, []);

   return { weather, loading, fetchWeather };
};
