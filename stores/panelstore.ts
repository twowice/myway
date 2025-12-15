import { create } from 'zustand';

interface panelstate {
  openpanel: string | null;
  setopenpanel: (key: string | null) => void;
  togglepanel: (key: string) => void;
}

export const panelstore = create<panelstate>((set) => ({
  openpanel: null,
  setopenpanel: (key) => set({ openpanel: key }),
  togglepanel: (key) =>
    set((state) => ({
      openpanel: state.openpanel === key ? null : key,
    })),
}));