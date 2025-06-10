import { ClassifiedTypeEnum, DataTypeEnum } from "@/models/pdfConfig";
import { toast } from "sonner";

export const tagStringToArray = (tagString: string | undefined): string[] =>
  (tagString || "")
    .split("\n")
    .map((val) => val.trim())
    .filter((val, idx, arr) => val && arr.indexOf(val) === idx);

export const mapClassifiedTypeEnum = (
  classified: ClassifiedTypeEnum
): string => {
  switch (classified) {
    case ClassifiedTypeEnum.KEYWORD:
      return "Keyword";
    case ClassifiedTypeEnum.LINE:
      return "Line";
    case ClassifiedTypeEnum.BOX:
      return "Box Area";
  }
};

export const mapDataTypeFieldEnum = (
  type: DataTypeEnum
) => {
  switch (type) {
    case DataTypeEnum.STRING:
      return "String";
    case DataTypeEnum.FLOAT:
      return "Decimal";
    case DataTypeEnum.INT:
      return "Number";
  }
}

export const successMessage = () => {
  toast.success("Field Updated!", {
    position: "top-right",
    richColors: true,
  });
};
