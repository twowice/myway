"use client";

export type LikedEventResponse = {
  success: boolean;
  data: unknown[];
};

export type LikedEventIdsResponse = {
  eventIds: number[];
};

export async function fetchLikedEvents(): Promise<LikedEventResponse> {
  const response = await fetch("/api/mypage/liked-events");

  if (!response.ok) {
    if (response.status === 401) {
      return { success: true, data: [] };
    }
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "좋아요 이벤트 목록 조회 실패");
  }

  return response.json();
}

export async function fetchLikedEventIds(): Promise<LikedEventIdsResponse> {
  const response = await fetch("/api/mypage/liked-events/ids");

  if (!response.ok) {
    if (response.status === 401) {
      return { eventIds: [] };
    }
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "좋아요 이벤트 ID 조회 실패");
  }

  return response.json();
}
