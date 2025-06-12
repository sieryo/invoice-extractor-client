import { Button } from "./ui/button";
import { ClassifiedTypeEnum, type FieldPdfConfig } from "@/models/pdfConfig";
import { EditorMode, useModeStore } from "@/store/useModeStore";

export const DrawButton = ({ curField }: { curField: FieldPdfConfig }) => {
  const { field, setField, getCurrentMode, setMode } = useModeStore();

  return (
    <div className="mt-2 flex flex-wrap gap-2 items-center">
      <Button
        variant="outline"
        className="h-9 px-3 text-sm"
        onClick={() => {
          if (field && field?.name === curField.name) {
            setMode(EditorMode.Cursor);
          } else {
            setMode(EditorMode.DrawBox);
            setField(curField);
          }
        }}
      >
        {getCurrentMode() == EditorMode.DrawBox &&
        field &&
        field?.name == curField.name &&
        field.classified.method === ClassifiedTypeEnum.BOX
          ? "Exit Draw Mode"
          : "Draw area"}
      </Button>
    </div>
  );
};
