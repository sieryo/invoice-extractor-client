import type { FieldPdfConfig } from "@/models/pdfConfig";
import { DrawButton } from "./DrawButton";
import { usePdfStore } from "@/store/usePdfStore";

export const ClassBoxArea = ({ field }: { field: FieldPdfConfig }) => {
  return (
    <div>
      <DrawButton curField={field} />
    </div>
  );
};
