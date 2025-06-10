import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { nanoid } from "nanoid";
import { TagEdit } from "./input/TagEdit";
import { Input } from "./ui/input";
import { usePdfStore } from "@/store/usePdfStore";
import { DataTypeEnum, type TableField } from "@/models/pdfConfig";
import { Switch } from "./ui/switch";


export const TableForm = ({

} : {

}) => {
  const { config } = usePdfStore();
  const tableConfig = config.sections.table;
  const [isHasColumnIndex, setIsHasColumnIndex] = useState(false);
  const [columnFields, setColumnFields] = useState<
    { id: string; name: string; type: DataTypeEnum }[]
  >([]);

  useEffect(() => {
    const column = tableConfig.tableHeader.map((header) => {
      return {
        ...header,
        id: nanoid(),
      };
    });
    setColumnFields(column);
  }, []);

  const [newColumn, setNewColumn] = useState<string>("");

  const handleChange = (id: string, newValue: string) => {
    if (newValue.trim() !== "") {
      setColumnFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, value: newValue } : f))
      );
    } else {
      handleDelete(id);
    }
  };

  const handleDelete = (id: string) => {
    setColumnFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newColumn.trim() !== "") {
      setColumnFields((prev) => [
        ...prev,
        { id: nanoid(), name: newColumn.trim(), type: DataTypeEnum.STRING },
      ]);
      setNewColumn("");
    }
  };

  return (
    <div>
      <div className=" p-2">
        <h2 className=" font-semibold text-xl">Products / Table</h2>
        <div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Has column "No"</Label>
            </div>
            <Switch
              checked={isHasColumnIndex}
              onCheckedChange={setIsHasColumnIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};