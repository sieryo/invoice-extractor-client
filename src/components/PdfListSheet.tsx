import { usePdfStore } from "@/store/usePdfStore";
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
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownItemDelete } from "./dropdownFile/DropdownItemDelete";
import { PdfDocumentCard } from "./PdfDocumentCard";

export const PdfListSheet = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const { pdfs, setCurrentId, currentId, exportedName } = usePdfStore();
  const { setField } = useActiveFieldBoxStore();
  const { setIsLoading } = useFullScreenLoadingStore();

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
          {pdfs.map((pdf) => {
            const isActive = pdf.id === currentId;
            return (
              <div
                key={pdf.id}
                style={{
                  width: newWidth,
                }}
                className="h-full relative"
              >
                <div className=" absolute top-[-25px] w-full flex justify-between">
                  <PdfCardTitle
                    fileName={pdf.config.fileName}
                    isActive={isActive}
                  />
                  <PdfCardOption />
                </div>

                <button
                  onClick={() => {
                    handleClick(pdf.id);
                  }}
                  className="p-0 border-none bg-transparent pointer-events-auto cursor-pointer"
                >
                  <PdfDocumentCard
                    pdf={pdf}
                    key={pdf.id}
                    height={newHeight}
                    width={newWidth}
                    isActive={pdf.id === currentId}
                  />
                </button>
              </div>
            );
          })}
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
              <div className=" p-1.5 bg-gray-900 text-gray-50 font-semibold rounded-md cursor-pointer ">Export</div>
            </div>
          </ExportTouchable>
        </div>
      </SheetContent>
    </Sheet>
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

const PdfCardOption = () => {
  const dropdownItem = [
    {
      title: "Copy Config",
      onClick: () => {
        console.log("Function copy config...")
      },
      type: "mutate"
    },
     {
      title: "Download Config",
      onClick: () => {
        console.log("Function download config...")
      },
      type: "download"
    },
     {
      title: "Delete File",
      onClick: () => {
        console.log("Function delete pdf...")
      },
      type: "delete"
    },
  ]


  return (
    <div className=" pt-1 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className=" cursor-pointer">
          <EllipsisVertical className="w-4 h-4 text-gray-900" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Copy Config</DropdownMenuItem>
          <DropdownMenuItem>Download Config</DropdownMenuItem>
          <DropdownItemDelete />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
