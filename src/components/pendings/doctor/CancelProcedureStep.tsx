import { CustomSelect } from "@/components/custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CancelProcedureStepProps {
 onClose: () => void;
}

const options = [
 { id: "Paciente Recusou Recoleta", value: "paciente" },
 { id: "Médico Recusou Recoleta", value: "medico" },
];

export default function CancelProcedureStep({ onClose }: CancelProcedureStepProps) {
 const [reason, setReason] = useState<string | null>(null);
 const [touched, setTouched] = useState(false);

 const isInvalid = touched && !reason;

 const handleSubmit = () => {
  if (!reason) {
   setTouched(true);
   return;
  }
  // TODO: Enviar dados ao backend
  onClose();
 };

 return (
  <div className="flex flex-col gap-4 p-4">
   <CustomSelect
    label="Por que está cancelando o procedimento?"
    value={reason}
    options={options}
    onChange={setReason}
    onBlur={() => setTouched(true)}
    name="cancelReason"
   />
   {isInvalid && <span className="text-xs text-red-500">Campo obrigatório</span>}

   <div className="flex justify-between mt-6">
    <Button variant="outlineMainlilly" onClick={onClose}>
     Cancelar
    </Button>
    <Button onClick={handleSubmit}>Enviar</Button>
   </div>
  </div>
 );
}