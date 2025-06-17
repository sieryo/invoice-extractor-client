import { useModeStore } from "@/store/useModeStore";
import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
import { useSortable } from "@dnd-kit/sortable";
import { SidebarOptions, type SidebarOptionsProps } from "./SidebarOptions";
import { cn } from "@/lib/utils";
import { File, GripIcon } from "lucide-react";
import { successMessage } from "@/lib/helper";

export const SidebarItems = ({
  pdf,
  groupId,
  isDragging,
}: {
  pdf: PdfItem;
  groupId: string;
  isDragging: boolean;
}) => {
  const { current, setCurrent, getGroup, setPdfs } = usePdfStore();
  const { setField } = useModeStore();

  const { attributes, listeners, setNodeRef } = useSortable({
    id: pdf.id,
    data: {
      type: "file",
      groupId,
      pdfId: pdf.id,
    },
  });

  const isActive = current?.pdfId === pdf.id;

  const handleClickItem = () => {
    setCurrent(pdf.id, groupId);
    setField(null);
  };

  const handleDeleteFile = () => {
    const currentGroup = getGroup(groupId);

    if (!currentGroup) return;

    const newPdfs = [...currentGroup.pdfs].filter((p) => p.id != pdf.id);

    successMessage("Successfully deleted file");

    setPdfs(groupId, newPdfs);
  };

  const option: SidebarOptionsProps[] = [
    {
      label: "Delete file",
      onClick: handleDeleteFile,
      isVisible: true,
      type: "destroy",
    },
  ];

  return (
    <div ref={setNodeRef} onClick={handleClickItem} className=" py-0.5">
      <div
        className={cn(
          "flex items-center justify-between pl-11 pr-1 py-1.5 group cursor-default transition-colors duration-150",
          isActive ? "bg-gray-300" : "hover:bg-gray-100",
          isDragging && "opacity-30"
        )}
      >
        <div className="flex items-center gap-2 w-full">
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={(e) => e.stopPropagation()}
            className=" p-1 rounded cursor-default "
            title="Drag to reorder"
          >
            <GripIcon
              className={cn(
                "w-4 h-4 text-gray-400",
                isActive && "text-gray-700"
              )}
            />
          </div>

          <span
            className={cn(
              "text-xs truncate flex-1 font-semibold select-none",
              isActive ? "text-gray-900" : "text-gray-700"
            )}
          >
            {pdf.fileName}
          </span>

          <div className="ml-auto">
            <SidebarOptions options={option} />
          </div>
        </div>
      </div>
    </div>
  );
};
