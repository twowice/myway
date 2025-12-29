// src/components/ui/Map/MapSection.tsx
"use client";
import { useWeather } from "@/types/weather";
import { NaverMap } from "@/types/maptype";
import { getPM10Level, getPM25Level, useAirQuality } from "@/types/airquality";
import { useWeeklyWeather } from "@/types/weeklyWeather";
import { useState, useCallback, useRef, useEffect } from "react";
import WeeklyWeatherModal from "@/feature/weeklyWeatherModal";
import { useMapStore } from "@/stores/map/store";
import { panelstore } from "@/stores/panelstore";

const MapSection = () => {
  const map = useMapStore((state) => state.map);
  const isMapScriptLoaded = useMapStore((state) => state.isMapScriptLoaded);
  const isInitialFetchDone = useRef(false);
  const openpanel = panelstore((state) => state.openpanel);
  const lastPanelShiftRef = useRef(0);
  const lastPanelOpenRef = useRef(false);

  const { weather, fetchWeather } = useWeather();
  const { airQuality, fetchAirQuality } = useAirQuality();
  const { weeklyWeather, fetchWeeklyWeather } = useWeeklyWeather();
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const fetchMapData = useCallback(
    (lat: number, lng: number) => {
      setCurrentPosition({ lat, lng });
      fetchWeather(lat, lng);
      fetchAirQuality(lat, lng);
    },
    [fetchWeather, fetchAirQuality] // fetchWeather, fetchAirQuality가 변경될 때마다 함수 재생성 (안정적)
  );
  const isListenerAddedRef = useRef(false);

  useEffect(() => {
    if (!map || !isMapScriptLoaded) {
      console.log("[MapSection UI] 지도 인스턴스 또는 스크립트 로드 대기 중.");
      return;
    }

    if (!isInitialFetchDone.current) {
      const initialCenter = map.getCenter();
      const initialLat = initialCenter.y;
      const initialLng = initialCenter.x;
      console.log(
        "[MapSection UI] 초기 맵 로드 시 fetchMapData 호출:",
        initialLat,
        initialLng
      );
      fetchMapData(initialLat, initialLng);
      isInitialFetchDone.current = true;
    }

    if (isListenerAddedRef.current) {
      console.log("[MapSection UI] 리스너 이미 추가됨. 재등록 방지.");
      return;
    }

    console.log("[MapSection UI] 지도 인스턴스에 이벤트 리스너 등록 시작.");
    isListenerAddedRef.current = true;

    const listener = naver.maps.Event.addListener(map, "idle", () => {
      const newCenter = map.getCenter();
      const newLat = newCenter.y;
      const newLng = newCenter.x;

      console.log(
        `[MapSection UI] 지도 이동 완료 (idle). 새로운 좌표: ${newLat} \t ${newLng}`
      );

      if (
        !currentPosition ||
        Math.abs(currentPosition.lat - newLat) > 0.0001 ||
        Math.abs(currentPosition.lng - newLng) > 0.0001
      ) {
        fetchMapData(newLat, newLng); // ⭐️ 3. 지도 이동 조건 충족 시 fetchMapData 호출
      } else {
        console.log("[MapSection UI] 지도 위치 변화 미미. API 호출 건너뜀.");
      }
    });

    return () => {
      console.log("[MapSection UI] Cleanup: 리스너 제거 및 플래그 초기화.");
      if (listener && naver.maps.Event.removeListener) {
        naver.maps.Event.removeListener(listener);
      }
      isListenerAddedRef.current = false;
    };
  }, [map, isMapScriptLoaded, currentPosition, fetchMapData]); // ⭐️ 의존성 배열에 fetchMapData 추가

  useEffect(() => {
    if (!map || !isMapScriptLoaded) return;

    const isPanelOpen = Boolean(openpanel);
    if (isPanelOpen === lastPanelOpenRef.current) return;

    if (isPanelOpen) {
      const openPanelEl = document.querySelector(
        '[data-panel-root="true"][data-panel-open="true"]'
      ) as HTMLElement | null;
      const panelWidth = openPanelEl?.getBoundingClientRect().width ?? 0;
      const shiftX = Math.round(panelWidth / 2);
      if (shiftX > 0 && map.panBy) {
        // 왼쪽 패널이 열리면 우측 영역이 중심이 되도록 왼쪽으로 이동
        map.panBy(-shiftX, 0);
        lastPanelShiftRef.current = shiftX;
      }
    } else if (lastPanelShiftRef.current > 0 && map.panBy) {
      map.panBy(lastPanelShiftRef.current, 0);
      lastPanelShiftRef.current = 0;
    }

    lastPanelOpenRef.current = isPanelOpen;
  }, [map, isMapScriptLoaded, openpanel]);

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
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {/* 날씨정보 */}
      {weather && (
        <div
          onClick={handleWeatherClick}
          className="absolute bottom-5 left-5 bg-[#F1F5FA] rounded shadow-[0_2px_8px_rgba(0,0,0,0.15)] w-[150px] h-[100px] flex gap-2 items-center justify-center cursor-pointer pointer-events-auto z-20"
        >
          <div className="flex items-center justify-center flex-col">
            <div className="w-12 h-12 border border-black"></div>
            <div className="text-base">{Math.round(weather.temperature)}°C</div>
          </div>
          {airQuality && pm10Level && pm25Level && (
            <div className="flex flex-col gap-3 w-[60px]">
              <div
                className="w-full flex-1 text-center text-base rounded-[3px]"
                style={{ borderRight: `3px solid ${pm25Level.color}` }}
              >
                미세
              </div>
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
      {showWeeklyModal && weeklyWeather && (
        <WeeklyWeatherModal
          weeklyWeather={weeklyWeather}
          onClose={() => setShowWeeklyModal(false)}
        />
      )}
    </div>
  );
};

export default MapSection;
