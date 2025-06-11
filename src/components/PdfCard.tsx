import { usePdfStore } from "@/store/usePdfStore";
import { Document, Page } from "react-pdf";

export const PdfCard = () => {
  const { file, width, height } = usePdfStore();

  const newWidth = width * 0.28;
  const newHeight = height * 0.28;

  return (
    <div
      style={{
        width: newWidth,
      }}
      className="  h-full  "
    >
      <p className=" text-center">1</p>
      {file && width && height && (
        <div
          style={{
            position: "relative",
            width: newWidth,
            height: newHeight,
          }}
        >
          <Document file={file}>
            <Page
              className={"border-2 border-blue-400"}
              pageNumber={1}
              width={newWidth}
              renderMode="canvas"
              scale={1}
            />
          </Document>
        </div>
      )}
    </div>
  );
};
