// GLOBAL CONFIG PDF STATE

import { PdfConfigManager } from "@/managers/PdfConfigManager";
import type { PdfConfig } from "@/models/pdfConfig";
import { create } from "zustand";

// Sementara upload 1 file dulu
type PdfStore = {
  file: any;
  setFile: (file: any) => void;
  config: PdfConfig;
  setConfig: (config: PdfConfig) => void;
};

export const usePdfStore = create<PdfStore>()((set) => ({
  file: null,
  setFile: (file) => {
    console.log(file);
    return set(() => ({ file }));
  },
  config: PdfConfigManager.generate(),
  setConfig: (config) => {
    console.log(config);
    return set(() => ({ config }));
  },
}));
