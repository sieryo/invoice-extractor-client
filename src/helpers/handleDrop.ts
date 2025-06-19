import { traverseFileTree } from "@/utils";

export async function handleFolderDrop(
  e: React.DragEvent,
  onFilesReady: (files: File[], folderName: string) => Promise<void> | void
) {
  e.preventDefault();

  const items = e.dataTransfer.items;
  if (items.length !== 1) return;

  const item = items[0];
  const entry = item.webkitGetAsEntry?.();
  if (!entry || !entry.isDirectory) return;

  const allFiles = await traverseFileTree(entry);
  if (allFiles.length <= 0) return;

  // @ts-expect-error
  const folderName = getFolderNameFromPath(allFiles[0].relativePath);

  await onFilesReady(allFiles, folderName);
}

export async function handlePdfFileDrop(
  e: React.DragEvent,
  onFilesReady: (files: File[]) => Promise<void> | void
) {
  e.preventDefault();

  const files = Array.from(e.dataTransfer.files);
  const pdfFiles = files.filter((f) => f.type === "application/pdf");

  if (pdfFiles.length === 0) return;

  await onFilesReady(pdfFiles);
}

export function handleBaseDrag(e: React.DragEvent, fn?: () => void) {
  e.preventDefault();

  if (fn) fn();
}
