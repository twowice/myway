"use client";

import { Button } from "@/components/ui/button";
import { RouteSearchBar } from "@/feature/location/RouteSearchBar";
import { RouteSearchHistoryItem } from "@/feature/location/RouteSearchHistory";
import { SearchState, useSearchStore } from "@/stores/map/seachstore";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Location() {
  const [isDuringSearching, setIsDuringSearching] = useState(false);
  const { places, setRoutePoints } = useSearchStore(
    useShallow((state: SearchState) => ({
      places: state.places,
      setRoutePoints: state.setRoutePoints,
    }))
  );

  console.log(
    "[Location] - 현재 장소 개수 및 장소 데이터:",
    places.length,
    places
  );
  const search = async () => {
    if (places.length < 2) {
      alert("출발지와 목적지를 모두 선택해주세요.");
      return;
    }

    setIsDuringSearching(true);
    try {
      const directionsApiUrl = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/map/direction`,
        window.location.origin
      );

      const startPlace = places.find((p) => p.order === 1);
      const endPlace = places.find((p) => p.order === places.length);

      if (!startPlace || !endPlace) {
        alert("출발지 또는 목적지 정보가 부족합니다.");
        return;
      }

      directionsApiUrl.searchParams.append(
        "start",
        `${startPlace.lng},${startPlace.lat}`
      );
      directionsApiUrl.searchParams.append(
        "goal",
        `${endPlace.lng},${endPlace.lat}`
      );

      const waypoints = places
        .filter((p) => p.order > 1 && p.order < places.length)
        .map((p) => `${p.lng},${p.lat}`)
        .join("|");
      if (waypoints) {
        directionsApiUrl.searchParams.append("waypoints", waypoints);
      }

      const response = await fetch(directionsApiUrl.toString());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `길찾기 API 오류: ${errorData.error || "알 수 없는 오류"}`
        );
      }
      const routeData = await response.json();

      console.log("길찾기 API 결과:", routeData);

      setRoutePoints(places);
    } catch (error: any) {
      console.error("길찾기 중 오류 발생:", error.message);
      alert(`길찾기 실패: ${error.message}`);
      setRoutePoints([]);
    } finally {
      setIsDuringSearching(false);
    }
  };

  return (
    <div className="bg-white p-4 w-full flex flex-col gap-6">
      <p className="text-[32px]">안녕하세요, 00님</p>
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

      <div className="flex gap-0 flex-col">
        <RouteSearchHistoryItem
          order={1}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
        <RouteSearchHistoryItem
          order={2}
          departure="해운대 해수욕장"
          destination="벡스코"
        />
      </div>
    </div>
  );
}
