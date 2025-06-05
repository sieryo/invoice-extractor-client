import { PDFAnnotator } from "@/components/PdfAnnotator";
import { Button } from "@/components/ui/button";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { createFileRoute } from "@tanstack/react-router";
import { Brackets, ScanText, Type } from "lucide-react";
import { usePdfStore } from "@/store/usePdfStore";
import { HeaderField } from "@/components/HeaderField";
import { TableForm } from "@/components/TableForm";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { config } = usePdfStore();

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {/* PDF Preview Area */}
      <div className="w-1/2 border-r flex flex-col max-w-1/2">
        <PDFAnnotator />
      </div>

      {/* Sidebar Panel */}
      <div className="w-1/2 bg-gray-50 flex flex-col h-full z-50">
        <div className=" p-1.5 ">
          <h1 className=" font-bold text-2xl">TRANSAKSI 02 MEI 2025</h1>
        </div>
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
          <TableForm />
        </div>
        <div className="p-4 flex justify-end gap-2">
          <Button
          variant={"secondary"}
          className=" px-8">Data result</Button>
          <Button className=" px-8">Export!</Button>
        </div>
      </div>
    </div>
  );
}
