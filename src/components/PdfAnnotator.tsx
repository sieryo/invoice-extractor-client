import { Document, Page, pdfjs } from "react-pdf";
import { Stage, Layer, Rect } from "react-konva";
import { useEffect, useState } from "react";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useBox, type BoxState } from "@/hooks/useBox";
import { useActiveFieldStore } from "@/store/useActiveFieldStore";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import FileUploader from "./FileUploader";
import { usePdfStore } from "@/store/usePdfStore";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// PDFAnnotator terlalu melakukan banyak hal.

// TODO: Desain singkat untuk

export const PDFAnnotator = () => {
  const {
    file,
    config
  } = usePdfStore()

  console.log(config)
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const { currentBox, handleMouseMove, handleClick } = useBox();

  const updateBox = (box: BoxState) => {
    setBoxes([...boxes, box]);
  };

  useEffect(() => {
    console.log(file);
  }, [file]);

  const { type } = useActiveFieldStore();

  return (
    <div
      className=" items-center p-4"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <FileUploader />
      {file && (
        <>
          <div
            style={{ position: "relative", width: "600px", height: "800px" }}
          >
            <Document file={file}>
              <Page pageNumber={1} width={600} renderMode="canvas" scale={1} />
            </Document>
            <Stage
              className={`z-50 ${type != ClassifiedTypeEnum.BOX && " pointer-events-none"}`}
              width={600}
              height={800}
              style={{ position: "absolute", top: 0, left: 0 }}
              onClick={(e) =>
                handleClick(e, (box) => {
                  updateBox(box);
                })
              }
              onMouseMove={handleMouseMove}
            >
              <Layer>
                {boxes.map((box, i) => (
                  // @ts-ignore
                  <Rect
                    key={i}
                    {...box}
                    strokeWidth={2}
                    fill={"#15fe0090"}
                    draggable
                  />
                ))}
                {currentBox && (
                  <Rect
                    // @ts-ignore
                    {...currentBox}
                    stroke="green"
                    strokeWidth={2}
                    fill={"#15fe0030"}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </>
      )}
    </div>
  );
};
