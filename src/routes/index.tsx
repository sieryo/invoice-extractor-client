import { DialogRenameFaktur } from "@/components/DialogRenameFaktur";
import { DialogUpdateLawanTransaksi } from "@/components/DialogUpdateLawanTransaksi";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const router = useRouter();

  const handleGo = () => {
    router.navigate({
      to: "/workspace",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 text-5xl font-bold text-gray-900">Welcome</div>

      {/* Centered Action */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <button
          onClick={handleGo}
          className="flex items-center gap-2 bg-white hover:bg-indigo-100 border border-gray-300 px-6 py-3 rounded-lg text-lg font-medium text-indigo-600 shadow-sm transition"
        >
          Go to workspace
          <ArrowRight className="w-5 h-5" />
        </button>
      <div className="p-6 text-5xl font-bold text-gray-900">Or</div>

        <div className=" p-4 rounded-md flex gap-3">
          <DialogUpdateLawanTransaksi />
          <DialogRenameFaktur />
        </div>
      </div>
    </div>
  );
}
