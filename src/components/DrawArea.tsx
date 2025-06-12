import { useBox, type BoxState } from "@/hooks/useBox";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";
import { successMessage } from "@/lib/helper";
import {
  ClassifiedTypeEnum,
  type Box,
  type FieldPdfConfig,
} from "@/models/pdfConfig";
import { useActiveFieldBoxStore } from "@/store/useActiveFieldBoxStore";
import type { PdfItem } from "@/store/usePdfStore";
import { useEffect, useState } from "react";
import { Layer, Rect, Stage, Group, Text } from "react-konva";

export const DrawArea = ({ scale, pdf }: { scale: number; pdf?: PdfItem }) => {
  const { currentBox, handleMouseMove, handleClick, handleCancel } = useBox();
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const { field, setField } = useActiveFieldBoxStore();

  const { id, config: curConfig, updateConfig } = useCurrentPdf();

  const config = pdf ? pdf.config : curConfig;

  useEffect(() => {
    if (!field) {
      // Cancel
      handleCancel();
      setBoxes([]);
    }

    if (!config) return;

    const configBox = config.sections.header.fields.find(
      (v) => v.classified.method == ClassifiedTypeEnum.BOX
    );
    if (configBox) {
      const x = configBox.classified.data.x0;
      const y = configBox.classified.data.top;
      const width = configBox.classified.data.x1 - x;
      const height = configBox.classified.data.bottom - y;
      const box: BoxState = {
        x,
        y,
        width,
        height,
        title: configBox.label,
      };
      setBoxes([box]);
    }
  }, [field, id, config]);

  if (!config || !id) return null;

  const handleUpdate = () => {
    if (!currentBox || !field) return;
    const box: Box = {
      x0: currentBox.x,
      x1: currentBox.width + currentBox.x,
      top: currentBox.y,
      bottom: currentBox.height + currentBox.y,
    };

    const updatedField: FieldPdfConfig = {
      ...field,
      classified: {
        ...field.classified,
        data: box,
      },
    };

    const index = config.sections.header.fields.findIndex(
      (f) => f.name === field.name
    );
    if (index !== -1) {
      const newConfig = config;
      newConfig.sections.header.fields[index] = updatedField;
      updateConfig(id, newConfig);
    }
    successMessage("Area Updated!");
    setBoxes([currentBox]);
  };

  const isDrawingMode = field?.classified.method === ClassifiedTypeEnum.BOX;

  const updateBox = (box: BoxState) => {
    const confirm = window.confirm("Confirm this area?");
    if (confirm) {
      handleUpdate();
      setField(null);
    }
  };

  // const handleDeleteBox = (index: number) => {
  //   const filtered = boxes.filter((_, i) => i !== index);
  //   setBoxes(filtered);
  // };

  return (
    <Stage
      className={`${isDrawingMode ? "z-40" : ""}`}
      width={600 * scale}
      height={800 * scale}
      scaleX={scale}
      scaleY={scale}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        cursor: isDrawingMode ? "crosshair" : "default",
      }}
      onClick={
        isDrawingMode ? (e) => handleClick(e, updateBox, scale) : undefined
      }
      onMouseMove={isDrawingMode ? (e) => handleMouseMove(e, scale) : undefined}
    >
      <Layer>
        {!currentBox &&
          boxes.map((box, i) => (
            <Group key={i}>
              <Rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                cornerRadius={2}
                strokeWidth={1}
                stroke={"rgba(126, 220, 238, 0.7)"}
                fill={"rgba(126, 220, 238, 0.4)"}
              />
            </Group>
          ))}

        {currentBox && (
          <Rect
            x={currentBox.x}
            y={currentBox.y}
            width={currentBox.width}
            height={currentBox.height}
            cornerRadius={2}
            strokeWidth={1}
            stroke={"rgba(126, 220, 238, 0.7)"}
            fill={"rgba(126, 220, 238, 0.4)"}
          />
        )}
      </Layer>
    </Stage>
  );
};
