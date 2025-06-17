import { useState } from "react";
import GenericModalForm from "@/components/modals/GenericModalForm";
import ReportProblemForm from "../operation/ReportProblemForm";
import { ExamPendingModel } from "@/types/diagnostic";
import ConclusionOptions from "../operation/ConclusionOptions";
import ConcludeAnalysisForm from "../operation/ConcludeAnalysisForm";

type Step = "initial" | "problem" | "conclude";

interface AnalysisConclusionModalProps {
 onClose: () => void;
 item: ExamPendingModel;
}

export default function AnalysisConclusionModal({ onClose, item }: AnalysisConclusionModalProps) {
 const [step, setStep] = useState<Step>("initial");

 const getTitle = () => {
  switch (step) {
   case "problem":
    return "Informar Problema";
   case "conclude":
    return "Conclusão da Análise";
   default:
    return "Conclusão da Análise";
  }
 };

 return (
  <GenericModalForm title={getTitle()} isOpen onClose={onClose}>
   {step === "initial" && <ConclusionOptions onSelect={setStep} />}
   {step === "problem" && <ReportProblemForm pendencyId={item.id} onClose={onClose} item={item} />}
   {step === "conclude" && <ConcludeAnalysisForm pendencyId={item.id} onClose={onClose} item={item} />}
  </GenericModalForm>
 );
}