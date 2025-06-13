import { X } from "lucide-react";
import { EditorMode, useModeStore } from "@/store/useModeStore";

export const ModeBanner = () => {
  const { setMode, getCurrentMode } = useModeStore();

  const title =
    getCurrentMode() == EditorMode.DrawBox
      ? "Drawing mode active"
      : "Drag & Drop mode active";

  if (getCurrentMode() === EditorMode.Cursor) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="bg-blue-400 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-4 animate-fade-in-down">
        <span className="font-semibold">{title}</span>
        {/* <button
          onClick={() => {
            console.log("hello")
            setMode(EditorMode.Cursor);
          }}
          className="ml-auto hover:text-gray-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button> */}
      </div>
    </div>
  );
};
