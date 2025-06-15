import { usePdfStore } from "@/store/usePdfStore";
import { Input } from "./ui/input";
import { PdfConfigManager } from "@/managers/PdfConfigManager";
import { successMessage } from "@/lib/helper";

export const BaseFileUploader = ({ onSuccessUpload }: { onSuccessUpload?: () => void }) => {
  const { addPdf } = usePdfStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let uploadedCount = 0;

    Array.from(files).forEach((file) => {
      if (file.type === "application/pdf") {
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        const config = PdfConfigManager.generate(fileNameWithoutExt);
        addPdf(file, config);
        uploadedCount++;
      }
    });

    if (uploadedCount > 0) {
      successMessage(`Upload ${uploadedCount} file(s) success`);
      onSuccessUpload?.();
    } else {
      alert("Please upload PDF file(s) only");
    }

    // Reset input agar bisa upload file yang sama lagi
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
