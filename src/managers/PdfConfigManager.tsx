import {
  type PdfConfig,
  type FieldPdfConfig,
  type TableField,
  ClassifiedTypeEnum,
  DataTypeEnum,
} from "@/models/pdfConfig"; // sesuaikan dengan path kamu

export class PdfConfigManager {
  private config: PdfConfig;

  constructor(exportedName: string) {
    this.config = {
      exportedName,
      sections: {
        header: {
          fields: [],
        },
        table: {
          tableHeader: [],
          extractFields: [],
        },
      },
    };
  }

  static generate(): PdfConfig {
    const fields: FieldPdfConfig[] = [
      {
        name: "invoice_number",
        label: "Invoice Number",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: ["Invoice No", "No. Invoice"],
        },
      },
      {
        name: "invoice_date",
        label: "Invoice Date",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: ["Invoice Date", "Date"],
        },
      },
      {
        name: "seller_address",
        label: "Seller Address",
        classified: {
          method: ClassifiedTypeEnum.LINE,
          data: [1, 2],
        },
      },
      {
        name: "seller_name",
        label: "Seller Name",
        classified: {
          method: ClassifiedTypeEnum.LINE,
          data: [0, 0],
        },
      },
      {
        name: "buyer_address",
        label: "Buyer Address",
        classified: {
          method: ClassifiedTypeEnum.BOX,
          data: {
            x0: 326,
            x1: 525,
            top: 150,
            bottom: 186,
          },
        },
      },
      {
        name: "buyer_name",
        label: "Buyer Name",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: ["Delivery to", "Customer Name"],
          isMultiwords: true,
        },
      },
    ];

    const tableFields: TableField[] = [
      { name: "no", type: DataTypeEnum.INT },
      { name: "sku", type: DataTypeEnum.STRING },
      { name: "name", type: DataTypeEnum.STRING },
      { name: "quantity", type: DataTypeEnum.INT },
      { name: "price", type: DataTypeEnum.FLOAT },
      { name: "total", type: DataTypeEnum.FLOAT },
    ];

    const config: PdfConfig = {
      exportedName: "",
      sections: {
        header: {
          fields,
        },
        table: {
          tableHeader: tableFields,
          extractFields: tableFields.map((f) => f.name),
        },
      },
    };

    return config;
  }

  changeExportedName(exportedName: string) {
    this.config.exportedName = exportedName
  }

  getConfig(): PdfConfig {
    return this.config;
  }

  // =======================
  // Header Config Methods
  // =======================

  addHeaderField(field: FieldPdfConfig): void {
    this.config.sections.header.fields.push(field);
  }

  removeHeaderFieldByName(name: string): void {
    this.config.sections.header.fields = this.config.sections.header.fields.filter(
      (f) => f.name !== name
    );
  }

  // =======================
  // Table Config Methods
  // =======================

  addTableField(field: TableField): void {
    this.config.sections.table.tableHeader.push(field);
  }

  removeTableFieldByName(name: string): void {
    this.config.sections.table.tableHeader = this.config.sections.table.tableHeader.filter(
      (f) => f.name !== name
    );
  }

  setExtractFields(fields: string[]): void {
    this.config.sections.table.extractFields = fields;
  }

  // =======================
  // Export / Import
  // =======================

  exportToJson(): string {
    return JSON.stringify(this.config, null, 2);
  }

  static importFromJson(json: string): PdfConfigManager {
    const parsed = JSON.parse(json);
    const manager = new PdfConfigManager(parsed.exportedName);
    manager.config = parsed;
    return manager;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.config.exportedName) {
      errors.push("exportedName is required.");
    }

    this.config.sections.header.fields.forEach((field, idx) => {
      if (!field.name || !field.label) {
        errors.push(`Header field at index ${idx} is missing name or label.`);
      }
    });

    this.config.sections.table.tableHeader.forEach((field, idx) => {
      if (!field.name || field.type === undefined) {
        errors.push(`Table field at index ${idx} is missing name or type.`);
      }
    });

    return errors;
  }
}
