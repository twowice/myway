import { create } from 'zustand';

interface SelectedPlace {
    order: number;
    name: string;
    address: string;
    roadAddress?: string;
    lat: number;
    lng: number;
}

interface MapState {
    places: SelectedPlace[];
    addOrUpdatePlace: (newPlace: SelectedPlace) => void;
    removePlace: (order: number) => void;
    clearPlaces: () => void;
}

export const useMapStore = create<MapState>((set) => ({
    places: [],

    addOrUpdatePlace: (newPlace) => set((state) => {
        const existingIndex = state.places.findIndex(p => p.order === newPlace.order);
        if (existingIndex !== -1) {
            const updatedPlaces = [...state.places];
            updatedPlaces[existingIndex] = newPlace;
            return { places: updatedPlaces.sort((a, b) => a.order - b.order) };
        } else {
            return { places: [...state.places, newPlace].sort((a, b) => a.order - b.order) };
        }
    }),

    removePlace: (orderToRemove) => set((state) => ({
        places: state.places.filter(p => p.order !== orderToRemove).sort((a, b) => a.order - b.order),
    })),

    clearPlaces: () => set({ places: [] }),
}));