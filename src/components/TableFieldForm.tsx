import { Label } from "./ui/label";
import { Grid2x2, Pencil } from "lucide-react";
import { type TableField } from "@/models/pdfConfig";
import { mapDataTypeFieldEnum } from "@/lib/helper";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DEFAULT_TABLE_COLUMN_HEADER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const TableFieldForm = ({ field }: { field: TableField }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleIsEditing = (state: boolean) => {
    setIsEditing(state);
  };

  const handleUpdate = () => {};

  return (
    <div className="relative flex gap-3 items-start p-1.5 pb-5 border-b border-b-gray-200">
      <button
        className={cn(`absolute top-1.5 right-1.5 text-gray-700 hover:text-blue-500`, field.name == "no" && "text-gray-400")}
        title="Edit"
        disabled={field.name == "no"}
        onClick={() => {
          handleIsEditing(true);
        }}
      >
        <Pencil className="w-4 h-4" />
      </button>

      <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border rounded-md mt-1">
        <Grid2x2 className="w-5 h-5 text-gray-600" />
      </div>

      <div className="flex-1">
        <Label className="block font-semibold text-gray-800 leading-tight">
          {field.columnName} ({mapDataTypeFieldEnum(field.type)})
        </Label>
        <p className="text-sm text-gray-500 mt-0.5">
          <span className="font-medium text-gray-600">Equal to: </span>
          {field.name}
          <br />
        </p>
      </div>
      <Dialog
        open={isEditing}
        onOpenChange={() => {
          setIsEditing(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
            {/* <DialogDescription>{description}</DialogDescription> */}
          </DialogHeader>

          <div>
            <Label className=" mb-1">Column name</Label>
            <Input
              className="mt-2 "
              placeholder={`Example: SKU`}
              value={field.columnName}
              // onChange={handleChange}
              // onKeyDown={handleKeyDown}
            />
          </div>

          <div>
            <Label className=" mb-1">Column for</Label>
            <Select defaultValue={field.name ?? ""}>
              <SelectTrigger className=" w-full">
                <SelectValue placeholder="Exc. SKU" />
              </SelectTrigger>
              <SelectContent >
                {DEFAULT_TABLE_COLUMN_HEADER.map((col) => (
                  <SelectItem  key={col.value} value={col.value}>{col.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className=" pt-4 flex justify-end ">
            <Button onClick={handleUpdate} className=" bg-green-700 px-8">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
