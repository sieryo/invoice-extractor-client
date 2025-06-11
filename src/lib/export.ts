import type { PdfConfig } from "@/models/pdfConfig";
import { failedMessage } from "./helper";
import axios from "axios";
import type { PdfItem } from "@/store/usePdfStore";

function buildHeaderConfig(config: PdfConfig) {
  return {
    fields: config.sections.header.fields.map((field) => ({
      name: field.name,
      classified: {
        method: field.classified.method,
        data: field.classified.data,
        is_multiword: field.classified.isMultiword ?? false,
      },
    })),
  };
}

function buildTableConfig(config: PdfConfig) {
  return {
    table_header: config.sections.table.tableHeader.map((h) => ({
      name: h.name,
      type: h.type,
    })),
    extract_fields: config.sections.table.extractFields,
  };
}

function buildExportConfig(config: PdfConfig) {
  return {
    sections: {
      header: buildHeaderConfig(config),
      table: buildTableConfig(config),
    },
  };
}

function buildFormDataMulti(pdfs: PdfItem[]) {
  const formData = new FormData();

  pdfs.forEach((pdf) => {
    formData.append("files", pdf.file);
    formData.append("configs", JSON.stringify(buildExportConfig(pdf.config)));
  });



  return formData;
}

function triggerDownload(response: any, exportedName: string) {
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const contentDisposition = response.headers["content-disposition"];
  let filename = `${exportedName}.xlsx`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?(.+)"?/);
    if (match) filename = match[1];
  }

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function handleErrorResponse(err: any) {
  if (
    err.response &&
    err.response.data instanceof Blob &&
    err.response.data.type === "application/json"
  ) {
    const reader = new FileReader();
    reader.onload = function () {
      const errorText = reader.result;
      try {
        // @ts-expect-error
        const json = JSON.parse(errorText ?? "");
        failedMessage(json.detail || "Unknown Error");
      } catch (parseError) {
        failedMessage("Error:" + errorText);
      }
    };
    reader.readAsText(err.response.data);
  } else {
    alert("err: " + (err.message || "Terjadi kesalahan"));
  }
}

export const handleExport = async (
  pdfs: PdfItem[],
  exportedName: string,
  onBeforeExport?: () => void,
  onAfterExport?: () => void
) => {
  if (onBeforeExport) {
    onBeforeExport();
  }

  const formData = buildFormDataMulti(pdfs);

  console.log(formData);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE}/export`,
      formData,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    triggerDownload(response, exportedName);
  } catch (err: any) {
    console.error("Upload error:", err);
    handleErrorResponse(err);
  } finally {
    if (onAfterExport) onAfterExport();
  }
};
