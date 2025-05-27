"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { addDoctor, getDoctorbyCRM, getListSpecialties } from "@/services/doctor";
import { IDoctorData, IMedicalSpecialty, IStringMap } from "@/types";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import StepIndicator from "../custom/StepIndicator";
import { Separator } from "../ui/separator";
import { maskedField } from "../custom/MaskedField";
import { isValidPhoneNumber } from "@/helpers/helpers";
import { AddressData } from "@/services/api";
import { getRegisterSignUpSchema } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { IProfessionalData } from "@/types/professions";
import { addProfessional } from "@/services/professions";
import { useGenericModal } from "@/contexts/GenericModalContext";
import RegisterDesktop from "../home/desktop/RegisterDesktop";
import RegisterMobile from "../home/mobile/RegisterMobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function MedicalSignUpModal({ role, onClose }: { role: string; onClose: () => void }) {
 const [step, setStep] = useState(1);
 const [isDoctorInfoLoading, setIsDoctorInfoLoading] = useState(false);
 const [infoSearchCep, setInfoSearchCep] = useState(false);
 const [medicalSpecialtyOptions, setMedicalSpecialtyOptions] = useState<IStringMap[]>([]);
 const [cellphoneError, setCellphoneError] = useState<string | null>(null);
 const router = useRouter();
 const modal = useGenericModal();
 const isMobile = useMediaQuery("(max-width: 768px)");

 const schema = useMemo(() => getRegisterSignUpSchema(role), [role]);
 type FormSchema = z.infer<ReturnType<typeof getRegisterSignUpSchema>>;

 const {
  register,
  handleSubmit,
  setValue,
  getValues,
  watch,
  control,
  reset,
  clearErrors,
  formState: { errors, isValid, isSubmitting },
 } = useForm<FormSchema>({
  resolver: zodResolver(schema),
  mode: "onChange",
 });

 const createListSpecialties = async () => {
  try {
   const response = await getListSpecialties();
   const mapped = response.map((item: IMedicalSpecialty) => ({
    stringMapId: item.name,
    optionName: item.name,
   }));
   setMedicalSpecialtyOptions(mapped);
  } catch (error) {
   console.error("Erro ao obter lista de especialidades", error);
  }
 };

 const fetchDoctorInfo = async (licenseState: string) => {
  if (!licenseState) return;
  setIsDoctorInfoLoading(true);
  setValue("medicalSpecialty", "");
  try {
   const crm = getValues("licenseNumber");
   const ufcrm = licenseState;
   if (crm && ufcrm) {
    const response = await getDoctorbyCRM({ crm, ufcrm });

    if (response) {
     setValue("doctorName", response.name);
     setValue("emailAddress", response.email);
     setValue("telephoneNumber", response.telephone);
     await createListSpecialties();
     if (response.medicalSpecialty !== "") setValue("medicalSpecialty", response.medicalSpecialty);
    } else {
     toast.warning("O CRM informado pode estar irregular ou inativo");
     setValue("licenseState", "");
     setValue("doctorName", "");
     setValue("emailAddress", "");
     setValue("telephoneNumber", "");
    }
   }
  } catch (error) {
   console.error("Erro ao buscar informações do médico", error);
  } finally {
   setIsDoctorInfoLoading(false);
  }
 };

 const createDoctorData = (data: FormSchema): IDoctorData => ({
  ...data,
 });

 const createProfessionalData = (data: FormSchema): IProfessionalData => ({
  name: data.doctorName,
  cpf: data.cpf,
  emailAddress1: data.emailAddress,
  mobilephone1: data.telephoneNumber,
  addressPostalCode: data.addressPostalCode,
  addressCity: data.addressCity,
  addressState: data.addressState,
  programParticipationConsent: data.programParticipationConsent,
  consentLGPD: data.consentLGPD,
 });

 const handleRegistration = async (data: FormSchema) => {
  if (role === "medico") {
   return await addDoctor(createDoctorData(data));
  } else {
   return await addProfessional(createProfessionalData(data));
  }
 };

 const onSubmit = async (data: FormSchema) => {
  if (!isValid) return;

  try {
   const res = await handleRegistration(data);
   if (res.isValidData) {
    modal.showModal(
     {
      type: "success",
      title: res.additionalMessage,
      message: "Agora você pode acessar e gerenciar as informações conforme necessário",
     },
     () => {
      onClose();
      router.push("/signin");
     }
    );
   } else {
    modal.showModal({
     type: "error",
     title: "Ocorreu um erro",
     message: res.additionalMessage,
    });
   }
  } catch (error: any) {
   modal.showModal(
    {
     type: "error",
     title: "Ocorreu um erro",
     message: error.response?.data?.additionalMessage || "Erro inesperado.",
    },
    () => {
     onClose();
     router.push("/signin");
    }
   );
  } finally {
   reset();
  }
 };

 const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/\D/g, "");
  setValue("licenseNumber", value);
 };

 const handleLicenseStateChange = (value: string) => {
  const crm = getValues("licenseNumber");
  setValue("licenseState", value);

  if (value === "RJ" && crm?.startsWith("52")) {
   toast.warning(
    "Não é necessário incluir o código 52 no campo do CRM. Por favor, remova o código 52 e insira apenas o número de registro."
   );
   setValue("licenseState", "");
   return;
  }

  if (role === "medico") {
   fetchDoctorInfo(value);
  }
 };

 const handleCepBlur = async (cepValue: string) => {
  if (cepValue.length === 9) {
   setInfoSearchCep(true);
   const data = await AddressData(cepValue);
   if (data && data.erro !== true) {
    setValue("addressCity", data.localidade || "");
    setValue("addressState", data.uf || "");
    setInfoSearchCep(false);
   } else {
    toast.error("CEP inválido ou não encontrado");
    setInfoSearchCep(false);
   }
  }
 };

 const validateStepFields = async () => {
  const currentStepFields: Record<number, (keyof FormSchema)[]> =
   role === "medico"
    ? {
       1: ["licenseNumber", "licenseState", "medicalSpecialty"],
       2: ["doctorName", "cpf", "emailAddress", "telephoneNumber"],
       3: ["addressPostalCode", "addressCity", "addressState", "consentLGPD", "programParticipationConsent"],
      }
    : {
       1: ["doctorName", "cpf", "emailAddress", "telephoneNumber"],
       2: ["addressPostalCode", "addressCity", "addressState", "consentLGPD", "programParticipationConsent"],
      };

  const fieldsToValidate = currentStepFields[step];
  const values = Object.fromEntries(fieldsToValidate.map((field) => [field, getValues(field)]));

  const invalidFields = fieldsToValidate.filter((field: any) => {
   const value = values[field];
   return !value || (typeof value === "string" && value.trim() === "");
  });

  if (invalidFields.length > 0) {
   toast.warning("Por favor, preencha todos os campos antes de continuar.");
   return false;
  }

  return true;
 };

 return (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
   <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl p-10">
    <div>
     <h2>{role === "medico" ? "Cadastro médico" : "Cadastro Assistente Médico"}</h2>
     <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black transition">
      <X className="w-6 h-6" />
     </button>
    </div>

    <Separator className="bg-gray-400/80 mb-6 mt-2" />

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
     {isMobile && <StepIndicator step={step} setStep={setStep} totalSteps={role === "medico" ? 3 : 2} />}

     {isMobile ? (
      <RegisterMobile
       cellphoneError={cellphoneError}
       setCellphoneError={setCellphoneError}
       errors={errors}
       register={register}
       control={control}
       isValidPhoneNumber={isValidPhoneNumber}
       maskedField={maskedField}
       isDoctorInfoLoading={isDoctorInfoLoading}
       role={role}
       handleCrmChange={handleCrmChange}
       handleLicenseStateChange={handleLicenseStateChange}
       handleCepBlur={handleCepBlur}
       infoSearchCep={infoSearchCep}
       watch={watch}
       medicalSpecialtyOptions={medicalSpecialtyOptions}
       step={step}
       setValue={setStep}
       clearErrors={clearErrors}
      />
     ) : (
      <RegisterDesktop
       cellphoneError={cellphoneError}
       setCellphoneError={setCellphoneError}
       errors={errors}
       register={register}
       control={control}
       isValidPhoneNumber={isValidPhoneNumber}
       maskedField={maskedField}
       isDoctorInfoLoading={isDoctorInfoLoading}
       role={role}
       handleCrmChange={handleCrmChange}
       handleLicenseStateChange={handleLicenseStateChange}
       handleCepBlur={handleCepBlur}
       infoSearchCep={infoSearchCep}
       watch={watch}
       medicalSpecialtyOptions={medicalSpecialtyOptions}
       clearErrors={clearErrors}
       setValue={setValue}
      />
     )}

     <div className="flex justify-between gap-2 mt-6">
      {isMobile ? (
       <>
        {step === 1 && (
         <Button variant="outlineMainlilly" type="button" size={"lg"} className="w-full" onClick={onClose}>
          Cancelar
         </Button>
        )}
        {step > 1 && (
         <Button variant="outlineMainlilly" type="button" size={"lg"} className="w-full" onClick={() => setStep(step - 1)}>
          Voltar
         </Button>
        )}
        {step < (role === "medico" ? 3 : 2) ? (
         <Button
          variant="default"
          type="button"
          size={"lg"}
          className="w-full"
          onClick={async () => {
           const isValid = await validateStepFields();
           if (isValid) {
            setStep(step + 1);
           }
          }}
         >
          Próximo
         </Button>
        ) : (
         <Button variant="default" size={"lg"} className="w-full" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
         </Button>
        )}
       </>
      ) : (
       <>
        <Button variant="outlineMainlilly" size={"lg"} className="w-full" type="button" onClick={onClose}>
         Cancelar
        </Button>
        <Button variant="default" size={"lg"} className="w-full" type="submit" disabled={!isValid || isSubmitting}>
         {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
        </Button>
       </>
      )}
     </div>
    </form>
   </div>
  </div>
 );
}
