import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_PDF_VIEWER_WIDTH,
  DEFAULT_PDF_VIEWER_HEIGHT,
} from "@/lib/constants";
import type { PdfConfig } from "@/models/pdfConfig";
import { PdfConfigManager } from "@/managers/PdfConfigManager";

export type PdfItem = {
  id: string;
  fileName: string;
  file: any;
};

export type PdfGroup = {
  id: string;
  identifier: string;
  pdfs: PdfItem[];
  config: PdfConfig;
  width: number;
  height: number;
};

type PdfStore = {
  groups: PdfGroup[];
  setGroups: (groups: PdfGroup[] | ((prev: PdfGroup[]) => PdfGroup[])) => void;
  addGroupOrPdfs: (files: any[], config?: PdfConfig) => void;
  getGroup: (groupId: string) => PdfGroup | undefined;
  movePdfToGroup: (
    fromGroupId: string,
    toGroupId: string,
    pdfId: string
  ) => void;
  setPdfs: (
    groupId: string,
    pdfs: PdfItem[] | ((prev: PdfItem[]) => PdfItem[])
  ) => void;
  removePdf: (groupId: string, id: string) => void;
  current: {
    pdfId: string;
    groupId: string;
  } | null;
  setCurrent: (pdfId: string, groupId: string) => void;
  currentPdf: () => PdfItem | undefined;
  updateConfig: (groupId: string, newConfig: PdfConfig) => void;
  updateDimensions: (
    id: string,
    dimensions: { width?: number; height?: number }
  ) => void;
};

export function extractIdentifier(name: string): string {
  const withoutNumber = name.replace(/^\d+\.\s*/, "");

  const stopWords = ["GST", "SMB", "GNG"];
  const parts = withoutNumber.split(/\s+/);
  const identifierWords: string[] = [];

  for (const word of parts) {
    if (/\d/.test(word) || stopWords.includes(word.toUpperCase())) {
      break;
    }
    identifierWords.push(word);
  }

  return identifierWords.join(" ").toLowerCase();
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  groups: [],
  setGroups: (groups) =>
    set((state) => ({
      groups: typeof groups === "function" ? groups(state.groups) : groups,
    })),
  getGroup: (groupId) => {
    const { groups } = get();
    return groups.find((p) => p.id === groupId);
  },

  addGroupOrPdfs: (files, config) => {
    set((state) => {
      const groups = [...state.groups];
      let latestCurrent = null;

      files.forEach((file) => {
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const identifier = extractIdentifier(fileNameWithoutExt);
        const existingGroup = groups.find(
          (g) => g.identifier.toLowerCase().includes(identifier)
        );

        const pdfId = uuidv4();
        if (existingGroup) {
          existingGroup.pdfs.push({
            id: pdfId,
            file: file,
            fileName: fileNameWithoutExt,
          });

          latestCurrent = {
            groupId: existingGroup.id,
            pdfId,
          };
        } else {
          const groupId = uuidv4();
          groups.push({
            id: groupId,
            identifier,
            pdfs: [{ id: pdfId, file: file, fileName: fileNameWithoutExt }],
            config: config || PdfConfigManager.generate(),
            width: DEFAULT_PDF_VIEWER_WIDTH,
            height: DEFAULT_PDF_VIEWER_HEIGHT,
          });

          latestCurrent = {
            groupId,
            pdfId,
          };
        }
      });

      return { groups, current: latestCurrent };
    });
  },

  movePdfToGroup: (fromGroupId, toGroupId, pdfId) => {
    set((state) => {
      const groups = [...state.groups];
      const fromGroup = groups.find((g) => g.id === fromGroupId);
      const toGroup = groups.find((g) => g.id === toGroupId);

      if (!fromGroup || !toGroup) return { groups };

      const pdfIndex = fromGroup.pdfs.findIndex((p) => p.id === pdfId);
      if (pdfIndex === -1) return { groups };

      const [pdfItem] = fromGroup.pdfs.splice(pdfIndex, 1);
      toGroup.pdfs.push(pdfItem);

      return { groups };
    });
  },

  setPdfs: (groupId, pdfs) => {
    set((state) => {
      const groups = [...state.groups];
      const group = groups.find((g) => g.id === groupId);
      if (!group) return { groups };
      group.pdfs = typeof pdfs === "function" ? pdfs(group.pdfs) : pdfs;
      return { groups };
    });
  },

  removePdf: (groupId, id) => {
    const { getGroup, current, setPdfs } = get();
    const group = getGroup(groupId);

    if (!group) return;

    const filtered = group.pdfs.filter((p) => p.id !== id);

    let newCurrent = current;
    if (current && current.groupId === groupId && current.pdfId === id) {
      const index = group.pdfs.findIndex((p) => p.id === id);
      if (index !== -1 && filtered.length > 0) {
        const nextItem = filtered[index] || filtered[index - 1];
        newCurrent = nextItem ? { groupId, pdfId: nextItem.id } : null;
      } else {
        newCurrent = null;
      }
    }

    setPdfs(groupId, filtered);

    set(() => ({ current: newCurrent }));
  },

  current: null,
  setCurrent: (pdfId, groupId) =>
    set(() => ({
      current: {
        pdfId,
        groupId,
      },
    })),

  currentPdf: () => {
    const { getGroup, current } = get();
    const group = getGroup(current ? current.groupId : "");
    return group?.pdfs.find((p) => p.id === current?.pdfId);
  },

  updateConfig: (groupId, newConfig) => {
    set((state) => {
      const groups = state.groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, config: newConfig };
        }
        return group;
      });
      return { groups };
    });
  },

  updateDimensions: (id, { width, height }) => {
    set((state) => {
      const groups = state.groups.map((group) => {
        if (group.id === id) {
          return {
            ...group,
            ...(width !== undefined ? { width } : {}),
            ...(height !== undefined ? { height } : {}),
          };
        }
        return group;
      });
      return { groups };
    });
  },
}));
