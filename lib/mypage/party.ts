'use client';

export type MyPartyResponse = {
  success: boolean;
  data: unknown[];
};

export async function fetchMyParties(): Promise<MyPartyResponse> {
  const response = await fetch("/api/mypage/parties");

  if (!response.ok) {
    if (response.status === 401) {
      return { success: true, data: [] };
    }
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "파티 목록 조회 실패");
  }

  return response.json();
}
