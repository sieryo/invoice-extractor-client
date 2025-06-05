import { usePdfStore } from "@/store/usePdfStore";
import { Input } from "./ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { FieldPdfConfig } from "@/models/pdfConfig";

export const ClassLine = ({
  isEditing,
  setIsEditing,
  field,
  description,
}: {
  description: React.ReactElement;
  field: FieldPdfConfig;
  isEditing: boolean;
  setIsEditing: (state: boolean) => void;
}) => {
  const [lines, setLines] = useState<number[]>([]);
  const data = field.classified.data as any;

  useEffect(() => {
    setLines(data);
  }, [isEditing]);

  const { config, setConfig } = usePdfStore();

  const handleUpdate = () => {

  };

  return (
    <div>
      <Dialog
        open={isEditing}
        onOpenChange={() => {
          setIsEditing(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Keyword</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <div className="mt-2 flex gap-2">
              <Input
                className="w-full max-w-[150px]"
                placeholder="Line from. Exc: 0"
                value={lines[0]}
                 onChange={(e) => {
                    const newLine = lines
                    lines[0] = e.target.value
                    console.log(lines)
                    setLines(newLine)
                }}
              />
              <Input
                className="w-full max-w-[150px]"
                placeholder="Line to. Exc: 1"
                value={lines[1] ?? 0}
                type="number"
                onChange={(e) => {
                    const newLine = lines
                    lines[1] = Number(e.target.value)
                    setLines(newLine)
                }}
              />
            </div>
          </DialogHeader>

          <div className=" pt-4 flex justify-end ">
            <Button onClick={handleUpdate} className=" bg-green-700 px-8">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Input
        disabled
        className="mt-2"
        placeholder={`Example: ${data}`}
        value={data}
      />
    </div>
  );
};
