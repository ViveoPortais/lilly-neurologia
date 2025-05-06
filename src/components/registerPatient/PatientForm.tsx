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
import { fetchDiseases, fetchExams, fetchGenders, fetchLabs } from "@/store/slices/registerPatientSlice";
import { Step3Doctor } from "./doctor/Step3";
import useSession from "@/hooks/useSession";

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

 const methods = useForm({
  resolver: zodResolver(patientSchema),
  mode: "onBlur",
 });

 const handleClearForm = () => {
  methods.reset();
 };

 const handleNext = () => {
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

 const handleFinish = () => {
  methods.handleSubmit((data) => {
   console.log("Final submitted data:", data);
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
     <Button variant="outlineMainlilly" onClick={handleBack}>
      Cancelar
     </Button>
     <Button onClick={handleFinish}>Finalizar</Button>
    </>
   )}
  </div>
 );

 useEffect(() => {
  dispatch(fetchGenders());
  dispatch(fetchExams());
  dispatch(fetchLabs());
  dispatch(fetchDiseases());
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
