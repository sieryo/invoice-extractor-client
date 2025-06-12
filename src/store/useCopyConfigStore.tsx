import type { Sections } from "@/models/pdfConfig";
import { create } from "zustand";

type CopyConfig = {
  sections: Sections | null;
  setSections: (sections: Sections | null) => void;
};

export const useCopyConfigStore = create<CopyConfig>()((set) => ({
  sections: null,
  setSections: (sections) => set(() => ({ sections: sections })),
}));
