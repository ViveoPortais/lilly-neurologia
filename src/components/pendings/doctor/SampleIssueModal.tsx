import GenericModalForm from "@/components/modals/GenericModalForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CancelProcedureStep from "./CancelProcedureStep";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { ExamPendingModel } from "@/types/diagnostic";

interface SampleIssueModalProps {
  onClose: () => void;
  item: ExamPendingModel;
}

export default function SampleIssueModal({ onClose, item }: SampleIssueModalProps) {
  const [step, setStep] = useState<"initial" | "cancel">("initial");
  const { resolve } = useResolveExamPendency();

  const handleRecoleta = async () => {
    await resolve({
      item: {
        ...item,
      },
      onSuccess: onClose,
    });
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
        <CancelProcedureStep onClose={onClose} itemId={item.id} />
      )}
    </GenericModalForm>
  );
}