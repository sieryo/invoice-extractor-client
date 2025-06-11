import { usePdfStore } from "@/store/usePdfStore";
import { useMemo } from "react";

export const useCurrentPdf = () => {
  const { currentPdf, updateConfig, currentId } = usePdfStore();

  const pdf = useMemo(() => currentPdf(), [currentId]);

  return {
    pdf,
    file: pdf?.file,
    config: pdf?.config,
    updateConfig,
    id: pdf?.id,
  };
};
