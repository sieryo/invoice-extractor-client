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
      fileName: exportedName,
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

  static generate(fileName: string): PdfConfig {
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
          data: [2, 3],
        },
      },
      {
        name: "seller_name",
        label: "Seller Name",
        classified: {
          method: ClassifiedTypeEnum.LINE,
          data: [1, 1],
        },
      },
      {
        name: "buyer_address",
        label: "Buyer Address",
        classified: {
          method: ClassifiedTypeEnum.BOX,
          data: {
            x0: 5,
            x1: 10,
            top: 10,
            bottom: 20,
          },
        },
      },
      {
        name: "buyer_name",
        label: "Buyer Name",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: "Customer Name",
          isMultiword: true,
        },
      },
    ];

    const tableFields: TableField[] = [
      { columnName: "SKU", name: "sku", type: DataTypeEnum.STRING },
      { columnName: "Product Name", name: "name", type: DataTypeEnum.STRING },
      { columnName: "Quantity", name: "quantity", type: DataTypeEnum.INT },
      { columnName: "Price", name: "price", type: DataTypeEnum.FLOAT },
      { columnName: "Amount", name: "total", type: DataTypeEnum.FLOAT },
    ];

    const config: PdfConfig = {
      exportedName: fileName,
      fileName: fileName,
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
