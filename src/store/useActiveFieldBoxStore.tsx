import type { FieldPdfConfig } from "@/models/pdfConfig";
import { create } from "zustand";

type ActiveFieldBoxStore = {
  field: FieldPdfConfig | null;
  setField: (field: FieldPdfConfig | null) => void;
};

export const useActiveFieldBoxStore = create<ActiveFieldBoxStore>()((set) => ({
  field: null,
  setField: (field) => {
    console.log(`Actived field: ${field}`);

    return set(() => ({ field }));
  },
}));
