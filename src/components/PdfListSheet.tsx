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
import { TitleLabel } from "./TitleLabel";
import { ExportTouchable } from "./ExportTouchable";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { cn } from "@/lib/utils";

import { PdfDocumentCard } from "./PdfDocumentCard";
import { usePdfListSheetStore } from "@/store/usePdfListSheetStore";
import { PdfCardOption } from "./PdfCardOption";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { EditorMode, useModeStore } from "@/store/useModeStore";
import { FileText } from "lucide-react";

const DEFAULT_SCALE = 0.32;

export const PdfListSheet = () => {
  const { pdfs, setCurrentId, currentId, exportedName, setPdfs } =
    usePdfStore();
  const { setField, setMode, getCurrentMode } = useModeStore();
  const { setIsLoading } = useFullScreenLoadingStore();

  const { isOpen, setIsOpen } = usePdfListSheetStore();

  const newWidth = DEFAULT_PDF_VIEWER_WIDTH * DEFAULT_SCALE;
  const newHeight = DEFAULT_PDF_VIEWER_HEIGHT * DEFAULT_SCALE;

  const handleSuccessUpload = () => {
    // setIsOpen(false);
  };

  const handleClick = (id: string) => {
    setCurrentId(id);
    setIsOpen(false);
    setField(null);
  };

  const title = exportedName ? `${exportedName}` : "Exported Name title";

  const sensors = useSensors(useSensor(PointerSensor));

  const [activeId, setActiveId] = useState<string | null>(null);
  const activePdf = pdfs.find((pdf) => pdf.id === activeId) || null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = pdfs.findIndex((item) => item.id === active.id);
      // @ts-expect-error
      const newIndex = pdfs.findIndex((item) => item.id === over.id);

      const reordered = arrayMove([...pdfs], oldIndex, newIndex); // ✅

      setPdfs(reordered);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className=" p-2 h-[450px] px-4 overflow-auto" side="top">
        <SheetHeader>
          <SheetTitle>
            <TitleLabel title={title} />
          </SheetTitle>
          <SheetDescription>
            When exporting this file to Excel, each Excel row (e.g., Row 1, Row 2,
            etc.) is displayed from left to right across the PDF.
          </SheetDescription>
        </SheetHeader>
        <div className=" flex gap-12">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pdfs}
              strategy={horizontalListSortingStrategy}
              disabled={!(getCurrentMode() == EditorMode.Drag)}
            >
              {pdfs.map((pdf) => {
                return (
                  <PdfCard
                    id={pdf.id}
                    pdf={pdf}
                    currentId={currentId}
                    height={newHeight}
                    width={newWidth}
                    handleOnClick={() => {
                      handleClick(pdf.id);
                    }}
                  />
                );
              })}
            </SortableContext>
            <DragOverlay adjustScale={false} style={{ transformOrigin: "0 0" }}>
              {activePdf ? (
                <div
                  className="bg-white border border-dashed border-gray-400 rounded-md shadow-md opacity-80 flex-col"
                  style={{
                    width: newWidth,
                    height: newHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "#555",
                    padding: 8,
                  }}
                >
                  <div>
                    <FileText className=" w-5 h-5 text-black" />
                  </div>
                  <div>{activePdf.config?.fileName || "Dragging..."}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
          <div
            style={{ width: newWidth }}
            className={cn(
              "h-full bg-gray-100 border relative border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition"
            )}
          >
            <div className="text-5xl font-light leading-none">+</div>
            <div className="text-sm mt-1">PDF</div>
            <BaseFileUploader onSuccessUpload={handleSuccessUpload} />
          </div>
        </div>

        <div className=" flex gap-3">
          <div>
            <div className=" h-full   ">
              <div
                onClick={() => {
                  if (getCurrentMode() == EditorMode.Drag) {
                    setMode(EditorMode.Cursor);
                  } else {
                    setMode(EditorMode.Drag);
                  }
                }}
                className={cn(
                  " p-2 px-6 bg-gray-100 border-gray-300 border text-gray-900 font-semibold rounded-md cursor-pointer ",
                  getCurrentMode() == EditorMode.Drag &&
                    " bg-blue-300 border-blue-400 text-blue-700"
                )}
              >
                Toggle Drag
              </div>
            </div>
          </div>
          <div>
            <ExportTouchable
              onBeforeExport={() => {
                setIsLoading(true);
              }}
              onAfterExport={() => {
                setIsLoading(false);
              }}
            >
              <div className=" h-full  ">
                <div className=" p-2 px-6 bg-gray-900 text-gray-50 font-semibold rounded-md cursor-pointer ">
                  Export
                </div>
              </div>
            </ExportTouchable>
          </div>
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

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width,
    height,
  };

  return (
    <div
      key={pdf.id}
      style={style}
      className="relative"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <div className=" absolute top-[-22px] w-full flex justify-between">
        <PdfCardTitle fileName={pdf.config.fileName} isActive={isActive} />
        <PdfCardOption pdf={pdf} />
      </div>

      <button
        onClick={handleOnClick}
        className="p-0 border-none bg-transparent pointer-events-auto cursor-pointer h-full "
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
