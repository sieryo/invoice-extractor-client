import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_PDF_VIEWER_WIDTH,
  DEFAULT_PDF_VIEWER_HEIGHT,
} from "@/lib/constants";
import type { PdfConfig } from "@/models/pdfConfig";

type PdfItem = {
  id: string;
  file: any;
  config: PdfConfig;
};

type PdfStore = {
  pdfs: PdfItem[];
  addPdf: (file: any, config: PdfConfig) => void;
  removePdf: (id: string) => void;
  currentId: string | null;
  setCurrentId: (id: string) => void;
  currentPdf: () => PdfItem | undefined;
  updateConfig: (id: string, newConfig: PdfConfig) => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
};

export const usePdfStore = create<PdfStore>((set, get) => ({
  pdfs: [],
  addPdf: (file, config) => {
    const id = uuidv4();
    set((state) => ({
      pdfs: [...state.pdfs, { id, file, config }],
      currentId: id, // langsung aktifkan
    }));
  },
  removePdf: (id) => {
    set((state) => ({
      pdfs: state.pdfs.filter((p) => p.id !== id),
      currentId: state.currentId === id ? null : state.currentId,
    }));
  },
  currentId: null,
  setCurrentId: (id) => set(() => ({ currentId: id })),
  currentPdf: () => {
    const { pdfs, currentId } = get();
    return pdfs.find((p) => p.id === currentId);
  },
  updateConfig: (id, newConfig) => {
    set((state) => ({
      pdfs: state.pdfs.map((pdf) =>
        pdf.id === id ? { ...pdf, config: newConfig } : pdf
      ),
    }));
  },

  width: DEFAULT_PDF_VIEWER_WIDTH,
  setWidth: (width) => set(() => ({ width })),
  height: DEFAULT_PDF_VIEWER_HEIGHT,
  setHeight: (height) => set(() => ({ height })),
}));
