import { useEffect, useState } from "react";
import { usePdfStore } from "@/store/usePdfStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FieldPdfConfig } from "@/models/pdfConfig";
import { PreviewField } from "./PreviewField";
import { successMessage } from "@/lib/helper";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";

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
  const [lines, setLines] = useState<number[]>([0, 0]);
  const [error, setError] = useState<string | null>(null);
  const { config, file, id, updateConfig } = useCurrentPdf();

  useEffect(() => {
    const initialData = Array.isArray(field.classified.data)
      ? field.classified.data
      : [0, 0];
    setLines(initialData);
    setError(null);
  }, [isEditing, field.classified.data]);

  const handleLineChange = (index: number, value: number) => {
    const updatedLines = [...lines];
    updatedLines[index] = value;
    setLines(updatedLines);
  };

  if (!config || !file || !id) return null;

  const handleUpdate = () => {
    if (lines[1] <= lines[0]) {
      setError("The final row must be larger than the initial row.");
      return;
    }

    const updatedField: FieldPdfConfig = {
      ...field,
      classified: {
        ...field.classified,
        data: [lines[0] ?? 0, lines[1] ?? 0],
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
  // @ts-expect-error
  const previewData = `Line ${field.classified.data[0] ?? "1"} to line ${field.classified.data[1] ?? "1"} `;

  return (
    <div>
      <Dialog open={isEditing} onOpenChange={() => setIsEditing(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lines</DialogTitle>
            <DialogDescription>{description}</DialogDescription>

            <div className="mt-4 flex gap-2">
              <Input
                className="w-full max-w-[150px]"
                placeholder="Line from. Ex: 1"
                type="number"
                min={1}
                value={lines[0] ?? ""}
                onChange={(e) => handleLineChange(0, Number(e.target.value))}
              />
              <Input
                className="w-full max-w-[150px]"
                placeholder="Line to. Ex: 2"
                type="number"
                min={1}
                value={lines[1] ?? ""}
                onChange={(e) => handleLineChange(1, Number(e.target.value))}
              />
            </div>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </DialogHeader>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleUpdate} className="bg-green-700 px-8">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PreviewField label="Configured lines" data={previewData} />
    </div>
  );
};
