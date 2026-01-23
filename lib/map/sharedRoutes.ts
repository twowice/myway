import { CreateSharedRoutePayload, CreateSharedRouteResponse, SharedRouteResponse } from "@/types/map/sharedRoute";


export async function createSharedRoute(
  payload: CreateSharedRoutePayload
): Promise<CreateSharedRouteResponse> {
  const response = await fetch("/api/shared-routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "공유 경로 생성 실패");
  }

  return response.json();
}

export async function fetchSharedRoute(
  shareCode: string
): Promise<SharedRouteResponse> {
  const response = await fetch(`/api/shared-routes/${shareCode}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "공유 경로 조회 실패");
  }

  return response.json();
}
