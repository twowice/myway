import { NextRequest, NextResponse } from "next/server";

type TmapFeature = {
  geometry?: {
    type?: string;
    coordinates?: number[][];
  };
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startX = searchParams.get("startX");
  const startY = searchParams.get("startY");
  const endX = searchParams.get("endX");
  const endY = searchParams.get("endY");

  if (!startX || !startY || !endX || !endY) {
    return NextResponse.json(
      { error: "startX, startY, endX, endY는 필수 쿼리입니다." },
      { status: 400 }
    );
  }

  const appKey = process.env.TMAP_APP_KEY;
  if (!appKey) {
    return NextResponse.json(
      { error: "TMAP_APP_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const TMAP_URL =
    "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json";

  try {
    const response = await fetch(TMAP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        appKey,
      },
      body: JSON.stringify({
        startX,
        startY,
        endX,
        endY,
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startName: "출발",
        endName: "도착",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Tmap API 오류: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const features: TmapFeature[] = data?.features ?? [];

    const paths = features
      .filter((feature) => feature?.geometry?.type === "LineString")
      .map((feature) => {
        const coords = feature?.geometry?.coordinates ?? [];
        return coords
          .filter((coord) => Array.isArray(coord) && coord.length >= 2)
          .map((coord) => ({
            lng: Number(coord[0]),
            lat: Number(coord[1]),
          }))
          .filter(
            (point) =>
              Number.isFinite(point.lat) && Number.isFinite(point.lng)
          );
      })
      .filter((segment) => segment.length >= 2);

    return NextResponse.json({ paths }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Tmap 도보 경로 요청 실패: ${error?.message || "unknown"}` },
      { status: 500 }
    );
  }
}
