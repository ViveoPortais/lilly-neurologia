import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/contexts/LoadingContext";
import { today, validateNoFutureDate } from "@/helpers/helpers";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { ExamPendingModel } from "@/types/diagnostic";
import { useState } from "react";

interface TubeDeliveryProps {
 onClose: () => void;
 item: ExamPendingModel;
}

export default function TubeDeliveryDate({ onClose, item }: TubeDeliveryProps) {
 const [sendDate, setSendDate] = useState("");
 const { show } = useLoading();
 const { resolve } = useResolveExamPendency();

 const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
  validateNoFutureDate(e.target.value, "sendDate", (field, value) => setSendDate(value), "A data de envio não pode ser futura");
 };

 const handleConfirm = async () => {
  show();
  await resolve({
   item: {
    ...item,
    deliveryConfirmedAt: sendDate,
   },
   onSuccess: onClose,
  });
 };

 const handleNotSent = () => {
  setSendDate("");
  onClose();
 };

 return (
  <div className="space-y-2">
   <Input
    type="date"
    placeholder="Data de entrega"
    max={today}
    value={sendDate}
    onChange={(e) => setSendDate(e.target.value)}
    onBlur={handleBlur}
   />

   <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
    <Button variant="outlineMainlilly" className="w-full md:w-1/2" onClick={handleNotSent}>
     Não Enviado
    </Button>
    <Button className="w-full md:w-1/2" onClick={handleConfirm} disabled={!sendDate}>
     Enviado
    </Button>
   </div>
  </div>
 );
}