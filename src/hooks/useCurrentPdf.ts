import { loadPdfFile } from "@/lib/pdfFileStorage";
import { usePdfStore } from "@/store/usePdfStore";
import { useEffect, useState } from "react";

export const useCurrentPdf = () => {
  const { currentPdf, updateConfig, updateDimensions, getGroup } =
    usePdfStore();

  const [file, setFile] = useState<any>(undefined);
  const currentPdfId = usePdfStore((state) => state.current?.pdfId);
  const currentGroupId = usePdfStore((state) => state.current?.groupId);

  useEffect(() => {
    let canceled = false;

    const loadFile = async () => {
      try {
        if (!currentPdfId) {
          setFile(undefined);
          return;
        }
        const file = await loadPdfFile(currentPdfId);

        if (!canceled) {
          setFile(file);
        }
      } catch (err) {
        if (!canceled) {
          console.error(err);
        }
      }
    };

    loadFile();

    return () => {
      canceled = true;
    };
  }, [currentPdfId]);

  const pdf = currentPdf();

  return {
    group: getGroup(currentGroupId),
    pdf,
    file: file,
    updateConfig,
    id: pdf?.id,
    updateDimensions: updateDimensions,
  };
};
