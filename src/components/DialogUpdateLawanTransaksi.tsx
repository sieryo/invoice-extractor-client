import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFullScreenLoadingStore } from "@/store/useFullScreenLoadingStore";
import { handleFileUpload } from "@/lib/lawanTransaksi";
import { Button } from "@/components/ui/button";

export const DialogUpdateLawanTransaksi = () => {
  const { setIsLoading } = useFullScreenLoadingStore();

  const onBeforeUpdate = () => {
    setIsLoading(true);
  };

  const onAfterUpdate = () => {
    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update Lawan Transaksi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Lawan Transaksi</DialogTitle>
          <DialogDescription>
            Pilih file Excel untuk melakukan update lawan transaksi.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Input
            id="files"
            type="file"
            accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="opacity-100 cursor-pointer"
            onChange={(e) => handleFileUpload(e, onBeforeUpdate, onAfterUpdate)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
