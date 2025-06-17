import { Step1 } from "@/components/register/Step1";
import { Step2 } from "@/components/register/Step2";
import { Step3 } from "@/components/register/Step3";
import { Checkbox } from "@/components/ui/checkbox";
import { usePdfModal } from "@/contexts/PdfModalContext";
import { AnimatePresence, motion } from "framer-motion";
import { Controller } from "react-hook-form";

interface RegisterProps {
 role: string;
 errors: any;
 register: any;
 control: any;
 watch: any;
 step: number;
 handleCrmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 handleLicenseStateChange: (value: string) => void;
 isDoctorInfoLoading: boolean;
 medicalSpecialtyOptions: any[];
 cellphoneError: any;
 isValidPhoneNumber: (value: string) => boolean;
 maskedField: (
  type: "cpf" | "cellphone" | "cep",
  onChange: (e: any) => void,
  name: string,
  label: string,
  disabled: boolean,
  onBlur: () => void,
  value: string
 ) => JSX.Element;
 handleCepBlur: (value: string) => void;
 infoSearchCep: boolean;
 setCellphoneError: (value: string | null) => void;
 setValue: any;
 clearErrors: any;
}

export default function RegisterMobile({
 cellphoneError,
 errors,
 register,
 control,
 watch,
 handleCrmChange,
 handleLicenseStateChange,
 isDoctorInfoLoading,
 role,
 medicalSpecialtyOptions,
 isValidPhoneNumber,
 maskedField,
 handleCepBlur,
 infoSearchCep,
 setCellphoneError,
 step,
 setValue,
 clearErrors,
}: RegisterProps) {
 const { openPdfModal, closePdfModal } = usePdfModal();
 return (
  <AnimatePresence mode="wait">
   {role === "medico" && step === 1 && (
    <motion.div
     key="step1"
     initial={{ opacity: 0, x: 50 }}
     animate={{ opacity: 1, x: 0 }}
     exit={{ opacity: 0, x: -50 }}
     transition={{ duration: 0.3 }}
     className="grid md:grid-cols-3 gap-4"
    >
     <h2>Dados Médico</h2>
     <Step1
      errors={errors}
      handleCrmChange={handleCrmChange}
      handleLicenseStateChange={handleLicenseStateChange}
      isDoctorInfoLoading={isDoctorInfoLoading}
      medicalSpecialtyOptions={medicalSpecialtyOptions}
      register={register}
      watch={watch}
      control={control}
     />
    </motion.div>
   )}

   {step === (role === "medico" ? 2 : 1) && (
    <motion.div
     key="step2"
     initial={{ opacity: 0, x: 50 }}
     animate={{ opacity: 1, x: 0 }}
     exit={{ opacity: 0, x: -50 }}
     transition={{ duration: 0.3 }}
     className="grid md:grid-cols-4 gap-4"
    >
     <h2>Dados Pessoais</h2>
     <Step2
      cellphoneError={cellphoneError}
      setCellphoneError={setCellphoneError}
      errors={errors}
      register={register}
      control={control}
      isValidPhoneNumber={isValidPhoneNumber}
      maskedField={maskedField}
      isDoctorInfoLoading={isDoctorInfoLoading}
      role={role}
      setValue={setValue}
      clearErrors={clearErrors}
     />
    </motion.div>
   )}

   {step === (role === "medico" ? 3 : 2) && (
    <motion.div
     key="step3"
     initial={{ opacity: 0, x: 50 }}
     animate={{ opacity: 1, x: 0 }}
     exit={{ opacity: 0, x: -50 }}
     transition={{ duration: 0.3 }}
     className="grid md:grid-cols-3 gap-4"
    >
     <h2>Endereço</h2>
     <Step3
      control={control}
      register={register}
      errors={errors}
      maskedField={maskedField}
      handleCepBlur={handleCepBlur}
      infoSearchCep={infoSearchCep}
      setValue={setValue}
      clearErrors={clearErrors}
     />

     <div className="col-span-full space-y-2">
      <Controller
       name="consentLGPD"
       control={control}
       render={({ field }) => (
        <div className="flex items-center gap-2">
         <Checkbox
          id="consentLGPD"
          checked={field.value || false}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          className="border border-[#82786F] data-[state=checked]:bg-white data-[state=checked]:text-[#82786F]"
          disabled
         />
         <span className="text-sm text-[#82786F] leading-snug">
          LI E ACEITO O{" "}
          <span
           onClick={() =>
            openPdfModal({
             pdfUrl: "/files/Regulamento Médico_PSD_Neurologia_VFinal.pdf",
             showAgree: true,
             showDisagree: true,
             showDownload: true,
             onAgree: () => {
              field.onChange(true);
              closePdfModal();
             },
             onDisagree: () => {
              field.onChange(false);
              closePdfModal();
             },
            })
           }
           className="underline cursor-pointer text-[#666666] font-bold"
          >
           TERMO DE CONSENTIMENTO PARA PARTICIPAÇÃO NO PROGRAMA
          </span>
          <span className="text-mainlilly"> *</span>
         </span>
        </div>
       )}
      />
      {errors.consentLGPD && <span className="text-sm text-red-500">{errors.consentLGPD.message}</span>}

      <Controller
       name="programParticipationConsent"
       control={control}
       render={({ field }) => (
        <div className="flex items-center gap-2">
         <Checkbox
          id="programParticipationConsent"
          checked={field.value || false}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          className="border border-[#82786F] data-[state=checked]:bg-white data-[state=checked]:text-[#82786F]"
         />
         <label htmlFor="programParticipationConsent" className="text-sm text-[#82786F] leading-snug">
          <span>
           AFIRMO QUE LI E CONFERI MEUS DADOS PESSOAIS E QUE TODAS AS INFORMAÇÕES AQUI PREENCHIDAS SÃO{" "}
           <span className="whitespace-nowrap">
            VERDADEIRAS<span className="text-mainlilly"> *</span>
           </span>
          </span>
         </label>
        </div>
       )}
      />
      {errors.programParticipationConsent && <span className="text-sm text-red-500">{errors.programParticipationConsent.message}</span>}
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
}
