import { create } from "zustand";
import type { FieldPdfConfig } from "@/models/pdfConfig";

export enum EditorMode {
  Cursor = "cursor",
  DrawBox = "drawBox",
  Drag = "drag",
}

type ActiveFieldBoxStore = {
  field: FieldPdfConfig | null;
  mode: EditorMode;
  setField: (field: FieldPdfConfig | null) => void;
  setMode: (mode: EditorMode) => void;
  isDragging: () => boolean;
  isDrawing: () => boolean;
  getCurrentMode: () => EditorMode;
};

export const useModeStore = create<ActiveFieldBoxStore>((set, get) => ({
  field: null,
  mode: EditorMode.Cursor,

  setField: (field) => {
    console.log(`Actived field: ${field}`);
    set({ field });
  },

  setMode: (mode) => {
    if (mode === EditorMode.Drag || mode === EditorMode.Cursor) {
      set({ mode, field: null });
    } else {
      set({ mode });
    }
  },

  isDragging: () => get().mode === EditorMode.Drag,
  isDrawing: () => get().mode === EditorMode.DrawBox,
  getCurrentMode: () => get().mode,
}));
