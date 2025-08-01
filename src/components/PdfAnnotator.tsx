import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { DrawArea } from "./DrawArea";
import { ArrowRight, Minus, Plus } from "lucide-react";

import { useCurrentPdf } from "@/hooks/useCurrentPdf";
import { PdfDocumentLoading } from "./PdfDocumentLoading";
import { ExportTouchable } from "./ExportTouchable";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { DialogUpdateLawanTransaksi } from "./DialogUpdateLawanTransaksi";
import { ActionButton } from "./ActionButton";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export const PDFAnnotator = () => {
  const { file, id, updateDimensions, group } = useCurrentPdf();

  const [scale, setScale] = useState(1);
  const { setIsLoading } = useFullScreenLoadingStore();

  const Navbar = () => {
    return (
      <div className="flex  p-1.5 px-4 items-center justify-between w-full bg-white border-b border-gray-200 mb-3">
        <div className=" flex">
          {/* <ReverseUploadSwitch /> */}

          <div className="flex justify-center items-center gap-3">
            <div
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              className="p-2 font-semibold rounded-md cursor-pointer"
            >
              <Minus className="w-5 h-5 text-gray-900" />
            </div>
            <div
              onClick={() => setScale((s) => s + 0.25)}
              className="p-2 font-semibold rounded-md cursor-pointer"
            >
              <Plus className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <DialogUpdateLawanTransaksi />
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
            <div>
              <ActionButton>
                Export
                <ArrowRight className=" w-5 h-5" />
              </ActionButton>
            </div>
          </ExportTouchable>
        </div>
      </div>
    );
  };

  if (!id || !file || !group || typeof file !== "object")
    return (
      <div
        className="items-center  relative "
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* <div className=" absolute left-0 top-[8px]">
        <PdfListSheetTrigger />
      </div> */}
        {/* <div className=" absolute top-4 left-2 z-[999] ">
        <div>
          <p>Pdf width: {Number(width).toFixed(1)}px</p>
        </div>
        <div>
          <p>Pdf height: {Number(height).toFixed(1)}px</p>
        </div>
        <div>
          <p>Zoom: {Number(scale).toFixed(2)}</p>
        </div>
      </div> */}
        <Navbar />
        <div className=" w-full flex items-center justify-center h-screen  p-12">
         
        </div>
      </div>
    );

  const width = group.width;
  const height = group.height;

  const handleLoadSuccess = async (pdf: pdfjs.PDFDocumentProxy) => {
    try {
      // setNumPages(pdf.numPages);

      console.log(pdf);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });

      updateDimensions(group.id, {
        width: viewport.width,
        height: viewport.height,
      });
    } catch (err) {
      // @ts-expect-error
      if (err?.message?.includes("sendWithPromise")) {
        console.warn("Ignored error: PDF was likely disposed", err);
        return;
      }
    } finally {
      //
    }
  };

  return (
    <div
      className="items-center  relative "
      style={{ display: "flex", flexDirection: "column" }}
    >
      {/* <div className=" absolute left-0 top-[8px]">
        <PdfListSheetTrigger />
      </div> */}
      {/* <div className=" absolute top-4 left-2 z-[999] ">
        <div>
          <p>Pdf width: {Number(width).toFixed(1)}px</p>
        </div>
        <div>
          <p>Pdf height: {Number(height).toFixed(1)}px</p>
        </div>
        <div>
          <p>Zoom: {Number(scale).toFixed(2)}</p>
        </div>
      </div> */}
      <Navbar />

      {file && width && height && file instanceof File && (
        <div
          style={{
            maxHeight: "calc(100vh - 70px)",
            overflow: "auto",
            maxWidth: "100%",
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
              key={file?.name || id}
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

// const ReverseUploadSwitch = () => {
//   const { isReverse, setIsReverse } = useReverseUploadStore();

//   return (
//     <div className="flex items-center rounded-lg border p-3 shadow-sm gap-10">
//       <Tooltip>
//         <TooltipTrigger>
//           <div className="space-y-0.5">
//             <Label>Reverse Upload file Order</Label>
//           </div>
//         </TooltipTrigger>
//         <TooltipContent>
//           Activated: Bottom to Top; Not Activated: Top to Bottom
//         </TooltipContent>
//       </Tooltip>
//       <Switch checked={isReverse} onCheckedChange={setIsReverse} />
//     </div>
//   );
// };
