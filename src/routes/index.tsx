import { createFileRoute, useRouter } from "@tanstack/react-router";
import { UploadPage } from "@/components/UploadPage";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const router = useRouter();

  useEffect(() => {
    router.navigate({ to: "/workspace" });
  }, []);
  return (
    <div className="text-center">
      <UploadPage
        onSuccessUpload={() => {
          router.navigate({ to: "/workspace" });
        }}
      />
    </div>
  );
}
