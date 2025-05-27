"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GenericModalForm from "@/components/modals/GenericModalForm";
import { PatientData } from "@/types/diagnostic";
import { scheduleSampeSchema } from "@/lib/utils";
import { Download } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Step2 from "./Step2";
import { AnimatePresence, motion } from "framer-motion";
import Step1 from "./Step1";
import StepIndicator from "../custom/StepIndicator";

interface ScheduleSampleFormProps {
 data: PatientData;
}

export default function ScheduleSampleForm({ data }: ScheduleSampleFormProps) {
 const isMobile = useMediaQuery("(max-width: 768px)");
 const [step, setStep] = useState(1);

 const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isValid },
 } = useForm({
  resolver: zodResolver(scheduleSampeSchema(data.receiptDate)),
  mode: "onChange",
  defaultValues: {
   collectDate: "",
   desiredDate: "",
  },
 });

 const onSubmit = (data: any) => {};

 return (
  <>
   <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {isMobile && <StepIndicator step={step} totalSteps={2} setStep={setStep} />}

    <AnimatePresence mode="wait">
     {isMobile ? (
      step === 1 ? (
       <motion.div
        key="step1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
       >
        <Step1 data={data} />
       </motion.div>
      ) : (
       <motion.div
        key="step2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
       >
        <Step2 register={register} errors={errors} />
       </motion.div>
      )
     ) : (
      <>
       <Step1 data={data} />
       <Step2 register={register} errors={errors} />
      </>
     )}
    </AnimatePresence>

    <div className="flex justify-end gap-4">
     {isMobile && step === 2 && (
      <Button type="button" variant="outlineMainlilly" onClick={() => reset()}>
       Limpar Tudo
      </Button>
     )}

     {isMobile ? (
      <>
       {step === 1 && (
        <Button type="button" onClick={() => setStep(2)}>
         Avançar
        </Button>
       )}
       {step === 2 && (
        <Button type="submit" disabled={!isValid}>
         Agendar
        </Button>
       )}
      </>
     ) : (
      <>
       <Button type="button" variant="outlineMainlilly" onClick={() => reset()}>
        Limpar Tudo
       </Button>
       <Button type="submit" disabled={!isValid}>
        Agendar
       </Button>
      </>
     )}
    </div>
   </form>
  </>
 );
}
