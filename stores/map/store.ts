// src/stores/map-store.ts
import { create } from 'zustand';
import { NaverMap } from '@/types/maptype';
import React from 'react'

declare global {
    interface Window {
        naver: any;
    }
}

interface MapState {
    map: NaverMap | null;
    isMapScriptLoaded: boolean;
    mapContainerRef: React.RefObject<HTMLDivElement | null>;

    // Actions
    setMap: (map: NaverMap | null) => void;
    setIsMapScriptLoaded: (loaded: boolean) => void;
    setMapContainerRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

export const useMapStore = create<MapState>((set) => ({
    map: null,
    isMapScriptLoaded: false,
    mapContainerRef: { current: null },

    setMap: (map) => set({ map }),
    setIsMapScriptLoaded: (loaded) => set({ isMapScriptLoaded: loaded }),
    setMapContainerRef: (ref) => set({ mapContainerRef: ref || { current: null } }),
}));