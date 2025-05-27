"use client";

import { diagnosticFilterModelSchema, DiagnosticFilterModelSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { UFlist } from "@/helpers/select-filters";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addHealthProfessionalByProgramDoctorByProgram, fetchDoctorByCrmUf, fetchHealthProfessionalByProgramDoctorByPrograms } from "@/store/slices/linkManagementeSlice";
import { toast } from "react-toastify";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { Button } from "@/components/ui/button";
import { IReturnMessage } from "@/types/general";
import { useLoading } from "@/contexts/LoadingContext";
import { IDiagnosticFilterModel } from "@/types/diagnostic";
import { fetchMyDiagnostics } from "@/store/slices/diagnosticSlice";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";



export default function Filter() {

  const methods = useForm<DiagnosticFilterModelSchema>({
    resolver: zodResolver(diagnosticFilterModelSchema),
    mode: "onChange",
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = methods;

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.diagnostic.loading);
  const stringMaps = useAppSelector((state) => state.basic.data.stringMaps);

  const { show, hide } = useLoading();

  useEffect(()=>{
    if (loading)
      show()
    else
      hide()
  },[loading])



  useEffect(() => {
    dispatch(fetchStringMaps({ entityName: "Exam", attributeName: "ExamStatusStringMap" }));
  }, [dispatch]);


  const onClean = async () => {

    setValue("patientName", "");

    setValue("patientCPF", "");

    setValue("examStatus", "");

    const filterDiagnostic: IDiagnosticFilterModel = {}
    await dispatch(fetchMyDiagnostics({ filterDiagnostic: filterDiagnostic }));
  }
  const onSubmit = async (data: DiagnosticFilterModelSchema) => {
    try {
      await dispatch(fetchMyDiagnostics({ filterDiagnostic: data as IDiagnosticFilterModel }));
    }
    catch (error: string | any) {   

    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90vw] md:w-full md:px-5 mx-auto">

        <div className="flex flex-col md:flex-row gap-6 py-5">
          <div className="flex flex-col basis-1/3">
            <Controller
              name="examStatus"
              control={methods.control}
              render={({ field }) => (
                <div className="w-full">
                  <CustomFilterSelect options={stringMaps} value={field.value} onChange={field.onChange} name="examStatus" label="Status" />
                  {errors?.examStatus && <span className="text-sm text-red-500 mt-1 block">{errors.examStatus.message as string}</span>}
                </div>
              )}
            />
            {errors?.examStatus && <span className="flex text-sm text-red-500 mt-1 block">{errors.examStatus.message as string}</span>}
          </div>
          <div className="flex flex-col basis-1/3">
            <Input {...register("patientName")} placeholder="Nome do Paciente" />
            {errors?.patientName && <span className="flex text-sm text-red-500 mt-1">{errors.patientName.message as string}</span>}
          </div>
          <div className="flex flex-col basis-1/3">
            <Input {...register("patientCPF")} placeholder="CPF do paciente" />
            {errors?.patientCPF && <span className="flex text-sm text-red-500 mt-1">{errors.patientCPF.message as string}</span>}
          </div>
        </div>
        <div className="flex flex-row justify-between md:justify-end py-6 gap-4">
          <Button variant={"outlineMainlilly"} size="lg" onClick={onClean} className="basis-1/2 md:basis-[17%] font-bold">Limpar Tudo</Button>
          <Button type="submit" variant={"default"} size="lg" className="basis-1/2 md:basis-[17%] font-bold">Filtrar</Button>
        </div>
        <div className="border-b border-b-gray-400 mb-12"></div>
      </form>
    </FormProvider>
  );
}