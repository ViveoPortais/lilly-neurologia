// components/steps/Step2.tsx
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

interface Step2Props {
 register: any;
 control: any;
 errors: any;
 cellphoneError: string | null;
 setCellphoneError: (value: string | null) => void;
 isDoctorInfoLoading: boolean;
 role: string;
 maskedField: (
  type: "cpf" | "cellphone",
  onChange: (e: any) => void,
  name: string,
  label: string,
  disabled: boolean,
  onBlur: () => void,
  value: string
 ) => JSX.Element;
 isValidPhoneNumber: (value: string) => boolean;
 setValue: any;
 clearErrors: any;
}

export const Step2 = ({
 register,
 control,
 errors,
 cellphoneError,
 setCellphoneError,
 maskedField,
 isValidPhoneNumber,
 isDoctorInfoLoading,
 role,
 setValue,
 clearErrors,
}: Step2Props) => {
 return (
  <>
   <div>
    <Input
     {...register("doctorName")}
     placeholder="Nome Completo"
     isLoading={role == "medico" ? isDoctorInfoLoading : null}
     onChange={(e) => {
      const onlyLetters = e.target.value.replace(/[0-9]/g, "");
      setValue("doctorName", onlyLetters);
      clearErrors("doctorName");
     }}
     disabled={role == "medico"}
     required
    />
    {errors.doctorName && <span className="text-sm text-red-500">{errors.doctorName.message}</span>}
   </div>

   <div>
    <Controller
     name="cpf"
     control={control}
     render={({ field }) => maskedField("cpf", field.onChange, field.name, "CPF", true, () => {}, field.value)}
    />
    {errors.cpf && <span className="ml-2 w-full text-sm text-red-500 mt-1">{errors.cpf.message}</span>}
   </div>

   <div>
    <Input {...register("emailAddress")} placeholder="E-mail" isLoading={role == "medico" ? isDoctorInfoLoading : null} required />
    {errors.emailAddress && <span className="text-sm text-red-500">{errors.emailAddress.message}</span>}
   </div>

   <div>
    <Controller
     name="telephoneNumber"
     control={control}
     render={({ field }) => {
      const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       const value = e.target.value;
       const cleanPhone = value.replace(/\D/g, "");
       if (isValidPhoneNumber(cleanPhone)) {
        field.onChange(value);
        setCellphoneError(null);
       } else {
        setCellphoneError("Telefone inválido");
        field.onChange(value);
       }
      };

      return maskedField("cellphone", handlePhoneChange, field.name, "Celular", true, () => {}, field.value);
     }}
    />
    {cellphoneError && <span className="ml-2 w-full text-sm text-red-500 mt-1">{cellphoneError}</span>}
    {errors.telephoneNumber && <span className="ml-2 w-full text-sm text-red-500 mt-1">{errors.telephoneNumber.message}</span>}
   </div>
  </>
 );
};
