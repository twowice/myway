// src/components/ui/Map/MapSection.tsx
'use client';
import { useWeather } from '@/types/weather';
import { getPM10Level, getPM25Level, useAirQuality } from '@/types/airquality';
import { useWeeklyWeather } from '@/types/weeklyWeather';
import { useState, useCallback, useRef, useEffect } from 'react';
import WeeklyWeatherModal from '@/feature/map/weeklyWeatherModal';
import { useMapStore } from '@/stores/map/store';
import { panelstore } from '@/stores/panelstore';
import { WeatherIcon } from '@/feature/map/weatherIcon';
import { Button } from '../button';
import { supabase } from '@/lib/clientSupabase';
import { HiDotsVertical } from 'react-icons/hi';
import { useEventFilterStore } from '@/stores/eventFilterStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MapPinOff } from 'lucide-react';
import { BiTargetLock } from 'react-icons/bi';

const REGION_NAME = {
   all: null,
   seoul: '서울',
   incheon: '인천',
   daejeon: '대전',
   daegu: '대구',
   gwangju: '광주',
   busan: '부산',
   ulsan: '울산',
   sejong: '세종',
   gyeonggi: '경기',
   gangwon: '강원',
   chungbuk: '충청북도',
   chungnam: '충청남도',
   gyeongbuk: '경상북도',
   gyeongnam: '경상남도',
   jeonbuk: '전북특별자치도',
   jeonnam: '전라남도',
   jeju: '제주',
} as const;

const INITIAL_CONFIG = { lat: 35.870435, lng: 125.1255026, zoom: 7 };

type MapEvent = {
   id: number;
   latitude: number;
   longitude: number;
   title?: string | null;
};

const REGION_COORDINATES = {
   all: INITIAL_CONFIG,
   seoul: { lat: 37.5665, lng: 126.978, zoom: 11 },
   incheon: { lat: 37.4563, lng: 126.7052, zoom: 11 },
   daejeon: { lat: 36.3504, lng: 127.3845, zoom: 11 },
   daegu: { lat: 35.8714, lng: 128.6014, zoom: 11 },
   gwangju: { lat: 35.1595, lng: 126.8526, zoom: 11 },
   busan: { lat: 35.1796, lng: 129.0756, zoom: 11 },
   ulsan: { lat: 35.5384, lng: 129.3114, zoom: 11 },
   sejong: { lat: 36.4801, lng: 127.289, zoom: 11 },
   gyeonggi: { lat: 37.4138, lng: 127.5183, zoom: 9 },
   gangwon: { lat: 37.8228, lng: 128.1555, zoom: 9 },
   chungbuk: { lat: 36.8, lng: 127.7, zoom: 9 },
   chungnam: { lat: 36.5184, lng: 126.8, zoom: 9 },
   gyeongbuk: { lat: 36.4919, lng: 128.8889, zoom: 9 },
   gyeongnam: { lat: 35.4606, lng: 128.2132, zoom: 9 },
   jeonbuk: { lat: 35.7175, lng: 127.153, zoom: 9 },
   jeonnam: { lat: 34.8679, lng: 126.991, zoom: 9 },
   jeju: { lat: 33.4996, lng: 126.5312, zoom: 10 },
} as const;

const REGION_BUTTONS = [
   { key: 'all', label: '전체' },
   { key: 'seoul', label: '서울' },
   { key: 'incheon', label: '인천' },
   { key: 'busan', label: '부산' },
   { key: 'jeju', label: '제주' },
   { key: 'daegu', label: '대구' },
   { key: 'daejeon', label: '대전' },
   { key: 'gwangju', label: '광주' },
   { key: 'ulsan', label: '울산' },
   { key: 'sejong', label: '세종' },
   { key: 'gyeonggi', label: '경기' },
   { key: 'gangwon', label: '강원' },
   { key: 'chungbuk', label: '충북' },
   { key: 'chungnam', label: '충남' },
   { key: 'gyeongbuk', label: '경북' },
   { key: 'gyeongnam', label: '경남' },
   { key: 'jeonbuk', label: '전북' },
   { key: 'jeonnam', label: '전남' },
];

