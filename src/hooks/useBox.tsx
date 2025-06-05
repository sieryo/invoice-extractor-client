import type Konva from "konva";
import { useState } from "react";

export type BoxState = null | {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
};

export const useBox = () => {
  const [currentBox, setCurrentBox] = useState<BoxState>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleClick = (
    e: Konva.KonvaEventObject<MouseEvent>,
    onComplete: (box: BoxState) => void,
    scale = 1 // ⬅️ Tambahan scale default
  ) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const x = pointer.x / scale;
    const y = pointer.y / scale;

    if (!isDrawing) {
      setCurrentBox({ x, y, width: 0, height: 0 });
      setIsDrawing(true);
    } else {
      console.log("PASTI KESINI!")
      setIsDrawing(false);
      if (currentBox && currentBox.width !== 0 && currentBox.height !== 0) {
        onComplete(currentBox);
      }
      setCurrentBox(null);
    }
  };

  const handleCancel = () => {
    setIsDrawing(false)
    setCurrentBox(null)
  }

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent>,
    scale = 1 // ⬅️ Tambahan scale default
  ) => {
    if (!isDrawing || !currentBox) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const x = pointer.x / scale;
    const y = pointer.y / scale;

    setCurrentBox((prev) =>
      prev
        ? {
            ...prev,
            width: x - prev.x,
            height: y - prev.y,
          }
        : null
    );
  };

  return {
    currentBox,
    setCurrentBox,
    handleClick,
    handleMouseMove,
    handleCancel
  };
};
