import type { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { create } from "zustand";

type ActiveFieldStore = {
  field: string;
  type: ClassifiedTypeEnum | null
  setActive: (field: string, type: ClassifiedTypeEnum | null) => void;
};

export const useActiveFieldStore = create<ActiveFieldStore>()((set) => ({
  field: "",
  type: null,
  setActive: (field, type) => {
    console.log(`Actived field: ${field}`);

    return set(() => ({ field, type }));
  },
}));
