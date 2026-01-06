import { create } from 'zustand';

interface EventFilterState {
  region: string;
  keyword: string;

  setRegion: (region: string) => void;
  setKeyword: (keyword: string) => void;

  resetRegion: () => void;
  resetKeyword: () => void;
  resetAll: () => void;
}

export const useEventFilterStore = create<EventFilterState>((set) => ({
  region: 'all',
  keyword: '',

  setKeyword: (keyword) => { set({ keyword }); },
  setRegion: (region) => { set({ region }); },

  resetRegion: () => set({ region: 'all' }),
  resetKeyword: () => set({ keyword: '' }),
  resetAll: () => set({ region: 'all', keyword: '' }),
}));
