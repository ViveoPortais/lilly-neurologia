import GenericModalForm from "@/components/modals/GenericModalForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SuggestionDateStep from "./SuggestionDateStep";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";

interface ApproveSampleDateModalProps {
  onClose: () => void;
  item: ExamPendingModel;
}

export default function ApproveSampleDateModal({ onClose, item }: ApproveSampleDateModalProps) {
  const [step, setStep] = useState<"initial" | "suggest">("initial");
  const { resolve } = useResolveExamPendency();

  const handleApprove = async () => {
    await resolve({
      item: {
        ...item,
      },
      onSuccess: onClose,
    });
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
        <SuggestionDateStep onCancel={onClose} item={item} />
      )}
    </GenericModalForm>
  );
}