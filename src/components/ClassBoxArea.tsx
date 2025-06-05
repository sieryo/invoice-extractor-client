import type { FieldPdfConfig } from "@/models/pdfConfig";
import { DrawButton } from "./DrawButton";
import { usePdfStore } from "@/store/usePdfStore";

export const ClassBoxArea = ({ field }: { field: FieldPdfConfig }) => {
    const {config} = usePdfStore()
  return (
    <div>
      <DrawButton name={field.name} />
    </div>
  );
};
