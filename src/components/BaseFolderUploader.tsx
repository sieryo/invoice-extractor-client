import { PdfStoreManager } from "@/managers/PdfStoreManager";
import { useReverseUploadStore } from "@/store/useReverseUploadStore";
import { getFolderNameFromPath } from "@/utils";
import { errorMessage, successMessage } from "@/utils/message";

export const BaseFolderUploader = ({
  onSuccessUpload,
}: {
  onSuccessUpload?: () => void;
}) => {
  const { isReverse } = useReverseUploadStore();

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      let arrayFiles = Array.from(files);

      // Filter hanya PDF
      arrayFiles = arrayFiles.filter((file) => file.type === "application/pdf");

      if (arrayFiles.length === 0) {
        errorMessage("No PDF files found in selected folders.");
        return;
      }

      const groupIdentifier = getFolderNameFromPath(
        arrayFiles[0].webkitRelativePath
      );
      if (isReverse) arrayFiles.reverse();
      PdfStoreManager.addGroupWithPdfs(arrayFiles, groupIdentifier);
      successMessage("Folder uploaded successfully");

      if (onSuccessUpload) onSuccessUpload();
      e.target.value = ""; // reset input
    } catch (err) {}

    // try {
    //   const items = e.dataTransfer.items;
    //   const files = Array.from(e.dataTransfer.files);
    //   console.log(files);
    //   const pdfFiles = files.filter((f) => f.type === "application/pdf");

    //   if (pdfFiles.length != 0) return;

    //   const item = items[0];
    //   const entry = item.webkitGetAsEntry?.();

    //   const allFiles: File[] = await traverseFileTree(entry);

    //   if (allFiles.length <= 0) return;

    //   // @ts-expect-error
    //   const groupIdentifier = getFolderNameFromPath(allFiles[0].relativePath);
    //   PdfStoreManager.addGroupWithPdfs(allFiles, groupIdentifier);
    //   successMessage("Folder uploaded successfully");
    // } catch (err) {
    // } finally {
    //   setIsUserDragging(false);
    // }
  };

  return (
    <input
      id="folders"
      type="file"
      accept="application/pdf"
      multiple
      //@ts-expect-error
      webkitdirectory="true"
      directory="true"
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      onChange={handleFolderUpload}
    />
  );
};
