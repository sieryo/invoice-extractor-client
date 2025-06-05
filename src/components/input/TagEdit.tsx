import { useState } from "react";
import { CircleDot, Hash, Pencil, Quote, X } from "lucide-react";
import { Input } from "../ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTypeEnum } from "@/models/pdfConfig";

export const TagEdit = ({
  title,
  onChange,
  onDelete,
  type,
}: {
  title: string;
  onChange?: (newValue: string) => void;
  onDelete?: () => void;
  type: DataTypeEnum;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  let typeBgIcon;

  switch (type) {
    case DataTypeEnum.INT:
      typeBgIcon = [<Hash className="w-2.5 h-2.5 text-gray-100" />, "Number"];
      break;

    case DataTypeEnum.FLOAT:
      typeBgIcon = [
        <CircleDot className="w-2.5 h-2.5 text-gray-100" />,
        "Decimal",
      ];
      break;

    default:
      typeBgIcon = [<Quote className="w-2.5 h-2.5 text-gray-100" />, "String"];
      break;
  }

  return (
    <div
      className={`flex items-center px-2.5 py-0.5 rounded-md border ${isEditing ? "border-blue-400" : "border-gray-500"} group cursor-text relative`}
    >
      <Tooltip>
        <TooltipContent>
          <p className="text-xs text-gray-100">{typeBgIcon[1]}</p>
        </TooltipContent>
        <TooltipTrigger>
          <div className=" absolute h-4 w-4 top-[-8px] flex items-center justify-center left-0 bg-black rounded-full">
            {typeBgIcon[0]}
          </div>
        </TooltipTrigger>
      </Tooltip>
      <p className="text-sm text-gray-700 max-w-[300px] truncate">{value}</p>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Column Field</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        <DialogTrigger
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Pencil
            className={`w-3 h-3 ml-3 ${isEditing ? "text-blue-400" : "hover:text-blue-400"}`}
          />
        </DialogTrigger>
      </Dialog>
    </div>
  );
};
