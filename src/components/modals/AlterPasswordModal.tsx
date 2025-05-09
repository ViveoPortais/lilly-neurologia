"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordFormData, passwordSchema } from "@/lib/utils";

export default function AlterPasswordModal() {
 const methods = useForm<PasswordFormData>({
  resolver: zodResolver(passwordSchema),
  mode: "onChange",
 });

 const {
  handleSubmit,
  register,
  formState: { errors, isValid },
 } = methods;

 const onSubmit = (data: PasswordFormData) => {
  console.log("Submit:", data);
 };

 return (
  <FormProvider {...methods}>
   <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <div>
     <div className="relative">
      <Input
       type="password"
       placeholder="Digite a senha"
       {...register("currentPassword")}
       className={errors.currentPassword ? "border-red-500" : ""}
      />
     </div>
    </div>

    <div>
     <div className="relative">
      <Input
       type="password"
       placeholder="Digite a senha nova"
       {...register("newPassword")}
       className={errors.newPassword ? "border-red-500" : ""}
      />
     </div>
    </div>

    <div>
     <div className="relative">
      <Input
       type="password"
       placeholder="Confirme a senha"
       {...register("confirmPassword")}
       className={errors.confirmPassword ? "border-red-500" : ""}
      />
     </div>
    </div>

    <div className="text-sm space-y-2 mt-2">
     <div className="flex items-center gap-1">
      <AlertCircle size={16} className="min-w-[16px] text-mainlilly" />
      <span>Preencha a senha atual</span>
     </div>
     <div className="flex items-center gap-1">
      <AlertCircle size={16} className="min-w-[16px] text-mainlilly" />
      <span>Ao menos um caracter minúsculo</span>
     </div>
     <div className="flex items-center gap-1">
      <AlertCircle size={16} className="min-w-[16px] text-mainlilly" />
      <span>Ao menos um caracter maiúsculo</span>
     </div>
     <div className="flex items-center gap-1">
      <AlertCircle size={16} className="min-w-[16px] text-mainlilly" />
      <span>Ao menos um número</span>
     </div>
     <div className="flex items-center gap-1">
      <AlertCircle size={16} className="min-w-[16px] text-mainlilly" />
      <span>Ao menos um caracter especial (!@#$%*?/)</span>
     </div>
     <div className="flex items-center gap-1">
      <AlertCircle size={16} className="min-w-[16px] text-mainlilly" />
      <span>Ao menos um 12 caracteres</span>
     </div>
    </div>

    <Button type="submit" disabled={!isValid} className="w-full mt-4">
     Salvar
    </Button>
   </form>
  </FormProvider>
 );
}
