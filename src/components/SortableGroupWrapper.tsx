import type { PdfGroup } from "@/store/usePdfStore";
import { useSortable } from "@dnd-kit/sortable";
import type { ReactNode } from "react";

export const SortableGroupWrapper = ({
  group,
  children,
}: {
  group: PdfGroup;
  children: (args: {
    setHandleRef: (el: HTMLElement | null) => void;
    listeners: any;
    attributes: any;
  }) => ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
  } = useSortable({
    id: group.id,
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
