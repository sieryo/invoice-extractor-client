import { Trash } from "lucide-react";

export const TrashIconButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="p-1.5 rounded-md hover:bg-red-100 transition-all duration-200 text-red-500 hover:text-red-600"
      aria-label="Delete"
    >
      <Trash className="w-5 h-5" />
    </div>
  );
};
