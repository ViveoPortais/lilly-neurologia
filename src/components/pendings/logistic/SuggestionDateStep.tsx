import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import dayjs from "dayjs";
import { CustomDatePicker } from "@/components/custom/CustomDatepicker";
import React from "react";

const suggestionSchema = z
  .object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  })
  .refine((data) => !!(data.suggestion1 || data.suggestion2 || data.suggestion3), {
    message: "Preencha pelo menos uma sugestão de data.",
  });

type SuggestionForm = z.infer<typeof suggestionSchema>;

interface SuggestionDateStepProps {
  onCancel: () => void;
  item: ExamPendingModel;
}

export default function SuggestionDateStep({ onCancel, item }: SuggestionDateStepProps) {
  const { resolve } = useResolveExamPendency();
  const {
    setValue,
    handleSubmit,
    watch,
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

  const now = dayjs().startOf("day");
  const minSelectable = now.add(now.day() === 4 ? 4 : 2, "day");

  const filterSuggestionDates = (date: Date) => {
    const selected = dayjs(date);

    const isWeekend = [5, 6, 0].includes(selected.day());
    if (isWeekend) return false;

    if (selected.isBefore(minSelectable)) return false;

    return true;
  };

  const onSubmit = async (data: SuggestionForm) => {
    await resolve({
      item: {
        ...item,
        logistcSuggestedDate1: data.suggestion1 || undefined,
        logistcSuggestedDate2: data.suggestion2 || undefined,
        logistcSuggestedDate3: data.suggestion3 || undefined,
        isPickupRequestApproved: false,
      },
      onSuccess: onCancel,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      {(["suggestion1", "suggestion2", "suggestion3"] as const).map((key, index) => (
        <React.Fragment key={key}>
          <div className="flex gap-1">
            <label className="text-base tracking-wide text-black">Sugestão 0{index + 1}</label>
          </div>
          <div className="w-full">
            <CustomDatePicker
              selected={watch(key) ? dayjs(watch(key)).toDate() : undefined}
              onChange={(date) => setValue(key, date ? dayjs(date).format("YYYY-MM-DD") : undefined, { shouldValidate: true })}
              placeholder="dd/mm/aaaa"
              filterDate={filterSuggestionDates}
              minDate={minSelectable.toDate()}
              name={key}
            />
          </div>
        </React.Fragment>
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