import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePdfStore } from "@/store/usePdfStore";
import { successMessage } from "@/lib/helper";
import { DialogDescription } from "@radix-ui/react-dialog";

export const DialogRenameGroup = ({
  isOpen,
  setIsOpen,
  currValue = "",
  groupId,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currValue?: string;
  groupId: string;
}) => {
  const [value, setValue] = useState("");
  const { renameGroupIdentifier } = usePdfStore();

  useEffect(() => {
    setValue(currValue);
  }, [currValue]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      handleUpdate();
    }
  };

  const handleUpdate = () => {
    const newValue = value.trim();
    if (newValue === "") return;

    renameGroupIdentifier(groupId, newValue);
    successMessage("Group name updated successfully");

    setValue("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group name</DialogTitle>
          <DialogDescription></DialogDescription>
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
            onClick={handleUpdate}
            className="bg-green-700 px-8"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
