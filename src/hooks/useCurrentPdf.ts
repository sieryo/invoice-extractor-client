import { usePdfStore } from "@/store/usePdfStore";
import { useMemo } from "react";

export const useCurrentPdf = () => {
  const {
    currentPdf,
    updateConfig,
    currentId,
    updateDimensions,
    exportedName,
    setExportedName,
  } = usePdfStore();

  const pdf = currentPdf()

  return {
    pdf,
    file: pdf?.file,
    config: pdf?.config,
    updateConfig,
    id: pdf?.id,
    width: pdf?.width,
    height: pdf?.height,
    updateDimensions: updateDimensions,
    exportedName,
    setExportedName,
  };
};
