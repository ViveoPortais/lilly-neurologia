import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "../ui/input";
import { maskedField } from "../custom/MaskedField";
import { IStringMap } from "@/types";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { useAppDispatch } from "@/store/hooks";
import { searchPatientByCpf } from "@/store/slices/registerPatientSlice";

export const Step1 = ({
 setStep,
 control,
 errors,
 diseases,
 exams,
 labs,
 genders,
}: {
 setStep: (step: number) => void;
 control: any;
 errors: any;
 diseases: IStringMap[];
 exams: IStringMap[];
 labs: IStringMap[];
 genders: IStringMap[];
}) => {
 const { register, watch } = useFormContext();
 const hasResponsible = watch("hasResponsible");
 const dispatch = useAppDispatch();

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
        true,
        (e) => {
         field.onBlur();
         const onlyDigits = e.target.value.replace(/\D/g, "");
         if (onlyDigits.length === 11) {
          dispatch(searchPatientByCpf(e.target.value));
         }
        },
        field.value,
        false,
        `w-full`
       )}
       {errors?.cpf && <span className="text-sm text-red-500 mt-1 block">{errors.cpf.message as string}</span>}
      </div>
     )}
    />
    <div className="w-full">
     <Input {...register("name")} placeholder="Nome Completo" />
     {errors?.name && <span className="text-sm text-red-500 mt-1 block">{errors.name.message as string}</span>}
    </div>
    <div className="w-full">
     <Input {...register("birthDate")} type="date" placeholder="Data de Nascimento" />
     {errors?.birthDate && <span className="text-sm text-red-500 mt-1 block">{errors.birthDate.message as string}</span>}
    </div>

    <Controller
     name="gender"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={genders} value={field.value} onChange={field.onChange} name="gender" label="Gênero biológico" />
       {errors?.gender && <span className="text-sm text-red-500 mt-1 block">{errors.gender.message as string}</span>}
      </div>
     )}
    />

    <div className="flex items-center gap-x-4 mt-5">
     <span className="font-medium">Possui Cuidador Responsável?</span>

     <label className="cursor-pointer">
      <input type="radio" value="yes" {...register("hasResponsible")} checked={watch("hasResponsible") === "yes"} className="peer hidden" />
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
      <Input {...register("birthDateCaregiver")} placeholder="Nascimento do Cuidador" />
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
     name="laboratoryName"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect
        options={labs}
        value={field.value}
        onChange={field.onChange}
        name="laboratoryName"
        label="Laboratório de Análise"
       />
       {errors?.laboratoryName && <span className="text-sm text-red-500 mt-1 block">{errors.laboratoryName.message as string}</span>}
      </div>
     )}
    />
   </div>
  </div>
 );
};
