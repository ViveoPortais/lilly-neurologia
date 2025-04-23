import { UFlist } from "@/helpers/select-filters";
import { CustomSelect } from "../custom/CustomSelect";
import { Input } from "../ui/input";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { Controller } from "react-hook-form";

interface Step1Props {
  register: any;
  errors: any;
  watch: any;
  control: any;
  handleCrmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLicenseStateChange: (value: string) => void;
  medicalSpecialtyOptions: any;
  isDoctorInfoLoading: boolean;
}

export const Step1 = ({
  register,
  errors,
  watch,
  handleCrmChange,
  handleLicenseStateChange,
  medicalSpecialtyOptions,
  isDoctorInfoLoading,
  control,
}: Step1Props) => {
  return (
    <>
      <div>
        <Input {...register("licenseNumber")} placeholder="Número do CRM" onChange={handleCrmChange} />
        {errors.licenseNumber && <span className="text-sm text-red-500">{errors.licenseNumber.message}</span>}
      </div>

      <div>
        <Controller
          name="licenseState"
          control={control}
          render={({ field }) => (
            <CustomSelect
              name="licenseState"
              label="UF do CRM"
              value={field.value}
              onChange={handleLicenseStateChange}
              options={UFlist}
              customClass="w-full"
            />
          )}
        />
        {errors.licenseState && <span className="text-sm text-red-500">{errors.licenseState.message}</span>}
      </div>

      <div>
        <Controller
          name="medicalSpecialty"
          control={control}
          render={({ field }) => (
            <CustomFilterSelect
              label="Especialidade"
              options={medicalSpecialtyOptions}
              {...field}
              isLoading={isDoctorInfoLoading}
            />
          )}
        />
        {errors.medicalSpecialty && <span className="text-sm text-red-500">{errors.medicalSpecialty.message}</span>}
      </div>
    </>
  );
};
