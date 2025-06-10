import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import FileUploader from "./FileUploader";
import { usePdfStore } from "@/store/usePdfStore";
import { DrawArea } from "./DrawArea";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogExportedName } from "./DialogExportedName";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const PDFAnnotator = () => {
  const { file, setHeight, setWidth, width, height } = usePdfStore();

  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1.3);

  const [isDialogNameActive, setIsDialogNameActive] = useState(false);

  const handleLoadSuccess = async (pdf: pdfjs.PDFDocumentProxy) => {
    try {
      setNumPages(pdf.numPages);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      setWidth(viewport.width);
      setHeight(viewport.height);

      setIsDialogNameActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      //
    }
  };

  return (
    <div
      className="items-center p-4 relative"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <FileUploader />


      <DialogExportedName 
      isActive={isDialogNameActive}
      setIsActive={setIsDialogNameActive}
      />

      
      <div className="flex gap-2 ">
        <Button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}>
          <ZoomOut className="w-5 h-5 text-gray-50" />
        </Button>
        <Button onClick={() => setScale((s) => s + 0.25)}>
          <ZoomIn className="w-5 h-5 text-gray-50" />
        </Button>
      </div>

      {file && width && height && (
        <div
          style={{
            maxHeight: "calc(100vh - 100px)",
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
