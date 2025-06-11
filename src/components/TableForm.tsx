import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { DataTypeEnum, type TableField } from "@/models/pdfConfig";
import { Switch } from "./ui/switch";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";

export const TableForm = ({}: {}) => {
  const { config, updateConfig, id } = useCurrentPdf();
  const [isHasColumnIndex, setIsHasColumnIndex] = useState(false);
  const targetField: TableField = {
    name: "no",
    type: DataTypeEnum.INT,
    columnName: "No",
  };

  useEffect(() => {
    const exists = tableConfig.tableHeader.some(
      (field) => field.name === targetField.name
    );

    console.log(exists);

    setIsHasColumnIndex(exists);
  }, [config]);

  if (!config || !id) return null;
  const tableConfig = config.sections.table;

  const handleChecked = (checked: boolean) => {
    const exists = tableConfig.tableHeader.some(
      (field) => field.name === targetField.name
    );

    let newTableHeader;

    if (checked && !exists) {
      newTableHeader = [targetField, ...tableConfig.tableHeader];
    } else if (!checked && exists) {
      newTableHeader = tableConfig.tableHeader.filter(
        (field) => field.name !== targetField.name
      );
    } else {
      newTableHeader = tableConfig.tableHeader;
    }

    const newConfig = config;
    config.sections.table.tableHeader = newTableHeader;

    setIsHasColumnIndex(checked);
    updateConfig(id, newConfig);
  };

  return (
    <div>
      <div className=" p-2">
        <h2 className=" font-semibold text-xl">Products / Table</h2>
        <div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm my-1.5">
            <div className="space-y-0.5">
              <Label>Has column "No"</Label>
            </div>
            <Switch
              checked={isHasColumnIndex}
              onCheckedChange={handleChecked}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
