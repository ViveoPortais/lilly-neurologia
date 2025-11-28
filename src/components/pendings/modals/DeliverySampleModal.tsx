"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateNoFutureDate } from "@/helpers/helpers";
import { IConfirmSampleDeliveryModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import useSession from "@/hooks/useSession";

interface DeliverySampleModalProps {
  onClose: () => void;
  item: IConfirmSampleDeliveryModel;
}

const createSchema = (minDate: string) => z.object({
  deliveryDate: z.string().min(1, "Data da entrega é obrigatória")
    .refine((date) => !date || date <= dayjs().format("YYYY-MM-DD"), {
      message: "A data de entrega não pode ser futura"
    })
    .refine((date) => !minDate || !date || date >= minDate, {
      message: "A data de entrega não pode ser inferior a data de retirada do exame"
    }),
  deliveryTime: z.string().min(1, "Horário é obrigatório"),
});

export default function DeliverySampleModal({ onClose, item }: DeliverySampleModalProps) {
  const { resolve } = useResolveExamPendency();
  const auth = useSession();
  
  const minDate = item.confirmWithdrawalDate ? dayjs(item.confirmWithdrawalDate).format("YYYY-MM-DD") : "";
  const schema = createSchema(minDate);
  
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid, touchedFields },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("deliveryDate", e.target.value, { shouldValidate: true });
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
        placeholder="Data de entrega da amostra"
        inputPlaceholder="Informe a data de entrega da amostra"
        {...register("deliveryDate")}
        onChange={handleDateChange}
        className="w-full"
        max={dayjs().format("YYYY-MM-DD")}
        min={minDate || undefined}
      />
      {touchedFields.deliveryDate && errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>}

      <Input type="time" placeholder="Horário de entrega da amostra" {...register("deliveryTime")} inputPlaceholder="Informe o horário de entrega da amostra" className="w-full" />
      {touchedFields.deliveryTime && errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime.message}</p>}

      <Button type="submit" className="w-full" disabled={!isValid}>
        Sim
      </Button>
    </form>
  );
}