'use client';

import { useEffect, useRef } from 'react';
import { useMapStore } from '@/stores/map/store';

const INITIAL_CENTER = [35.870435, 125.1255026] as const;
const INITIAL_ZOOM = 7;

export default function MapCanvas() {
   const { map, setMap, isMapScriptLoaded, setMapContainerRef } = useMapStore();
   const internalMapContainerRef = useRef<HTMLDivElement>(null);

   // 1. 로컬 ref를 Zustand 스토어에 전달 및 해제
   useEffect(() => {
      setMapContainerRef(internalMapContainerRef);
      console.log('[MapCanvas] 로컬 ref를 Zustand 스토어에 전달.');

      return () => {
         // 컴포넌트 언마운트 시 스토어에서 ref 해제
         setMapContainerRef({ current: null });
         console.log('[MapCanvas] 로컬 ref가 스토어에서 해제됨.');
      };
   }, [setMapContainerRef]);

   // 2. 지도 인스턴스 생성 및 스토어에 저장, 그리고 언마운트 시 초기화 (추가된 부분)
   useEffect(() => {
      if (isMapScriptLoaded && internalMapContainerRef.current && !map) {
         console.log('[MapCanvas] 지도 인스턴스 초기화 시작 (MapCanvas).');

         const mapOptions = {
            center: new window.naver.maps.LatLng(...INITIAL_CENTER),
            zoom: INITIAL_ZOOM,
            minZoom: 6,
            maxZoom: 18,
            scaleControl: false,
            mapDataControl: false,
            logoControlOptions: {
               position: window.naver.maps.Position.BOTTOM_LEFT,
            },
         };

         try {
            const naverMapInstance = new window.naver.maps.Map(internalMapContainerRef.current, mapOptions);
            setMap(naverMapInstance);
            console.log('[MapCanvas] 지도 인스턴스 생성 완료 및 Zustand에 저장.');
         } catch (error) {
            console.error('[MapCanvas] 지도 인스턴스 생성 중 에러 발생:', error);
         }
      }

      return () => {
         if (map) {
            console.log('[MapCanvas] 언마운트: 지도 인스턴스를 Zustand 스토어에서 제거합니다.');
            setMap(null);
         }
      };
   }, [isMapScriptLoaded, map, setMap]);

   return <div ref={internalMapContainerRef} id="map-canvas" className="absolute inset-0 w-full h-full z-0" />;
}
