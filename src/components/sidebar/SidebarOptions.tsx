import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { DropdownItemDelete } from "../dropdownFile/DropdownItemDelete";

export type SidebarOptionsProps = {
  label: string;
  onClick: (e?: any) => void;
  isVisible: boolean;
  type: "default" | "destroy";
};

export const SidebarOptions = ({
  options,
}: {
  isActive?: boolean;
  options: SidebarOptionsProps[];
}) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "p-1 text-gray-800  opacity-0 group-hover:opacity-100 transition-opacity"
          )}
        >
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white text-gray-900 shadow-md">
        {options.map((opt) => {
          if (!opt.isVisible) return null;

          if (opt.type == "default") {
            return (
              <DropdownMenuItem onClick={opt.onClick}>
                {opt.label}
              </DropdownMenuItem>
            );
          } else if (opt.type == "destroy") {
            return (
              <DropdownItemDelete onClick={opt.onClick} label={opt.label} />
            );
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
