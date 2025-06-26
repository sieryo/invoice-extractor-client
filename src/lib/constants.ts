const DEFAULT_PDF_VIEWER_WIDTH = 600;
const DEFAULT_PDF_VIEWER_HEIGHT = 800;

const BASE_API_PATH = import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/api` : "/api"

console.log(BASE_API_PATH)

const DEFAULT_TABLE_COLUMN_HEADER = [
  {
    name: "SKU",
    value: "sku",
  },
  {
    name: "Name",
    value: "name",
  },
  {
    name: "Quantity",
    value: "quantity",
  },
  {
    name: "Price",
    value: "price",
  },
  {
    name: "Total",
    value: "total",
  },
];

export {
  DEFAULT_PDF_VIEWER_HEIGHT,
  DEFAULT_PDF_VIEWER_WIDTH,
  DEFAULT_TABLE_COLUMN_HEADER,
  BASE_API_PATH,
};
