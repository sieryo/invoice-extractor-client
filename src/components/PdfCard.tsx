import { cn } from "@/lib/utils";
import { type PdfItem } from "@/store/usePdfStore";
import { Document, Page } from "react-pdf";

export const PdfCard = ({
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
          style={{
            position: "relative",
            width: width,
          }}
        >
          <Document file={pdf.file}>
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
};
