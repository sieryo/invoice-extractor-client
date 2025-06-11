export enum ClassifiedTypeEnum {
  KEYWORD = "keyword",
  BOX = "box",
  LINE = "line",
}

export enum DataTypeEnum {
  FLOAT = "float",
  INT = "int",
  STRING = "string",
}

export type Box = {
  x0: number;
  x1: number;
  top: number;
  bottom: number;
};

export type Classified = {
  method: ClassifiedTypeEnum;
  data: [number, number] | string | Box;
  isMultiword?: boolean;
};

export type FieldPdfConfig = {
  name: string;
  label: string;
  classified: Classified;
};

export type HeaderPdfConfig = {
  fields: FieldPdfConfig[];
};

export type TableField = {
  columnName: string;
  name: string;
  type: DataTypeEnum;
};

export type TablePdfConfig = {
  tableHeader: TableField[];
  extractFields: string[];
};

export type Sections = {
  header: HeaderPdfConfig;
  table: TablePdfConfig;
};

export type PdfConfig = {
  exportedName: string;
  fileName: string;
  sections: Sections;
};
