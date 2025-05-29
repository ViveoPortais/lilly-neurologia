"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateNoFutureDate } from "@/helpers/helpers";

interface DeliverySampleModalProps {
 onClose: () => void;
}

const schema = z.object({
 deliveryDate: z.string().min(1, "Data da entrega é obrigatória"),
 deliveryTime: z.string().min(1, "Horário é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export default function DeliverySampleModal({ onClose }: DeliverySampleModalProps) {
 const {
  register,
  handleSubmit,
  setValue,
  trigger,
  formState: { errors, isValid, touchedFields },
 } = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: "onBlur",
  reValidateMode: "onBlur",
 });

 const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  validateNoFutureDate(e.target.value, "deliveryDate", setValue, "A data de entrega não pode ser futura.");
 };

 const onSubmit = (data: FormData) => {
  //TODO: Integrar com o back quando estiver pronto
  onClose();
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
   <Input
    type="date"
    placeholder="Data da entrega"
    inputPlaceholder="Informe a data"
    {...register("deliveryDate")}
    onChange={handleDateChange}
    className="w-full"
    max={dayjs().format("YYYY-MM-DD")}
   />
   {touchedFields.deliveryDate && errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>}

   <Input
    type="time"
    placeholder="Horário da entrega"
    {...register("deliveryTime")}
    inputPlaceholder="Informe o horário"
    className="w-full"
   />
   {touchedFields.deliveryTime && errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime.message}</p>}

   <Button type="submit" className="w-full" disabled={!isValid}>
    Sim
   </Button>
  </form>
 );
}