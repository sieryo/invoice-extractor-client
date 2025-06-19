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
  type Active,
  type Over,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";
import { DropIndicator } from "./DropIndicator";
import { SidebarGroup } from "./sidebar/SidebarGroup";
import { SortableGroupWrapper } from "./SortableGroupWrapper";
import { AddGroup } from "./AddGroup";
import {
  getFolderNameFromPath,
  traverseFileTree,
} from "@/utils";
import { successMessage } from "@/utils/message";
import { X } from "lucide-react";
import { deletePdfFile } from "@/lib/pdfFileStorage";

export const SidebarWorkspace = () => {
  const {
    groups,
    current,
    setGroups,
    getGroup,
    setPdfs,
    setCurrent,
    addGroupWithPdfs,
  } = usePdfStore();
  const [active, setActive] = useState<Active | null>(null);
  const [over, setOver] = useState<Over | null>(null);

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  // DRAG N DROP FOLDER FROM LOCAL

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const items = e.dataTransfer.items;
    if (items.length !== 1) return;

    const item = items[0];
    const entry = item.webkitGetAsEntry?.();
    if (!entry || !entry.isDirectory) return;

    const allFiles: File[] = await traverseFileTree(entry);

    if (allFiles.length <= 0) return;

    // @ts-expect-error
    const groupIdentifier = getFolderNameFromPath(allFiles[0].relativePath);
    addGroupWithPdfs(allFiles, groupIdentifier);
  };

  const handleGroupDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActive(active);
  };

  const handleGroupDragOver = (event: DragOverEvent) => {
    const { over } = event;

    setOver(over);
  };

  const handleDeleteAllGroup = async () => {
    await Promise.all(
      groups.flatMap((group) => group.pdfs.map((pdf) => deletePdfFile(pdf.id)))
    );

    setGroups([]);
    setCurrent("", "");
    successMessage("Successfully deleted all groups");
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActive(null);
    setOver(null);

    if (!over || active.id === over.id) return;

    const overId = over.id;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle file -> file
    if (activeData?.type === "file" && overData?.type === "file") {
      const fromGroupId = activeData.groupId;
      const toGroupId = overData.groupId;
      const pdfId = activeData.pdfId;
      const targetPdfId = overData.pdfId;

      const fromGroup = getGroup(fromGroupId);
      const toGroup = getGroup(toGroupId);

      if (!fromGroup || !toGroup) return;

      const pdfToMove = fromGroup.pdfs.find((p) => p.id === pdfId);
      if (!pdfToMove) return;

      let newFromPdfs = fromGroup.pdfs.filter((p) => p.id !== pdfId);

      const targetIndex = toGroup.pdfs.findIndex((p) => p.id === targetPdfId);

      let newToPdfs = [...toGroup.pdfs];

      if (fromGroupId !== toGroupId) {
        newToPdfs.splice(targetIndex + 1, 0, pdfToMove);
        setPdfs(fromGroupId, newFromPdfs);
        setPdfs(toGroupId, newToPdfs);

        setCurrent(pdfId, toGroupId);
      } else {
        const oldIndex = fromGroup.pdfs.findIndex((p) => p.id === pdfId);
        const newIndex = targetIndex;

        const reordered = arrayMove(fromGroup.pdfs, oldIndex, newIndex);
        setPdfs(fromGroupId, reordered);
      }
    }

    // Handle file -> group
    if (activeData?.type === "file" && overData?.type === "group") {
      const fromGroupId = activeData.groupId;
      const pdfId = activeData.pdfId;
      const toGroupId = overId.toString();

      if (fromGroupId === toGroupId) return;

      const fromGroup = getGroup(fromGroupId);
      const toGroup = getGroup(toGroupId);

      if (!fromGroup || !toGroup) return;

      const pdfToMove = fromGroup.pdfs.find((p) => p.id === pdfId);
      if (!pdfToMove) return;

      const newFromPdfs = fromGroup.pdfs.filter((p) => p.id !== pdfId);
      setPdfs(fromGroupId, newFromPdfs);

      const newToPdfs = [...toGroup.pdfs, pdfToMove];
      setPdfs(toGroupId, newToPdfs);

      setCurrent(pdfId, toGroupId);
    }
    // handle group -> group
    if (activeData?.type === "group" && overData?.type === "group") {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      setGroups(newGroups);
    }
  };

  const getIndex = (id: string | null) => groups.findIndex((g) => g.id === id);

  return (
    <div className="bg-white text-gray-900  h-full flex flex-col px-2   ">
      <div className=" flex justify-between items-center px-4 py-2  ">
        <div className=" text-lg font-semibold">Groups</div>
        <div className=" relative flex gap-2">
          {/* <div>
            <BaseFileUploader />
            <Plus className=" w-6 h-6 text-gray-800" />
          </div> */}
          <div>
            <AddGroup />
          </div>
          <div>
            <X
              onClick={() => {
                handleDeleteAllGroup();
              }}
              className=" w-6 h-6 text-red-500"
            />
          </div>
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex-1 overflow-y-auto overflow-x-hidden pb-10 mt-3"
      >
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
            {groups.map((group, idx) => {
              const activeId = active ? active.id : "";
              const overId = over ? over.id : "";

              const activeData = active?.data.current;
              const overData = over?.data.current;
              let activeType = activeData?.type;
              let overType = overData?.type;
              let placeIndicatorAbove = false;
              let isOver = false;

              // (Active type file to group yang berbeda)
              // Menyalakan Drop indicator bawah folder
              if (activeData?.type == "file" && overData?.type == "group") {
                isOver = overId === group.id && activeData.groupId !== overId;
              } else if (activeType == "group" && overType == "group") {
                isOver = overId === group.id && activeId !== overId;
                const activeIndex = getIndex(activeId.toString());
                const overIndex = getIndex(overId.toString());
                placeIndicatorAbove = activeIndex > overIndex;
              }

              const isShowGroupDropIndicator =
                isOver && activeType == "group" && overType == "group";

              return (
                <React.Fragment key={group.id}>
                  {isShowGroupDropIndicator && placeIndicatorAbove && (
                    <DropIndicator />
                  )}

                  <SortableGroupWrapper group={group}>
                    {({ setHandleRef, listeners, attributes }) => (
                      <div>
                        <SidebarGroup
                          group={group}
                          order={idx + 1}
                          dragHandleProps={{
                            setHandleRef,
                            listeners,
                            attributes,
                          }}
                          selected={selectedGroupId == group.id}
                          setSelected={setSelectedGroupId}
                          isDragging={group.id === activeId}
                          isActive={current?.groupId === group.id}
                          dropIndicator={{
                            isOver: isOver,
                            placement: placeIndicatorAbove ? "top" : "bottom",
                            activeType: activeType,
                            overType: overType,
                          }}
                          // @ts-expect-error
                          activeFileId={
                            activeData?.type === "file" ? active?.id : null
                          }
                          // @ts-expect-error
                          overFileId={
                            overData?.type === "file" ? over?.id : null
                          }
                        />
                      </div>
                    )}
                  </SortableGroupWrapper>

                  {isShowGroupDropIndicator && !placeIndicatorAbove && (
                    <DropIndicator />
                  )}
                </React.Fragment>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
