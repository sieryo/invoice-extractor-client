import {
  type PdfConfig,
  type FieldPdfConfig,
  type TableField,
  ClassifiedTypeEnum,
  DataTypeEnum,
} from "@/models/pdfConfig"; // sesuaikan dengan path kamu

export class PdfConfigManager {

  static generate(): PdfConfig {
    const fields: FieldPdfConfig[] = [
      {
        name: "invoice_number",
        label: "Invoice Number",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: "Invoice No",
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
        name: "seller_name",
        label: "Seller Name",
        classified: {
          method: ClassifiedTypeEnum.LINE,
          data: [1, 1],
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
        name: "buyer_name",
        label: "Buyer Name",
        classified: {
          method: ClassifiedTypeEnum.KEYWORD,
          data: "Customer Name",
          isMultiword: true,
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
    ];

    const tableFields: TableField[] = [
      {
        name: "no",
        type: DataTypeEnum.INT,
        columnName: "No",
      },
      { columnName: "SKU", name: "sku", type: DataTypeEnum.STRING },
      { columnName: "Product Name", name: "name", type: DataTypeEnum.STRING },
      { columnName: "Quantity", name: "quantity", type: DataTypeEnum.INT },
      { columnName: "Price", name: "price", type: DataTypeEnum.FLOAT },
      { columnName: "Amount", name: "total", type: DataTypeEnum.FLOAT },
    ];

    const config: PdfConfig = {
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
