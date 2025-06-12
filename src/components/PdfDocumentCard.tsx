import { cn } from "@/lib/utils";
import { type PdfItem } from "@/store/usePdfStore";
import { Document, Page } from "react-pdf";
import { PdfDocumentLoading } from "./PdfDocumentLoading";
import { memo } from "react";

export const PdfDocumentCard = memo(
  ({
    pdf,
    width,
    height,
    isActive,
  }: {
    pdf: PdfItem;
    width: number;
    height: number;
    isActive: boolean;
  }) => {
    return (
      <div>
        {pdf.file && width && height && (
          <div
            style={{ position: "relative", width }}
            className="h-full bg-gray-100 border relative border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition cursor-pointer"
          >
            <Document  loading={<PdfDocumentLoading />} file={pdf.file}>
              <Page
                className={cn(
                  `border-2 hover:border-blue-400 transition`,
                  isActive && "border-blue-400"
                )}
                pageNumber={1}
                width={width}
                renderMode="canvas"
                scale={1}
              />
            </Document>
          </div>
        )}
      </div>
    );
  }
);