const MapSection = () => {
   const map = useMapStore(state => state.map);
   const isMapScriptLoaded = useMapStore(state => state.isMapScriptLoaded);
   const isInitialFetchDone = useRef(false);
   const openpanel = panelstore(state => state.openpanel);
   const { data: session } = useSession();

   const { weather, fetchWeather } = useWeather();
   const { airQuality, fetchAirQuality } = useAirQuality();
   const { weeklyWeather, fetchWeeklyWeather } = useWeeklyWeather();
   const [showWeeklyModal, setShowWeeklyModal] = useState(false);
   const [selectedRegion, setSelectedRegion] = useState<keyof typeof REGION_NAME | null>(null);
   const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
   const [currentPosition, setCurrentPosition] = useState<{
      lat: number;
      lng: number;
   } | null>(null);
   const [locationName, setLocationName] = useState<string>('위치 정보');
   const [showMoreRegions, setShowMoreRegions] = useState(false);
   const [visibleButtonCount, setVisibleButtonCount] = useState(REGION_BUTTONS.length);
   const [panelOffset, setPanelOffset] = useState(0);
   const panelOffsetRef = useRef(0);

   const lastPanelOpenRef = useRef<boolean>(!!openpanel);
   const isMapInitializedRef = useRef(false);
   const markersRef = useRef<naver.maps.Marker[]>([]);
   const clustererRef = useRef<any>(null);
   const filterContainerRef = useRef<HTMLDivElement>(null);
   const moreButtonRef = useRef<HTMLButtonElement>(null);

   const fetchMapData = useCallback(
      (lat: number, lng: number) => {
         setCurrentPosition({ lat, lng });
         fetchWeather(lat, lng);
         fetchAirQuality(lat, lng);
      },
      [fetchWeather, fetchAirQuality], // fetchWeather, fetchAirQuality가 변경될 때마다 함수 재생성 (안정적)
   );
   const isListenerAddedRef = useRef(false);
   const setRegionFilter = useEventFilterStore(state => state.setRegion); /* ADD BY CKH 26.01.05 */
   const setKeywordFilter = useEventFilterStore(state => state.setKeyword); /* ADD BY CKH 26.01.06 */
   const router = useRouter(); /* ADD BY CKH 26.01.06 */

   const moveMapTo = useCallback(
      (targetLat: number, targetLng: number, targetZoom: number) => {
         if (!map) {
            console.error('[moveMapTo] map이 없습니다!');
            return;
         }


         // 1. 줌 레벨 변경
         map.setZoom(targetZoom);

         // 2. 중심 좌표 설정
         const targetCoord = new naver.maps.LatLng(targetLat, targetLng);
         map.setCenter(targetCoord);

         // 3. 패널 오프셋 적용
         setTimeout(() => {
            const openPanelEl = document.querySelector('[data-panel-root="true"][data-panel-open="true"]');
            const currentPanelOffset = openPanelEl?.getBoundingClientRect().width ?? 0;

            const screenWidth = window.innerWidth;
            const visibleWidth = screenWidth - currentPanelOffset;
            const visibleCenterX = currentPanelOffset + visibleWidth / 2;
            const screenCenterX = screenWidth / 2;
            const pixelShift = screenCenterX - visibleCenterX;


            if (map && map.panBy) {
               map.panBy(new naver.maps.Point(pixelShift, 0));
            }
         }, 50);
      },
      [map],
   );

   /* focusedEvent 감지 ADD BY CKH */
   const focusedEvent = useEventFilterStore(state => state.focusedEvent);
   const clearFocusedEvent = useEventFilterStore(state => state.clearFocusedEvent);

   useEffect(() => {
      if(!map || !isMapScriptLoaded || !focusedEvent) return;

      setSelectedRegion(`all`);
      setSelectedEventId(focusedEvent.id);

      moveMapTo(focusedEvent.latitude, focusedEvent.longitude, 15);

      clearFocusedEvent();
   }, [map, isMapScriptLoaded, focusedEvent, moveMapTo, clearFocusedEvent]);

   /* 마커 초기화 ADD BY CKH */
   const handleClearMarkers = () => {
      clustererRef.current?.setMap(null);
      clustererRef.current = null;

      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      if (currentLocationMarkerRef.current) {
         currentLocationMarkerRef.current.setMap(null);
         currentLocationMarkerRef.current = null;
      }

      setSelectedRegion(null);
      setSelectedEventId(null);
      setRegionFilter('all');
      setShowMoreRegions(false);
   };

   /* 현재 위치 마커 ADD BY CKH */
   const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);



   useEffect(() => {
      if (!map || !isMapScriptLoaded) return;

      async function loadMarkers() {
         try {
            // 클러스터 제거
            clustererRef.current?.setMap(null);
            clustererRef.current = null;
            
            // 기존 마커 모두 제거
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];

            // 선택 해제된 경우 마커 미표시
            if (selectedRegion === null) {
               return;
            }

            // ⭐️ 현재 사용자 정보 가져오기 (NextAuth 세션 사용)
            const userId = session?.user?.id;

            //supabase에서 이벤트 가져오기
            let query = supabase.from('events').select('*');

            //지역 필터링
            if (selectedRegion !== 'all') {
               const regionName = REGION_NAME[selectedRegion];
               if (regionName) {
                  query = query.like('address', `${regionName}%`);
               }
            }

            const { data: events, error } = await query;

            if (error) {
               console.error('❌ [loadMarkers] 이벤트 로드 실패:', error);
               return;
            }

            if (!events) {
               console.warn('⚠️ [loadMarkers] events가 null');
               return;
            }

            if (events.length === 0) {
               return;
            }


            // 사용자 좋아요 목록 가져오기
            let likedEventIds: Set<number> = new Set();
            if (userId) {
               const { data: likedEvents, error: likedError } = await supabase
                  .from('liked_events')
                  .select('event_id')
                  .eq('user_id', userId);


               if (likedEvents && likedEvents.length > 0) {
                  likedEventIds = new Set(likedEvents?.map(like => Number(like.event_id)) ?? []);
               }
            }


            // 마커 생성
            let markerCount = 0;
            events.forEach((event: MapEvent) => {
               if (!event.latitude || !event.longitude) {
                  console.warn('[loadMarkers] 좌표 없음:', event.title);
                  return;
               }

               let iconUrl = '/marker/normal.png';

               // 좋아요 여부 확인
               const eventIdNum = Number(event.id);
               const isLiked = likedEventIds.has(eventIdNum);


               // 선택된 이벤트인 경우
               if (selectedEventId === event.id) {
                  iconUrl = '/marker/select.png';
               }
               // 좋아요한 이벤트인 경우
               else if (isLiked) {
                  iconUrl = '/marker/like.png';
               }
               if(!map) return;
               const marker = new naver.maps.Marker({
                  position: new naver.maps.LatLng(event.latitude, event.longitude),
                  title: event.title || '이벤트',
                  icon: {
                     url: iconUrl,
                     scaledSize: new naver.maps.Size(18, 26),
                     anchor: new naver.maps.Point(16, 26),
                  },
               });

               // 마커 클릭 이벤트
               naver.maps.Event.addListener(marker, 'click', () => {
                  setSelectedEventId(event.id ?? null);
                  //todo eventpanel 열기 
                  setKeywordFilter(event.title ?? ''); // ADD BY CKH 26.01.06
                  router.push('/'); // ADD BY CKH 26.01.06
               });

               markersRef.current.push(marker);
               markerCount++;
            });

            // 클러스터 마커 생성
            const { default: MarkerClustering } = await import('@/lib/map/MarkerClustering');
            clustererRef.current = new MarkerClustering({
               map,
               markers: markersRef.current,
               minClusterSize: 2,
               maxZoom: 13,
               gridSize: 80,
               disableClickZoom: false,
               icons: [
                  {
                     content:
                        '<div class="event-cluster-marker event-cluster-marker-sm"><span></span></div>',
                     size: new naver.maps.Size(38, 38),
                     anchor: new naver.maps.Point(19, 19),
                  },
                  {
                     content:
                        '<div class="event-cluster-marker event-cluster-marker-md"><span></span></div>',
                     size: new naver.maps.Size(46, 46),
                     anchor: new naver.maps.Point(23, 23),
                  },
                  {
                     content:
                        '<div class="event-cluster-marker event-cluster-marker-lg"><span></span></div>',
                     size: new naver.maps.Size(54, 54),
                     anchor: new naver.maps.Point(27, 27),
                  },
               ],
               stylingFunction: (clusterMarker: naver.maps.Marker, count: number) => {
                  const element = clusterMarker.getElement();
                  const countElement = element?.querySelector('span');
                  if (countElement) countElement.textContent = String(count);
               },
            });

         } catch (error) {
            console.error('❌ [loadMarkers] 예외 발생:', error);
         }
      }

      loadMarkers();
   }, [map, isMapScriptLoaded, selectedRegion, selectedEventId, session]);

   useEffect(() => {
      if (!map || !isMapScriptLoaded) {
         return;
      }

      if (!isInitialFetchDone.current) {
         fetchMapData(INITIAL_CONFIG.lat, INITIAL_CONFIG.lng);
         isInitialFetchDone.current = true;
      }

      if (isListenerAddedRef.current) {
         return;
      }

      isListenerAddedRef.current = true;

      const listener = naver.maps.Event.addListener(map, 'idle', () => {
         const newCenter = map.getCenter();
         const newLat = newCenter.y;
         const newLng = newCenter.x;


         if (
            !currentPosition ||
            Math.abs(currentPosition.lat - newLat) > 0.0001 ||
            Math.abs(currentPosition.lng - newLng) > 0.0001
         ) {
            fetchMapData(newLat, newLng); // ⭐️ 3. 지도 이동 조건 충족 시 fetchMapData 호출
         }
      });

      return () => {
         if (listener) naver.maps.Event.removeListener(listener);
         isListenerAddedRef.current = false;
      };
   }, [map, isMapScriptLoaded, currentPosition, fetchMapData]); // ⭐️ 의존성 배열에 fetchMapData 추가

   useEffect(() => {
      if (!map || !isMapScriptLoaded || isMapInitializedRef.current) return;

      // DOM 렌더링 안정화를 위해 약간의 지연 후 실행
      setTimeout(() => {
         const { lat, lng, zoom } = INITIAL_CONFIG;
         // 이 함수가 패널 상태를 체크해서 자동으로 중앙(패널 제외 영역)을 잡아줌
         moveMapTo(lat, lng, zoom);
         isMapInitializedRef.current = true;
      }, 200);
   }, [map, isMapScriptLoaded, moveMapTo]);

   useEffect(() => {
      if (!map || !isMapScriptLoaded) return;
      const isPanelOpen = Boolean(openpanel);
      if (isPanelOpen === lastPanelOpenRef.current) return;

      // 초기화 직후에는 panBy 실행 방지 (moveMapTo와 충돌 방지)
      if (!isMapInitializedRef.current) {
         lastPanelOpenRef.current = isPanelOpen;
         return;
      }

      setTimeout(() => {
         const openPanelEl = document.querySelector('[data-panel-root="true"][data-panel-open="true"]') as HTMLElement;
         const panelWidth = openPanelEl?.getBoundingClientRect().width ?? 0;
         const prevPanelWidth = panelOffsetRef.current;

         const nextOffset = isPanelOpen ? panelWidth : 0;
         setPanelOffset(nextOffset);
         panelOffsetRef.current = nextOffset;

         // 패널 변화량 계산
         const panelDelta = isPanelOpen ? panelWidth : -prevPanelWidth;

         // 패널이 열리거나 닫힐 때, 가시영역의 중심이 유지되도록 조정
         // 패널 너비의 절반만큼 반대 방향으로 이동
         if (map.panBy && panelDelta !== 0) {
            map.panBy(new naver.maps.Point(-panelDelta / 2, 0));
         }
      }, 100);
      lastPanelOpenRef.current = isPanelOpen;
   }, [map, isMapScriptLoaded, openpanel]);

   useEffect(() => {
      const calculateVisibleButtons = () => {
         if (!filterContainerRef.current) return;

         // 전체 창 너비 - 패널 너비 - 양쪽 마진(left-5 + right-5) - 더보기 버튼 공간
         const availableWidth = window.innerWidth - (panelOffset + 20) - 80;
         const buttonWidth = 76;

         const maxButtons = Math.floor(availableWidth / buttonWidth);

         //최소 5개
         const newVisibleCount = Math.max(5, Math.min(maxButtons, REGION_BUTTONS.length));

         if (newVisibleCount !== visibleButtonCount) {
            setVisibleButtonCount(newVisibleCount);
         }
      };

      // 초기 계산
      calculateVisibleButtons();

      // ResizeObserver로 컨테이너 크기 변화 감지
      const resizeObserver = new ResizeObserver(() => {
         calculateVisibleButtons();
      });

      if (filterContainerRef.current) {
         resizeObserver.observe(filterContainerRef.current);
      }

      // Window resize 이벤트도 추가로 감지
      window.addEventListener('resize', calculateVisibleButtons);

      return () => {
         resizeObserver.disconnect();
         window.removeEventListener('resize', calculateVisibleButtons);
      };
   }, [visibleButtonCount, panelOffset]);

   useEffect(() => {
      if (!currentPosition) return;

      // ⭐️ 현재 좌표가 초기 좌표(전체/초기화 위치)와 거의 일치하는지 확인
      // 부동 소수점 오차를 고려하여 약간의 차이는 허용 (Math.abs < 0.001)
      const isInitialPosition =
         Math.abs(currentPosition.lat - INITIAL_CONFIG.lat) < 0.001 &&
         Math.abs(currentPosition.lng - INITIAL_CONFIG.lng) < 0.001;

      // 초기 위치라면 API 호출 없이 기본값으로 설정하고 종료
      if (isInitialPosition) {
         setLocationName('위치 정보');
         return;
      }

      let retryCount = 0;
      const maxRetries = 10;

      const tryReverseGeocode = () => {
         if (typeof window === 'undefined') return;

         // 네이버 지도 스크립트 로드 확인
         if (!window.naver?.maps?.Service?.reverseGeocode) {
            if (retryCount < maxRetries) {
               retryCount++;
               setTimeout(tryReverseGeocode, 1000);
            } else {
               // 실패 시 좌표 표시
               setLocationName(`${currentPosition.lat.toFixed(4)}, ${currentPosition.lng.toFixed(4)}`);
            }
            return;
         }

         try {
            naver.maps.Service.reverseGeocode(
               {
                  coords: new naver.maps.LatLng(currentPosition.lat, currentPosition.lng),
                  orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(','),
               },
               function (status, response) {
                  if (status === naver.maps.Service.Status.ERROR) {
                     setLocationName('위치 정보');
                     return;
                  }

                  const result = response.v2;
                  const address = result.address;

                  if (address && address.jibunAddress) {
                     const parts = address.jibunAddress.split(' ');
                     const area2 = parts[1] || ''; // 구/군
                     const area3 = parts[2] || ''; // 동/읍/면

                     // 구/군 + 동/읍/면 조합, 없으면 상위 주소 사용
                     const displayName = area2 && area3 ? `${area2} ${area3}` : area2 || parts[0] || '현재 위치';

                     setLocationName(displayName);
                  }
               },
            );
         } catch (error) {
            console.error('Reverse Geocoding Error:', error);
            setLocationName('위치 정보');
         }
      };

      tryReverseGeocode();
   }, [currentPosition]);

   const handleWeatherClick = async () => {
      if (showWeeklyModal) {
         setShowWeeklyModal(false);
      } else {
         if (currentPosition) {
            await fetchWeeklyWeather(currentPosition.lat, currentPosition.lng);
            setShowWeeklyModal(true);
         }
      }
   };

   const pm10Level = airQuality ? getPM10Level(airQuality.pm10) : null;
   const pm25Level = airQuality ? getPM25Level(airQuality.pm2_5) : null;

   const handleRegion = (region: keyof typeof REGION_NAME) => {
      // 전체 버튼 선택
      if (region === 'all') {
         // 이미 전체가 선택되어 있으면 -> 해제
         if (selectedRegion === 'all') {
            setSelectedRegion(null);
            setRegionFilter('all'); /* EDIT BY CKH 26.01.05 */
            const { lat, lng, zoom } = INITIAL_CONFIG;
            moveMapTo(lat, lng, zoom);
         }
         // 전체 선택
         else {
            setSelectedRegion('all');
            setRegionFilter('all'); /* EDIT BY CKH 26.01.05 */
            const { lat, lng, zoom } = INITIAL_CONFIG;
            moveMapTo(lat, lng, zoom);
         }
      }
      // 다른 지역이 선택된 상태에서 같은 지역 다시 클릭 -> 필터 해제
      else if (selectedRegion === region) {
         setSelectedRegion(null);
         setRegionFilter('all'); /* EDIT BY CKH 26.01.05 */
         const { lat, lng, zoom } = INITIAL_CONFIG;
         moveMapTo(lat, lng, zoom);
      }
      // 새로운 지역 선택
      else {
         setSelectedRegion(region);
         setRegionFilter(REGION_NAME[region] ?? 'all');
         if (REGION_COORDINATES[region]) {
            const { lat, lng, zoom } = REGION_COORDINATES[region];
            moveMapTo(lat, lng, zoom);
         }
      }

      setShowMoreRegions(false);
   };

   const handleCurrentLocation = () => {
      if (!map) return;
      
      if (!navigator.geolocation) {
         alert(`현재 위치를 사용할 수 없습니다.`);
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            moveMapTo(lat, lng, 15);
            setCurrentPosition({ lat, lng });

            currentLocationMarkerRef.current?.setMap(null);

            currentLocationMarkerRef.current = new naver.maps.Marker({
               position: new naver.maps.LatLng(lat, lng),
               map,
               icon: {
                  content: `
                  <div style="
                     width: 18px;
                     height: 18px;
                     border-radius: 9999px;
                     background: #007de4;
                     border: 3px solid white;
                     box-shadow: 0 0 0 4px rgba(0,125,228,.2);
                  "></div>
               `,
               size: new naver.maps.Size(18, 18),
               anchor: new naver.maps.Point(9, 9),
               }
            })
         },
         (error) => {
            console.error(`현재 위치 가져오기 실패:`, error);
            alert('현재 위치 권한을 확인해주세요.');
         },
         {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
         }
      )
   };

   const visibleButtons = REGION_BUTTONS.slice(0, visibleButtonCount);
   const hiddenButtons = REGION_BUTTONS.slice(visibleButtonCount);

   return (
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
         {/* 필터 */}
         <div className="absolute top-5 left-5 rounded-md pointer-events-auto flex gap-2 items-start z-20">
            <div ref={filterContainerRef} className="flex gap-2 overflow-hidden flex-1">
               {visibleButtons.map(({ key, label }) => (
                  <Button
                     key={key}
                     variant={selectedRegion === key ? 'default' : 'outline'}
                     className="rounded-3xl min-w-[60px] whitespace-nowrap shrink-0"
                     onClick={() => handleRegion(key as keyof typeof REGION_NAME)}
                  >
                     {label}
                  </Button>
               ))}
            </div>

            {/* 초기화 버튼 */}
            <Button
               variant="outline"
               className='rounded-full bg-white shrink-0'
               onClick={handleClearMarkers}
               title="마커 숨기기"
            >
               <MapPinOff size={18} />
            </Button>

            {/* 더보기 버튼 */}
            {hiddenButtons.length > 0 && (
               <div className="relative shrink-0 z-50">
                  <Button
                     ref={moreButtonRef}
                     variant={showMoreRegions ? 'default' : 'outline'}
                     className="rounded-full bg-white"
                     onClick={() => setShowMoreRegions(!showMoreRegions)}
                  >
                     <HiDotsVertical />
                  </Button>

                  {/* 숨겨진 버튼 드롭다운 */}
                  {showMoreRegions && (
                     <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border p-2 min-w-[200px] max-h-[300px] overflow-y-auto z-50">
                        <div className="flex flex-col gap-1">
                           {hiddenButtons.map(({ key, label }) => (
                              <Button
                                 key={key}
                                 variant={selectedRegion === key ? 'default' : 'ghost'}
                                 className="w-full justify-start"
                                 onClick={() => handleRegion(key as keyof typeof REGION_NAME)}
                              >
                                 {label}
                              </Button>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
         {/* 날씨정보 */}
         {weather && (
            <div
               onClick={handleWeatherClick}
               className="absolute bottom-20 md:bottom-5 left-5 bg-[#F1F5FA] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] px-2 py-3 flex flex-col gap-1 items-center justify-center pointer-events-auto z-20 cursor-pointer border"
            >
               <div className="flex items-center justify-center flex-col gap-2">
                  <div className="text-sm">{locationName}</div>
               </div>
               <div className="flex gap-1 items-center justify-center">
                  <div className="flex items-center justify-center flex-col gap-2">
                     <WeatherIcon weatherCode={weather.weathercode} className="w-8 h-8" />
                     <div className="text-sm">{Math.round(weather.temperature)}°C</div>
                  </div>
                  {airQuality && pm10Level && pm25Level && (
                     <div className="flex flex-col gap-3 w-12">
                        <div
                           className="w-full flex-1 text-center text-xs rounded-sm items-center justify-center"
                           style={{ borderRight: `3px solid ${pm25Level.color}` }}
                        >
                           미세
                        </div>
                        <div
                           className="w-full flex-1 text-center text-xs rounded-sm items-center justify-centers"
                           style={{ borderRight: `3px solid ${pm25Level.color}` }}
                        >
                           초미세
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* 위치 초기화 버튼 */}
         <Button
            className="fixed bottom-8 right-3 pointer-events-auto cursor-pointer rounded-2xl w-10 h-10 bg-white z-50 shadow-md"
            variant="outline"
            onClick={handleCurrentLocation}
            title="지도 초기 위치"
         >
            <BiTargetLock />
         </Button>

         {showWeeklyModal && weeklyWeather && (
            <WeeklyWeatherModal
               weeklyWeather={weeklyWeather}
               locationName={locationName}
               onClose={() => setShowWeeklyModal(false)}
            />
         )}
      </div>
   );
};

export default MapSection;
