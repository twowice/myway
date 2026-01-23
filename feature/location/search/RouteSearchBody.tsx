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
import {
  markerDepartureDrawer,
  markerDestinationDrawer,
} from "@/utills/route/routeMarkerDrawer";
import { panelstore } from "@/stores/panelstore";
import type { OdsayTranspath } from "@/app/api/map/odsay/odsay";
import {
  fetchRouteSearchHistories,
  type RouteSearchHistory,
  deleteRouteSearchHistory,
} from "@/lib/map/history";
import { createSharedRoute, fetchSharedRoute } from "@/lib/map/sharedRoutes";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { TwoFunctionPopup } from "@/components/popup/twofunction";
import {
  historyToPlaces,
  sharedRouteToPlaces,
} from "@/utills/route/historyToPlaces";
import { placesToHistoryPayload } from "@/utills/route/placesToHistoryPayload";

export const RouteSearchBody = ({}: {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [histories, setHistories] = useState<RouteSearchHistory[]>([]);
  const [shareHistoryId, setShareHistoryId] = useState<number | null>(null);
  const [isShareLoginOpen, setIsShareLoginOpen] = useState(false);
  const { map, isMapScriptLoaded } = useMapStore();
  const drawResultRef = useRef<DrawResult | null>(null);
  const fallbackPolylinesRef = useRef<naver.maps.Polyline[]>([]);
  const markersRef = useRef<Map<number, naver.maps.Marker>>(new Map());
  const openpanel = panelstore((state) => state.openpanel);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sharedCode = searchParams.get("shared");
  const { showToast } = useToast();

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
      const data = await fetchRouteSearchHistories({ limit: 5 });
      setHistories(data);
    } catch (error: any) {
      console.warn("검색 기록 조회 실패:", error?.message);
    }
  }, []);

  useEffect(() => {
    void loadHistories();
  }, [loadHistories]);

  useEffect(() => {
    if (!sharedCode) return;

    let cancelled = false;

    const loadSharedRoute = async () => {
      try {
        const data = await fetchSharedRoute(sharedCode);
        if (cancelled) return;

        const { startPlace, endPlace } = sharedRouteToPlaces(data);

        setAllPlaces([startPlace, endPlace]);
        setRoutePoints([startPlace, endPlace]);
        setPaths(data.rawResponse as OdsayTranspath);
        setIsAfterSearching(true);
        setIsDuringSearching(false);

        if (session?.user?.id && session.user.id === data.ownerId) {
          setShareHistoryId(data.searchHistoryId);
        } else {
          setShareHistoryId(null);
        }
      } catch (error: any) {
        console.warn("공유 경로 조회 실패:", error?.message);
        showToast(error?.message ?? "공유 경로를 불러오지 못했어.");
      }
    };

    void loadSharedRoute();

    return () => {
      cancelled = true;
    };
  }, [
    sharedCode,
    session?.user?.id,
    setAllPlaces,
    setIsAfterSearching,
    setIsDuringSearching,
    setPaths,
    setRoutePoints,
    showToast,
  ]);

  useEffect(() => {
    if (!map || !isMapScriptLoaded) return;

    const nextKeys = new Set<number>();
    places.forEach((place) => {
      nextKeys.add(place.order);
      const existingMarker = markersRef.current.get(place.order);
      const position = new naver.maps.LatLng(place.lat, place.lng);

      if (existingMarker) {
        existingMarker.setPosition(position);
        existingMarker.setMap(map);
        return;
      }

      const marker =
        place.order === 1
          ? markerDepartureDrawer(map, place.lat, place.lng)
          : markerDestinationDrawer(map, place.lat, place.lng);
      markersRef.current.set(place.order, marker);
    });

    markersRef.current.forEach((marker, key) => {
      if (nextKeys.has(key)) return;
      marker.setMap(null);
      markersRef.current.delete(key);
    });
  }, [places, map, isMapScriptLoaded]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    return () => {
      clearRoutePolylines();
    };
  }, []);

  const search = async () => {
    if (places.length < 2) {
      alert("출발지와 목적지를 모두 선택해주세요.");
      return;
    }

    setIsDuringSearching(true);
    setShareHistoryId(null);
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
        const saved = await saveRouteSearchHistory(
          placesToHistoryPayload({
            startPlace,
            endPlace,
            rawResponse: routeData,
            summary: {
              totalTimeSeconds: Number.isFinite(totalTimeSeconds)
                ? totalTimeSeconds
                : null,
              totalFare:
                totalFare != null && Number.isFinite(Number(totalFare))
                  ? Number(totalFare)
                  : null,
              mapObjectId,
            },
          })
        );
        const savedId = Number(saved?.id);
        setShareHistoryId(Number.isFinite(savedId) ? savedId : null);
        await loadHistories();
      } catch (historyError: any) {
        console.warn("검색 기록 저장 실패:", historyError?.message);
        setShareHistoryId(null);
      }
    } catch (error: any) {
      console.error("길찾기 중 오류 발생:", error.message);
      alert(`길찾기 실패: ${error.message}`);
      setRoutePoints([]);
    } finally {
      setIsDuringSearching(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!success) {
      throw new Error("클립보드 복사 실패");
    }
  };

  const handleShare = async (pathIndex: number) => {
    if (!session?.user?.id) {
      setIsShareLoginOpen(true);
      return;
    }

    if (!shareHistoryId) {
      showToast("공유할 검색 기록이 존재하지 않습니다.");
      return;
    }

    try {
      const { shareUrl } = await createSharedRoute({
        searchHistoryId: shareHistoryId,
        sharedPathIndex: pathIndex,
      });
      await copyToClipboard(shareUrl);
      showToast("경로 링크 복사가 완료되었습니다.");
    } catch (error: any) {
      console.error("공유 링크 생성 실패:", error);
      showToast(error?.message ?? "공유 링크 생성 실패");
    }
  };

  const applyHistory = (history: RouteSearchHistory) => {
    setShareHistoryId(history.id);
    const { startPlace, endPlace } = historyToPlaces(history);

    setAllPlaces([startPlace, endPlace]);
    setRoutePoints([startPlace, endPlace]);
    setIsAfterSearching(true);
    setIsDuringSearching(false);
    setPaths(history.raw_response as OdsayTranspath);
  };

  const handleDeleteHistory = useCallback(async (id: number) => {
    try {
      await deleteRouteSearchHistory(id);
      setHistories((prev) => prev.filter((history) => history.id !== id));
    } catch (error: any) {
      console.warn("검색 기록 삭제 실패:", error?.message);
    }
  }, []);

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
        "현재 선택하신 대중교통(KTX, ITX, SRT, 시외 버스 등)은 도보 및 지하철&시내버스 경로를 제외한 지도 경로 정보를 제공하지 않습니다.\n추후 업데이트를 통해 해당 내용은 제공될 예정입니다."
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
    <div className="bg-white w-full flex flex-col gap-6">
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
          paths?.result?.path?.map((path, index) => {
            const titleText =
              index === 0
                ? "최적"
                : path.pathType === 1
                ? "지하철"
                : path.pathType === 2
                ? "버스"
                : path.pathType === 3
                ? "지하철+버스"
                : path.pathType === 11
                ? "기차"
                : path.pathType === 12
                ? "버스"
                : path.pathType === 20
                ? "시외/고속버스"
                : "상세 경로";

            const title =
              index === 0 ? (
                <span className="text-primary">{titleText}</span>
              ) : (
                titleText
              );

            return (
              <RouteDetailPopup
                key={`popup-${index}`}
                open={openIndex === index}
                onOpenChange={(isOpen) => setOpenIndex(isOpen ? index : null)}
                title={title}
                path={path}
                fromName={places.find((p) => p.order === 1)?.name ?? ""}
                toName={
                  places.find((p) => p.order === places.length)?.name ?? ""
                }
              >
                <RouteSearchItem
                  key={index}
                  index={index}
                  path={path}
                  fromName={places.find((p) => p.order === 1)?.name ?? ""}
                  toName={
                    places.find((p) => p.order === places.length)?.name ?? ""
                  }
                  onShare={() => {
                    void handleShare(index);
                  }}
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
            );
          })
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
                  onDelete={() => handleDeleteHistory(history.id)}
                />
              ))
            )}
          </>
        )}
      </div>

      <TwoFunctionPopup
        open={isShareLoginOpen}
        onOpenChange={setIsShareLoginOpen}
        title="로그인이 필요합니다."
        body={
          <p className="text-sm text-muted-foreground">
            공유 링크를 생성하실려면 로그인이 필요합니다.
          </p>
        }
        leftTitle="닫기"
        rightTitle="로그인"
        leftCallback={() => setIsShareLoginOpen(false)}
        rightCallback={() => router.push("/loginpage")}
        dialogTrigger={<span />}
      />
    </div>
  );
};
