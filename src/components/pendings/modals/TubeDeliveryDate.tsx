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
  onClose();
 };

 return (
  <div className="w-full max-w-sm">
   <div className="space-y-2">
    <label className="text-sm text-zinc-700">Data de entrega</label>
    <Input
     type="date"
     placeholder="Selecione a data"
     max={today}
     value={sendDate}
     onChange={(e) => setSendDate(e.target.value)}
     onBlur={handleBlur}
    />
   </div>

   <div className="flex justify-between mt-6 gap-2">
    <Button variant="outlineMainlilly" className="w-full" onClick={handleNotSent}>
     Não Enviado
    </Button>
    <Button className="w-full" onClick={handleConfirm} disabled={!sendDate}>
     Enviado
    </Button>
   </div>
  </div>
 );
}