import { Label } from "./ui/label";
import { Pencil } from "lucide-react";
import { ClassifiedTypeEnum, type FieldPdfConfig } from "@/models/pdfConfig";
import { ClassKeyword } from "./ClassKeyword";
import { useState } from "react";
import { ClassLine } from "./ClassLine";
import { ClassBoxArea } from "./ClassBoxArea";
import { mapClassifiedTypeEnum } from "@/utils";

export const HeaderField = ({
  field,
  icon,
  description,
}: {
  field: FieldPdfConfig;
  icon: React.ReactNode;
  description?: string;
}) => {
  const classifiedMethod = field.classified.method;
  const label = field.label;
  const [isEditing, setIsEditing] = useState(false);

  const handleIsEditing = (state: boolean) => {
    setIsEditing(state);
  };

  const desc = (
    <span className="text-xs">
      {description} {field.label}
    </span>
  );

  return (
    <div className="relative flex gap-3 items-start p-1.5 pb-5 border-b border-b-gray-200">
      {classifiedMethod !== ClassifiedTypeEnum.BOX && (
        <button
          className="absolute top-1.5 right-1.5 text-gray-700 hover:text-blue-500"
          title="Edit"
          onClick={() => {
            handleIsEditing(true);
          }}
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {/* ICON UTAMA */}
      <div className="w-9 h-9 flex items-center justify-center bg-gray-50 border rounded-md mt-1">
        {icon}
      </div>

      {/* LABEL + DESKRIPSI */}
      <div className="flex-1">
        <Label className="block font-semibold text-gray-800 leading-tight">
          {label}
        </Label>
        <p className="text-sm text-gray-500 mt-0.5">
          <span className="font-medium text-gray-600">Classified: </span>
          {mapClassifiedTypeEnum(classifiedMethod)}
          <br />
          {desc}
        </p>

        {/* NILAI */}
        <div>
          {classifiedMethod === ClassifiedTypeEnum.KEYWORD && (
            <ClassKeyword
              isEditing={isEditing}
              setIsEditing={handleIsEditing}
              field={field}
              description={desc}
            />
          )}

          {classifiedMethod === ClassifiedTypeEnum.LINE && (
            <ClassLine
              isEditing={isEditing}
              setIsEditing={handleIsEditing}
              field={field}
              description={desc}
            />
          )}

          {classifiedMethod === ClassifiedTypeEnum.BOX && (
            <ClassBoxArea field={field} />
          )}
        </div>
      </div>
    </div>
  );
};
