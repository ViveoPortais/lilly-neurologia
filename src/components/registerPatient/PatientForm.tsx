import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import StepIndicator from "../custom/StepIndicator";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./professional/Step3";
import { patientSchema } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
 fetchDiseases,
 fetchExams,
 fetchGenders,
 fetchLabs,
 getDoctorInfo,
 submitPatientRegistration,
} from "@/store/slices/registerPatientSlice";
import { Step3Doctor } from "./doctor/Step3";
import useSession from "@/hooks/useSession";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useRouter } from "next/navigation";

type Props = {
 role: string;
 isMobile: boolean;
};

export default function PatientForm({ role, isMobile }: Props) {
 const [step, setStep] = useState(1);
 const auth = useSession();
 const dispatch = useAppDispatch();
 const genders = useAppSelector((state) => state.registerPatient.data.genders);
 const exams = useAppSelector((state) => state.registerPatient.data.exams);
 const labs = useAppSelector((state) => state.registerPatient.data.labs);
 const diseases = useAppSelector((state) => state.registerPatient.data.diseases);
 const doctorId = useAppSelector((state) => state.registerPatient.data.doctorId);
 const isSubmitting = useAppSelector((state) => state.registerPatient.isSubmitting);
 const router = useRouter();

 const methods = useForm({
  resolver: zodResolver(patientSchema),
  mode: "onBlur",
 });

 const handleClearForm = () => {
  methods.reset({
   cpf: "",
   name: "",
   birthDate: "",
   hasResponsible: null,
   nameCaregiver: "",
   cpfCaregiver: "",
   birthDateCaregiver: "",
   disease: "",
   examDefinition: "",
   laboratoryAnalysis: "",
   genderId: "",
   addressPostalCode: "",
   addressName: "",
   addressNumber: "",
   sector: "",
   responsibleName: "",
   contact: "",
   termConsentAttach: undefined,
   medicalRequestAttach: undefined,
  });
 };

 const modal = useGenericModal();

 const getStepFields = () => {
  const hasResponsible = methods.watch("hasResponsible") === "yes";

  if (!isMobile && step === 1) {
   return [
    "cpf",
    "name",
    "birthDate",
    "hasResponsible",
    ...(hasResponsible ? ["nameCaregiver", "cpfCaregiver", "birthDateCaregiver"] : []),
    "disease",
    "examDefinition",
    "laboratoryAnalysis",
    "genderId",
    "addressPostalCode",
    "addressName",
    "addressNumber",
    "sector",
    "responsibleName",
    "contact",
   ];
  }

  if (isMobile && step === 1) {
   return [
    "cpf",
    "name",
    "birthDate",
    "hasResponsible",
    ...(hasResponsible ? ["nameCaregiver", "cpfCaregiver", "birthDateCaregiver"] : []),
    "disease",
    "examDefinition",
    "laboratoryAnalysis",
    "genderId",
   ];
  }

  if (isMobile && step === 2) {
   return ["addressPostalCode", "addressName", "addressNumber", "sector", "responsibleName", "contact"];
  }

  return [];
 };

 const handleNext = async () => {
  const fields = getStepFields().filter((field) => field !== "hasResponsible");
  const values = Object.fromEntries(fields.map((field) => [field, methods.getValues(field)]));

  const invalidFields = fields.filter((field: any) => {
   const value = values[field];
   return !value || (typeof value === "string" && value.trim() === "") || (value instanceof File === false && typeof value === "object");
  });

  if (invalidFields.length > 0) {
   modal.showModal(
    {
     type: "warning",
     title: "Campos obrigatórios",
     message: "Por favor, preencha todos os campos antes de continuar.",
     buttonLabel: "Fechar",
    },
    () => {}
   );
   return;
  }

  if (!isMobile && step === 1) {
   setStep(3);
  } else if (step < 3) {
   setStep((prev) => prev + 1);
  }
 };

 const handleBack = () => {
  if (!isMobile && step === 3) {
   setStep(1);
  } else if (step > 1) {
   setStep((prev) => prev - 1);
  }
 };

 function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.onload = () => {
    const result = reader.result as string;
    const base64 = result.split(",")[1];
    resolve(base64);
   };
   reader.onerror = reject;
   reader.readAsDataURL(file);
  });
 }

 const handleFinish = async () => {
  methods.handleSubmit(async (data) => {
   try {
    const termFile = data.termConsentAttach as File;
    const requestFile = data.medicalRequestAttach as File;

    const [termBase64, requestBase64] = await Promise.all([readFileAsBase64(termFile), readFileAsBase64(requestFile)]);

    const { termConsentAttach, medicalRequestAttach, hasResponsible, ...restData } = data;

    const payload = {
     ...restData,
     programCode: "1001",
     doctorId: doctorId,
     termConsentAttach: {
      fileName: termConsentAttach.name,
      documentBody: await readFileAsBase64(termConsentAttach),
     },
     medicalRequestAttach: {
      fileName: medicalRequestAttach.name,
      documentBody: await readFileAsBase64(medicalRequestAttach),
     },
    };

    const response = await dispatch(submitPatientRegistration(payload)).unwrap();

    if (response.isValidData) {
     modal.showModal(
      {
       type: "success",
       title: "Sua solicitação foi enviada.",
       message: response.additionalMessage,
      },
      () => {
       handleClearForm();
       setStep(1);
      }
     );
    } else {
     modal.showModal(
      {
       type: "error",
       title: "Erro ao cadastrar paciente.",
       message: response.additionalMessage,
      },
      () => {
       router.push("/dashboard/starts");
      }
     );
    }
   } catch (error) {
    console.log("Erro ao registrar paciente:", error);
   }
  })();
 };

 const renderNavigationButtons = () => (
  <div className={`flex flex-wrap gap-2 end mt-6 ${isMobile ? "mb-10" : ""}`}>
   {step > 1 && (
    <Button variant="outlineMainlilly" onClick={handleBack}>
     Voltar
    </Button>
   )}

   {step === 1 && (
    <>
     <Button variant="outlineMainlilly" onClick={handleClearForm}>
      Limpar Tudo
     </Button>
     <Button onClick={handleNext}>Avançar</Button>
    </>
   )}

   {step === 2 && (
    <Button onClick={handleNext} className="ml-auto">
     Avançar
    </Button>
   )}

   {step === 3 && (
    <>
     <Button variant="outlineMainlilly" onClick={() => router.push("/dashboard/starts")}>
      Cancelar
     </Button>
     <Button onClick={handleFinish} disabled={isSubmitting} isLoading={isSubmitting}>
      Finalizar
     </Button>
    </>
   )}
  </div>
 );

 useEffect(() => {
  dispatch(fetchGenders());
  dispatch(fetchExams());
  dispatch(fetchLabs());
  dispatch(fetchDiseases());
  dispatch(getDoctorInfo());
 }, [dispatch]);

 return (
  <FormProvider {...methods}>
   {!isMobile && (
    <div className="flex border-b border-gray-300 mb-6 w-full">
     <div className={`flex-1 text-center px-4 py-2 font-semibold ${step < 3 ? "border-b-2 border-mainlilly text-black" : "text-gray-400"}`}>
      Dados do Paciente
     </div>
     <div
      className={`flex-1 text-center px-4 py-2 font-semibold ${step === 3 ? "border-b-2 border-mainlilly text-black" : "text-gray-400"}`}
     >
      Documentação
     </div>
    </div>
   )}

   {isMobile && <StepIndicator step={step} setStep={setStep} totalSteps={3} />}

   <AnimatePresence mode="wait">
    {(!isMobile && step < 3) || (isMobile && step === 1) ? (
     <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
     >
      <Step1
       setStep={setStep}
       control={methods.control}
       errors={methods.formState.errors}
       diseases={diseases}
       exams={exams}
       labs={labs}
       genders={genders}
      />
     </motion.div>
    ) : null}

    {(!isMobile && step < 3) || (isMobile && step === 2) ? (
     <motion.div
      key="step2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
     >
      <Step2 setStep={setStep} control={methods.control} errors={methods.formState.errors} setValue={methods.setValue} />
     </motion.div>
    ) : null}

    {step === 3 && (
     <motion.div
      key="step3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
     >
      {auth.role === "doctor" ? <Step3Doctor /> : <Step3 />}
     </motion.div>
    )}
   </AnimatePresence>

   <div className="w-full flex justify-end">{renderNavigationButtons()}</div>
  </FormProvider>
 );
}
