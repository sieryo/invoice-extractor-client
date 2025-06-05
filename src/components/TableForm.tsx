import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { nanoid } from "nanoid";
import { TagEdit } from "./input/TagEdit";
import { Input } from "./ui/input";
import { usePdfStore } from "@/store/usePdfStore";
import { DataTypeEnum } from "@/models/pdfConfig";

export const TableForm = () => {
  const { config, setConfig } = usePdfStore();
  const tableConfig = config.sections.table;
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
        <div className=" flex p-1.5">
          <div className=" flex flex-col w-1/4">
            <Label className="block font-semibold text-blue-400 leading-tight">
              Columns
            </Label>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter the column names for each data point in the invoice
            </p>
          </div>
          <div className=" space-y-3 flex-1 w-full rounded-sm   p-1.5">
            <div className=" flex gap-1 min-h-8 flex-wrap">
              {columnFields.map((field) => (
                <TagEdit
                type={field.type}
                  key={field.id}
                  title={field.name}
                  onChange={(newVal) => handleChange(field.id, newVal)}
                  onDelete={() => handleDelete(field.id)}
                />
              ))}
            </div>
            <Input
              placeholder='Place "enter" to add column'
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
