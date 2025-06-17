import { usePdfStore } from "@/store/usePdfStore";
import { Input } from "./ui/input";
import { failedMessage, successMessage } from "@/lib/helper";
import { useReverseUploadStore } from "@/store/useReverseUploadStore";

export const BaseFileUploader = ({
  onSuccessUpload,
  groupId,
}: {
  onSuccessUpload?: () => void;
  groupId?: string;
}) => {
  const { addGroupOrPdfs } = usePdfStore();
  const { isReverse } = useReverseUploadStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let arrayFiles = Array.from(files);

    if (isReverse) arrayFiles.reverse()

    if (groupId)
      try {
        addGroupOrPdfs(arrayFiles, groupId);
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
