import type { FieldPdfConfig } from "@/models/pdfConfig";
import { DrawButton } from "./DrawButton";
import { Ruler } from "lucide-react"; // optional icon

export const ClassBoxArea = ({ field }: { field: FieldPdfConfig }) => {
  const data = {
    // @ts-expect-error
    x0: Number(field.classified.data.x0).toFixed(2) ?? "0",
    // @ts-expect-error
    x1: Number(field.classified.data.x1).toFixed(2) ?? "0",
    // @ts-expect-error
    top: Number(field.classified.data.top).toFixed(2) ?? "0",
    // @ts-expect-error
    bottom: Number(field.classified.data.bottom).toFixed(2) ?? "0",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-4">
      <div className="flex items-start gap-3">
        <Ruler className="w-5 h-5 text-gray-500 mt-0.5" />
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-medium text-gray-900">x0:</span> {data.x0}
          </div>
          <div>
            <span className="font-medium text-gray-900">x1:</span> {data.x1}
          </div>
          <div>
            <span className="font-medium text-gray-900">top:</span> {data.top}
          </div>
          <div>
            <span className="font-medium text-gray-900">bottom:</span>{" "}
            {data.bottom}
          </div>
        </div>
      </div>

      <DrawButton curField={field} />
    </div>
  );
};
