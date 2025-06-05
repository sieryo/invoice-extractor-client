import { ClassifiedTypeEnum } from "@/models/pdfConfig";

export const tagStringToArray = (tagString: string | undefined): string[] =>
  (tagString || "")
    .split("\n")
    .map((val) => val.trim())
    .filter((val, idx, arr) => val && arr.indexOf(val) === idx);


export const mapClassifiedTypeEnum = (classified: ClassifiedTypeEnum): string => {
  switch (classified) {
    case ClassifiedTypeEnum.KEYWORD:
      return "Keyword"
    case ClassifiedTypeEnum.LINE:
      return "Line"
    case ClassifiedTypeEnum.BOX:
      return "Box Area"
  }
}