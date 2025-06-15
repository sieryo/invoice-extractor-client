import { FileText, EllipsisVertical } from "lucide-react";
import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModeStore } from "@/store/useModeStore";

export const SidebarWorkspace = () => {
  const { pdfs, setCurrentId, currentId } = usePdfStore();
  const { setField } = useModeStore();

  const handleClickItem = (id: string) => {
    setCurrentId(id);
    setField(null);
  };

  return (
    <div className=" bg-white text-gray-900 h-full flex flex-col border-r border-gray-200">
      <div className="px-4 py-2 text-sm font-semibold border-b border-gray-200">
        PDF List
      </div>
      <SidebarWorkspaceContent>
        {pdfs.map((pdf) => (
          <SidebarWorkspaceItem
            key={pdf.id}
            pdf={pdf}
            isActive={pdf.id === currentId}
            onClick={() => handleClickItem(pdf.id)}
          />
        ))}
      </SidebarWorkspaceContent>
    </div>
  );
};

const SidebarWorkspaceContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="">{children}</div>;
};

const SidebarWorkspaceItem = ({
  pdf,
  isActive,
  onClick,
}: {
  pdf: PdfItem;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 group",
        isActive && "bg-gray-200"
      )}
    >
      <div className="flex items-center gap-2 w-[90%]">
        <FileText className="w-4 h-4 text-gray-500" />
        <span
          className={cn(
            "text-sm truncate w-full",
            isActive ? "text-gray-900 font-semibold" : "text-gray-700"
          )}
        >
          {pdf.config.fileName}
        </span>
      </div>
      <SidebarWorkspaceOption pdf={pdf} />
    </div>
  );
};

const SidebarWorkspaceOption = ({ pdf }: { pdf: PdfItem }) => {
  const handleDelete = () => {
    console.log("Delete PDF", pdf.id);
  };

  const handleCopy = () => {
    console.log("Copy config", pdf.config);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-gray-900 shadow-md">
        <DropdownMenuItem onClick={handleCopy}>Copy Config</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
