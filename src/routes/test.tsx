import { FormFormat } from "@/components/FormFormat";
import { PDFAnnotator } from "@/components/PdfAnnotator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassifiedTypeEnum } from "@/models/pdfConfig";
import { useActiveFieldStore } from "@/store/useActiveFieldStore";
import { createFileRoute } from "@tanstack/react-router";
import { Brackets } from "lucide-react";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const { field, setActive } = useActiveFieldStore();
  return (
    <div className="w-full h-screen bg-gray-100 flex">
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
      <div className="w-1/2 bg-gray-100 flex flex-col">
        <div className="p-4 flex-shrink-0">
          <Button
            className={`${field === "buyer_address" ? "bg-amber-500" : ""}`}
            variant="default"
            onClick={() => {
              if (field === "buyer_address") {
                setActive("", null);
              } else {
                setActive("buyer_address", ClassifiedTypeEnum.BOX);
              }
            }}
          >
            <Brackets />
          </Button>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <FormFormat />
        </div>
      </div>
    </div>
  );
}
