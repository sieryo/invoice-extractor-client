import { usePdfStore } from "@/store/usePdfStore";
import { Input } from "./ui/input";
import { PdfConfigManager } from "@/managers/PdfConfigManager";
import { successMessage } from "@/lib/helper";

export const BaseFileUploader = ({ onSuccessUpload }: {onSuccessUpload?: () => void}) => {
  const { addPdf } = usePdfStore();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      const config = PdfConfigManager.generate(fileNameWithoutExt);
      addPdf(file, config);
      successMessage("Upload file success");
      if (onSuccessUpload) {
          onSuccessUpload()
      }
    } else {
      alert("Please upload PDF file");
    }
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
