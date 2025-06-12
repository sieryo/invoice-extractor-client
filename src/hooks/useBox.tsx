import type Konva from "konva";
import { useState } from "react";

export type BoxState = null | {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke?: string;
  title?: string
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
      setIsDrawing(false);
      if (currentBox && currentBox.width !== 0 && currentBox.height !== 0) {
        onComplete(currentBox);
      }
      setCurrentBox(null);
    }
  };

  const handleCancel = () => {
    setIsDrawing(false);
    setCurrentBox(null);
  };

  const handleMouseMove = (
    e: Konva.KonvaEventObject<MouseEvent>,
    scale = 1 // ⬅️ Tambahan scale default
  ) => {
    if (!isDrawing || !currentBox) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pointer = stage.getPointerPosition();
    if (!pointer || pointer.x <= 0 || pointer.y <= 0) return;

    const x = pointer.x / scale;
    const y = pointer.y / scale;

    setCurrentBox((prev) => {
      if (!prev) return null;

      const newWidth = x - prev.x;
      const newHeight = y - prev.y;

      const newX = newWidth < 0 ? x : prev.x;
      const newY = newHeight < 0 ? y : prev.y;

      return {
        ...prev,
        x: newX,
        y: newY,
        width: Math.abs(newWidth),
        height: Math.abs(newHeight),
      };
    });
  };

  return {
    currentBox,
    setCurrentBox,
    handleClick,
    handleMouseMove,
    handleCancel,
  };
};
