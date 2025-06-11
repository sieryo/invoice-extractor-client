import { usePdfStore } from "@/store/usePdfStore";
import { PdfCard } from "./PdfCard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  DEFAULT_PDF_VIEWER_HEIGHT,
  DEFAULT_PDF_VIEWER_WIDTH,
} from "@/lib/constants";
import { BaseFileUploader } from "./BaseFileUploader";
import { useActiveFieldBoxStore } from "@/store/useActiveFieldBoxStore";
import { TitleLabel } from "./TitleLabel";
import { ExportTouchable } from "./ExportTouchable";
import { Button } from "./ui/button";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";

export const PdfListSheet = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const { pdfs, setCurrentId, currentId, exportedName } = usePdfStore();
  const { setField } = useActiveFieldBoxStore();
  const { isLoading, setIsLoading } = useFullScreenLoadingStore();

  const newWidth = DEFAULT_PDF_VIEWER_WIDTH * 0.32;
  const newHeight = DEFAULT_PDF_VIEWER_HEIGHT * 0.32;

  const handleSuccessUpload = () => {
    setIsOpen(false);
  };

  const handleClick = (id: string) => {
    setCurrentId(id);
    setIsOpen(false);
    setField(null);
  };

  const title = exportedName
    ? `${exportedName}`
    : "Exported Name title";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className=" p-2 h-[450px] px-4 overflow-auto" side="top">
        <SheetHeader>
          <SheetTitle>
            <TitleLabel title={title} />
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className=" flex gap-12">
          {pdfs.map((pdf) => (
            <button
              onClick={() => {
                handleClick(pdf.id);
              }}
              className="p-0 border-none bg-transparent pointer-events-auto cursor-pointer"
            >
              <PdfCard
                pdf={pdf}
                key={pdf.id}
                height={newHeight}
                width={newWidth}
                isActive={pdf.id === currentId}
              />
            </button>
          ))}
          <div
            style={{ width: newWidth }}
            className="h-full bg-gray-100 border relative border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition cursor-pointer"
          >
            <div className="text-5xl font-light leading-none">+</div>
            <div className="text-sm mt-1">PDF</div>
            <BaseFileUploader onSuccessUpload={handleSuccessUpload} />
          </div>
        </div>

        <div className=" max-w-30">
          <ExportTouchable
            onBeforeExport={() => {
              setIsLoading(true);
            }}
            onAfterExport={() => {
              setIsLoading(false);
            }}
          >
            <div className=" h-full  ">
              <Button className=" px-8 cursor-pointer">Export</Button>
            </div>
          </ExportTouchable>
        </div>
      </SheetContent>
    </Sheet>
  );
};
