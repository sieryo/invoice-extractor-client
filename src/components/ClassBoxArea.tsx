import type { FieldPdfConfig } from "@/models/pdfConfig";
import { DrawButton } from "./DrawButton";

export const ClassBoxArea = ({ field }: { field: FieldPdfConfig }) => {
  return (
    <div>
      <DrawButton curField={field} />
    </div>
  );
};
