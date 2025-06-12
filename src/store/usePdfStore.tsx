import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_PDF_VIEWER_WIDTH,
  DEFAULT_PDF_VIEWER_HEIGHT,
} from "@/lib/constants";
import type { PdfConfig } from "@/models/pdfConfig";

export type PdfItem = {
  id: string;
  file: any;
  config: PdfConfig;
  width: number;
  height: number;
};

type PdfStore = {
  pdfs: PdfItem[];
  setPdfs: (pdfs: PdfItem[] | ((prev: PdfItem[]) => PdfItem[])) => void;
  exportedName: string;
  setExportedName: (name: string) => void;
  addPdf: (file: any, config: PdfConfig) => void;
  removePdf: (id: string) => void;
  currentId: string | null;
  setCurrentId: (id: string) => void;
  currentPdf: () => PdfItem | undefined;
  updateConfig: (id: string, newConfig: PdfConfig) => void;
  updateDimensions: (
    id: string,
    dimensions: { width?: number; height?: number }
  ) => void;
};

export const usePdfStore = create<PdfStore>((set, get) => ({
  pdfs: [],
  setPdfs: (pdfs) =>
    set((state) => ({
      pdfs: typeof pdfs === "function" ? pdfs(state.pdfs) : pdfs,
    })),
  exportedName: "",
  setExportedName: (name) => set(() => ({ exportedName: name })),
  addPdf: (file, config) => {
    const id = uuidv4();
    set((state) => ({
      pdfs: [
        ...state.pdfs,
        {
          id,
          file,
          config,
          height: DEFAULT_PDF_VIEWER_HEIGHT,
          width: DEFAULT_PDF_VIEWER_WIDTH,
        },
      ],
      currentId: id,
    }));
  },
  removePdf: (id) => {
    set((state) => {
      const filtered = state.pdfs.filter((p) => p.id !== id);
      let newCurrentId = state.currentId;

      if (state.currentId === id) {
        const index = state.pdfs.findIndex((p) => p.id === id);
        if (index !== -1 && filtered.length > 0) {
          const nextItem = filtered[index] || filtered[index - 1];
          newCurrentId = nextItem ? nextItem.id : null;
        } else {
          newCurrentId = null;
        }
      }

      return {
        pdfs: filtered,
        currentId: newCurrentId,
      };
    });
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

  updateDimensions: (id, { width, height }) => {
    set((state) => ({
      pdfs: state.pdfs.map((pdf) =>
        pdf.id === id
          ? {
              ...pdf,
              ...(width !== undefined ? { width } : {}),
              ...(height !== undefined ? { height } : {}),
            }
          : pdf
      ),
    }));
  },
}));
