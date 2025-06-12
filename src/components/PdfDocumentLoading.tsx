import { LoaderCircle } from "lucide-react";

export const PdfDocumentLoading = () => {
  return (
    <div className=" w-full h-screen flex items-center justify-center  ">
      <LoaderCircle className="h-12 w-12 animate-spin text-gray-800" />
    </div>
  );
};
