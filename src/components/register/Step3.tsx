// components/steps/Step3.tsx
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { CustomSelect } from "../custom/CustomSelect";
import { UFlist } from "@/helpers/select-filters";

interface Step3Props {
 control: any;
 register: any;
 errors: any;
 maskedField: (
  type: "cep",
  onChange: (e: any) => void,
  name: string,
  label: string,
  disabled: boolean,
  onBlur: () => void,
  value: string
 ) => JSX.Element;
 handleCepBlur: (value: string) => void;
 infoSearchCep: boolean;
 setValue: any;
 clearErrors: any;
}

export const Step3 = ({ control, register, errors, maskedField, handleCepBlur, infoSearchCep, setValue, clearErrors }: Step3Props) => {
 return (
  <>
   <div>
    <Controller
     name="addressPostalCode"
     control={control}
     render={({ field }) => maskedField("cep", field.onChange, field.name, "CEP", true, () => handleCepBlur(field.value), field.value)}
    />
    {errors.addressPostalCode && <span className="ml-2 w-full text-xs text-red-400 mt-1">{errors.addressPostalCode.message}</span>}
   </div>

   <div>
    <Input
     {...register("addressCity")}
     placeholder="Cidade"
     onChange={(e) => {
      const onlyLetters = e.target.value.replace(/[0-9]/g, "");
      setValue("addressCity", onlyLetters);
      clearErrors("addressCity");
     }}
     isLoading={infoSearchCep}
     required
    />
    {errors.addressCity && <span className="text-sm text-red-500">{errors.addressCity.message}</span>}
   </div>

   <div>
    <Controller
     name="addressState"
     control={control}
     render={({ field }) => (
      <CustomSelect
       name="addressState"
       label={
        <>
         UF <span className="text-red-500">*</span>
        </>
       }
       value={field.value}
       onChange={(value) => {
        field.onChange(value);
       }}
       options={UFlist}
       customClass="w-full"
      />
     )}
    />
    {errors.addressState && <span className="text-sm text-red-500">{errors.addressState.message}</span>}
   </div>
  </>
 );
};
