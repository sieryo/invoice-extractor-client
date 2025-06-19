import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { usePdfStore } from "@/store/usePdfStore";
import { successMessage } from "@/utils/message";

export const AddGroup = () => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const { addEmptyGroup } = usePdfStore();

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      handleAddGroup();
    }
  };

  const handleAddGroup = () => {
    const newValue = value.trim();
    if (newValue === "") return;

    addEmptyGroup(newValue);
    successMessage("Group added successfully");

    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <FolderUp className="w-6 h-6 text-gray-800" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row items-center justify-between rounded-lg">
          <Input
            className="mt-2"
            placeholder={`Example: PT ... `}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            onClick={handleAddGroup}
            className="bg-green-700 px-8"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
