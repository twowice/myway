import { GraphPo, Lane, OdsayLoadLane } from "@/app/api/map/odsay/odsay";
import {
  getLaneTypeColor,
  getPolylineSegmentColor,
  getSegmentColor,
  WALK_COLOR,
} from "./routeColors";
import { getTmapPedestrianRoute } from "@/lib/map/tmap";

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

function getOdsayLaneColor(lane: ODsayLaneLike): string {
  return getLaneTypeColor(lane);
}

function getLaneStyle(lane: Lane): RoutePolylineStyle {
  return getStyles(lane, { isTransfer: false });
}

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

type LatLngPoint = { lat: number; lng: number };

function isValidPoint(point?: LatLngPoint): point is LatLngPoint {
  return (
    !!point &&
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng)
  );
}

function createDashedPolyline(
  map: naver.maps.Map,
  path: naver.maps.LatLng[],
  styleSource: any
): naver.maps.Polyline {
  return new naver.maps.Polyline({
    map,
    path,
    strokeColor: getPolylineSegmentColor(styleSource),
    strokeWeight: 4,
    strokeOpacity: 0.9,
    strokeStyle: "dash",
    zIndex: 900,
  });
}

export function drawFallbackSegments(
  map: naver.maps.Map | null,
  subPaths: any[]
): naver.maps.Polyline[] {
  if (!map || !subPaths?.length) return [];

  const polylines: naver.maps.Polyline[] = [];

  const drawStraightFallback = (sub: any) => {
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
      return;
    }

    const path = [
      new naver.maps.LatLng(startY, startX),
      new naver.maps.LatLng(endY, endX),
    ];

    polylines.push(createDashedPolyline(map, path, sub));
  };

  for (let index = 0; index < subPaths.length; index += 1) {
    const sub = subPaths[index];
    const trafficType = sub?.trafficType;
    const isIntercity = trafficType === 4 || trafficType === 6;
    if (!isIntercity) continue;
    drawStraightFallback(sub);
  }

  return polylines;
}

export function getEdgeTargetsFromSubPaths(subPaths: any[]): {
  start?: LatLngPoint;
  end?: LatLngPoint;
} {
  if (!subPaths?.length) return {};

  const firstSub = subPaths[0];
  const lastSub = subPaths[subPaths.length - 1];

  const startX = Number(firstSub?.startX);
  const startY = Number(firstSub?.startY);
  const endX = Number(lastSub?.endX);
  const endY = Number(lastSub?.endY);

  const start = Number.isFinite(startX) && Number.isFinite(startY)
    ? { lat: startY, lng: startX }
    : undefined;
  const end = Number.isFinite(endX) && Number.isFinite(endY)
    ? { lat: endY, lng: endX }
    : undefined;

  return { start, end };
}

export function getEdgeTargetsFromLoadlane(data?: OdsayLoadLane): {
  start?: LatLngPoint;
  end?: LatLngPoint;
} {
  const lanes = data?.result?.lane ?? [];
  if (!lanes.length) return {};

  const firstLane = lanes[0];
  const lastLane = lanes[lanes.length - 1];
  const firstSections = firstLane?.section ?? [];
  const lastSections = lastLane?.section ?? [];
  const firstSection = firstSections[0];
  const lastSection = lastSections[lastSections.length - 1];
  const firstPos = firstSection?.graphPos?.[0];
  const lastPos = lastSection?.graphPos?.[lastSection.graphPos.length - 1];

  const start =
    firstPos && Number.isFinite(firstPos.y) && Number.isFinite(firstPos.x)
      ? { lat: firstPos.y, lng: firstPos.x }
      : undefined;
  const end =
    lastPos && Number.isFinite(lastPos.y) && Number.isFinite(lastPos.x)
      ? { lat: lastPos.y, lng: lastPos.x }
      : undefined;

  return { start, end };
}

export async function drawEdgeWalkSegments(
  map: naver.maps.Map | null,
  startPlace: LatLngPoint,
  endPlace: LatLngPoint,
  edgeTargets?: {
    start?: LatLngPoint;
    end?: LatLngPoint;
  }
): Promise<naver.maps.Polyline[]> {
  if (!map) return [];

  const polylines: naver.maps.Polyline[] = [];
  const walkStyle = { trafficType: 3 };

  const drawStraightBetween = (from: LatLngPoint, to: LatLngPoint) => {
    if (!isValidPoint(from) || !isValidPoint(to)) return;

    const path = [
      new naver.maps.LatLng(from.lat, from.lng),
      new naver.maps.LatLng(to.lat, to.lng),
    ];

    polylines.push(createDashedPolyline(map, path, walkStyle));
  };

  const drawTmapOrFallback = async (from: LatLngPoint, to: LatLngPoint) => {
    if (!isValidPoint(from) || !isValidPoint(to)) return;

    if (
      Math.abs(from.lat - to.lat) < 1e-7 &&
      Math.abs(from.lng - to.lng) < 1e-7
    ) {
      return;
    }

    try {
      const route = await getTmapPedestrianRoute({
        startX: from.lng,
        startY: from.lat,
        endX: to.lng,
        endY: to.lat,
      });

      if (!route?.paths?.length) {
        drawStraightBetween(from, to);
        return;
      }

      route.paths.forEach((segment) => {
        const path = segment.map(
          (point) => new naver.maps.LatLng(point.lat, point.lng)
        );
        if (path.length >= 2) {
          polylines.push(createDashedPolyline(map, path, walkStyle));
        }
      });
    } catch (error) {
      console.warn("Tmap 도보 경로 실패, 직선으로 대체:", error);
      drawStraightBetween(from, to);
    }
  };

  if (edgeTargets?.start) {
    await drawTmapOrFallback(startPlace, edgeTargets.start);
  }
  if (edgeTargets?.end) {
    await drawTmapOrFallback(edgeTargets.end, endPlace);
  }

  return polylines;
}

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
        strokeStyle: "dash", // ✅ 점선
        zIndex: 999,       // ✅ 실선 위로
      })
    );
  }

  // 3) boundary fit
  const b = odsay?.result?.boundary;
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
