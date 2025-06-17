import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { DrawArea } from "./DrawArea";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

import { useCurrentPdf } from "@/hooks/useCurrentPdf";
import { PdfDocumentLoading } from "./PdfDocumentLoading";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const PDFAnnotator = () => {
  const { file, id, updateDimensions, group } = useCurrentPdf();

  // const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setScale(1)
  }, [id])

  if (!id || !file || !group) return (
    <div className=" w-full flex items-center justify-center h-full  p-12">
      <div className=" w-[60%] h-full border border-gray-300 flex items-center justify-center">
        <p>File not selected</p>
      </div>
    </div>
  )

  const width = group.width;
  const height = group.height;


  const handleLoadSuccess = async (pdf: pdfjs.PDFDocumentProxy) => {
    try {
      // setNumPages(pdf.numPages);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });



      updateDimensions(group.id, { width: viewport.width, height: viewport.height });
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
      {/* <div className=" absolute left-0 top-[8px]">
        <PdfListSheetTrigger />
      </div> */}
      <div className=" absolute top-4 left-0 ">
        <div>
          <p>Pdf width: {width}px</p>
        </div>
         <div>
          <p>Pdf height: {height}px</p>
        </div>
      </div>
      <div className="flex gap-2 p-1.5 items-center   w-full ">
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
            maxHeight: "calc(100vh - 70px)",
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
            <Document
              onLoadSuccess={handleLoadSuccess}
              loading={<PdfDocumentLoading />}
              file={file}
            >
              <Page
                pageNumber={1}
                width={width}
                renderMode="canvas"
                scale={scale}
              />
            </Document>

            <DrawArea width={width} height={height} scale={scale} />
          </div>
        </div>
      )}
    </div>
  );
};
