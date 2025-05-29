import GenericModalForm from "@/components/modals/GenericModalForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CancelProcedureStep from "./CancelProcedureStep";

interface SampleIssueModalProps {
 onClose: () => void;
}

export default function SampleIssueModal({ onClose }: SampleIssueModalProps) {
 const [step, setStep] = useState<"initial" | "cancel">("initial");

 const handleRecoleta = () => {
  // TODO: Integrar com o back depois
  onClose();
 };

 return (
  <GenericModalForm title={step === "initial" ? "Problema com a Amostra" : "Cancelar Procedimento"} isOpen onClose={onClose}>
   {step === "initial" ? (
    <div className="flex flex-col items-center gap-4 p-4">
     <div className="flex gap-4">
      <Button variant="outlineMainlilly" onClick={() => setStep("cancel")}>
       Cancelar Procedimento
      </Button>
      <Button onClick={handleRecoleta}>Solicitar Recoleta</Button>
     </div>
    </div>
   ) : (
    <CancelProcedureStep onClose={onClose} />
   )}
  </GenericModalForm>
 );
}