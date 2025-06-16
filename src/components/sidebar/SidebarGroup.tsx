import { cn } from "@/lib/utils";
import { usePdfStore, type PdfGroup } from "@/store/usePdfStore";
import { ChevronDown, ChevronUp, Folder } from "lucide-react";
import { SidebarOptions, type SidebarOptionsProps } from "./SidebarOptions";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SidebarItems } from "./SidebarItem";
import { useCopyConfigStore } from "@/store/useCopyConfigStore";
import { toast } from "sonner";
import { DropIndicator } from "../DropIndicator";

export const SidebarGroup = ({
  group,
  dragHandleProps,
  isDragging,
}: {
  group: PdfGroup;
  dragHandleProps: {
    setHandleRef: (el: HTMLElement | null) => void;
    listeners: any;
    attributes: any;
  };
  isDragging?: boolean;
  isActive?: boolean;
}) => {
  const { updateConfig, groups, setGroups, setPdfs } = usePdfStore();

  const [collapsed, setCollapsed] = useState(false);
  const { sections, setSections } = useCopyConfigStore();

  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleItemDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItemId(active.id as string);
  };

  const handleItemDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id.toString() ?? null);
  };

  const handleItemDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItemId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = group.pdfs.findIndex((g) => g.id === active.id);
    const newIndex = group.pdfs.findIndex((g) => g.id === over.id);
    const newPdfs = arrayMove(group.pdfs, oldIndex, newIndex);

    setPdfs(group.id, newPdfs);
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

  const handleDeleteGroup = () => {
    const newGroups = [...groups].filter((g) => g.id != group.id);

    setGroups(newGroups);
  };

  const options: SidebarOptionsProps[] = [
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

  const getIndex = (id: string | null) =>
    group.pdfs.findIndex((g) => g.id === id);

  return (
    <div
      className={cn(
        " ",
        isDragging && "  disable-hover cursor-default bg-gray-300  "
      )}
    >
      <div
        className={cn(
          "flex items-center group px-1 py-2 hover:bg-gray-100 text-xs font-bold uppercase text-gray-900  gap-2"
        )}
      >
        <div className="">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-gray-800"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            )}
          </button>
        </div>

        <div
          ref={dragHandleProps.setHandleRef}
          {...dragHandleProps.listeners}
          {...dragHandleProps.attributes}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center gap-2 min-w-0 cursor-default "
        >
          <Folder className="w-4 h-4 inline" />
          <span className="text-xs truncate  flex-1 select-none ">
            {group.identifier}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SidebarOptions isActive={true} options={options} />
        </div>
      </div>

      {/* Items */}
      {!collapsed && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleItemDragEnd}
          onDragOver={handleItemDragOver}
          onDragStart={handleItemDragStart}
          sensors={sensors}
        >
          <SortableContext
            items={group.pdfs.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {group.pdfs.map((pdf) => {
              const isOver = overId === pdf.id && activeItemId !== overId;
              const activeIndex = getIndex(activeItemId);
              const overIndex = getIndex(overId);
              const placeIndicatorAbove = activeIndex > overIndex;

              return (
                <div key={pdf.id} className=" py-0.5">
                  <div className=" pl-8">
                    {isOver && placeIndicatorAbove && <DropIndicator />}
                  </div>
                  <SidebarItems pdf={pdf} groupId={group.id} isDragging={activeItemId == pdf.id} />
                  <div className=" pl-8">
                    {isOver && !placeIndicatorAbove && <DropIndicator />}
                  </div>
                </div>
              );
            })}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
