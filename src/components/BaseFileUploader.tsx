import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
import { Input } from "./ui/input";
import { failedMessage, successMessage } from "@/lib/helper";

export const BaseFileUploader = ({
  onSuccessUpload,
}: {
  onSuccessUpload?: () => void;
}) => {
  const { addGroupOrPdfs } = usePdfStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const arrayFiles = Array.from(files);
    try {
      addGroupOrPdfs(arrayFiles);
      successMessage(`Upload ${arrayFiles.length} file(s) success`);
      onSuccessUpload?.();
    } catch (err) {
      failedMessage("Error uploading file");
    }

    e.target.value = "";
  };

  return (
    <Input
      id="files"
      type="file"
      accept="application/pdf"
      multiple
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      onChange={handleFileUpload}
    />
  );
};
