export type RouteSearchHistoryPayload = {
  departure_name: string;
  departure_latitude: number;
  departure_longitude: number;
  destination_name: string;
  destination_latitude: number;
  destination_longitude: number;
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
