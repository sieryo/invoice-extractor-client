import { create } from "zustand";

type OverlayStateStore = {
  active: boolean;
  setActive: (value: boolean) => void;
};

export const useOverlayStore = create<OverlayStateStore>()((set) => ({
  active: false,
  setActive: (value) => set(() => ({ active: value })),
}));
