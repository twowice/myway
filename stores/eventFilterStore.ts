import { create } from 'zustand';

interface EventFilterState {
  region: string;
  setRegion: (region: string) => void;
  resetRegion: () => void;
}

export const useEventFilterStore = create<EventFilterState>((set) => ({
  region: 'all',
  setRegion: (region) => set({ region }),
  resetRegion: () => set({ region: 'all' }),
}));
