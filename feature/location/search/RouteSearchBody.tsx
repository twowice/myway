import { Button } from "@/components/ui/button";
import { RouteSearchBar } from "./RouteSearchBar";
import { SearchState, useSearchStore } from "@/stores/map/seachstore";
import { useShallow } from "zustand/react/shallow";
import { RouteSearchHistoryItem } from "./RouteSearchHistory";
import { RouteSearchItem } from "../detail/RouteSearchItem";

export const RouteSearchBody = ({}: {}) => {
  const {
    places,
    setRoutePoints,
    isDuringSearching,
    setIsDuringSearching,
    setIsAfterSearching,
    isAfterSearching,
  } = useSearchStore(
    useShallow((state: SearchState) => ({
      isDuringSearching: state.isDuringSearching,
      setIsDuringSearching: state.setIsDuringSearching,
      places: state.places,
      setRoutePoints: state.setRoutePoints,
      setIsAfterSearching: state.setIsAfterSearching,
      isAfterSearching: state.isAfterSearching,
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

      const transpathUrl = new URL(
        `${process.env.NEXT_PUBLIC_API_URL}/api/map/odsay/transpath?sx=${startPlace.lng}&sy=${startPlace.lat}&ex=${endPlace.lng}&ey=${endPlace.lat}`,
        window.location.origin
      );

      const response = await fetch(transpathUrl.toString());
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `길찾기 API 오류: ${errorData.error || "알 수 없는 오류"}`
        );
      }
      const routeData = await response.json();

      console.log("길찾기 API 결과:", routeData);

      setRoutePoints(places);
      setIsAfterSearching(true);
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
        {isAfterSearching ? (
          <RouteSearchItem />
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
