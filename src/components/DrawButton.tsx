import { useActiveFieldBoxStore } from "@/store/useActiveFieldBoxStore";
import { Button } from "./ui/button";
import { ClassifiedTypeEnum, type FieldPdfConfig } from "@/models/pdfConfig";

export const DrawButton = ({ curField }: { curField: FieldPdfConfig }) => {
  const { field, setField } = useActiveFieldBoxStore();


  return (
    <div className="mt-2 flex flex-wrap gap-2 items-center">
      <Button
        variant="outline"
        className="h-9 px-3 text-sm"
        onClick={() => {
          if (field && field?.name === curField.name) {
            setField(null);
          } else {
            setField(curField);
          }
        }}
      >
        {field && field?.name == curField.name &&
        field.classified.method === ClassifiedTypeEnum.BOX
          ? "Exit Draw Mode"
          : "Draw area"}
      </Button>
    </div>
  );
};
