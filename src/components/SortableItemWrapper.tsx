import type { PdfItem } from "@/store/usePdfStore";
import { useSortable } from "@dnd-kit/sortable";
import type { ReactNode } from "react";

export const SortableItemWrapper = ({
  pdf,
  groupId,
  children,
}: {
  pdf: PdfItem;
  groupId: string;
  children: (args: {
    setHandleRef: (el: HTMLElement | null) => void;
    listeners: any;
    attributes: any;
  }) => ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef } =
    useSortable({
      id: pdf.id,
      data: {
        type: "file",
        groupId,
        pdfId: pdf.id,
      },
      transition: null,
      animateLayoutChanges: () => false,
    });

  return (
    <div ref={setNodeRef}>
      {children({
        setHandleRef: setActivatorNodeRef,
        listeners,
        attributes,
      })}
    </div>
  );
};
