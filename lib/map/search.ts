import { SearchApiResponse } from "@/types/map/place";

const MIN_SEARCH_QUERY_LENGTH = 2;

export async function fetchNaverPlaceSuggestions(query: string): Promise<SearchApiResponse> {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
        return { addresses: [] };
    }

    try {
        const apiUrl = new URL("/api/map/search", window.location.origin);
        apiUrl.searchParams.append("query", trimmedQuery);

        const response = await fetch(apiUrl.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error("API Route 에러 응답:", response.status, data);
            throw new Error(
                `API Route 오류: ${data?.error || "알 수 없는 오류"}`
            );
        }

        return data ?? { addresses: [] };
    } catch (error: any) {
        console.error("장소 검색 에러 (lib/map/search):", error.message);
        throw error;
    }
}
