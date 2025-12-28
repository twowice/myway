"use client";

import { Button } from "@/components/ui/button";
import { RouteSearchBar } from "./RouteSearchBar";
import { SearchState, useSearchStore } from "@/stores/map/seachstore";
import { useShallow } from "zustand/react/shallow";
import { RouteSearchHistoryItem } from "./RouteSearchHistory";
import { RouteSearchItem } from "../detail/RouteSearchItem";
import { getLoadlane, getTransPath } from "@/lib/map/odsay";
import { RouteDetailPopup } from "../detail/RouteDetailPopup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMapStore } from "@/stores/map/store";
import type { OdsayLoadLane } from "@/app/api/map/odsay/odsay";
import { saveRouteSearchHistory } from "@/lib/map/history";
import {
  clearDrawResult,
  drawEdgeWalkSegments,
  drawFallbackSegments,
  getEdgeTargetsFromLoadlane,
  getEdgeTargetsFromSubPaths,
  drawOdsayStyledPolylinesWithTransfer,
  type DrawResult,
} from "@/utills/route/routePolyLineDrawer";
import { panelstore } from "@/stores/panelstore";
import type { OdsayTranspath } from "@/app/api/map/odsay/odsay";
import {
  fetchRouteSearchHistories,
  type RouteSearchHistory,
} from "@/lib/map/history";

export const RouteSearchBody = ({}: {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [histories, setHistories] = useState<RouteSearchHistory[]>([]);
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
    setAllPlaces,
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
      setAllPlaces: state.setAllPlaces,
      setRoutePoints: state.setRoutePoints,
      setIsAfterSearching: state.setIsAfterSearching,
      isAfterSearching: state.isAfterSearching,
      paths: state.paths,
      setPaths: state.setPaths,
    }))
  );

  const loadHistories = useCallback(async () => {
    try {
      const data = await fetchRouteSearchHistories({ limit: 10 });
      setHistories(data);
    } catch (error: any) {
      console.warn("검색 기록 조회 실패:", error?.message);
    }
  }, []);

  useEffect(() => {
    void loadHistories();
  }, [loadHistories]);

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
        await loadHistories();
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

  const applyHistory = (history: RouteSearchHistory) => {
    const startPlace = {
      order: 1,
      name: history.departure_name,
      address: "",
      lat: history.departure_latitude,
      lng: history.departure_longitude,
    };
    const endPlace = {
      order: 2,
      name: history.destination_name,
      address: "",
      lat: history.destination_latitude,
      lng: history.destination_longitude,
    };

    setAllPlaces([startPlace, endPlace]);
    setRoutePoints([startPlace, endPlace]);
    setIsAfterSearching(true);
    setIsDuringSearching(false);
    setPaths(history.raw_response as OdsayTranspath);
  };

  const normalizeMapObject = (mapObj: string) => {
    const trimmed = mapObj.trim();
    if (!trimmed) return "";
    const head = trimmed.split("@")[0]?.split(":") ?? [];
    if (head.length === 2) return trimmed;
    return `0:0@${trimmed}`;
  };

  const drawLoadlane = async (
    mapObj: string,
    subPaths: any[],
    startPlace?: { lat: number; lng: number },
    endPlace?: { lat: number; lng: number }
  ) => {
    clearRoutePolylines();
    if (!map || !isMapScriptLoaded) return;

    if (!mapObj) {
      alert(
        "현재 선택하신 대중교통(KTX, ITX, SRT, 시외 버스 등은 도보 및 지하철&시내버스 경로를 제외한 지도 경로 정보를 제공하지 않습니다.\n추후 업데이트를 통해 해당 내용은 제공될 예정입니다.)"
      );
      fallbackPolylinesRef.current.push(...drawFallbackSegments(map, subPaths));
      if (startPlace && endPlace) {
        const edgeTargetsFromSubPaths = getEdgeTargetsFromSubPaths(subPaths);
        fallbackPolylinesRef.current.push(
          ...(await drawEdgeWalkSegments(map, startPlace, endPlace, {
            start: edgeTargetsFromSubPaths.start,
            end: edgeTargetsFromSubPaths.end,
          }))
        );
      }
      return;
    }

    const normalized = normalizeMapObject(mapObj);
    if (!normalized) return;

    const data = (await getLoadlane(normalized)) as OdsayLoadLane;
    console.log("경로 그리기 API 결과:", data);
    drawResultRef.current = drawOdsayStyledPolylinesWithTransfer(map, data);

    fallbackPolylinesRef.current.push(...drawFallbackSegments(map, subPaths));

    if (startPlace && endPlace) {
      const edgeTargetsFromLoadlane = getEdgeTargetsFromLoadlane(data);
      const edgeTargetsFromSubPaths = getEdgeTargetsFromSubPaths(subPaths);
      fallbackPolylinesRef.current.push(
        ...(await drawEdgeWalkSegments(map, startPlace, endPlace, {
          start: edgeTargetsFromLoadlane.start ?? edgeTargetsFromSubPaths.start,
          end: edgeTargetsFromLoadlane.end ?? edgeTargetsFromSubPaths.end,
        }))
      );
    }

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
                  void drawLoadlane(
                    path.info.mapObj,
                    path.subPath ?? [],
                    places.find((p) => p.order === 1),
                    places.find((p) => p.order === places.length)
                  );
                }}
              />
            </RouteDetailPopup>
          ))
        ) : (
          <>
            {histories.length === 0 ? (
              <p>검색 기록이 없습니다.</p>
            ) : (
              histories.map((history, index) => (
                <RouteSearchHistoryItem
                  key={history.id}
                  order={index + 1}
                  departure={history.departure_name}
                  destination={history.destination_name}
                  onSelect={() => applyHistory(history)}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
