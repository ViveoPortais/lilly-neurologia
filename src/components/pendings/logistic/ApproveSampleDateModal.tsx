import GenericModalForm from "@/components/modals/GenericModalForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SuggestionDateStep from "./SuggestionDateStep";

interface ApproveSampleDateModalProps {
 onClose: () => void;
}

export default function ApproveSampleDateModal({ onClose }: ApproveSampleDateModalProps) {
 const [step, setStep] = useState<"initial" | "suggest">("initial");

 const handleApprove = () => {
  // TODO: integrar com o backend (aprovação)
  onClose();
 };

 return (
  <GenericModalForm title={step === "initial" ? "Aprovar Data" : "Sugestão de datas"} isOpen onClose={onClose}>
   {step === "initial" ? (
    <div className="flex justify-center gap-4 p-4">
     <Button variant="outlineMainlilly" onClick={() => setStep("suggest")}>
      Não Aprovar
     </Button>
     <Button onClick={handleApprove}>Aprovar</Button>
    </div>
   ) : (
    <SuggestionDateStep onCancel={onClose} />
   )}
  </GenericModalForm>
 );
}