import { create } from "zustand";

type ReverseUploadStore = {
  isReverse: boolean;
  setIsReverse: (value: boolean) => void;
};

export const useReverseUploadStore = create<ReverseUploadStore>()((set) => ({
  isReverse: true,
  setIsReverse: (value) => set(() => ({ isReverse: value })),
}));
