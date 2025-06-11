import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/contexts/LoadingContext";
import { today, validateNoFutureDate } from "@/helpers/helpers";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { useAppDispatch } from "@/store/hooks";
import { ExamPendingModel } from "@/types/diagnostic";
import { useState } from "react";

interface TubeShippingProps {
 onClose: () => void;
 item: ExamPendingModel;
}

export default function TubeShippingModal({ onClose, item }: TubeShippingProps) {
 const [sendDate, setSendDate] = useState("");
 const { show } = useLoading();
 const { resolve } = useResolveExamPendency();

 const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
  validateNoFutureDate(e.target.value, "sendDate", (field, value) => setSendDate(value), "A data de envio não pode ser futura");
 };

 const handleCancel = () => {
  setSendDate("");
  onClose();
 };

 const handleConfirm = async () => {
  show();
  await resolve({
   item: {
    ...item,
    sentAt: sendDate,
   },
   onSuccess: onClose,
  });
 };

 return (
  <div className="space-y-2">
   <Input
    type="date"
    placeholder="Data de envio"
    max={today}
    value={sendDate}
    onChange={(e) => setSendDate(e.target.value)}
    onBlur={handleBlur}
    className="w-full"
   />

   <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
    <Button onClick={handleCancel} variant="outlineMainlilly" className="w-full md:w-1/2">
     Cancelar
    </Button>
    <Button onClick={handleConfirm} disabled={!sendDate} className="w-full md:w-1/2">
     Enviado
    </Button>
   </div>
  </div>
 );
}