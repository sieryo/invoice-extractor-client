import { handleExport } from "@/lib/export";
import { usePdfStore } from "@/store/usePdfStore";
import type { AxiosResponse } from "axios";

export const ExportTouchable = ({
  children,
  onBeforeExport,
  onAfterExport,
}: {
  children: React.ReactNode;
  onBeforeExport?: () => void;
  onAfterExport?: (response: AxiosResponse<any,any>) => void;
}) => {
  const { groups } = usePdfStore();

  const exportToExcel = async () => {
    if (groups.length <= 0) return;


    await handleExport(groups, onBeforeExport, onAfterExport);
  };

  return (
    <button
      onClick={exportToExcel}
      className="p-0 border-none bg-transparent w-full h-full pointer-events-auto cursor-pointer"
    >
      {children}
    </button>
  );
};
