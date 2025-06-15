import { createFileRoute, useRouter } from "@tanstack/react-router";
import { UploadPage } from "@/components/UploadPage";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const router = useRouter();
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
