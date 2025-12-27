"use client";

import { Button } from "@/components/ui/button";
import { RouteSearchBar } from "./RouteSearchBar";
import { SearchState, useSearchStore } from "@/stores/map/seachstore";
import { useShallow } from "zustand/react/shallow";
import { RouteSearchHistoryItem } from "./RouteSearchHistory";
import { RouteSearchItem } from "../detail/RouteSearchItem";
import { getLoadlane, getTransPath } from "@/lib/map/odsay";
import { RouteDetailPopup } from "../detail/RouteDetailPopup";
import { useRef, useState } from "react";
import { useMapStore } from "@/stores/map/store";
import type { OdsayLoadLane } from "@/app/api/map/odsay/odsay";
import { saveRouteSearchHistory } from "@/lib/map/history";
import {
  clearDrawResult,
  drawOdsayStyledPolylinesWithTransfer,
  type DrawResult,
} from "@/utills/route/routePolyLineDrawer";
import { panelstore } from "@/stores/panelstore";
import { getSegmentColor } from "@/utills/route/routeColors";

export const RouteSearchBody = ({}: {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { map, isMapScriptLoaded } = useMapStore();
  const drawResultRef = useRef<DrawResult | null>(null);
  const fallbackPolylinesRef = useRef<naver.maps.Polyline[]>([]);
  const openpanel = panelstore((state) => state.openpanel);

  const clearRoutePolylines = () => {
    if (drawResultRef.current) {
      clearDrawResult(drawResultRef.current);
      drawResultRef.current = null;
    }
    fallbackPolylinesRef.current.forEach((p) => p.setMap(null));
    fallbackPolylinesRef.current = [];
  };
  const {
    places,
    setRoutePoints,
    isDuringSearching,
    setIsDuringSearching,
    setIsAfterSearching,
    isAfterSearching,
    paths,
    setPaths,
  } = useSearchStore(
    useShallow((state: SearchState) => ({
      isDuringSearching: state.isDuringSearching,
      setIsDuringSearching: state.setIsDuringSearching,
      places: state.places,
      setRoutePoints: state.setRoutePoints,
      setIsAfterSearching: state.setIsAfterSearching,
      isAfterSearching: state.isAfterSearching,
      paths: state.paths,
      setPaths: state.setPaths,
    }))
  );

  const search = async () => {
    if (places.length < 2) {
      alert("출발지와 목적지를 모두 선택해주세요.");
      return;
    }

    setIsDuringSearching(true);
    try {
      const startPlace = places.find((p) => p.order === 1);
      const endPlace = places.find((p) => p.order === places.length);

      if (!startPlace || !endPlace) {
        alert("출발지 또는 목적지 정보가 부족합니다.");
        return;
      }
      const routeData = await getTransPath(startPlace, endPlace);

      console.log("길찾기 API 결과:", routeData);

      setPaths(routeData);
      setRoutePoints(places);
      setIsAfterSearching(true);

      const bestPath = routeData?.result?.path?.[0];
      const totalTimeSeconds = Number(bestPath?.info?.totalTime ?? 0) * 60;
      const totalFare =
        bestPath?.info?.payment ??
        (bestPath?.info as any)?.totalPayment ??
        null;
      const mapObjectId = bestPath?.info?.mapObj ?? null;

      try {
        await saveRouteSearchHistory({
          departure_name: startPlace.name,
          departure_latitude: startPlace.lat,
          departure_longitude: startPlace.lng,
          destination_name: endPlace.name,
          destination_latitude: endPlace.lat,
          destination_longitude: endPlace.lng,
          total_time_seconds: Number.isFinite(totalTimeSeconds)
            ? totalTimeSeconds
            : null,
          total_fare:
            totalFare != null && Number.isFinite(Number(totalFare))
              ? Number(totalFare)
              : null,
          map_object_id: mapObjectId,
          raw_response: routeData,
        });
      } catch (historyError: any) {
        console.warn("검색 기록 저장 실패:", historyError?.message);
      }
    } catch (error: any) {
      console.error("길찾기 중 오류 발생:", error.message);
      alert(`길찾기 실패: ${error.message}`);
      setRoutePoints([]);
    } finally {
      setIsDuringSearching(false);
    }
  };

  const normalizeMapObject = (mapObj: string) => {
    const trimmed = mapObj.trim();
    if (!trimmed) return "";
    const head = trimmed.split("@")[0]?.split(":") ?? [];
    if (head.length === 2) return trimmed;
    return `0:0@${trimmed}`;
  };

  const drawFallbackSegments = (subPaths: any[]) => {
    if (!map || !isMapScriptLoaded || !subPaths?.length) return;

    subPaths.forEach((sub) => {
      const trafficType = sub?.trafficType;
      if (trafficType !== 4 && trafficType !== 6) return;

      const startX = Number(sub?.startX);
      const startY = Number(sub?.startY);
      const endX = Number(sub?.endX);
      const endY = Number(sub?.endY);

      if (
        Number.isNaN(startX) ||
        Number.isNaN(startY) ||
        Number.isNaN(endX) ||
        Number.isNaN(endY)
      ) {
        alert("선택하신 이동수단은 지도 경로를 제공하지 않습니다");
        return;
      }

      const path = [
        new window.naver.maps.LatLng(startY, startX),
        new window.naver.maps.LatLng(endY, endX),
      ];

      fallbackPolylinesRef.current.push(
        new window.naver.maps.Polyline({
          map,
          path,
          strokeColor: getSegmentColor(sub),
          strokeWeight: 4,
          strokeOpacity: 0.9,
          strokeStyle: "dash",
          zIndex: 900,
        })
      );
    });
  };

  const drawLoadlane = async (mapObj: string, subPaths: any[]) => {
    clearRoutePolylines();
    if (!map || !isMapScriptLoaded) return;

    drawFallbackSegments(subPaths);

    if (!mapObj) return;

    const normalized = normalizeMapObject(mapObj);
    if (!normalized) return;

    const data = (await getLoadlane(normalized)) as OdsayLoadLane;
    console.log("경로 그리기 API 결과:", data);
    drawResultRef.current = drawOdsayStyledPolylinesWithTransfer(map, data);

    if (openpanel) {
      const openPanelEl = document.querySelector(
        '[data-panel-root="true"][data-panel-open="true"]'
      ) as HTMLElement | null;
      const panelWidth = openPanelEl?.getBoundingClientRect().width ?? 0;
      const shiftX = Math.round(panelWidth / 2);
      if (shiftX > 0 && map.panBy && window?.naver?.maps?.Point) {
        map.panBy(new window.naver.maps.Point(-shiftX, 0));
      }
    }
  };

  return (
    <div className="bg-white p-4 w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h1 className="text-[24px] font-semibold">길찾기</h1>
          <Button
            disabled={isDuringSearching || places.length < 2}
            onClick={search}
          >
            길찾기 {isDuringSearching ? "중..." : ""}
          </Button>
        </div>
        <RouteSearchBar order={1} total={2} />
        <RouteSearchBar order={2} total={2} />
      </div>

      <div className="flex flex-col gap-2">
        {isAfterSearching ? (
          paths?.result?.path?.map((path, index) => (
            <RouteDetailPopup
              key={`popup-${index}`}
              open={openIndex === index}
              onOpenChange={(isOpen) => setOpenIndex(isOpen ? index : null)}
            >
              <RouteSearchItem
                key={index}
                index={index}
                path={path}
                fromName={places.find((p) => p.order === 1)?.name ?? ""}
                toName={
                  places.find((p) => p.order === places.length)?.name ?? ""
                }
                onClick={() => {
                  setOpenIndex(index);
                  clearRoutePolylines();
                  void drawLoadlane(path.info.mapObj, path.subPath ?? []);
                }}
              />
            </RouteDetailPopup>
          ))
        ) : (
          <RouteSearchHistoryItem
            order={1}
            departure="해운대 해수욕장"
            destination="벡스코"
          />
        )}
      </div>
    </div>
  );
};
