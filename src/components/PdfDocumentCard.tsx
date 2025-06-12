import { cn } from "@/lib/utils";
import { type PdfItem } from "@/store/usePdfStore";
import { Document, Page } from "react-pdf";
import { PdfDocumentLoading } from "./PdfDocumentLoading";
import { DrawArea } from "./DrawArea";
import { useMemo } from "react";

export const PdfDocumentCard = ({
  pdf,
  width,
  height,
  isActive,
  scale,
}: {
  pdf: PdfItem;
  width: number;
  height: number;
  isActive: boolean;
  scale: number;
}) => {
  return (
    <div>
      {pdf.file && width && height && (
        <div
          style={{
            position: "relative",
            width,
            height,
            maxHeight: height,
            maxWidth: width
          }}
          className={cn(
            "h-full bg-gray-100 border-2 relative border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 transition cursor-pointer",
            isActive && "border-blue-400"
          )}
        >
          <Document className={"w-full h-full  overflow-hidden flex items-center justify-center"} loading={<PdfDocumentLoading />} file={pdf.file}>
            <Page
              // className={cn(`border-2 hover:border-blue-400 transition`)}
              pageNumber={1}
              width={width}
              renderMode="canvas"
              scale={1}
            />
          </Document>
          <DrawArea scale={scale} pdf={pdf} />
        </div>
      )}
    </div>
  );
};
