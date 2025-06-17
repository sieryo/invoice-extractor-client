import { loadPdfFile } from "@/lib/pdfFileStorage";
import { usePdfStore } from "@/store/usePdfStore";
import { useEffect, useState } from "react";

export const useCurrentPdf = () => {
  const { currentPdf, updateConfig, current, updateDimensions, getGroup } =
    usePdfStore();

  const [file, setFile] = useState<any>(undefined);

  useEffect(() => {
    let canceled = false;

    const loadFile = async () => {
      console.log("🔁 loadFile triggered");

      try {
        const pdfId = current ? current.pdfId : "";
        if (!pdfId) return;

        const file = await loadPdfFile(pdfId);

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
  }, [current?.pdfId]);

  const pdf = currentPdf();

  return {
    group: getGroup(current ? current.groupId : ""),
    pdf,
    file: file,
    updateConfig,
    id: pdf?.id,
    updateDimensions: updateDimensions,
  };
};
