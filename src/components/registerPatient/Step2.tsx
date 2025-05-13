import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { maskedField } from "../custom/MaskedField";
import { useState } from "react";
import { AddressData } from "@/services/api";
import { toast } from "react-toastify";

export const Step2 = ({
 setStep,
 setValue,
 control,
 errors,
}: {
 setStep: (step: number) => void;
 control: any;
 errors: any;
 setValue: any;
}) => {
 const { register } = useFormContext();

 const [isFetchingCep, setIsFetchingCep] = useState(false);

 const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const rawCep = e.target.value.replace(/\D/g, "");

  if (rawCep.length === 8) {
   setIsFetchingCep(true);
   const data = await AddressData(rawCep);
   if (data && !data.erro) {
    setValue("addressName", data.logradouro || "");
   } else {
    toast.error("CEP inválido ou não encontrado");
   }
   setIsFetchingCep(false);
  }
 };

 return (
  <div>
   <div className="grid md:grid-cols-3 gap-4 mt-4">
    <Controller
     name="addressPostalCode"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       {maskedField(
        "cep",
        field.onChange,
        field.name,
        "CEP da Coleta",
        false,
        (e) => {
         field.onBlur;
         handleCepBlur(e);
        },
        field.value,
        false,
        `w-full`
       )}
       {errors?.addressPostalCode && <span className="text-sm text-red-500 mt-1 block">{errors.addressPostalCode.message as string}</span>}
      </div>
     )}
    />
    <div className="w-full">
     <Input {...register("addressName")} placeholder="Endereço da Coleta" isLoading={isFetchingCep} />
     {errors?.addressName && <span className="text-sm text-red-500 mt-1 block">{errors.addressName.message as string}</span>}
    </div>
    <div className="w-full">
     <Input {...register("addressNumber")} placeholder="Número" />
     {errors?.addressNumber && <span className="text-sm text-red-500 mt-1 block">{errors.addressNumber.message as string}</span>}
    </div>
    <div className="w-full">
     <Input {...register("sector")} placeholder="Local de Retirada" />
     {errors?.sector && <span className="text-sm text-red-500 mt-1 block">{errors.sector.message as string}</span>}
    </div>
    <div className="w-full">
     <Input {...register("responsibleName")} placeholder="Nome do Responsável/Setor" />
     {errors?.responsibleName && <span className="text-sm text-red-500 mt-1 block">{errors.responsibleName.message as string}</span>}
    </div>
    <Controller
     name="contact"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       {maskedField("cellphone", field.onChange, field.name, "Telefone de Contato", false, field.onBlur, field.value, false, `w-full`)}
       {errors?.contact && <span className="text-sm text-red-500 mt-1 block">{errors.contact.message as string}</span>}
      </div>
     )}
    />
   </div>
   <div className="grid grid-cols-1 mt-4">
    <label className="flex items-center gap-2 text-sm text-zinc-700">
     <input type="checkbox" className="accent-mainlilly w-4 h-4" {...register("saveAddress")} />
     Salvar endereço
    </label>
   </div>
  </div>
 );
};
