"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { maskedField } from "@/components/custom/MaskedField";
import { useEffect, useState } from "react";
import { AddressData } from "@/services/api";
import { toast } from "react-toastify";

export function Step2({ control, errors, setValue }: any) {
  const { register, watch } = useFormContext();
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const useSameAddress = watch("useSameAddress");

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>, type: "pickup" | "address") => {
    const rawCep = e.target.value.replace(/\D/g, "");
    if (rawCep.length === 8) {
      setIsFetchingCep(true);
      const data = await AddressData(rawCep);
      if (data && !data.erro) {
        const prefix = type === "pickup" ? "pickupAddress" : "address";
        setValue(`${prefix}Name`, data.logradouro || "");
        setValue(`${prefix}District`, data.bairro || "");
        setValue(`${prefix}City`, data.localidade || "");
        setValue(`${prefix}State`, data.uf || "");
      } else {
        toast.error("CEP inválido ou não encontrado");
      }
      setIsFetchingCep(false);
    }
  };

  useEffect(() => {
    if (useSameAddress) {
      setValue("addressPostalCode", "");
      setValue("addressName", "");
      setValue("addressNumber", "");
      setValue("addressComplement", "");
      setValue("addressDistrict", "");
      setValue("addressCity", "");
      setValue("addressState", "");
    }
  }, [useSameAddress, setValue]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg text-gray-600 mb-2">Endereço de Envio do Tubo</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Controller
            name="pickupPostalCode"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                {maskedField("cep", field.onChange, field.name, "CEP", false, (e) => handleCepBlur(e, "pickup"), field.value, false, `w-full`)}
                {errors?.pickupPostalCode && <span className="text-sm text-red-500 block mt-1">{errors.pickupPostalCode.message}</span>}
              </div>
            )}
          />
          <div className="w-full">
            <Input {...register("pickupAddressName")} placeholder="Rua" />
            {errors?.pickupAddressName && <span className="text-sm text-red-500 block mt-1">{errors.pickupAddressName.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("pickupNumber")} placeholder="Número" />
            {errors?.pickupNumber && <span className="text-sm text-red-500 block mt-1">{errors.pickupNumber.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("pickupAddressComplement")} placeholder="Complemento (opcional)" />
            {errors?.pickupAddressComplement && <span className="text-sm text-red-500 block mt-1">{errors.pickupAddressComplement.message}</span>}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="w-full">
            <Input {...register("pickupAddressDistrict")} placeholder="Bairro" />
            {errors?.pickupAddressDistrict && <span className="text-sm text-red-500 block mt-1">{errors.pickupAddressDistrict.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("pickupAddressCity")} placeholder="Cidade" />
            {errors?.pickupAddressCity && <span className="text-sm text-red-500 block mt-1">{errors.pickupAddressCity.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("pickupAddressState")} placeholder="Estado" />
            {errors?.pickupAddressState && <span className="text-sm text-red-500 block mt-1">{errors.pickupAddressState.message}</span>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg text-gray-600 mb-2">Endereço de Retirada da Amostra</h2>
        <label className="flex items-center gap-2 text-sm text-zinc-700 mb-3">
          <input type="checkbox" className="accent-mainlilly w-4 h-4" {...register("useSameAddress")} />
          Utilizar o mesmo endereço da coleta
        </label>

        <div className="grid md:grid-cols-4 gap-4">
          <Controller
            name="addressPostalCode"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                {maskedField("cep", field.onChange, field.name, "CEP", false, (e) => handleCepBlur(e, "address"), field.value, useSameAddress, `w-full`)}
                {errors?.addressPostalCode && <span className="text-sm text-red-500 mt-1 block">{errors.addressPostalCode.message}</span>}
              </div>
            )}
          />
          <div className="w-full">
            <Input {...register("addressName")} placeholder="Rua" disabled={useSameAddress} isLoading={isFetchingCep} />
            {errors?.addressName && <span className="text-sm text-red-500 block mt-1">{errors.addressName.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("addressNumber")} disabled={useSameAddress} placeholder="Número" />
            {errors?.addressNumber && <span className="text-sm text-red-500 block mt-1">{errors.addressNumber.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("addressComplement")} disabled={useSameAddress} placeholder="Complemento (opcional)" />
            {errors?.addressComplement && <span className="text-sm text-red-500 block mt-1">{errors.addressComplement.message}</span>}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="w-full">
            <Input {...register("addressDistrict")} disabled={useSameAddress} placeholder="Bairro" />
            {errors?.addressDistrict && <span className="text-sm text-red-500 block mt-1">{errors.addressDistrict.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("addressCity")} disabled={useSameAddress} placeholder="Cidade" />
            {errors?.addressCity && <span className="text-sm text-red-500 block mt-1">{errors.addressCity.message}</span>}
          </div>
          <div className="w-full">
            <Input {...register("addressState")} disabled={useSameAddress} placeholder="Estado" />
            {errors?.addressState && <span className="text-sm text-red-500 block mt-1">{errors.addressState.message}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}