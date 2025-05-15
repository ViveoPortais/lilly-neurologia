import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";

type ConfirmationDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    content : string;
};

export const ConfirmationDialog = ({ open, onClose, onConfirm, content }: ConfirmationDialogProps) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild>
            <div></div>
        </DialogTrigger>
        <DialogContent className="mt-4">
            <DialogTitle className="text-lg md:text-2xl font-semibold">
                Atenção
            </DialogTitle>
            <p className="my-2 md:my-4">
                {content}
            </p>
            <DialogFooter className="flex justify-between flex-col sm:flex-row gap-2 mt-4">
                <Button onClick={onConfirm} variant="default" size="lg" >Confirmar</Button>
                <DialogClose asChild>
                    <Button type="button" variant="outlineMainlilly" size="lg" onClick={onClose}>Cancelar</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);