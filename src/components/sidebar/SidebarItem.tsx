import { useModeStore } from "@/store/useModeStore";
import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
import { useSortable } from "@dnd-kit/sortable";
import { SidebarOptions, type SidebarOptionsProps } from "./SidebarOptions";
import { cn } from "@/lib/utils";
import { GripIcon } from "lucide-react";
import { successMessage } from "@/lib/helper";
import { deletePdfFile } from "@/lib/pdfFileStorage";

export const SidebarItems = ({
  pdf,
  groupId,
  setGroupSelected,
}: {
  pdf: PdfItem;
  groupId: string;
  groupSelected: boolean;
  setGroupSelected: (val: string) => void;
}) => {
  const { current, setCurrent, getGroup, setPdfs } = usePdfStore();
  const { setField } = useModeStore();

  const isActive = current?.pdfId === pdf.id;
  const { attributes, listeners, setNodeRef } = useSortable({
    id: pdf.id,
    data: {
      type: "file",
      groupId,
      pdfId: pdf.id,
    },
  });

  const handleClickItem = () => {
    setGroupSelected("");
    setCurrent(pdf.id, groupId);
    setField(null);
  };

  const handleDeleteFile = async () => {
    const currentGroup = getGroup(groupId);

    await deletePdfFile(pdf.id)

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
    <div className=" my-1">
      <div
        ref={setNodeRef}
        onMouseDown={handleClickItem}
        className={cn(
          "flex items-center justify-between pl-8 pr-1 py-1.5 rounded-sm group cursor-default",
          isActive ? "bg-slate-300" : "hover:bg-slate-300"
        )}
      >
        <div {...listeners} {...attributes} className=" flex-1">
          <div className="flex items-center gap-2 w-full">
            <div
              ref={setNodeRef}
              className=" p-1 rounded cursor-default "
              title="Drag to reorder"
            >
              <GripIcon
                className={cn(
                  "w-4 h-4 text-gray-400",
                  isActive && "text-blue-500"
                )}
              />
            </div>

            <span
              className={cn(
                "text-xs truncate flex-1 font-semibold select-none ",
                isActive ? "text-gray-900" : "text-gray-700"
              )}
            >
              {pdf.fileName}
            </span>
          </div>
        </div>
        <div className=" ">
          <SidebarOptions options={option} />
        </div>
      </div>
    </div>
  );
};
