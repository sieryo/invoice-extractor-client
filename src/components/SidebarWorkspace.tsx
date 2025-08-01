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
import { PdfStoreManager } from "@/managers/PdfStoreManager";
import { handleActionWithToast } from "@/utils/withToast";
import { getFolderNameFromPath, traverseFileTree } from "@/utils";
import { successMessage } from "@/utils/message";
import { BackButton } from "./BackButton";
import { useRouter } from "@tanstack/react-router";
import { DialogConfirm } from "./DialogConfirm";
import { TrashIconButton } from "./icon/TrashIconButton";
import { cn } from "@/lib/utils";
import { BaseFolderUploader } from "./BaseFolderUploader";
import { FolderUp } from "lucide-react";

export const SidebarWorkspace = () => {
  const { groups, current, setGroups, getGroup, setPdfs, setCurrent } =
    usePdfStore();
  const [active, setActive] = useState<Active | null>(null);
  const [over, setOver] = useState<Over | null>(null);

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [isUserDragging, setIsUserDragging] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.navigate({
      to: "/",
    });
  };

  // DRAG N DROP FOLDER FROM LOCAL

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsUserDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsUserDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    console.log("kesini!");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    try {
      const items = e.dataTransfer.items;
      const files = Array.from(e.dataTransfer.files);
      console.log(files);
      const pdfFiles = files.filter((f) => f.type === "application/pdf");

      if (pdfFiles.length != 0) return;

      const item = items[0];
      const entry = item.webkitGetAsEntry?.();

      const allFiles: File[] = await traverseFileTree(entry);

      if (allFiles.length <= 0) return;

      // @ts-expect-error
      const groupIdentifier = getFolderNameFromPath(allFiles[0].relativePath);
      PdfStoreManager.addGroupWithPdfs(allFiles, groupIdentifier);
      successMessage("Folder uploaded successfully");
    } catch (err) {
    } finally {
      setIsUserDragging(false);
    }
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
    await handleActionWithToast(() => PdfStoreManager.deleteAllGroup(), {
      successMsg: "Successfully deleted all groups",
    });
  };

  const handleGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActive(null);
    setOver(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "file" && overData?.type === "file") {
      handleFileToFile(activeData, overData);
    }

    if (activeData?.type === "file" && overData?.type === "group") {
      handleFileToGroup(activeData, over.id.toString());
    }

    if (activeData?.type === "group" && overData?.type === "group") {
      handleGroupToGroup(active.id.toString(), over.id.toString());
    }
  };

  function handleFileToFile(activeData: any, overData: any) {
    const { groupId: fromGroupId, pdfId } = activeData;
    const { groupId: toGroupId, pdfId: targetPdfId } = overData;

    const fromGroup = getGroup(fromGroupId);
    const toGroup = getGroup(toGroupId);
    if (!fromGroup || !toGroup) return;

    const pdfToMove = fromGroup.pdfs.find((p) => p.id === pdfId);
    if (!pdfToMove) return;

    if (fromGroupId !== toGroupId) {
      const newFromPdfs = fromGroup.pdfs.filter((p) => p.id !== pdfId);
      const targetIndex = toGroup.pdfs.findIndex((p) => p.id === targetPdfId);
      const newToPdfs = [...toGroup.pdfs];
      newToPdfs.splice(targetIndex + 1, 0, pdfToMove);

      setPdfs(fromGroupId, newFromPdfs);
      setPdfs(toGroupId, newToPdfs);
      setCurrent(pdfId, toGroupId);
    } else {
      const oldIndex = fromGroup.pdfs.findIndex((p) => p.id === pdfId);
      const newIndex = toGroup.pdfs.findIndex((p) => p.id === targetPdfId);
      if (oldIndex < 0 || newIndex < 0) return;

      const reordered = arrayMove(fromGroup.pdfs, oldIndex, newIndex);
      setPdfs(fromGroupId, reordered);
    }
  }

  function handleFileToGroup(activeData: any, toGroupId: string) {
    const { groupId: fromGroupId, pdfId } = activeData;

    if (fromGroupId === toGroupId) return;

    const fromGroup = getGroup(fromGroupId);
    const toGroup = getGroup(toGroupId);
    if (!fromGroup || !toGroup) return;

    const pdfToMove = fromGroup.pdfs.find((p) => p.id === pdfId);
    if (!pdfToMove) return;

    const newFromPdfs = fromGroup.pdfs.filter((p) => p.id !== pdfId);
    const newToPdfs = [...toGroup.pdfs, pdfToMove];

    setPdfs(fromGroupId, newFromPdfs);
    setPdfs(toGroupId, newToPdfs);
    setCurrent(pdfId, toGroupId);
  }

  function handleGroupToGroup(activeId: string, overId: string) {
    const oldIndex = groups.findIndex((g) => g.id === activeId);
    const newIndex = groups.findIndex((g) => g.id === overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const newGroups = arrayMove(groups, oldIndex, newIndex);
    setGroups(newGroups);
  }

  const getIndex = (id: string | null) => groups.findIndex((g) => g.id === id);

  return (
    <div className="bg-white text-gray-900  h-full flex flex-col px-2   ">
      <DialogConfirm
        isOpen={showConfirm}
        setIsOpen={setShowConfirm}
        title="Delete ALL group?"
        description="This action cannot be undone."
        onConfirm={() => handleDeleteAllGroup()}
      />
      <div className=" flex justify-between items-center px-4 py-2  ">
        <div className=" text-lg font-semibold flex items-center  gap-4">
          <BackButton
            onClick={() => {
              handleBack();
            }}
          />
          <div>Workspace</div>
        </div>
        <div className=" flex gap-3 items-center justify-center">
          <div className=" relative flex gap-2 ">
            <TrashIconButton
              onClick={() => {
                setShowConfirm(true);
              }}
            />
          </div>
          <div className=" relative flex gap-2 items-center ">
            <div className="p-1.5 rounded-md  hover:bg-sky-100 transition-all duration-200 text-sky-500 hover:text-sky-600">
              <BaseFolderUploader />
              <FolderUp className=" w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      {groups.length == 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden pb-10 mt-3 transition ",
            isUserDragging && " bg-slate-200"
          )}
        >
          <div
            className={cn(" w-full h-full flex items-center justify-center")}
          >
            <div className=" text-lg text-gray-800 text-center">
              Empty Workspace
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden pb-10 mt-3 transition ",
            isUserDragging && " bg-slate-200"
          )}
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
      )}
    </div>
  );
};
