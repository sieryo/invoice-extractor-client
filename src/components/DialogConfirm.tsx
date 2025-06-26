import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";

export const DialogConfirm = ({
  isOpen,
  setIsOpen,
  title = "Are you sure?",
  description = "",
  onConfirm,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
}) => {
  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="pt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="text-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
