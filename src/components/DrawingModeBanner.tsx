import { useState } from "react";
import { X } from "lucide-react";
import { useActiveFieldBoxStore } from "@/store/useActiveFieldBoxStore";

export const DrawingModeBanner = () => {
  const [visible, setVisible] = useState(true);
  const setField = useActiveFieldBoxStore((state) => state.setField);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
      <div className="bg-blue-400 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-4 animate-fade-in-down">
        <span className="font-semibold">Drawing mode active</span>
        <button
          onClick={() => {
            setVisible(false);
            setField(null);
          }}
          className="ml-auto hover:text-gray-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
