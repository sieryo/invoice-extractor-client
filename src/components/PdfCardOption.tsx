import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DropdownItemDelete } from "./dropdownFile/DropdownItemDelete";
import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
import { useCopyConfigStore } from "@/store/useCopyConfigStore";
import { toast } from "sonner";

export const PdfCardOption = ({ pdf }: { pdf: PdfItem }) => {
  const { updateConfig } = usePdfStore();
  const { sections, setSections } = useCopyConfigStore();

  const dropdownItem = [
    {
      title: "Copy Config",
      onClick: () => {
        console.log("Function copy config...");
      },
      type: "mutate",
    },
    {
      title: "Download Config",
      onClick: () => {
        console.log("Function download config...");
      },
      type: "download",
    },
    {
      title: "Delete File",
      onClick: () => {
        console.log("Function delete pdf...");
      },
      type: "delete",
    },
  ];

  const handleCopyConfig = () => {
    const clonedSections = structuredClone(pdf.config.sections);

    setSections(clonedSections);
  };

  const handlePasteConfig = () => {
    if (!sections) return;

    const newConfig = {
      ...pdf.config,
      sections: sections,
    };

    toast.success("Config has been pasted successfully", {
      position: "top-center",
      richColors: true,
    });
    updateConfig(pdf.id, newConfig);
  };

  return (
    <div className=" pt-1 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className=" cursor-pointer">
          <EllipsisVertical className="w-4 h-4 text-gray-900" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              handleCopyConfig();
            }}
          >
            Copy Config
          </DropdownMenuItem>
          {sections && (
            <DropdownMenuItem
              onClick={() => {
                handlePasteConfig();
              }}
            >
              Paste Config
            </DropdownMenuItem>
          )}
          <DropdownItemDelete id={pdf.id} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
