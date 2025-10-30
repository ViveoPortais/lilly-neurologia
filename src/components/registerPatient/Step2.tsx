"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { maskedField } from "@/components/custom/MaskedField";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { useEffect, useState } from "react";
import { AddressData } from "@/services/api";
import { toast } from "react-toastify";
import { isValidPhoneNumber } from "@/helpers/helpers";
import { IStringMap } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

export function Step2({ control, errors, setValue, logisticsAddressType, logisticsScheduleAddressType, methods, selectedLogisticsAddressType, selectedLogisticsScheduleAddressType }: any) {
  const { register, watch } = useFormContext();
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const useSameAddress = watch("useSameAddress");
  const [pickupContactError, setPickupContactError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);


  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>, type: "pickup" | "address") => {
    const rawCep = e.target.value.replace(/\D/g, "");
    const prefix = type === "pickup" ? "pickupAddress" : "address";
    if (rawCep.length === 8) {
      setIsFetchingCep(true);
      const data = await AddressData(rawCep);
      if (data && !data.erro) {
        setValue(`${prefix}Name`, data.logradouro || "");
        setValue(`${prefix}District`, data.bairro || "");
        setValue(`${prefix}City`, data.localidade || "");
        setValue(`${prefix}State`, data.uf || "");
      } else {
        toast.error("CEP inválido ou não encontrado");
      }
      setIsFetchingCep(false);
    } else {
      toast.warning("CEP inválido ou não encontrado");
      setValue(`${type}PostalCode`, "");
      setValue(`${prefix}Name`, "");
      setValue(`${prefix}District`, "");
      setValue(`${prefix}City`, "");
      setValue(`${prefix}State`, "");
    }
  };



  useEffect(() => {
    if (useSameAddress) {


      let logisticsScheduleAddressTypeSameFlag = 
          logisticsScheduleAddressType?.find((x: IStringMap) => x.flag === selectedLogisticsAddressType.flag) || null;

      setValue("logisticsScheduleAddressType", logisticsScheduleAddressTypeSameFlag.stringMapId);

      // Copiar campos comerciais
      setValue("localName", watch("pickupLocalName") || "");
      setValue("companyName", watch("pickupCompanyName") || "");
      setValue("cnpj", watch("pickupCNPJ") || "");

      // Copiar endereço
      setValue("addressPostalCode", watch("pickupPostalCode") || "");
      setValue("addressName", watch("pickupAddressName") || "");
      setValue("addressNumber", watch("pickupNumber") || "");
      setValue("addressComplement", watch("pickupAddressComplement") || "");
      setValue("addressDistrict", watch("pickupAddressDistrict") || "");
      setValue("addressCity", watch("pickupAddressCity") || "");
      setValue("addressState", watch("pickupAddressState") || "");
      setValue("sector", watch("pickupSector") || "");
      setValue("contact", watch("pickupContact") || "");
    } else {
      setValue("logisticsScheduleAddressType", "");
      setValue("localName", "");
      setValue("companyName", "");
      setValue("cnpj", "");
      setValue("addressPostalCode", "");
      setValue("addressName", "");
      setValue("addressNumber", "");
      setValue("addressComplement", "");
      setValue("addressDistrict", "");
      setValue("addressCity", "");
      setValue("addressState", "");
      setValue("sector", "");
      setValue("contact", "");
    }
  }, [useSameAddress, setValue, watch]);




  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg text-gray-600 mb-2">Endereço de Envio do Tubo</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <Controller
            name="logisticsAddressType"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <CustomFilterSelect options={logisticsAddressType} value={field.value} onChange={field.onChange} name="logisticsAddressType" label="Tipo de Endereço" />
                {errors?.logisticsAddressType && <span className="text-sm text-red-500 mt-1 block">{errors.logisticsAddressType.message as string}</span>}
              </div>
            )}
          />
        </div>
        <AnimatePresence>
          {(selectedLogisticsAddressType != null && selectedLogisticsAddressType.flag === "#COMMERCIAL") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="w-full">
                  <Input {...register("pickupLocalName")} placeholder="Nome do Local" />
                  {errors?.pickupLocalName && <span className="text-sm text-red-500 block mt-1">{errors.pickupLocalName.message}</span>}
                </div>
                <div className="w-full">
                  <Input {...register("pickupCompanyName")} placeholder="Razão Social" />
                  {errors?.pickupCompanyName && <span className="text-sm text-red-500 block mt-1">{errors.pickupCompanyName.message}</span>}
                </div>
                <Controller
                  name="pickupCNPJ"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      {maskedField("cnpj", field.onChange, field.name, "CNPJ", false, field.onBlur, field.value, false, `w-full`)}
                      {errors?.pickupCNPJ && <span className="text-sm text-red-500 block mt-1">{errors.pickupCNPJ.message}</span>}
                    </div>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="w-full">
                  <Input {...register("pickupSector")} placeholder="Nome do Responsável/Setor" />
                  {errors?.pickupSector && <span className="text-sm text-red-500 block mt-1">{errors.pickupSector.message}</span>}
                </div>
                <div className="w-full">
                  <Controller
                    name="pickupContact"
                    control={control}
                    render={({ field }) => {
                      const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        const cleanPhone = value.replace(/\D/g, "");
                        if (!value) {
                          setPickupContactError("Telefone de contato é obrigatório");
                        } else if (!isValidPhoneNumber(cleanPhone)) {
                          setPickupContactError("Telefone inválido");
                        } else {
                          setPickupContactError(null);
                        }

                        field.onChange(value);
                      };
                      return maskedField("cellphone", handlePhoneChange, field.name, "Telefone de Contato", false, () => { }, field.value, false);
                    }}
                  />
                  {errors?.pickupContact && <span className="text-sm text-red-500 block mt-1">{errors.pickupContact.message}</span>}
                  {pickupContactError && <span className="text-sm text-red-500 block mt-1">{pickupContactError}</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedLogisticsAddressType != null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-4 gap-4 mb-4">
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
                  <Input {...register("pickupAddressName")} placeholder="Rua" isLoading={isFetchingCep} />
                  {errors?.pickupAddressName && <span className="text-sm text-red-500 block mt-1">{errors.pickupAddressName.message}</span>}
                </div>
                <div className="w-full">
                  <Input {...register("pickupNumber")} placeholder="Número" />
                  {errors?.pickupNumber && <span className="text-sm text-red-500 block mt-1">{errors.pickupNumber.message}</span>}
                </div>
                <div className="w-full">
                  <Input {...register("pickupAddressComplement")} placeholder="Complemento/Sala/Consultório" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <h2 className="font-semibold text-lg text-gray-600 mb-2">Endereço de Retirada da Amostra</h2>
        <label className="flex items-center gap-2 text-sm text-zinc-700 mb-3">
          <input type="checkbox" className="accent-mainlilly w-4 h-4" {...register("useSameAddress")} />
          Utilizar o Endereço da Entrega para retirada da amostra
        </label>

        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <Controller
            name="logisticsScheduleAddressType"
            control={control}
            render={({ field }) => (
              <div className="w-full">
                <CustomFilterSelect 
                  options={logisticsScheduleAddressType} 
                  value={field.value} 
                  onChange={useSameAddress ? () => {} : field.onChange} 
                  name="logisticsScheduleAddressType" 
                  label="Tipo de Endereço"
                  placeholder={"Selecione..."}
                  disabled={useSameAddress}
                />
                {errors?.logisticsScheduleAddressType && <span className="text-sm text-red-500 mt-1 block">{errors.logisticsScheduleAddressType.message as string}</span>}
              </div>
            )}
          />
        </div>

        <AnimatePresence>
          {(selectedLogisticsScheduleAddressType != null && selectedLogisticsScheduleAddressType.flag === "#COMMERCIAL") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="w-full">
                  <Input {...register("localName")} placeholder="Nome do Local" disabled={useSameAddress} />
                  {errors?.localName && <span className="text-sm text-red-500 block mt-1">{errors.localName.message}</span>}
                </div>
                <div className="w-full">
                  <Input {...register("companyName")} placeholder="Razão Social" disabled={useSameAddress} />
                  {errors?.companyName && <span className="text-sm text-red-500 block mt-1">{errors.companyName.message}</span>}
                </div>
                <Controller
                  name="cnpj"
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      {maskedField("cnpj", field.onChange, field.name, "CNPJ", false, field.onBlur, field.value, useSameAddress, `w-full`)}
                      {errors?.cnpj && <span className="text-sm text-red-500 block mt-1">{errors.cnpj.message}</span>}
                    </div>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="w-full">
                  <Input {...register("sector")} disabled={useSameAddress} placeholder="Nome do Responsável/Setor" />
                  {errors?.sector && <span className="text-sm text-red-500 block mt-1">{errors.sector.message}</span>}
                </div>
                <div className="w-full">
                  <Controller
                    name="contact"
                    control={control}
                    render={({ field }) => {
                      const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value;
                        const cleanPhone = value.replace(/\D/g, "");
                        if (!isValidPhoneNumber(cleanPhone)) {
                          setContactError("Telefone inválido");
                        } else {
                          setContactError(null);
                        }
                        field.onChange(value);
                      };
                      return maskedField("cellphone", handlePhoneChange, field.name, "Telefone de Contato", false, () => { }, field.value, useSameAddress);
                    }}
                  />
                  {errors?.contact && <span className="text-sm text-red-500 block mt-1">{errors.contact.message}</span>}
                  {contactError && <span className="text-sm text-red-500 block mt-1">{contactError}</span>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedLogisticsScheduleAddressType != null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-4 gap-4 mb-4">

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
                  <Input {...register("addressComplement")} disabled={useSameAddress} placeholder="Complemento/Sala/Consultório" />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}