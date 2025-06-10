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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TitleLabel } from "@/components/TitleLabel";

import { useEffect } from "react";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { file, config } = usePdfStore();
  const field = useActiveFieldBoxStore((state) => state.field);

  useEffect(() => {
    const handleBeforeUnload = (e : any) => {
      if (!file) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [file]);

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {field && <DrawingModeBanner />}
      {/* PDF Preview Area */}
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
              <div className=" p-2 ">
                <h2 className=" font-semibold text-xl">Products / Table</h2>
              </div>
              <div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mb-3">
                  <div className="space-y-0.5">
                    <Label>Has column "No"</Label>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
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
            <Button
              onClick={() => {
                console.log(file);
                console.log(config);
              }}
              className=" px-8"
            >
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
