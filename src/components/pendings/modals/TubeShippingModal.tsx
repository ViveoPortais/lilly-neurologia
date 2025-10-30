import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/contexts/LoadingContext";
import { today, validateNoFutureDate } from "@/helpers/helpers";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { useAppDispatch } from "@/store/hooks";
import { ExamPendingModel, LabelPendingModel } from "@/types/diagnostic";
import { useState } from "react";

interface TubeShippingProps {
  onClose: () => void;
  item: ExamPendingModel;
}

export default function TubeShippingModal({ onClose, item }: TubeShippingProps) {
  const [sendDate, setSendDate] = useState("");
  const [dateError, setDateError] = useState("");
  const { show } = useLoading();
  const { resolve } = useResolveExamPendency();

  const minDate = new Date(item.dateCreate!).toISOString().split("T")[0];

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    if (selectedDate && selectedDate < minDate) {
      setDateError("A data de envio não pode ser inferior a data de solicitação do exame");
      return;
    }

    setDateError("");
    validateNoFutureDate(selectedDate, "sendDate", (field, value) => setSendDate(value), "A data de envio não pode ser futura");
  };

  const handleCancel = () => {
    setSendDate("");
    setDateError("");
    onClose();
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

  const labelItem = item as LabelPendingModel;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input value={labelItem.addressPostalCode ?? ""} readOnly placeholder="CEP" />
          <Input value={labelItem.addressName ?? ""} readOnly placeholder="Rua" />
          <Input value={labelItem.addressNumber ?? ""} readOnly placeholder="Número" />
          <Input value={labelItem.addressComplement ?? ""} readOnly placeholder="Complemento/Sala/Consultório" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input value={labelItem.addressDistrict ?? ""} readOnly placeholder="Bairro" />
          <Input value={labelItem.addressCity ?? ""} readOnly placeholder="Cidade" />
          <Input value={labelItem.addressState ?? ""} readOnly placeholder="Estado" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Input value={labelItem.section ?? ""} readOnly placeholder="Nome do Responsável/Setor" />
          <Input value={labelItem.institutionTelephone ?? ""} readOnly placeholder="Telefone de contato" />
        </div>
        {labelItem.logisticsAddressTypeStringMap?.flag === "#COMMERCIAL" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input value={labelItem.logisticsLocal?.name ?? ""} readOnly placeholder="Nome do Local" />
            <Input value={labelItem.logisticsLocal?.cnpj ?? ""} readOnly placeholder="CNPJ" />
            <Input value={labelItem.logisticsLocal?.companyName ?? ""} readOnly placeholder="Razão Social" />
          </div>
        )}
      </div>
      <div>
        <Input
          type="date"
          placeholder="Data de envio"
          max={today}
          min={minDate}
          value={sendDate}
          onChange={(e) => setSendDate(e.target.value)}
          onBlur={handleBlur}
          className="w-full"
        />
        {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
        <Button onClick={handleCancel} variant="outlineMainlilly" className="w-full md:w-1/2">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} disabled={!sendDate || !!dateError} className="w-full md:w-1/2">
          Enviado
        </Button>
      </div>
    </div>
  );
}