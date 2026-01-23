'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useMapStore } from '@/stores/map/store';

export default function MapScriptLoader() {
   const isMapScriptLoaded = useMapStore(state => state.isMapScriptLoaded);
   const setIsMapScriptLoaded = useMapStore(state => state.setIsMapScriptLoaded);

   const handleScriptReady = () => {
      console.log('[MapScriptLoader] 네이버 지도 스크립트 로드 완료.');
      setIsMapScriptLoaded(true);
   };

   useEffect(() => {
      if (window.naver && window.naver.maps && !isMapScriptLoaded) {
         console.log('[MapScriptLoader] 네이버 지도 스크립트가 이미 로드되어 있습니다.');
         setIsMapScriptLoaded(true);
      }
   }, [isMapScriptLoaded, setIsMapScriptLoaded]);

   return (
      <>
         {!isMapScriptLoaded && (
            <Script
               id="naver-map-sdk"
               strategy="beforeInteractive"
               type="text/javascript"
               src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}&submodules=geocoder`}
               onReady={handleScriptReady}
               onError={e => {
                  console.error('[MapScriptLoader] 네이버 지도 스크립트 로드 실패:', e);
               }}
            />
         )}
      </>
   );
}
