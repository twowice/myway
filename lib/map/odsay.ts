import { OdsayTranspath } from "@/app/api/map/odsay/odsay";
import { SelectedPlace } from "@/types/map/place";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export async function getLoadlane(mapObject: string) {
    try {
        const apiUrl = new URL(
            `${API_URL}/api/map/odsay/loadlane`,
            window.location.origin
        );
        apiUrl.searchParams.append("mapObject", mapObject);

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

        const data = response.json()
        return data;
    } catch (error: any) {
        console.error("장소 검색 에러 (lib/map/search):", error.message);
        throw error;
    }
}

export async function getTransPath(startPlace: SelectedPlace, endPlace: SelectedPlace): Promise<OdsayTranspath> {
    const transpathUrl = new URL(
        `${API_URL}/api/map/odsay/transpath?sx=${startPlace.lng}&sy=${startPlace.lat}&ex=${endPlace.lng}&ey=${endPlace.lat}`,
        window.location.origin
    );

    const response = await fetch(transpathUrl.toString());
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `길찾기 API 오류: ${errorData.error || "알 수 없는 오류"}`
        );
    }
    const routeData = await response.json();

    return routeData
}