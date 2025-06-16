import { usePdfStore } from "@/store/usePdfStore";

export const useCurrentPdf = () => {
  const { currentPdf, updateConfig, current, updateDimensions, getGroup } =
    usePdfStore();

  const pdf = currentPdf();

  return {
    group: getGroup(current ? current.groupId : ""),
    pdf,
    file: pdf?.file,
    updateConfig,
    id: pdf?.id,
    updateDimensions: updateDimensions,
  };
};
