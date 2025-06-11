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
import { PreviewField } from "./PreviewField";
import { successMessage } from "@/lib/helper";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";

export const ClassKeyword = ({
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
  const [value, setValue] = useState("");
  const [isMultiword, setIsMultiword] = useState(false);
  const data = field.classified.data as any;
  const multiword = field.classified.isMultiword ?? false;
  const { config, file, id, updateConfig } = useCurrentPdf();

  if (!config || !file || !id) return null;

  const handleUpdate = () => {
    const newValue = value.trim() !== "" ? value : data;
    const updatedField: FieldPdfConfig = {
      ...field,
      classified: {
        ...field.classified,
        data: newValue,
        isMultiword,
      },
    };

    const index = config.sections.header.fields.findIndex(
      (f) => f.name === field.name
    );
    if (index !== -1) {
      const newConfig = config;
      newConfig.sections.header.fields[index] = updatedField;
      updateConfig(id, newConfig);
    }
    successMessage();
    setIsEditing(false);
  };

  useEffect(() => {
    setValue(data);
    setIsMultiword(multiword);
  }, [isEditing]);

  const handleChange = (e: any) => {
    const value = e.target.value;

    setValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      handleUpdate();
    }
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

            <Input
              className="mt-2 "
              placeholder={`Example: ${data}`}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </DialogHeader>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <Tooltip>
              <TooltipTrigger>
                <div className="space-y-0.5">
                  <Label>Multiword</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Exc. "PT HEBAT"; Singleword Exc. "OST0001"
              </TooltipContent>
            </Tooltip>
            <Switch checked={isMultiword} onCheckedChange={setIsMultiword} />
          </div>

          <div className=" pt-4 flex justify-end ">
            <Button onClick={handleUpdate} className=" bg-green-700 px-8">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <PreviewField
        data={field.classified.data.toString()}
        isMultiword={field.classified.isMultiword}
      />
    </div>
  );
};
