import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      {(["suggestion1", "suggestion2", "suggestion3"] as const).map((key, index) => (
        <div key={key}>
          <Input placeholder={`Sugestão 0${index + 1}`} inputPlaceholder="Escolha a data" type="date" {...register(key)} />
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