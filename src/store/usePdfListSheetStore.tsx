import { create } from "zustand";

type PdfListSheet = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const usePdfListSheetStore = create<PdfListSheet>()((set) => ({
  isOpen: false,
  setIsOpen: (value) => set(() => ({ isOpen: value })),
}));
