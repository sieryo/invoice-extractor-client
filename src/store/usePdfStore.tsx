import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_PDF_VIEWER_WIDTH,
  DEFAULT_PDF_VIEWER_HEIGHT,
} from "@/lib/constants";
import type { PdfConfig } from "@/models/pdfConfig";
import { PdfConfigManager } from "@/managers/PdfConfigManager";
import { persist } from "zustand/middleware";
import { savePdfFile } from "@/lib/pdfFileStorage";
import { getFileNameFromPath } from "@/lib/helper";

export type PdfItem = {
  id: string;
  fileName: string;
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
  addEmptyGroup: (identifier: string) => void;
  addGroupWithPdfs: (files: any[], identifier: string) => void;
  addGroupOrPdfs: (files: any[], groupId?: string, config?: PdfConfig) => void;
  getGroup: (groupId: string) => PdfGroup | undefined;
  renameGroupIdentifier(groupId: string, newIdentifier: string): void;
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

export const usePdfStore = create<PdfStore>()(
  persist(
    (set, get) => ({
      groups: [],
      setGroups: (groups) =>
        set((state) => ({
          groups: typeof groups === "function" ? groups(state.groups) : groups,
        })),
      getGroup: (groupId) => {
        const { groups } = get();
        return groups.find((p) => p.id === groupId);
      },
      renameGroupIdentifier: (groupId, newIdentifier) => {
        set((state) => {
          const groups = state.groups.map((group) =>
            group.id === groupId
              ? { ...group, identifier: newIdentifier }
              : group
          );
          return { groups };
        });
      },
      addEmptyGroup: (identifier) => {
        set((state) => {
          const groups = [...state.groups];

          const newGroup = {
            id: uuidv4(),
            identifier,
            pdfs: [],
            config: PdfConfigManager.generate(),
            width: DEFAULT_PDF_VIEWER_WIDTH,
            height: DEFAULT_PDF_VIEWER_HEIGHT,
          };

          groups.unshift(newGroup);

          return { groups };
        });
      },

      addGroupWithPdfs: async (files, identifier) => {
        const groups = [...get().groups];
        let latestCurrent = null;
        let latestPdfId = "";

        const newGroupId = uuidv4();
        const pdfMetas = [];
        for (const file of files) {
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          console.log(fileNameWithoutExt);
          const newFileName = getFileNameFromPath(fileNameWithoutExt);

          const pdfId = uuidv4();
          await savePdfFile(pdfId, file);

          const pdfMeta = {
            id: pdfId,
            fileName: newFileName,
          };

          pdfMetas.push(pdfMeta);
          latestPdfId = pdfId;
        }

        groups.push({
          id: newGroupId,
          identifier,
          pdfs: pdfMetas,
          config: PdfConfigManager.generate(),
          width: DEFAULT_PDF_VIEWER_WIDTH,
          height: DEFAULT_PDF_VIEWER_HEIGHT,
        });

        latestCurrent = {
          groupId: newGroupId,
          pdfId: latestPdfId,
        };

        set({ groups, current: latestCurrent });
      },

      addGroupOrPdfs: async (files, groupId, config) => {
        const groups = [...get().groups];
        let latestCurrent = null;

        for (const file of files) {
          const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const identifier =
            extractIdentifier(fileNameWithoutExt) || "uncategorized";

          const existingGroup = groupId
            ? groups.find((g) => g.id === groupId)
            : groups.find((g) =>
                g.identifier.toLowerCase().includes(identifier.toLowerCase())
              );

          const pdfId = uuidv4();
          await savePdfFile(pdfId, file);

          const pdfMeta = {
            id: pdfId,
            fileName: fileNameWithoutExt,
          };

          if (existingGroup) {
            existingGroup.pdfs.push(pdfMeta);
            latestCurrent = {
              groupId: existingGroup.id,
              pdfId,
            };
          } else {
            const newGroupId = uuidv4();
            groups.push({
              id: newGroupId,
              identifier,
              pdfs: [pdfMeta],
              config: config || PdfConfigManager.generate(),
              width: DEFAULT_PDF_VIEWER_WIDTH,
              height: DEFAULT_PDF_VIEWER_HEIGHT,
            });
            latestCurrent = {
              groupId: newGroupId,
              pdfId,
            };
          }
        }

        set({ groups, current: latestCurrent });
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
    }),
    {
      name: "pdf-store",
      partialize: (state) => ({
        groups: state.groups.map((g) => ({
          ...g,
          pdfs: g.pdfs.map((p) => ({
            id: p.id,
            fileName: p.fileName,
          })),
        })),
        current: state.current,
      }),
    }
  )
);

// export const usePdfStore = create<PdfStore>((set, get) => ({
//   groups: [],
//   setGroups: (groups) =>
//     set((state) => ({
//       groups: typeof groups === "function" ? groups(state.groups) : groups,
//     })),
//   getGroup: (groupId) => {
//     const { groups } = get();
//     return groups.find((p) => p.id === groupId);
//   },
//   renameGroupIdentifier: (groupId, newIdentifier) => {
//     set((state) => {
//       const groups = state.groups.map((group) =>
//         group.id === groupId ? { ...group, identifier: newIdentifier } : group
//       );
//       return { groups };
//     });
//   },
//   addEmptyGroup: (identifier) => {
//     set((state) => {
//       const groups = [...state.groups];

//       const newGroup = {
//         id: uuidv4(),
//         identifier,
//         pdfs: [],
//         config: PdfConfigManager.generate(),
//         width: DEFAULT_PDF_VIEWER_WIDTH,
//         height: DEFAULT_PDF_VIEWER_HEIGHT,
//       };

//       groups.unshift(newGroup);

//       return { groups };
//     });
//   },

//   addGroupOrPdfs: (files, groupId, config) => {
//     set((state) => {
//       const groups = [...state.groups];
//       let latestCurrent = null;

//       files.forEach((file) => {
//         const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
//         const identifier =
//           extractIdentifier(fileNameWithoutExt) !== ""
//             ? extractIdentifier(fileNameWithoutExt)
//             : "uncategorized";

//         const existingGroup = groupId
//           ? groups.find((g) => g.id === groupId)
//           : groups.find((g) =>
//               g.identifier.toLowerCase().includes(identifier.toLowerCase())
//             );

//         const pdfId = uuidv4();

//         if (existingGroup) {
//           existingGroup.pdfs.push({
//             id: pdfId,
//             fileName: fileNameWithoutExt,
//           });

//           latestCurrent = {
//             groupId: existingGroup.id,
//             pdfId,
//           };
//         } else {
//           const newGroupId = uuidv4();
//           groups.push({
//             id: newGroupId,
//             identifier,
//             pdfs: [{ id: pdfId, fileName: fileNameWithoutExt }],
//             config: config || PdfConfigManager.generate(),
//             width: DEFAULT_PDF_VIEWER_WIDTH,
//             height: DEFAULT_PDF_VIEWER_HEIGHT,
//           });

//           latestCurrent = {
//             groupId: newGroupId,
//             pdfId,
//           };
//         }
//       });

//       return { groups, current: latestCurrent };
//     });
//   },

//   movePdfToGroup: (fromGroupId, toGroupId, pdfId) => {
//     set((state) => {
//       const groups = [...state.groups];
//       const fromGroup = groups.find((g) => g.id === fromGroupId);
//       const toGroup = groups.find((g) => g.id === toGroupId);

//       if (!fromGroup || !toGroup) return { groups };

//       const pdfIndex = fromGroup.pdfs.findIndex((p) => p.id === pdfId);
//       if (pdfIndex === -1) return { groups };

//       const [pdfItem] = fromGroup.pdfs.splice(pdfIndex, 1);
//       toGroup.pdfs.push(pdfItem);

//       return { groups };
//     });
//   },

//   setPdfs: (groupId, pdfs) => {
//     set((state) => {
//       const groups = [...state.groups];
//       const group = groups.find((g) => g.id === groupId);
//       if (!group) return { groups };
//       group.pdfs = typeof pdfs === "function" ? pdfs(group.pdfs) : pdfs;
//       return { groups };
//     });
//   },

//   removePdf: (groupId, id) => {
//     const { getGroup, current, setPdfs } = get();
//     const group = getGroup(groupId);

//     if (!group) return;

//     const filtered = group.pdfs.filter((p) => p.id !== id);

//     let newCurrent = current;
//     if (current && current.groupId === groupId && current.pdfId === id) {
//       const index = group.pdfs.findIndex((p) => p.id === id);
//       if (index !== -1 && filtered.length > 0) {
//         const nextItem = filtered[index] || filtered[index - 1];
//         newCurrent = nextItem ? { groupId, pdfId: nextItem.id } : null;
//       } else {
//         newCurrent = null;
//       }
//     }

//     setPdfs(groupId, filtered);

//     set(() => ({ current: newCurrent }));
//   },

//   current: null,
//   setCurrent: (pdfId, groupId) =>
//     set(() => ({
//       current: {
//         pdfId,
//         groupId,
//       },
//     })),

//   currentPdf: () => {
//     const { getGroup, current } = get();
//     const group = getGroup(current ? current.groupId : "");
//     return group?.pdfs.find((p) => p.id === current?.pdfId);
//   },

//   updateConfig: (groupId, newConfig) => {
//     set((state) => {
//       const groups = state.groups.map((group) => {
//         if (group.id === groupId) {
//           return { ...group, config: newConfig };
//         }
//         return group;
//       });
//       return { groups };
//     });
//   },

//   updateDimensions: (id, { width, height }) => {
//     set((state) => {
//       const groups = state.groups.map((group) => {
//         if (group.id === id) {
//           return {
//             ...group,
//             ...(width !== undefined ? { width } : {}),
//             ...(height !== undefined ? { height } : {}),
//           };
//         }
//         return group;
//       });
//       return { groups };
//     });
//   },
// }));
