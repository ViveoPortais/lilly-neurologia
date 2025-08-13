"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordFormData, passwordSchema } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useState } from "react";
import { changePasswordSlice } from "@/store/slices/profileSlice";
import useSession from "@/hooks/useSession";

interface AlterPasswordModalProps {
 isOpenExternally?: boolean;
 onCloseExternally?: () => void;
}

export default function AlterPasswordModal({ isOpenExternally, onCloseExternally }: AlterPasswordModalProps) {
 const [isOpen, setIsOpen] = useState(isOpenExternally ?? true);
 const dispatch = useAppDispatch();
 const modal = useGenericModal();
 const isLoading = useAppSelector((state) => state.profile.loading);
 const methods = useForm<PasswordFormData>({
  resolver: zodResolver(passwordSchema),
  mode: "onChange",
 });

 const auth = useSession();
 
 const {
  handleSubmit,
  register,
  reset,
  formState: { errors, isValid },
 } = methods;

 const closeModal = () => {
  if (onCloseExternally) {
   onCloseExternally();
  } else {
   setIsOpen(false);
  }
 };

 const onSubmit = async (data: PasswordFormData) => {
  try {

   const res = await dispatch(
    changePasswordSlice({
     oldPassword: data.oldPassword,
     newPassword: data.newPassword,
     confirmPassword: data.confirmPassword,
    })
   ).unwrap();

   if (res.isValidData) {
    modal.showModal(
     {
      type: "success",
      message: res.additionalMessage,
      buttonLabel: "Fechar",
     },
     () => {
      closeModal();
      reset();
      auth.setObrigatorioAlterarSenha(false);
     }
    );
   } else {
    modal.showModal(
     {
      type: "warning",
      message: res.additionalMessage,
      buttonLabel: "Fechar",
     },
     () => reset()
    );
   }
  } catch (error) {
   console.error("Erro ao alterar a senha:", error);
  }
 };

 return (
  <FormProvider {...methods}>
   <form className="space-y-4">
    <div>
     <div className="relative">
      <Input
       type="password"
       placeholder="Digite a senha atual"
       {...register("oldPassword")}
       className={errors.oldPassword ? "border-red-500" : ""}
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
      <span>Ao menos 12 caracteres</span>
     </div>
    </div>

    <Button type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid || isLoading} className="w-full mt-4" isLoading={isLoading}>
     Salvar
    </Button>
   </form>
  </FormProvider>
 );
}
