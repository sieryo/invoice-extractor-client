import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { DrawArea } from "./DrawArea";
import { Button } from "./ui/button";
import { AlignJustify, ZoomIn, ZoomOut } from "lucide-react";

import { DialogExportedName } from "./DialogExportedName";

import { PdfListSheet } from "./PdfListSheet";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const PDFAnnotator = () => {
  const { file, height, width, id, updateDimensions, exportedName } =
    useCurrentPdf();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.3);

  const [isDialogNameActive, setIsDialogNameActive] = useState(false);

  if (!id || !file) return null;

  const handleLoadSuccess = async (pdf: pdfjs.PDFDocumentProxy) => {
    try {
      setNumPages(pdf.numPages);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      updateDimensions(id, { width: viewport.width, height: viewport.height });

      if (!exportedName) {
        setIsDialogNameActive(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      //
    }
  };

  return (
    <div
      className="items-center  relative"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <PdfListSheet isOpen={isSheetOpen} setIsOpen={setIsSheetOpen} />

      <DialogExportedName
        isActive={isDialogNameActive}
        setIsActive={setIsDialogNameActive}
      />

      <div className="flex gap-2 absolute z-50 mt-4  w-full ">
        <div className=" max-w-10 pl-2">
          <Button onClick={() => setIsSheetOpen(true)}>
            <AlignJustify className="w-5 h-5 text-gray-50" />
          </Button>
        </div>
        <div className=" w-full justify-center gap-3 flex ">
          <Button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}>
            <ZoomOut className="w-5 h-5 text-gray-50" />
          </Button>
          <Button onClick={() => setScale((s) => s + 0.25)}>
            <ZoomIn className="w-5 h-5 text-gray-50" />
          </Button>
        </div>
      </div>

      {file && width && height && (
        <div
          style={{
            maxHeight: "calc(100vh)",
            overflow: "auto",
            maxWidth: "100%",
            border: "1px solid #ccc",
          }}
        >
          <div
            style={{
              position: "relative",
              width: width * scale,
              height: height * scale,
            }}
          >
            <Document onLoadSuccess={handleLoadSuccess} file={file}>
              <Page
                pageNumber={1}
                width={width}
                renderMode="canvas"
                scale={scale}
              />
            </Document>

            <DrawArea scale={scale} />
          </div>
        </div>
      )}
    </div>
  );
};
