import { PDFAnnotator } from "@/components/PdfAnnotator";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { createFileRoute } from "@tanstack/react-router";
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
import { ModeBanner } from "@/components/ModeBanner";
import { SidebarWorkspace } from "@/components/SidebarWorkspace";

export const Route = createFileRoute("/workspace")({
  component: RouteComponent,
});

function RouteComponent() {
  const { group, id } = useCurrentPdf();

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

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      <ModeBanner />
      <div className=" w-full h-full flex">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[200px]  rounded-lg border"
        >
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className=" flex flex-col h-full ">
              <SidebarWorkspace />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50}>
            <div className=" flex- flex-col h-full">
              <PDFAnnotator />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} maxSize={25} minSize={22}>
            {/* <FileUploader /> */}
            {id ? (
              <div className="flex flex-col h-full z-50 bg-white">
                <div className="flex-grow overflow-auto p-4 pb-10">
                  <div className=" p-2 ">
                    <h2 className=" font-semibold text-xl">Header Sections</h2>
                  </div>
                  <div className=" flex flex-col gap-6">
                    {group &&
                      group.config.sections.header.fields.map((field) => {
                        let icon;
                        let description;
                        switch (field.classified.method) {
                          case ClassifiedTypeEnum.KEYWORD:
                            icon = (
                              <ScanText className="w-5 h-5 text-gray-600" />
                            );
                            description =
                              "Enter a keyword that indicates to section : ";
                            break;
                          case ClassifiedTypeEnum.BOX:
                            icon = (
                              <Brackets className="w-5 h-5 text-gray-600" />
                            );
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
                      {group &&
                        group.config.sections.table.tableHeader.map((field) => {
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
              <div className="w-full bg-gray-50 items-center justify-center flex flex-col h-full z-50">
                <p className=" text-2xl font-semibold">File not selected</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Sidebar Panel */}
      </div>
    </div>
  );
}
