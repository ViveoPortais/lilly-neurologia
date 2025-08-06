import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const suggestionSchema = z
  .object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  })
  .refine((data) => !!(data.suggestion1 || data.suggestion2 || data.suggestion3), { message: "Preencha pelo menos uma sugestão de data." });

type SuggestionForm = z.infer<typeof suggestionSchema>;

interface SuggestionDateStepProps {
  onCancel: () => void;
  item: ExamPendingModel;
}

export default function SuggestionDateStep({ onCancel, item }: SuggestionDateStepProps) {
  const { resolve } = useResolveExamPendency();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<SuggestionForm>({
    resolver: zodResolver(suggestionSchema),
    mode: "onChange",
    defaultValues: {
      suggestion1: "",
      suggestion2: "",
      suggestion3: "",
    },
  });

  const onSubmit = async (data: SuggestionForm) => {
    await resolve({
      item: {
        ...item,
        logistcSuggestedDate1: data.suggestion1,
        logistcSuggestedDate2: data.suggestion2,
        logistcSuggestedDate3: data.suggestion3,
        isPickupRequestApproved: false,
      },
      onSuccess: onCancel,
    });
  };

  function validateSuggestionDate<T>(dateStr: string, item: ExamPendingModel, fieldName: keyof T, setValue: (name: keyof T, value: string) => void): boolean {
    if (!dateStr) return true;

    const selected = dayjs(dateStr);
    const now = dayjs().startOf("day");
    const minDate = now.add(2, "day");

    const doctorDate = item.doctorSuggestedDate ? dayjs(item.doctorSuggestedDate) : null;
    const deliveryDate = item.deliveryConfirmedAt ? dayjs(item.deliveryConfirmedAt) : null;

    const clearField = () => setValue(fieldName, "");

    if (selected.isBefore(minDate)) {
      toast.warning(`A data deve ser a partir de ${minDate.format("DD/MM/YYYY")}`);
      clearField();
      return false;
    }

    if (selected.day() === 5) {
      toast.warning("Não é permitido selecionar sextas-feiras.");
      clearField();
      return false;
    }

    if (doctorDate && !selected.isAfter(doctorDate)) {
      toast.warning("A data deve ser após a data da coleta.");
      clearField();
      return false;
    }

    if (deliveryDate && selected.isBefore(deliveryDate)) {
      toast.warning("A data deve ser igual ou posterior à data de recebimento do tubo.");
      clearField();
      return false;
    }

    return true;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      {(["suggestion1", "suggestion2", "suggestion3"] as const).map((key, index) => (
        <div key={key}>
          <Input
            placeholder={`Sugestão 0${index + 1}`}
            inputPlaceholder="Escolha a data"
            type="date"
            {...register(key)}
            onBlur={(e) => validateSuggestionDate(e.target.value, item, key, setValue)}
            onChange={(e) => validateSuggestionDate(e.target.value, item, key, setValue)}
          />
        </div>
      ))}

      {errors?.root?.message && <p className="text-xs text-red-500 -mt-2">{errors.root.message}</p>}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outlineMainlilly" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isValid}>
          Salvar
        </Button>
      </div>
    </form>
  );
}