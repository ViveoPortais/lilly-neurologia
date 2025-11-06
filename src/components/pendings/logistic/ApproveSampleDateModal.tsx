import GenericModalForm from "@/components/modals/GenericModalForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SuggestionDateStep from "./SuggestionDateStep";
import { ExamPendingModel, IPickupRequestModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";

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
        isPickupRequestApproved: true,
      },
      onSuccess: onClose,
    });
  };

  const labelItem = item as IPickupRequestModel;

  return (
    <GenericModalForm title={step === "initial" ? "Aprovar Data" : "Sugestão de datas"} isOpen onClose={onClose}>
      {step === "initial" ? (
        <div className="space-y-6 p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input value={labelItem.addressName ?? ""} readOnly placeholder="Rua" />
              <Input value={labelItem.addressComplement ?? ""} readOnly placeholder="Complemento" />
              <Input value={labelItem.addressDistrict ?? ""} readOnly placeholder="Bairro" />
              <Input value={labelItem.addressCity ?? ""} readOnly placeholder="Cidade" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input value={labelItem.addressPostalCode ?? ""} readOnly placeholder="CEP" />
              <Input value={labelItem.addressNumber ?? ""} readOnly placeholder="Número" />
              <Input value={labelItem.addressState ?? ""} readOnly placeholder="Estado" />
            </div>
            {(labelItem.addressCommercial && labelItem.logisticsScheduleLocal)&& (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input value={labelItem.logisticsScheduleLocal?.name ?? ""} readOnly placeholder="Nome do Local" />
                <Input value={labelItem.logisticsScheduleLocal?.cnpj ?? ""} readOnly placeholder="CNPJ" />
                <Input value={labelItem.logisticsScheduleLocal?.companyName ?? ""} readOnly placeholder="Razão Social" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input value={dayjs(labelItem.examPickupDate).format("DD/MM/YYYY") ?? ""} readOnly placeholder="Data sugerida" />
              <Input value={labelItem.preferredTimeStringMap?.optionName ?? ""} readOnly placeholder="Período da coleta" />
            </div>
          </div>
          <div className="flex justify-center gap-4 p-4">
            <Button variant="outlineMainlilly" onClick={() => setStep("suggest")}>
              Não Aprovar
            </Button>
            <Button onClick={handleApprove}>Aprovar</Button>
          </div>
        </div>
      ) : (
        <SuggestionDateStep onCancel={onClose} item={item} />
      )}
    </GenericModalForm>
  );
}