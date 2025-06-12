import { UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { BaseFileUploader } from "./BaseFileUploader";

export default function FileUploader({
  onSuccessUpload
} : {
  onSuccessUpload?: () => void
}) {

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Label htmlFor="files">Files</Label>
      <div className="relative w-full aspect-square max-w-full border-2 border-gray-500 border-dashed rounded-md cursor-pointer dark:border-gray-600 group hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex flex-col items-center justify-center h-full p-6">
          <UploadIcon className="w-12 h-12 mb-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-600 dark:group-hover:text-gray-400" />
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">
            Drag and drop PDF files here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            or click to upload
          </p>
        </div>
        <BaseFileUploader onSuccessUpload={onSuccessUpload} />
      </div>
    </div>
  );
}
