import { UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePdfStore } from "@/store/usePdfStore";
import { toast } from "sonner";
import { successMessage } from "@/lib/helper";

export default function FileUploader() {
  const { file, setFile, setConfig, config } = usePdfStore();
  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFile(URL.createObjectURL(file));
      const newConfig = config
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      newConfig.exportedName = fileNameWithoutExt
      setConfig(newConfig)
      successMessage("Upload file success")
    } else {
      alert("Mohon upload file PDF");
    }
  };

  if (file) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Label htmlFor="files">Files</Label>
      <div className="relative w-full aspect-square max-w-full border-2 border-gray-500 border-dashed rounded-md cursor-pointer dark:border-gray-600 group hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex flex-col items-center justify-center h-full p-6">
          <UploadIcon className="w-12 h-12 mb-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400" />
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">
            Drag and drop files here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            or click to upload
          </p>
        </div>
        <Input
          id="files"
          type="file"
          accept="application/pdf"
          multiple
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}
