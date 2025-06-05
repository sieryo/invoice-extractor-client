import { useActiveFieldStore } from "@/store/useActiveFieldStore";
import { Button } from "./ui/button";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";

export const DrawButton = ({
  name,
  label,
}: {
  name: string;
  label?: string;
}) => {
  const { field, setActive, type } = useActiveFieldStore();

  return (
    <div className="mt-2 flex flex-wrap gap-2 items-center">
      <Button
        variant="outline"
        className="h-9 px-3 text-sm"
        onClick={() => {
          if (field === name) {
            setActive("", null);
          } else {
            setActive(name, ClassifiedTypeEnum.BOX);
          }
        }}
      >
        {field == name && type === ClassifiedTypeEnum.BOX
          ? "Cancel draw"
          : "Draw area"}
      </Button>
    </div>
  );
};
