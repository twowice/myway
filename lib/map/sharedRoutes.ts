export type CreateSharedRoutePayload = {
  searchHistoryId: number;
  sharedPathIndex: number;
};

export type CreateSharedRouteResponse = {
  shareCode: string;
  shareUrl: string;
};

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
