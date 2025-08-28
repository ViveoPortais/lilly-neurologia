"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateNoFutureDate } from "@/helpers/helpers";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import useSession from "@/hooks/useSession";

interface RecollectSampleModalProps {
  onClose: () => void;
  item: ExamPendingModel;
}

const createSchema = (minDate: string) => z.object({
  deliveryDate: z.string().min(1, "Data da entrega é obrigatória")
    .refine((date) => !minDate || date >= minDate, {
      message: "A data de retirada não pode ser inferior a data de coleta do exame"
    }),
  deliveryTime: z.string().min(1, "Horário é obrigatório"),
});

export default function RecollectSampleModal({ onClose, item }: RecollectSampleModalProps) {
   const { resolve } = useResolveExamPendency();
  const auth = useSession();
  
  const minDate = item.examCollectionDate ? dayjs(item.examCollectionDate).format("YYYY-MM-DD") : "";
  const schema = createSchema(minDate);
  
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateNoFutureDate(e.target.value, "deliveryDate", setValue, "A data de retirada não pode ser futura.");
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const formattedDateTime = dayjs(`${data.deliveryDate}T${data.deliveryTime}`).format("YYYY-MM-DDTHH:mm:ss");
    await resolve({
      item: {
        ...item,
        ...(auth.role === "operation" ? { deliveryConfirmedAt: formattedDateTime } : { dateForCollecting: formattedDateTime }),
      },
      onSuccess: onClose,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="date"
        placeholder="Data da retirada"
        inputPlaceholder="Informe a data da retirada"
        {...register("deliveryDate")}
        onChange={handleDateChange}
        className="w-full"
        max={dayjs().format("YYYY-MM-DD")}
        min={minDate}
      />
      {touchedFields.deliveryDate && errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>}

      <Input type="time" placeholder="Horário da retirada" {...register("deliveryTime")} inputPlaceholder="Informe o horário" className="w-full" />
      {touchedFields.deliveryTime && errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime.message}</p>}

      <Button type="submit" className="w-full" disabled={!isValid}>
        Sim
      </Button>
    </form>
  );
}