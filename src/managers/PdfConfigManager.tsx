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
          data: "No. Invoice",
        },
      },
      {
        name: "invoice_date",
        label: "Invoice Date",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: "Invoice Date",
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
          data: "Customer Name",
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

}
