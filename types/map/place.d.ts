export interface PlaceResult {
    name: string;
    address: string;
    roadAddress: string;
    lat: number;
    lng: number;
    category: string;
    telephone?: string;
    link?: string;
}

export type SelectedPlace = PlaceResult & {
    order: number;
};

export interface SearchApiResponse {
    addresses: PlaceResult[];
}
