import { PDFAnnotator } from "@/components/PdfAnnotator";
import { Button } from "@/components/ui/button";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Brackets, ScanText, Type } from "lucide-react";
import { HeaderField } from "@/components/HeaderField";
import { TableFieldForm } from "@/components/TableFieldForm";

import { TableForm } from "@/components/TableForm";
import { useCurrentPdf } from "@/hooks/useCurrentPdf";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { UploadPage } from "@/components/UploadPage";
import { PdfListSheet } from "@/components/PdfListSheet";
import { EditorMode, useModeStore } from "@/store/useModeStore";
import { ModeBanner } from "@/components/ModeBanner";

export const Route = createFileRoute("/view")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pdf, config, file } = useCurrentPdf();

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

  if (!pdf || !config || !file) return <UploadPage />;

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      <PdfListSheet />

      <ModeBanner />
      <div className=" w-full h-full flex">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px]  rounded-lg border"
        >
          <ResizablePanel defaultSize={70}>
            <div className=" flex- flex-col h-full">
              <PDFAnnotator />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} maxSize={40} minSize={25}>
            {file ? (
              <div className="flex flex-col h-full z-50">
                <h1 className=" p-2 text-xl font-semibold">
                  {config.fileName ? config.fileName : "PDF File Name"}
                </h1>
                <div className="flex-grow overflow-auto p-4 pb-10">
                  <div className=" p-2 ">
                    <h2 className=" font-semibold text-lg">Header Sections</h2>
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
                        return (
                          <TableFieldForm key={field.name} field={field} />
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* <div className="p-4 flex justify-end gap-2">
                  <Button className=" px-8">Save Config</Button>
                </div> */}
              </div>
            ) : (
              <div className="w-1/2 bg-gray-50 items-center justify-center flex flex-col h-full z-50">
                <p className=" text-2xl font-semibold">Upload file first</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Sidebar Panel */}
      </div>
    </div>
  );
}
