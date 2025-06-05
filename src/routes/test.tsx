import { TagEdit } from "@/components/input/TagEdit";
import { PDFAnnotator } from "@/components/PdfAnnotator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { useActiveFieldStore } from "@/store/useActiveFieldStore";
import { createFileRoute } from "@tanstack/react-router";
import { Brackets, EllipsisVertical, Hash, ScanText, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid"; // atau pakai uuid kalau kamu prefer
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
      <div className="w-1/2 border-r flex flex-col">
        <div className="p-4 flex-shrink-0">
          <h2 className="text-xl font-semibold mb-2">PDF Annotator</h2>
        </div>
        <div className="flex-grow overflow-auto p-4 flex items-center justify-center">
          <PDFAnnotator />
        </div>
      </div>

      {/* Sidebar Panel */}
      <div className="w-1/2 bg-gray-50 flex flex-col h-full">
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
                    "Enter a keyword that indicates this section is : ";
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
        <div className="p-4 flex justify-end">
          <Button className=" px-8">Save Config</Button>
        </div>
      </div>
    </div>
  );
}
