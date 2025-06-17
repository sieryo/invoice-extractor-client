import { cn } from "@/lib/utils";
import { usePdfStore, type PdfGroup } from "@/store/usePdfStore";
import { ChevronDown, ChevronUp, Folder, Plus } from "lucide-react";
import { SidebarOptions, type SidebarOptionsProps } from "./SidebarOptions";
import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SidebarItems } from "./SidebarItem";
import { useCopyConfigStore } from "@/store/useCopyConfigStore";
import { toast } from "sonner";
import { DropIndicator } from "../DropIndicator";
import { BaseFileUploader } from "../BaseFileUploader";
import { DialogRenameGroup } from "../DialogRenameGroup";
import { deletePdfFile } from "@/lib/pdfFileStorage";

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
  const { updateConfig, groups, setGroups, setCurrent, current } =
    usePdfStore();

  const [collapsed, setCollapsed] = useState(true);
  const { sections, setSections } = useCopyConfigStore();

  const [isDialogRenameOpen, setIsDialogRenameOpen] = useState(false);

  const handleDialogRename = () => {
    setIsDialogRenameOpen(true);
  };

  const handleCopyConfig = () => {
    const clonedSections = structuredClone(group.config.sections);

    setSections(clonedSections);
  };

  const handlePasteConfig = () => {
    if (!sections) return;

    const newConfig = {
      ...group.config,
      sections: sections,
    };

    toast.success("Config has been pasted successfully", {
      position: "top-center",
      richColors: true,
    });

    updateConfig(group.id, newConfig);
  };

  const handleDeleteGroup = async () => {
    await Promise.all(group.pdfs.map((pdf) => deletePdfFile(pdf.id)));

    const newGroups = [...groups].filter((g) => g.id != group.id);

    toast.success("Successfully deleted group", {
      position: "top-center",
      richColors: true,
    });

    setGroups(newGroups);
  };

  const options: SidebarOptionsProps[] = [
    {
      label: "Rename",
      onClick: handleDialogRename,
      isVisible: true,
      type: "default",
    },
    {
      label: "Copy Config",
      onClick: handleCopyConfig,
      isVisible: true,
      type: "default",
    },
    {
      label: "Paste Config",
      onClick: handlePasteConfig,
      isVisible: sections != null,
      type: "default",
    },
    {
      label: "Delete group",
      onClick: handleDeleteGroup,
      isVisible: true,
      type: "destroy",
    },
  ];

  const handleSelectedGroup = () => {
    if (current?.groupId != group.id) {
      const pdfId = group.pdfs.at(0)?.id ?? "";
      setCurrent(pdfId, group.id);
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
        " rounded-lg ",
        isDragging && "  disable-hover cursor-default bg-slate-200  ",
        selected && " bg-slate-200"
      )}
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
          selected && "bg-slate-200"
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
