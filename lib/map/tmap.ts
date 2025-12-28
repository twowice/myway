type TmapPedestrianPoint = {
  lat: number;
  lng: number;
};

export type TmapPedestrianRoute = {
  paths: TmapPedestrianPoint[][];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getTmapPedestrianRoute(params: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}): Promise<TmapPedestrianRoute> {
  const apiUrl = new URL(`${API_URL}/api/map/tmap/pedestrian`, window.location.origin);
  apiUrl.searchParams.set("startX", params.startX.toString());
  apiUrl.searchParams.set("startY", params.startY.toString());
  apiUrl.searchParams.set("endX", params.endX.toString());
  apiUrl.searchParams.set("endY", params.endY.toString());

  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Tmap 도보 API 오류: ${errorData?.error || response.statusText}`
    );
  }

  return response.json();
}
