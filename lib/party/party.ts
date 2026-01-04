import type { PartyCreate } from "@/feature/party/partyCreatePopup";

export type CreatePartyResponse = {
  id: number;
};

export type FetchPartiesParams = {
  eventId?: number;
  limit?: number;
  offset?: number;
  keyword?: string;
  statuses?: string[];
};

export type FetchPartiesResponse = {
  success: boolean;
  count: number;
  data: unknown[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
};

export async function createParty(
  payload: PartyCreate
): Promise<CreatePartyResponse> {
  const response = await fetch("/api/party", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "파티 생성 실패");
  }

  return response.json();
}

export type UpdatePartyPayload = {
  id: string;
  partyName?: string;
  description?: string;
  max_members?: string | number;
  label1?: string;
  label2?: string;
  label3?: string;
  eventId?: number;
  date?: string;
  time?: string;
  location?: string;
  locationLatitude?: number;
  locationLongitude?: number;
};

export async function updateParty(
  payload: UpdatePartyPayload
): Promise<{ success: boolean }> {
  const response = await fetch("/api/party", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "파티 수정 실패");
  }

  return response.json();
}

export async function fetchParties(
  params: FetchPartiesParams = {}
): Promise<FetchPartiesResponse> {
  const query = new URLSearchParams();
  if (typeof params.eventId === "number") {
    query.set("eventId", String(params.eventId));
  }
  if (typeof params.limit === "number") {
    query.set("limit", String(params.limit));
  }
  if (typeof params.offset === "number") {
    query.set("offset", String(params.offset));
  }
  if (params.keyword) {
    query.set("keyword", params.keyword);
  }
  if (params.statuses && params.statuses.length > 0) {
    query.set("status", params.statuses.join(","));
  }

  const response = await fetch(`/api/party?${query.toString()}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "파티 조회 실패");
  }

  return response.json();
}
