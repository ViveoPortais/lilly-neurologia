import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import dayjs from "dayjs";
import { CustomDatePicker } from "@/components/custom/CustomDatepicker";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { IStringMap } from "@/types";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";

const suggestionSchema = z
  .object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
    timeSuggestion1: z.string().optional(),
    timeSuggestion2: z.string().optional(),
    timeSuggestion3: z.string().optional(),
  })
  .refine((data) => !!(data.suggestion1 && data.timeSuggestion1 ||
    data.suggestion2 && data.timeSuggestion2 ||
    data.suggestion3 && data.timeSuggestion3),
    {
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
    control,
    formState: { errors, isValid },
  } = useForm<SuggestionForm>({
    resolver: zodResolver(suggestionSchema),
    mode: "onChange",
    defaultValues: {
      suggestion1: "",
      suggestion2: "",
      suggestion3: "",
      timeSuggestion1: "",
      timeSuggestion2: "",
      timeSuggestion3: "",
    },
  });

  const [custom1StringMaps, setCustom1StringMaps] = useState<IStringMap[]>([]);
  const [custom2StringMaps, setCustom2StringMaps] = useState<IStringMap[]>([]);
  const [custom3StringMaps, setCustom3StringMaps] = useState<IStringMap[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const result1 = await dispatch(fetchStringMaps({ attributeName: "Custom1StringMap", entityName: "LogisticsSchedule" })).unwrap();
      const result2 = await dispatch(fetchStringMaps({ attributeName: "Custom2StringMap", entityName: "LogisticsSchedule" })).unwrap();
      const result3 = await dispatch(fetchStringMaps({ attributeName: "Custom3StringMap", entityName: "LogisticsSchedule" })).unwrap();
      setCustom1StringMaps(result1);
      setCustom2StringMaps(result2);
      setCustom3StringMaps(result3);
    };

    fetchData();
  }, [dispatch]);

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
        timeSuggested1: data.timeSuggestion1 || undefined,
        timeSuggested2: data.timeSuggestion2 || undefined,
        timeSuggested3: data.timeSuggestion3 || undefined,
        isPickupRequestApproved: false,
      },
      onSuccess: onCancel,
    });
  };

  function getOptionsByIndex(index: number): IStringMap[] {
    
    switch(index){
      case 0:
        return custom1StringMaps;
      case 1:
        return custom2StringMaps;
      case 2:
        return custom3StringMaps;
      default:
        return [];
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      {(["suggestion1", "suggestion2", "suggestion3"] as const).map((key, index) => (
        <React.Fragment key={key}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block mb-1 text-base tracking-wide text-black">Sugestão 0{index + 1}</label>
              <CustomDatePicker
                selected={watch(key) ? dayjs(watch(key)).toDate() : undefined}
                onChange={(date) => setValue(key, date ? dayjs(date).format("YYYY-MM-DD") : undefined, { shouldValidate: true })}
                placeholder="dd/mm/aaaa"
                filterDate={filterSuggestionDates}
                minDate={minSelectable.toDate()}
                name={key}
              />
            </div>
            <div className="space-y-1">
              <Controller
                name={`time${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof SuggestionForm}
                control={control}
                render={({ field }) => (
                  <CustomFilterSelect
                    {...field}
                    label="Período"
                    options={getOptionsByIndex(index)}
                  />
                )}
              />
            </div>
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