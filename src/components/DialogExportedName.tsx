import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { successMessage } from "@/lib/helper";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";

export const DialogExportedName = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (val: boolean) => void;
}) => {
  const { config, id, setExportedName, exportedName } = useCurrentPdf();
  const [value, setValue] = useState("");

  if (!config || !id) return null;

  const handleChange = (e: any) => {
    const value = e.target.value;

    setValue(value);
  };

  const handleUpdateFileName = () => {
    const newValue = value.trim() !== "" ? value : exportedName;

    if (newValue == exportedName) {
      setIsActive(false);
      return;
    } else {
      setExportedName(newValue);
      successMessage("Exported Name updated!");
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      handleUpdateFileName();
    }
  };

  return (
    <Dialog
      open={isActive}
      onOpenChange={() => {
        handleUpdateFileName();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Name your file!</DialogTitle>
          <DialogDescription>Exported name</DialogDescription>
        </DialogHeader>
        <Input
          className="mt-2 "
          placeholder={`Example: Transaction-12`}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className=" pt-4 flex justify-end ">
          <Button onClick={handleUpdateFileName} className=" bg-green-700 px-8">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
