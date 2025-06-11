import { PDFAnnotator } from "@/components/PdfAnnotator";
import { Button } from "@/components/ui/button";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Brackets, ScanText, Type } from "lucide-react";
import { usePdfStore } from "@/store/usePdfStore";
import { HeaderField } from "@/components/HeaderField";
import { useActiveFieldBoxStore } from "@/store/useActiveFieldBoxStore";
import { DrawingModeBanner } from "@/components/DrawingModeBanner";
import { TableFieldForm } from "@/components/TableFieldForm";
import { TitleLabel } from "@/components/TitleLabel";

import axios from "axios";

import { TableForm } from "@/components/TableForm";
import { failedMessage } from "@/lib/helper";
import { FullscreenLoader } from "@/components/FullScreenLoader";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { file, config } = usePdfStore();
  const field = useActiveFieldBoxStore((state) => state.field);
  const { isLoading, setIsLoading } = useFullScreenLoadingStore();
  // useEffect(() => {
  //   const handleBeforeUnload = (e: any) => {
  //     if (!file) return;
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [file]);

  const handleExport = async () => {
    setIsLoading(true);

    const newHeaderFields = config.sections.header.fields.map((field) => ({
      name: field.name,
      classified: {
        method: field.classified.method,
        data: field.classified.data,
        is_multiword: field.classified.isMultiword ?? false,
      },
    }));

    const newTableHeader = config.sections.table.tableHeader.map((h) => ({
      name: h.name,
      type: h.type,
    }));

    const newTableConfig = {
      table_header: newTableHeader,
      extract_fields: config.sections.table.extractFields,
    };

    const newHeaderConfig = {
      fields: newHeaderFields,
    };

    const newSections = {
      header: newHeaderConfig,
      table: newTableConfig,
    };

    const newConfig = {
      exported_name: config.exportedName,
      sections: newSections,
    };

    console.log(newConfig);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("config_str", JSON.stringify(newConfig));

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

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const contentDisposition = response.headers["content-disposition"];
      let filename = `${config.exportedName}.xlsx`;
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
    } catch (err: any) {
      console.error("Upload error:", err);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {isLoading && <FullscreenLoader />}
      {field && <DrawingModeBanner />}
      <div className="w-1/2 border-r flex flex-col max-w-1/2">
        <PDFAnnotator />
      </div>

      {/* Sidebar Panel */}
      {file ? (
        <div className="w-1/2 bg-gray-50 flex flex-col h-full z-50">
          <TitleLabel
            title={config.exportedName ? config.exportedName : "Title Here"}
          />
          <div className="flex-grow overflow-auto p-4 pb-10">
            <div className=" p-2 ">
              <h2 className=" font-semibold text-xl">Header</h2>
            </div>
            <div className=" flex flex-col gap-6">
              {config.sections.header.fields.map((field) => {
                let icon;
                let description;
                switch (field.classified.method) {
                  case ClassifiedTypeEnum.KEYWORD:
                    icon = <ScanText className="w-5 h-5 text-gray-600" />;
                    description =
                      "Enter a keyword that indicates to section : ";
                    break;
                  case ClassifiedTypeEnum.BOX:
                    icon = <Brackets className="w-5 h-5 text-gray-600" />;
                    description = "use draw mode to locate : ";
                    break;
                  case ClassifiedTypeEnum.LINE:
                    icon = <Type className="w-5 h-5 text-gray-600" />;
                    description =
                      "Specify the line range (from which row to which row) to locate : ";

                    break;
                }

                return (
                  <HeaderField
                    key={field.name}
                    field={field}
                    icon={icon}
                    description={description}
                  />
                );
              })}
            </div>
            <div>
              <TableForm />
              <div className=" flex flex-col gap-6">
                {config.sections.table.tableHeader.map((field) => {
                  return <TableFieldForm key={field.name} field={field} />;
                })}
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-end gap-2">
            <Button variant={"secondary"} className=" px-8">
              Data result
            </Button>
            <Button onClick={handleExport} className=" px-8">
              Export!
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-1/2 bg-gray-50 items-center justify-center flex flex-col h-full z-50">
          <p className=" text-2xl font-semibold">Upload file first</p>
        </div>
      )}
    </div>
  );
}
