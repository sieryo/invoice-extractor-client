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

export const mapDataTypeFieldEnum = (type: DataTypeEnum) => {
  switch (type) {
    case DataTypeEnum.STRING:
      return "String";
    case DataTypeEnum.FLOAT:
      return "Decimal";
    case DataTypeEnum.INT:
      return "Number";
  }
};

export const successMessage = (message: string = "Field Updated!") => {
  toast.success(message, {
    position: "top-center",
    richColors: true,
    duration: 2000,
  });
};

export const failedMessage = (message: string = "Failed") => {
  toast.error(message, {
    position: "top-center",
    richColors: true,
  });
};

export const traverseFileTree = (item: any, path = ""): Promise<File[]> => {
  return new Promise((resolve) => {
    if (item.isFile) {
      item.file((file: File) => {
        // @ts-expect-error
        file.relativePath = path + file.name;
        resolve([file]);
      });
    } else if (item.isDirectory) {
      const dirReader = item.createReader();
      dirReader.readEntries(async (entries: any[]) => {
        const files = await Promise.all(
          entries.map((entry) =>
            traverseFileTree(entry, path + item.name + "/")
          )
        );
        resolve(files.flat());
      });
    }
  });
};

export function getFolderNameFromPath(path : string) {
  const parts = path.split("/");
  return parts.length > 1 ? parts[0] : "uncategorized";
}

export function getFileNameFromPath(path: string) {
  const parts = path.split("/");
  return parts.length > 0 ? parts[parts.length - 1] : path;
}

