// GLOBAL CONFIG PDF STATE

import { DEFAULT_PDF_VIEWER_HEIGHT, DEFAULT_PDF_VIEWER_WIDTH } from "@/lib/constants";
import { PdfConfigManager } from "@/managers/PdfConfigManager";
import type { PdfConfig } from "@/models/pdfConfig";
import { create } from "zustand";

// Sementara upload 1 file dulu
type PdfStore = {
  file: any;
  setFile: (file: any) => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
  config: PdfConfig;
  setConfig: (config: PdfConfig) => void;
};

export const usePdfStore = create<PdfStore>()((set) => ({
  file: null,
  setFile: (file) => {
    console.log(file);
    return set(() => ({ file }));
  },
  width: DEFAULT_PDF_VIEWER_WIDTH,
  setWidth: (width) => {
    return set(() => ({ width }));
  },
  height: DEFAULT_PDF_VIEWER_HEIGHT,
  setHeight: (height) => {
    return set(() => ({ height }));
  },
  config: PdfConfigManager.generate(),
  setConfig: (config) => {
    console.log(config);
    return set(() => ({ config }));
  },
}));
