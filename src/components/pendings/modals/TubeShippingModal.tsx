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
  <div className="w-full max-w-sm">
   <div className="space-y-2">
    <label className="text-sm text-zinc-700">Data de envio</label>
    <Input
     type="date"
     placeholder="Selecione a data"
     max={today}
     value={sendDate}
     onChange={(e) => setSendDate(e.target.value)}
     onBlur={handleBlur}
    />
   </div>

   <div className="flex justify-right mt-6 gap-2">
    <Button className="w-1/2" onClick={handleConfirm} disabled={!sendDate}>
     Enviado
    </Button>
   </div>
  </div>
 );
}
