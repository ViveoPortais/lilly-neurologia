import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { Button } from "@/components/ui/button";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { postCancellationExam } from "@/store/slices/diagnosticSlice";
import { IStringMap } from "@/types";
import { IExamCancellationModel } from "@/types/diagnostic";
import { useEffect, useState } from "react";

interface CancelProcedureStepProps {
  onClose: () => void;
  itemId: string;
}

export default function CancelProcedureStep({ onClose, itemId }: CancelProcedureStepProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const dispatch = useAppDispatch();
  const [optionsCancellation, setOptionsCancellation] = useState<IStringMap[]>([]);
  const { show, hide } = useLoading();
  const modal = useGenericModal();

  const isInvalid = touched && !reason;

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const examNotDoneStringMaps: IStringMap[] = await dispatch(
          fetchStringMaps({ entityName: "Exam", attributeName: "ReasonExamNotDoneStringMap" })
        ).unwrap();
        setOptionsCancellation(examNotDoneStringMaps);
      } catch (err) {
        console.error("Erro ao carregar motivos de cancelamento:", err);
      }
    };

    loadOptions();
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!reason) {
      setTouched(true);
      return;
    }

    const payload: IExamCancellationModel = {
      id: itemId,
      examCancellationReason: reason,
    };

    try {
      show();
      const response = await dispatch(postCancellationExam({ examCancellationModel: payload })).unwrap();

      if (response) {
        if (response.isValidData) {
          modal.showModal(
            {
              type: "success",
              buttonLabel: "Fechar",
              message: response.additionalMessage,
            },
            onClose
          );
        } else {
          modal.showModal(
            {
              type: "error",
              buttonLabel: "Fechar",
              message: response.additionalMessage,
            },
            onClose
          );
        }
      }
    } catch (error: string | any) {
      modal.showModal(
        {
          type: "error",
          buttonLabel: "Fechar",
          message: error,
        },
        onClose
      );
    } finally {
      hide();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <CustomFilterSelect
        label="Por que está cancelando o procedimento?"
        name="cancelReason"
        value={reason!}
        options={optionsCancellation}
        onChange={setReason}
        onBlur={() => setTouched(true)}
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