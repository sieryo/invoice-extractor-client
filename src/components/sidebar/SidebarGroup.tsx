import { cn } from "@/lib/utils";
import { usePdfStore, type PdfGroup } from "@/store/usePdfStore";
import { ChevronDown, ChevronUp, Folder, Plus } from "lucide-react";
import { SidebarOptions} from "./SidebarOptions";
import { useRef, useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SidebarItems } from "./SidebarItem";
import { useCopyConfigStore } from "@/store/useCopyConfigStore";
import { DropIndicator } from "../DropIndicator";
import { BaseFileUploader } from "../BaseFileUploader";
import { DialogRenameGroup } from "../DialogRenameGroup";
import { PdfStoreManager } from "@/managers/PdfStoreManager";
import { handleActionWithToast } from "@/utils/withToast";
import { NotFoundError } from "@/errors";
import { handleBaseDrag, handlePdfFileDrop } from "@/helpers/handleDrop";
import { CopyConfigManager } from "@/managers/CopyConfigManager";
import { generateSidebarOptions } from "@/helpers/generateSidebarOptions";

export type DropType = "file" | "group";

export const SidebarGroup = ({
  group,
  dragHandleProps,
  isDragging,
  dropIndicator,
  activeFileId,
  overFileId,
  selected,
  setSelected,
}: {
  group: PdfGroup;
  dragHandleProps: {
    setHandleRef: (el: HTMLElement | null) => void;
    listeners: any;
    attributes: any;
  };
  isDragging?: boolean;
  isActive?: boolean;
  dropIndicator: {
    placement: "top" | "bottom";
    isOver: boolean;
    activeType: DropType;
    overType: DropType;
  };
  activeFileId: string | null;
  overFileId: string | null;
  order: number;
  selected: boolean;
  setSelected: (val: string) => void;
}) => {
  const { current } = usePdfStore();

  const [collapsed, setCollapsed] = useState(true);
  const { sections } = useCopyConfigStore();

  const [isDraggingToGroup, setIsDraggingToGroup] = useState(false);
  const dragCounter = useRef(0);

  const [isDialogRenameOpen, setIsDialogRenameOpen] = useState(false);

  const handleDialogRename = () => {
    setIsDialogRenameOpen(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    return handleBaseDrag(e, () => {
      dragCounter.current += 1;
      setIsDraggingToGroup(true);
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    return handleBaseDrag(e, () => {
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDraggingToGroup(false);
      }
    });
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    await handleActionWithToast(
      () =>
        handlePdfFileDrop(e, (files) => {
          return PdfStoreManager.addPdfs(files, group.id);
        }),
      {
        successMsg: "Files uploaded successfully",
        errorMap: new Map([[NotFoundError, "Group not found"]]),
      }
    );
  };

  const handleCopyConfig = () => {
    return CopyConfigManager.copy(group.config.sections);
  };

  const handlePasteConfig = async () => {
    await handleActionWithToast(() => CopyConfigManager.paste(group), {
      successMsg: "Config has been pasted successfully",
      errorMap: new Map([[NotFoundError, "Config not found"]]),
    });
  };

  const handleDeleteGroup = async () => {
    await handleActionWithToast(() => PdfStoreManager.deleteGroup(group.id), {
      successMsg: "Group Deleted Successfully",
      errorMap: new Map([[NotFoundError, "Group not found"]]),
    });
  };

  const options = generateSidebarOptions({
    onRename: handleDialogRename,
    onDeleteGroup: handleDeleteGroup,
    onPasteConfig: handlePasteConfig,
    onCopyConfig: handleCopyConfig,
    canPasteConfig: sections != null,
  });

  const handleSelectedGroup = () => {
    if (current?.groupId != group.id) {
      const pdfId = group.pdfs.at(0)?.id ?? "";
      PdfStoreManager.setCurrent(pdfId, group.id);
    }

    setSelected(group.id);
  };

  const getIndex = (id: string | null) =>
    group.pdfs.findIndex((g) => g.id === id);

  const handleSuccessUpload = () => {
    setCollapsed(false);
  };

  return (
    <div
      className={cn(
        " rounded-lg   ",
        isDragging &&
          !isDraggingToGroup &&
          "  disable-hover cursor-default bg-slate-200 ",
        selected && !isDraggingToGroup && " bg-slate-200"
      )}
      onDrop={handleDrop}
      onDragOver={handleBaseDrag}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <DialogRenameGroup
        isOpen={isDialogRenameOpen}
        setIsOpen={setIsDialogRenameOpen}
        currValue={group.identifier}
        groupId={group.id}
      />
      <div
        className={cn(
          "flex items-center group  rounded-t-lg  hover:bg-slate-200  text-xs font-bold uppercase text-gray-900",
          selected && "bg-slate-200",
          isDraggingToGroup && "bg-slate-300"
        )}
      >
        <div className=" items-center">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-gray-800"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>

        <div
          ref={dragHandleProps.setHandleRef}
          {...dragHandleProps.listeners}
          {...dragHandleProps.attributes}
          onMouseDown={handleSelectedGroup}
          className="flex-1 flex items-center px-1 py-2   gap-2 min-w-0 cursor-default "
        >
          <Folder className="w-4 h-4 inline" />
          <span className="text-xs truncate  flex-1 select-none ">
            {group.identifier}
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          <UploadWithGroupId
            onSuccessUpload={handleSuccessUpload}
            groupId={group.id}
          />
          <SidebarOptions isActive={true} options={options} />
        </div>
      </div>

      {dropIndicator.isOver &&
        dropIndicator.activeType == "file" &&
        dropIndicator.overType == "group" &&
        dropIndicator.placement == "bottom" && <DropIndicator />}
      <div className=" mt-1">
        {!collapsed && (
          <SortableContext
            items={group.pdfs.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
            disabled={dropIndicator.activeType == "group"}
          >
            {group.pdfs.map((pdf) => {
              const isOver =
                pdf.id === overFileId && activeFileId !== overFileId;

              const activeIndex = getIndex(activeFileId);
              const overIndex = getIndex(overFileId);
              const placeIndicatorAbove = activeIndex > overIndex;

              const isShowItemDropIndicator =
                dropIndicator.activeType == "file" &&
                dropIndicator.overType == "file";

              return (
                <div key={pdf.id}>
                  <div className=" pl-8">
                    {isOver &&
                      placeIndicatorAbove &&
                      isShowItemDropIndicator && <DropIndicator />}
                  </div>
                  <SidebarItems
                    pdf={pdf}
                    groupId={group.id}
                    groupSelected={selected}
                    setGroupSelected={setSelected}
                  />
                  <div className=" pl-8">
                    {isOver &&
                      !placeIndicatorAbove &&
                      isShowItemDropIndicator && <DropIndicator />}
                  </div>
                </div>
              );
            })}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

const UploadWithGroupId = ({
  onSuccessUpload,
  groupId,
}: {
  onSuccessUpload?: () => void;
  groupId: string;
}) => {
  return (
    <div className=" relative">
      <BaseFileUploader onSuccessUpload={onSuccessUpload} groupId={groupId} />
      <Plus className=" w-4 h-4 text-gray-800  opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
