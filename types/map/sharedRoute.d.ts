export type CreateSharedRoutePayload = {
    searchHistoryId: number;
    sharedPathIndex: number;
};

export type CreateSharedRouteResponse = {
    shareCode: string;
    shareUrl: string;
};

export type SharedRouteResponse = {
    shareCode: string;
    sharedPathIndex: number;
    searchHistoryId: number;
    ownerId: string;
    searchMode: string;
    createdAt: string;
    departure: {
        name: string;
        latitude: number;
        longitude: number;
        address: string | null;
        roadAddress: string | null;
        category: string | null;
        telephone: string | null;
        link: string | null;
    };
    destination: {
        name: string;
        latitude: number;
        longitude: number;
        address: string | null;
        roadAddress: string | null;
        category: string | null;
        telephone: string | null;
        link: string | null;
    };
    totalTimeSeconds: number | null;
    totalFare: number | null;
    mapObjectId: string | null;
    rawResponse: unknown;
    sharedPath: unknown;
};