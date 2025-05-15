import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "../ui/input";
import { maskedField } from "../custom/MaskedField";
import { IStringMap } from "@/types";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { useAppDispatch } from "@/store/hooks";
import { searchPatientByCpf } from "@/store/slices/registerPatientSlice";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useRouter } from "next/navigation";
import { today, validateNoFutureDate } from "@/helpers/helpers";

export const Step1 = ({
 setStep,
 control,
 errors,
 diseases,
 exams,
 labs,
 genders,
 setValue,
}: {
 setStep: (step: number) => void;
 control: any;
 errors: any;
 diseases: IStringMap[];
 exams: IStringMap[];
 labs: IStringMap[];
 genders: IStringMap[];
 setValue: any;
}) => {
 const { register, watch } = useFormContext();
 const hasResponsible = watch("hasResponsible");
 const dispatch = useAppDispatch();
 const modal = useGenericModal();
 const router = useRouter();

 const handleCpfBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const onlyDigits = e.target.value.replace(/\D/g, "");
  if (onlyDigits.length === 11) {
   try {
    const res = await dispatch(searchPatientByCpf(e.target.value)).unwrap();
    if (res.additionalMessage === "Paciente já cadastrado no programa e não está elegível para novos exames") {
     modal.showModal(
      {
       type: "warning",
       message: res.additionalMessage,
      },
      () => {
       false;
       router.push("/dashboard/starts");
      }
     );
    }
   } catch (error) {
    console.error("CPF não encontrado ou erro ao buscar:", error);
   }
  }
 };

 return (
  <div>
   <div className="grid md:grid-cols-5 gap-4">
    <Controller
     name="cpf"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       {maskedField(
        "cpf",
        field.onChange,
        field.name,
        "CPF",
        false,
        (e) => {
         field.onBlur();
         handleCpfBlur(e);
        },
        field.value,
        false,
        `w-full`,
        "Digite aqui..."
       )}
       {errors?.cpf && <span className="text-sm text-red-500 mt-1 block">{errors.cpf.message as string}</span>}
      </div>
     )}
    />
    <div className="w-full">
     <Input {...register("name")} placeholder="Nome Completo" inputPlaceholder="Digite aqui..." />
     {errors?.name && <span className="text-sm text-red-500 mt-1 block">{errors.name.message as string}</span>}
    </div>
    <div className="w-full">
     <Input
      {...register("birthDate")}
      type="date"
      placeholder="Data de Nascimento"
      max={today}
      onChange={(e) => validateNoFutureDate(e.target.value, "birthDate", setValue)}
     />
     {errors?.birthDate && <span className="text-sm text-red-500 mt-1 block">{errors.birthDate.message as string}</span>}
    </div>

    <Controller
     name="genderId"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={genders} value={field.value} onChange={field.onChange} name="genderId" label="Gênero biológico" />
       {errors?.genderId && <span className="text-sm text-red-500 mt-1 block">{errors.genderId.message as string}</span>}
      </div>
     )}
    />

    <div>
     <span className="font-medium block mb-2">Possui Cuidador Responsável?</span>
     <div className="flex gap-x-4 md:pl-8 md:pt-2">
      <label className="cursor-pointer">
       <input
        type="radio"
        value="yes"
        {...register("hasResponsible")}
        checked={watch("hasResponsible") === "yes"}
        className="peer hidden"
       />
       <div className="px-4 py-1 border border-red-500 rounded-full text-red-500 peer-checked:bg-red-500 peer-checked:text-white transition-colors">
        Sim
       </div>
      </label>

      <label className="cursor-pointer">
       <input type="radio" value="no" {...register("hasResponsible")} checked={watch("hasResponsible") === "no"} className="peer hidden" />
       <div className="px-4 py-1 border border-red-500 rounded-full text-red-500 peer-checked:bg-red-500 peer-checked:text-white transition-colors">
        Não
       </div>
      </label>
     </div>
    </div>
   </div>

   {hasResponsible === "yes" && (
    <div className="grid md:grid-cols-3 gap-3 mt-4">
     <div className="w-full">
      <Input {...register("nameCaregiver")} placeholder="Nome do Cuidador" />
      {errors?.nameCaregiver && <span className="text-sm text-red-500 mt-1 block">{errors.nameCaregiver.message as string}</span>}
     </div>
     <Controller
      name="cpfCaregiver"
      control={control}
      render={({ field }) => (
       <div className="w-full">
        {maskedField("cpf", field.onChange, field.name, "CPF do Cuidador", false, field.onBlur, field.value, false, `w-full`)}
        {errors?.cpfCaregiver && <span className="text-sm text-red-500 mt-1 block">{errors.cpfCaregiver.message as string}</span>}
       </div>
      )}
     />
     <div className="w-full">
      <Input
       {...register("birthDateCaregiver")}
       type="date"
       placeholder="Nascimento do Cuidador"
       max={today}
       onChange={(e) => validateNoFutureDate(e.target.value, "birthDateCaregiver", setValue)}
      />
      {errors?.birthDateCaregiver && <span className="text-sm text-red-500 mt-1 block">{errors.birthDateCaregiver.message as string}</span>}
     </div>
    </div>
   )}
   <div className="grid md:grid-cols-3 gap-3 mt-4">
    <Controller
     name="disease"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={diseases} value={field.value} onChange={field.onChange} name="disease" label="Patologia" />
       {errors?.disease && <span className="text-sm text-red-500 mt-1 block">{errors.disease.message as string}</span>}
      </div>
     )}
    />
    <Controller
     name="examDefinition"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={exams} value={field.value} onChange={field.onChange} name="examDefinition" label="Exame" />
       {errors?.examDefinition && <span className="text-sm text-red-500 mt-1 block">{errors.examDefinition.message as string}</span>}
      </div>
     )}
    />
    <Controller
     name="laboratoryAnalysis"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect
        options={labs}
        value={field.value}
        onChange={field.onChange}
        name="laboratoryAnalysis"
        label="Laboratório de Análise"
       />
       {errors?.laboratoryAnalysis && (
        <span className="text-sm text-red-500 mt-1 block">{errors.laboratoryAnalysis.message as string}</span>
       )}
      </div>
     )}
    />
   </div>
  </div>
 );
};
