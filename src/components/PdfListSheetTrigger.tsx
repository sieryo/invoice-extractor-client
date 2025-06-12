import { AlignJustify } from "lucide-react";
import { Button } from "./ui/button";
import { usePdfListSheetStore } from "@/store/usePdfListSheetStore";

export const PdfListSheetTrigger = () => {
  const { setIsOpen } = usePdfListSheetStore();
  return (
    <div className=" max-w-10 pl-2">
      <Button className=" cursor-pointer" onClick={() => setIsOpen(true)}>
        <AlignJustify className="w-5 h-5 text-gray-50" />
        <p>List</p>
      </Button>
    </div>
  );
};
