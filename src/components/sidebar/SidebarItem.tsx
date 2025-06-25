import { useModeStore } from "@/store/useModeStore";
import { usePdfStore, type PdfItem } from "@/store/usePdfStore";
import { SidebarOptions, type SidebarOptionsProps } from "./SidebarOptions";
import { cn } from "@/lib/utils";
import { GripIcon } from "lucide-react";
import { handleActionWithToast } from "@/utils/withToast";
import { PdfStoreManager } from "@/managers/PdfStoreManager";
import { NotFoundError } from "@/errors";

export const SidebarItems = ({
  pdf,
  groupId,
  setGroupSelected,
  dragHandleProps,
  isDragging,
}: {
  pdf: PdfItem;
  groupId: string;
  groupSelected: boolean;
  dragHandleProps: {
    setHandleRef: (el: HTMLElement | null) => void;
    listeners: any;
    attributes: any;
  };
  setGroupSelected: (val: string) => void;
  isDragging: boolean;
}) => {
  const { current } = usePdfStore();
  const { setField } = useModeStore();

  const isActive = current?.pdfId === pdf.id;

  const handleClickItem = () => {
    setGroupSelected("");
    PdfStoreManager.setCurrent(pdf.id, groupId);
    setField(null);
  };

  const handleDeleteFile = async () => {
    await handleActionWithToast(
      () => PdfStoreManager.deletePdf(groupId, pdf.id),
      {
        successMsg: "File Deleted Successfully",
        errorMap: new Map([[NotFoundError, "Group not found"]]),
      }
    );
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
        onMouseDown={handleClickItem}
        className={cn(
          "items-center justify-between pl-8 pr-1 py-1.5 rounded-sm group cursor-default relative ",
          isActive && "bg-slate-300",
          !isDragging && "hover:bg-slate-300"
        )}
      >
        <div
          ref={dragHandleProps.setHandleRef}
          {...dragHandleProps.listeners}
          {...dragHandleProps.attributes}
        >
          <div className="flex items-center gap-2 min-w-0 pr-6  ">
            <div
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
                "text-xs truncate   font-semibold select-none",
                isActive ? "text-gray-900" : "text-gray-700"
              )}
            >
              {pdf.fileName}
            </span>
          </div>
        </div>
        <div className=" absolute right-0  top-[16%]">
          <SidebarOptions options={option} />
        </div>
      </div>
    </div>
  );
};
