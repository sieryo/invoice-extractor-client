import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
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
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { cn } from "@/lib/utils";

import { PdfDocumentCard } from "./PdfDocumentCard";
import { usePdfListSheetStore } from "@/store/usePdfListSheetStore";
import { PdfCardOption } from "./PdfCardOption";

const DEFAULT_SCALE = 0.32;

export const PdfListSheet = () => {
  const { pdfs, setCurrentId, currentId, exportedName } = usePdfStore();
  const { setField } = useActiveFieldBoxStore();
  const { setIsLoading } = useFullScreenLoadingStore();

  const { isOpen, setIsOpen } = usePdfListSheetStore();

  const newWidth = DEFAULT_PDF_VIEWER_WIDTH * DEFAULT_SCALE;
  const newHeight = DEFAULT_PDF_VIEWER_HEIGHT * DEFAULT_SCALE;

  const handleSuccessUpload = () => {
    setIsOpen(false);
  };

  const handleClick = (id: string) => {
    setCurrentId(id);
    setIsOpen(false);
    setField(null);
  };

  const title = exportedName ? `${exportedName}` : "Exported Name title";

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
            <PdfCard
              id={pdf.id}
              key={pdf.id}
              pdf={pdf}
              currentId={currentId}
              height={newHeight}
              width={newWidth}
              handleOnClick={() => {
                handleClick(pdf.id);
              }}
            />
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
              <div className=" p-1.5 bg-gray-900 text-gray-50 font-semibold rounded-md cursor-pointer ">
                Export
              </div>
            </div>
          </ExportTouchable>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const PdfCard = ({
  id,
  pdf,
  currentId,
  width,
  handleOnClick,
  height,
}: {
  id: string;
  pdf: PdfItem;
  currentId: string | null;
  width: number;
  handleOnClick: () => void;
  height: number;
}) => {
  const isActive = pdf.id === currentId;

  return (
    <div
      key={pdf.id}
      style={{
        width,
      }}
      className="h-full relative"
    >
      <div className=" absolute top-[-25px] w-full flex justify-between">
        <PdfCardTitle fileName={pdf.config.fileName} isActive={isActive} />
        <PdfCardOption pdf={pdf} />
      </div>

      <button
        onClick={handleOnClick}
        className="p-0 border-none bg-transparent pointer-events-auto cursor-pointer"
      >
        <PdfDocumentCard
          pdf={pdf}
          key={pdf.id}
          height={height}
          width={width}
          isActive={pdf.id === currentId}
          scale={DEFAULT_SCALE}
        />
      </button>
    </div>
  );
};

const PdfCardTitle = ({
  fileName,
  isActive,
}: {
  fileName: string;
  isActive: boolean;
}) => {
  return (
    <div>
      <p className={cn(" text-sm text-gray-600", isActive && "text-gray-900")}>
        {fileName}
      </p>
    </div>
  );
};
