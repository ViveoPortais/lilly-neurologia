// components/steps/Step3.tsx
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

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
}

export const Step3 = ({ control, register, errors, maskedField, handleCepBlur, infoSearchCep }: Step3Props) => {
  return (
    <>
      <div>
        <Controller
          name="addressPostalCode"
          control={control}
          render={({ field }) =>
            maskedField("cep", field.onChange, field.name, "CEP", false, () => handleCepBlur(field.value), field.value)
          }
        />
        {errors.addressPostalCode && <span className="ml-2 w-full text-xs text-red-400 mt-1">{errors.addressPostalCode.message}</span>}
      </div>

      <div>
        <Input {...register("addressCity")} placeholder="Cidade" isLoading={infoSearchCep} />
        {errors.addressCity && <span className="text-sm text-red-500">{errors.addressCity.message}</span>}
      </div>

      <div>
        <Input {...register("addressState")} placeholder="UF" isLoading={infoSearchCep} />
        {errors.addressState && <span className="text-sm text-red-500">{errors.addressState.message}</span>}
      </div>
    </>
  );
};
