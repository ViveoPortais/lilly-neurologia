"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ExamPendingModel, IPatientSampleCollectionViewModel, PatientData } from "@/types/diagnostic";
import { scheduleSampeSchema } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Step2 from "./Step2";
import { AnimatePresence, motion } from "framer-motion";
import Step1 from "./Step1";
import StepIndicator from "../custom/StepIndicator";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { clearSelectedExamItem } from "@/store/slices/pendingsSlice";
import { IStringMap } from "@/types";

interface ScheduleSampleFormProps {
  data: IPatientSampleCollectionViewModel;
  item: ExamPendingModel;
  preferredTimeStringMaps : IStringMap[];
}

export default function ScheduleSampleForm({ data, item,preferredTimeStringMaps }: ScheduleSampleFormProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [step, setStep] = useState(1);
  const { resolve } = useResolveExamPendency();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(scheduleSampeSchema(data.tubeReceptionDate!)),
    mode: "onChange",
    defaultValues: {
      collectMaterial: "",
      doctorSuggestedDate: "",
      preferredTimeStringMaps:"",
    },
  });


  const onSubmit = async (dataForm: any) => {
    await resolve({
      item: {
        ...item,
        deliveryConfirmedAt: dataForm.tubeReceptionDate,
        doctorSuggestedDate: dataForm.doctorSuggestedDate,
        collectMaterial: dataForm.collectMaterial,
        preferredTimeStringMapId: dataForm.preferredTimeStringMap,
        id : data.examId,
      },
      onSuccess: () => {
        clearSelectedExamItem();
      },
      redirectUrlOnSuccess : "/dashboard/doctor/pendings"
    });
  };

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
                <Step2 register={register} errors={errors} data={data} control={control} preferredTimeStringMaps={preferredTimeStringMaps} />
              </motion.div>
            )
          ) : (
            <>
              <Step1 data={data} />
              <Step2 register={register} errors={errors} data={data} control={control} preferredTimeStringMaps={preferredTimeStringMaps}/>
            </>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-4 pb-4">
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