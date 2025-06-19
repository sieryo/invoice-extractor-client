import type { SidebarOptionsProps } from "@/components/sidebar/SidebarOptions";

export function generateSidebarOptions({
  onRename,
  onDeleteGroup,
  onPasteConfig,
  onCopyConfig,
  canPasteConfig,
}: {
  onRename: () => void;
  onDeleteGroup: () => Promise<void>;
  onPasteConfig: () => Promise<void>;
  onCopyConfig: () => void;
  canPasteConfig: boolean;
}): SidebarOptionsProps[] {
  return [
    {
      label: "Rename",
      onClick: onRename,
      isVisible: true,
      type: "default",
    },
    {
      label: "Copy Config",
      onClick: onCopyConfig,
      isVisible: true,
      type: "default",
    },
    {
      label: "Paste Config",
      onClick: onPasteConfig,
      isVisible: canPasteConfig,
      type: "default",
    },
    {
      label: "Delete group",
      onClick: onDeleteGroup,
      isVisible: true,
      type: "destroy",
    },
  ];
}
