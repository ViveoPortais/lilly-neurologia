"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CgSpinner } from "react-icons/cg";
import { forgetPassword, forgetPasswordProfessional } from "@/services/auth";
import { useRouter } from "next/navigation";
import { ForgetPasswordSchema, forgetPasswordSchema } from "@/lib/utils";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { maskedField } from "@/components/custom/MaskedField";
import { UFlist } from "@/helpers/select-filters";
import { Input } from "@/components/ui/input";
import { useGenericModal } from "@/contexts/GenericModalContext";

const profileOptions = [
  { id: "medico", value: "Médico" },
  { id: "assistente", value: "Assistente Médico" },
  { id: "logistica", value: "Logística" },
  { id: "operacao", value: "Operação" },
];

export default function ForgetPasswordPage() {
  const router = useRouter();
  const modal = useGenericModal();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const role = watch("role");

  const onSubmit = async (data: ForgetPasswordSchema) => {
    try {
      let response;

      if (data.role === "medico") {
        const { cpf, licenseNumber, licenseState } = data;
        response = await forgetPassword({ cpf, licenseNumber, licenseState });
      } else {
        response = await forgetPasswordProfessional({ email: data.email });
      }

      handleResponse(response);
    } catch {
      modal.showModal(
        {
          type: "error",
          message: "Erro ao recuperar senha",
        },
        () => {
          router.push("/signin");
        }
      );
    } finally {
      reset();
    }
  };

  function handleResponse(response: { isValidData: boolean; additionalMessage: string }) {
    if (response.isValidData) {
      modal.showModal(
        {
          type: "success",
          message: response.additionalMessage,
        },
        () => {
          router.push("/signin");
        }
      );
    } else {
      modal.showModal(
        {
          type: "error",
          message: response.additionalMessage,
        },
        () => {
          router.push("/signin");
        }
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <CustomSelect
            name="role"
            label="Qual seu perfil?"
            options={profileOptions}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      {role && role !== "medico" && (
        <div className="flex flex-col gap-4 mt-4">
          <Input type="email" {...register("email")} placeholder="Digite seu email" />
          {(errors as any).email && <p className="text-red-500 text-sm">{(errors as any).email.message}</p>}
        </div>
      )}

      {role === "medico" && (
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <Input {...register("licenseNumber")} placeholder="Digite seu CRM" />
            {(errors as any).licenseNumber && (
              <p className="text-red-500 text-sm">{(errors as any).licenseNumber.message}</p>
            )}
          </div>

          <Controller
            name="licenseState"
            control={control}
            render={({ field }) => (
              <CustomSelect
                name="licenseState"
                label="UF do CRM"
                options={UFlist}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {(errors as any).licenseState && (
            <p className="text-red-500 text-sm">{(errors as any).licenseState.message}</p>
          )}

          <Controller
            name="cpf"
            control={control}
            render={({ field }) => maskedField("cpf", field.onChange, field.name, "CPF", false, () => {}, field.value)}
          />
          {(errors as any).cpf && <p className="text-red-500 text-sm">{(errors as any).cpf.message}</p>}
        </div>
      )}

      <div className="flex flex-col gap-y-2 mt-2">
        <Button type="submit" disabled={isSubmitting || !isValid} variant={"default"}>
          {isSubmitting ? <CgSpinner className="animate-spin" size={20} /> : "Solicitar Nova Senha"}
        </Button>
        <Button type="button" disabled={isSubmitting} variant={"outlineMainlilly"} onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    </form>
  );
}
