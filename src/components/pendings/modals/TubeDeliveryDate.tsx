import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/contexts/LoadingContext";
import { today, validateNoFutureDate } from "@/helpers/helpers";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { ExamPendingModel, TubePendingModel } from "@/types/diagnostic";
import { useState } from "react";

interface TubeDeliveryProps {
 onClose: () => void;
 item: TubePendingModel;
}

export default function TubeDeliveryDate({ onClose, item }: TubeDeliveryProps) {
 const [sendDate, setSendDate] = useState("");
 const [dateError, setDateError] = useState("");
 const { show } = useLoading();
 const { resolve } = useResolveExamPendency();

 const minDate = new Date(item.deliveryDate!).toISOString().split('T')[0];

 const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedDate = e.target.value;
  
  if (selectedDate && selectedDate < minDate) {
   setDateError("A data de entrega não pode ser inferior a data de envio do tubo");
   return;
  }
  
  setDateError("");
  validateNoFutureDate(selectedDate, "sendDate", (field, value) => setSendDate(value), "A data de envio não pode ser futura");
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
  setDateError("");
  onClose();
 };

 return (
  <div className="space-y-2">
   <div>
    <Input
     type="date"
     placeholder="Data de entrega"
     max={today}
     min={minDate}
     value={sendDate}
     onChange={(e) => setSendDate(e.target.value)}
     onBlur={handleBlur}
    />
    {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
   </div>

   <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
    <Button variant="outlineMainlilly" className="w-full md:w-1/2" onClick={handleNotSent}>
     Não Enviado
    </Button>
    <Button className="w-full md:w-1/2" onClick={handleConfirm} disabled={!sendDate || !!dateError}>
     Enviado
    </Button>
   </div>
  </div>
 );
}