export interface SelectedPlace {
    order: number;
    name: string;
    address: string;
    lat: number;
    lng: number;
}

export interface SearchApiResponse {
    addresses: PlaceResult[];
}
