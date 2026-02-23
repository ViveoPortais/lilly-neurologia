"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordFormData, passwordSchema } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useState, useMemo } from "react";
import { changePasswordSlice } from "@/store/slices/profileSlice";
import useSession from "@/hooks/useSession";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

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

 const newPassword = methods.watch("newPassword") ?? "";
 const confirmPassword = methods.watch("confirmPassword") ?? "";

 const passwordChecks = useMemo(() => {
  const hasMin = newPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%*?/]/.test(newPassword);
  const matchesConfirm = confirmPassword.length > 0 && newPassword === confirmPassword;
  
  return { hasMin, hasUpper, hasLower, hasNumber, hasSpecial, matchesConfirm };
 }, [newPassword, confirmPassword]);

 const Rule = ({ isValid, children }: { isValid: boolean; children: React.ReactNode }) => (
  <div className="flex items-center gap-1">
   {isValid ? (
    <FiCheckCircle size={16} className="min-w-[16px] text-green-600" />
   ) : (
    <AlertCircle size={16} className="min-w-[16px] text-red-500" />
   )}
   <span className={isValid ? "text-green-600" : "text-red-500"}>
    {children}
   </span>
  </div>
 );

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
     <Rule isValid={passwordChecks.hasLower}>
      Ao menos um caracter minúsculo
     </Rule>
     <Rule isValid={passwordChecks.hasUpper}>
      Ao menos um caracter maiúsculo
     </Rule>
     <Rule isValid={passwordChecks.hasNumber}>
      Ao menos um número
     </Rule>
     <Rule isValid={passwordChecks.hasSpecial}>
      Ao menos um caracter especial (!@#$%*?/)
     </Rule>
     <Rule isValid={passwordChecks.hasMin}>
      Ao menos 12 caracteres
     </Rule>
     {confirmPassword.length > 0 && (
      <Rule isValid={passwordChecks.matchesConfirm}>
       Senhas coincidem
      </Rule>
     )}
    </div>

    <Button type="button" onClick={handleSubmit(onSubmit)} disabled={!isValid || isLoading} className="w-full mt-4" isLoading={isLoading}>
     Salvar
    </Button>
   </form>
  </FormProvider>
 );
}
