import { create } from 'zustand';

export interface SelectedPlace {
    order: number;
    name: string;
    address: string;
    roadAddress?: string;
    lat: number;
    lng: number;
}

export interface RoutePoint extends SelectedPlace {
}

export interface SearchState {
    places: SelectedPlace[];
    routePoints: RoutePoint[];

    addOrUpdatePlace: (newPlace: SelectedPlace) => void;
    removePlace: (order: number) => void;
    clearPlaces: () => void;
    setAllPlaces: (newPlaces: SelectedPlace[]) => void;

    setRoutePoints: (points: RoutePoint[]) => void;
    clearRoutePoints: () => void;
}



export const useSearchStore = create<SearchState>((set) => ({
    places: [],
    routePoints: [],

    addOrUpdatePlace: (newPlace) => set((state) => {
        const existingIndex = state.places.findIndex(p => p.order === newPlace.order);
        let updatedPlaces: SelectedPlace[];

        if (existingIndex !== -1) {
            updatedPlaces = [
                ...state.places.slice(0, existingIndex),
                newPlace,
                ...state.places.slice(existingIndex + 1)
            ];
        } else {
            updatedPlaces = [...state.places, newPlace];
        }

        return { places: updatedPlaces.sort((a, b) => a.order - b.order) };
    }),

    removePlace: (orderToRemove) => set((state) => ({
        places: state.places.filter(p => p.order !== orderToRemove).sort((a, b) => a.order - b.order),
    })),

    clearPlaces: () => set({ places: [] }),

    setAllPlaces: (newPlaces) => set({ places: newPlaces }),

    setRoutePoints: (points) => set({ routePoints: points }),
    clearRoutePoints: () => set({ routePoints: [] }),
}));