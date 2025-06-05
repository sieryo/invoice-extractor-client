import { Label } from "./ui/label";
import { ClassifiedTypeEnum, type Classified } from "@/models/pdfConfig";
import { mapClassifiedTypeEnum } from "@/lib/helper";
import { Input } from "./ui/input";
import { DrawButton } from "./DrawButton";

export const HeaderField = ({
  name,
  label,
  icon,
  classified,
  description,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  classified: Classified;
  description?: string;
}) => {
  const classifiedData = classified.data;
  const classifiedMethod = classified.method;

  const desc = (
    <span className="text-xs">
      {description} {label}
    </span>
  );

  return (
    <div className="flex gap-3 items-start p-1.5 pb-5 border-b border-b-gray-200 ">
      {/* ICON */}
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

        {/* ACTUAL VALUE... */}
        <div>
          {classifiedMethod == ClassifiedTypeEnum.KEYWORD && (
            <Input
              disabled
              className="mt-2"
              placeholder="Contoh: No. Invoice, Invoice no"
              value={classifiedData ?? ""}
            />
          )}

          {classifiedMethod == ClassifiedTypeEnum.LINE && (
            <div className="mt-2 flex gap-2">
              <Input className="w-full max-w-[150px]" placeholder="Line from" disabled value={classifiedData[0] ?? ""} />
              <Input className="w-full max-w-[150px]" placeholder="Line to" disabled  value={classifiedData[1] ?? ""}/>
            </div>
          )}

          {classifiedMethod == ClassifiedTypeEnum.BOX && (
            <DrawButton name={name} />
          )}
        </div>
      </div>
    </div>
  );
};
