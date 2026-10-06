import { Button } from "../Button";
import { Dialog, DialogContent } from "../ui/dialog";

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  closeButton: string;
  confirmButton: string;
  onConfirm: () => void;
  onClose?: () => void;
};

export default function InfoModal({
  open,
  onOpenChange,
  title,
  closeButton,
  confirmButton,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[532px]">
        <div className="flex flex-col px-8 pb-5 pt-20 gap-10 items-center">
          <div className="text-2xl font-bold text-scale-600 whitespace-pre-line text-center">
            {title}
          </div>
          <div className="flex w-full gap-5">
            <Button variant="outlined" className="flex-1" onClick={onClose}>
              {closeButton}
            </Button>
            <Button variant="primary" onClick={onConfirm} className="flex-1">
              {confirmButton}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
