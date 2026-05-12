import { create } from 'zustand';

type FocusedEvent = {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
}

interface EventFilterState {
  region: string;
  keyword: string;
  focusedEvent: FocusedEvent | null;

  setRegion: (region: string) => void;
  setKeyword: (keyword: string) => void;
  setFocusedEvent: (event: FocusedEvent) => void;
  clearFocusedEvent: () => void;

  resetRegion: () => void;
  resetKeyword: () => void;
  resetAll: () => void;
}

export const useEventFilterStore = create<EventFilterState>((set) => ({
  region: 'all',
  keyword: '',
  focusedEvent: null,

  setKeyword: (keyword) => { set({ keyword }); },
  setRegion: (region) => { set({ region }); },
  setFocusedEvent: (event) => set({ focusedEvent: event }),
  clearFocusedEvent: () => set({ focusedEvent: null }),

  resetRegion: () => set({ region: 'all' }),
  resetKeyword: () => set({ keyword: '' }),
  resetAll: () => set({ region: 'all', keyword: '', focusedEvent: null }),
}));
