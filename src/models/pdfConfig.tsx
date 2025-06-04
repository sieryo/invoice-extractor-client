export enum ClassifiedTypeEnum {
  KEYWORD,
  BOX,
  LINE,
}

export enum DataTypeEnum {
  FLOAT,
  INT,
  STRING,
}

export type Box = {
  x0: number;
  x1: number;
  top: number;
  bottom: number;
};

export type Classified = {
  method: ClassifiedTypeEnum;
  data: [number, number] | string[] | Box;
  isMultiwords?: boolean
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
  sections: Sections;
};
