import { ArrowLeft } from "lucide-react";

export const BackButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 text-gray-600 hover:text-black"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};
