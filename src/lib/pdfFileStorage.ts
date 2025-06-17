import { set, get, del } from "idb-keyval";

export const savePdfFile = async (pdfId: string, file: File) => {
  await set(`pdf-file-${pdfId}`, file);
};

export const loadPdfFile = async (pdfId: string): Promise<File | undefined> => {
  return await get(`pdf-file-${pdfId}`);
};

export const deletePdfFile = async (pdfId: string) => {
  await del(`pdf-file-${pdfId}`);
};
