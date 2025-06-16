import { Plus } from "lucide-react";
import { usePdfStore } from "@/store/usePdfStore";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import { BaseFileUploader } from "./BaseFileUploader";
import { DropIndicator } from "./DropIndicator";
import { SidebarGroup } from "./sidebar/SidebarGroup";
import { ExportTouchable } from "./ExportTouchable";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { SortableGroupWrapper } from "./SortableGroupWrapper";

export const SidebarWorkspace = () => {
  const { groups, current, setGroups } = usePdfStore();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const { setIsLoading } = useFullScreenLoadingStore();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleGroupDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // const group = groups.find((g) => g.id === active.id);
    setActiveGroupId(active.id as string);
  };

  const handleGroupDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id.toString() ?? null);
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveGroupId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = groups.findIndex((g) => g.id === active.id);
    const newIndex = groups.findIndex((g) => g.id === over.id);
    const newGroups = arrayMove(groups, oldIndex, newIndex);
    setGroups(newGroups);
  };

  const getIndex = (id: string | null) => groups.findIndex((g) => g.id === id);

  return (
    <div className="bg-white text-gray-900  h-full flex flex-col  ">
      <div className=" flex justify-between items-center px-4 py-2  ">
        <div className=" text-lg font-semibold">Groups</div>
        <div className=" relative">
          <BaseFileUploader />
          <Plus className=" w-4 h-4 text-gray-800" />
        </div>
        <div>
          <ExportTouchable
            onBeforeExport={() => {
              setIsLoading(true);
            }}
            onAfterExport={() => {
              setIsLoading(false);
            }}
          >
            <div className=" h-full  ">
              <div className=" p-2 px-6 bg-gray-900 text-gray-50 font-semibold rounded-md cursor-pointer ">
                Export
              </div>
            </div>
          </ExportTouchable>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-10 ">
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleGroupDragStart}
          onDragEnd={handleGroupDragEnd}
          onDragOver={handleGroupDragOver}
          sensors={sensors}
        >
          <SortableContext
            items={groups.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            {groups.map((group) => {
              const isOver = overId === group.id && activeGroupId !== overId;
              const activeIndex = getIndex(activeGroupId);
              const overIndex = getIndex(overId);
              const placeIndicatorAbove = activeIndex > overIndex;

              return (
                <React.Fragment key={group.id}>
                  {isOver && placeIndicatorAbove && <DropIndicator />}

                  <SortableGroupWrapper group={group}>
                    {({ setHandleRef, listeners, attributes }) => (
                      <div className=" py-0.5">
                        <SidebarGroup
                          group={group}
                          dragHandleProps={{
                            setHandleRef,
                            listeners,
                            attributes,
                          }}
                          isDragging={group.id === activeGroupId}
                          isActive={current?.groupId === group.id}
                        />
                      </div>
                    )}
                  </SortableGroupWrapper>

                  {isOver && !placeIndicatorAbove && <DropIndicator />}
                </React.Fragment>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
