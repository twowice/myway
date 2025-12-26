import { GraphPo, Lane, OdsayLoadLane } from "@/app/api/map/odsay/odsay";
import { getSegmentColor, WALK_COLOR } from "./routeColors";

function first<T>(arr?: T[]): T | undefined {
  return arr && arr.length ? arr[0] : undefined;
}
function last<T>(arr?: T[]): T | undefined {
  return arr && arr.length ? arr[arr.length - 1] : undefined;
}

function getLaneStartEnd(lane: Lane): {
  startPos?: GraphPo;
  endPos?: GraphPo;
} {
  const firstSection = first(lane.section);
  const lastSection = last(lane.section);

  const startPos = firstSection ? first(firstSection.graphPos) : undefined;
  const endPos = lastSection ? last(lastSection.graphPos) : undefined;

  return { startPos, endPos };
}


/**
 * ODsay loadLane 기준: lane.class (1=버스, 2=지하철 등), lane.type(노선 타입)
 * 네이버 지도 Polyline 스타일에 바로 꽂아 쓸 수 있는 형태로 반환.
 */
export type RoutePolylineStyle = {
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
  zIndex: number;
  lineDash?: number[];
};

export type ODsayLaneLike = {
  class: number;
  type: number;
};

/**
 * 지도에 그릴 때 사용할 스타일.
 * - isTransfer=true면 환승 연결(도보) 구간을 점선으로 표시
 * - baseZIndex는 실선 위/아래 레이어 조절용
 */
export function getStyles(
  laneOrSub: any,
  opts?: {
    isTransfer?: boolean;
    baseZIndex?: number;
    weight?: number;
    opacity?: number;
  }
): RoutePolylineStyle {
  const isTransfer = opts?.isTransfer ?? false;

  // 1) ODsay loadLane lane 객체가 들어온 경우: { class, type }
  if (laneOrSub && typeof laneOrSub.class === "number" && typeof laneOrSub.type === "number") {
    const color = getOdsayLaneColor(laneOrSub as ODsayLaneLike);

    const baseZ = opts?.baseZIndex ?? (laneOrSub.class === 2 ? 20 : laneOrSub.class === 1 ? 10 : 5);
    const weight = opts?.weight ?? (laneOrSub.class === 2 ? 6 : laneOrSub.class === 1 ? 5 : 4);
    const opacity = opts?.opacity ?? (laneOrSub.class === 2 ? 0.95 : 0.85);

    return {
      strokeColor: color,
      strokeWeight: weight,
      strokeOpacity: opacity,
      zIndex: isTransfer ? baseZ + 1000 : baseZ,
      ...(isTransfer ? { lineDash: [10, 8] } : {}),
    };
  }

  // 2) ODsay path(대중교통) subPath 객체가 들어온 경우: trafficType 기반 색상
  //    - 환승(도보) 구간을 점선으로 표현하고 싶을 때: isTransfer=true로 호출
  const color = isTransfer ? WALK_COLOR : getSegmentColor(laneOrSub);

  return {
    strokeColor: color,
    strokeWeight: opts?.weight ?? (isTransfer ? 4 : 5),
    strokeOpacity: opts?.opacity ?? (isTransfer ? 0.9 : 0.85),
    zIndex: (opts?.baseZIndex ?? 10) + (isTransfer ? 1000 : 0),
    ...(isTransfer ? { lineDash: [10, 8] } : {}),
  };
}

export type DrawResult = {
  polylines: naver.maps.Polyline[];
  transferPolylines: naver.maps.Polyline[];
};

export function drawOdsayStyledPolylinesWithTransfer(
  map: naver.maps.Map,
  odsay: OdsayLoadLane
): DrawResult {
  const polylines: naver.maps.Polyline[] = [];
  const transferPolylines: naver.maps.Polyline[] = [];

  const lanes = odsay?.result?.lane ?? [];

  // 1) 실선(각 lane/section)
  lanes.forEach((lane) => {
    const style = getLaneStyle(lane);

    (lane.section ?? []).forEach((section) => {
      const graphPos = section.graphPos ?? [];
      if (graphPos.length < 2) return;

      const path = graphPos.map((p) => new naver.maps.LatLng(p.y, p.x));

      polylines.push(
        new naver.maps.Polyline({
          map,
          path,
          ...style,
        })
      );
    });
  });

  // 2) 환승 연결선만 점선 (이전 lane 끝점 -> 다음 lane 시작점)
  for (let i = 0; i < lanes.length - 1; i++) {
    const a = getLaneStartEnd(lanes[i]);
    const b = getLaneStartEnd(lanes[i + 1]);

    if (!a.endPos || !b.startPos) continue;

    const transferPath = [
      new naver.maps.LatLng(a.endPos.y, a.endPos.x),
      new naver.maps.LatLng(b.startPos.y, b.startPos.x),
    ];

    transferPolylines.push(
      new naver.maps.Polyline({
        map,
        path: transferPath,
        strokeColor: "#111",
        strokeWeight: 4,
        strokeOpacity: 0.9,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        lineDash: [10, 8], // ✅ 점선
        zIndex: 999,       // ✅ 실선 위로
      })
    );
  }

  // 3) boundary fit
  const b = odsay.result.boundary;
  if (b) {
    const bounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(b.bottom, b.left),
      new naver.maps.LatLng(b.top, b.right)
    );
    map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }

  return { polylines, transferPolylines };
}

export function clearDrawResult(draw: DrawResult) {
  [...draw.polylines, ...draw.transferPolylines].forEach((p) => p.setMap(null));
}