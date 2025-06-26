import { ArrowRight } from "lucide-react";
import { type ButtonHTMLAttributes } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const ActionButton = ({ children, ...props }: ActionButtonProps) => {
  return (
    <button
      className="flex items-center gap-2 border border-sky-400 text-sky-600 bg-white hover:bg-sky-100 hover:text-sky-700 px-6 py-1 rounded-lg text-lg font-medium shadow-sm transition-all duration-200"
      {...props}
    >
      {children}
    </button>
  );
};
