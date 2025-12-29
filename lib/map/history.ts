export type RouteSearchHistoryPayload = {
  departure_name: string;
  departure_latitude: number;
  departure_longitude: number;
  departure_address: string;
  departure_road_address: string;
  departure_category: string;
  departure_telephone?: string | null;
  departure_link?: string | null;
  destination_name: string;
  destination_latitude: number;
  destination_longitude: number;
  destination_address: string;
  destination_road_address: string;
  destination_category: string;
  destination_telephone?: string | null;
  destination_link?: string | null;
  total_time_seconds?: number | null;
  total_fare?: number | null;
  map_object_id?: string | null;
  raw_response: unknown;
};

export async function saveRouteSearchHistory(
  payload: RouteSearchHistoryPayload
) {
  const response = await fetch("/api/map/search/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "검색 기록 저장 실패");
  }

  return response.json();
}

export type RouteSearchHistory = {
  id: number;
  created_at: string;
  status: "active" | "deleted";
  departure_name: string;
  departure_latitude: number;
  departure_longitude: number;
  departure_address: string | null;
  departure_road_address: string | null;
  departure_category: string | null;
  departure_telephone: string | null;
  departure_link: string | null;
  destination_name: string;
  destination_latitude: number;
  destination_longitude: number;
  destination_address: string | null;
  destination_road_address: string | null;
  destination_category: string | null;
  destination_telephone: string | null;
  destination_link: string | null;
  total_time_seconds: number | null;
  total_fare: number | null;
  map_object_id: string | null;
  raw_response: unknown;
};

export async function fetchRouteSearchHistories(params?: {
  limit?: number;
  offset?: number;
}): Promise<RouteSearchHistory[]> {
  const limit = params?.limit ?? 5;
  const offset = params?.offset ?? 0;
  const response = await fetch(
    `/api/map/search/history?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "검색 기록 조회 실패");
  }

  const data = await response.json();
  return data?.data ?? [];
}
