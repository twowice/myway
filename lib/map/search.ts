import { SearchApiResponse } from "@/types/map/place";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export async function fetchNaverPlaceSuggestions(query: string): Promise<SearchApiResponse> {
    if (!query.trim()) {
        return { addresses: [] };
    }

    try {
        const apiUrl = new URL(
            `${API_URL}/api/map/search`,
            window.location.origin
        );
        apiUrl.searchParams.append("query", query);

        const response = await fetch(apiUrl.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Route 에러 응답:", response.status, errorData);
            throw new Error(
                `API Route 오류: ${errorData.error || "알 수 없는 오류"}`
            );
        }

        const data: SearchApiResponse = await response.json();
        return data;
    } catch (error: any) {
        console.error("장소 검색 에러 (lib/map/search):", error.message);
        throw error;
    }
}
