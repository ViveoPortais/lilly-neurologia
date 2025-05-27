import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface OperationPasswordModalProps {
 onConfirm: (senha: string) => void;
 onClose: () => void;
}

export default function OperationPasswordModal({ onConfirm, onClose }: OperationPasswordModalProps) {
 const router = useRouter();
 const { register, handleSubmit, watch } = useForm();

 const onSubmit = (data: any) => {
  console.log("Senha enviada:", data.senha);
  onConfirm(data.senha);
 };

 const senha = watch("senha");

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:pr-14 md:pl-14">
   <p className="text-lg text-start">Para continuar insira sua senha</p>

   <div className="relative mt-1">
    <Input
     id="senha"
     type="password"
     placeholder="Senha"
     inputPlaceholder="Digite sua senha..."
     {...register("senha", { required: true })}
    />
   </div>

   <div className="flex justify-between gap-4 mt-6">
    <Button variant="outlineMainlilly" className="w-full" type="button" onClick={onClose}>
     Voltar
    </Button>
    <Button className="w-full" type="submit" disabled={!senha}>
     Continuar
    </Button>
   </div>
  </form>
 );
}
