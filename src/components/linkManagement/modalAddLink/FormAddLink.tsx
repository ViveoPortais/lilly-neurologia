import { HealthProfessionalByProgramDoctorByProgramFormData, healthProfessionalByProgramDoctorByProgramSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../ui/input";
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

interface FormAddLinkProps {
  onClose: () => void;
}

export default function FormAddLink({ onClose }: FormAddLinkProps) {

  const methods = useForm<HealthProfessionalByProgramDoctorByProgramFormData>({
    resolver: zodResolver(healthProfessionalByProgramDoctorByProgramSchema),
    mode: "onSubmit",
  });

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = methods;

  const dispatch = useAppDispatch();
  const doctor = useAppSelector((state) => state.linkManagement.data.doctor);
  const error = useAppSelector((state) => state.linkManagement.error);
  const modal = useGenericModal();
  const loading = useAppSelector((state) => state.linkManagement.loading);

  const {show,hide} = useLoading();
  useEffect(()=>{

      if(loading)
          show()
      else
          hide()

  },[loading]);

  const licenseState = watch("licenseState");
  const licenseNumber = watch("licenseNumber");

  useEffect(() => {
    if (licenseState && licenseNumber) {
      dispatch(fetchDoctorByCrmUf({ crm: licenseNumber, uf: licenseState }));
    }
  }, [licenseState, setValue]);

  useEffect(() => {
    if (error) {
      modal.showModal(
        {
          type: "error",
          buttonLabel: "Fechar",
          message: error
        },
        () => { }
      )
    }
  }, [error]);

  useEffect(() => {
    if (licenseState) setValue("licenseState","");
  }, [licenseNumber])

  useEffect(() => {
    if (doctor.length > 0 && doctor[0]) {
      setValue("doctorName", doctor[0].name ? doctor[0].name : "");
    }
    else {
      setValue("doctorName", "");
    }
  }, [doctor]);

  const onCloseModal = async()=>{
    reset();
    setValue("doctorName", "");
    onClose();
  };

  const onSubmit = async (data: HealthProfessionalByProgramDoctorByProgramFormData) => {
    try {

      const response = await dispatch(addHealthProfessionalByProgramDoctorByProgram({ doctorId: doctor[0].doctorId ? doctor[0].doctorId : "" }));

      const result = response.payload;

      if (result) {
        if (result.isValidData) {
          modal.showModal(
            {
              type: "success",
              title: "Sucesso",
              buttonLabel: "Fechar",
              message: result.additionalMessage
            },
            onCloseModal
          )
          dispatch(fetchHealthProfessionalByProgramDoctorByPrograms())
        }
        else {
          modal.showModal(
            {
              type: "error",
              title: "Erro",
              buttonLabel: "Fechar",
              message: result.additionalMessage
            },
            onCloseModal
          )
        }
      }
    }
    catch (error: string | any) {
      modal.showModal(
        {
          type: "error",
          buttonLabel: "Fechar",
          message: error
        },
        onCloseModal
      )
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="py-4">

        <div className="flex flex-row gap-6 py-4">
          <div className="flex flex-col basis-2/3">
            <Input {...register("licenseNumber")} placeholder="Número do CRM" inputPlaceholder="Digite o CRM aqui..." />
            {errors?.licenseNumber && <span className="flex text-sm text-red-500 mt-1">{errors.licenseNumber.message as string}</span>}
          </div>
          <div className="flex flex-col basis-1/3 text-left">
            <Controller
              name="licenseState"
              control={methods.control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="UF"
                  options={UFlist}
                />
              )}
            />
            {errors?.licenseState && <span className="flex text-sm text-red-500 mt-1 block">{errors.licenseState.message as string}</span>}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Input {...register("doctorName")} placeholder={"Nome completo"} inputPlaceholder="" disabled />
        </div>
        <div className="flex flex-row justifybetween py-6 gap-4">
          <Button variant={"outlineMainlilly"} size="lg" onClick={onClose} className="flex basis-1/2 font-bold">CANCELAR</Button>
          <Button type="submit" variant={"default"} size="lg" className="flex basis-1/2 font-bold" disabled={!watch("doctorName")}>SOLICITAR</Button>
        </div>
      </form>
    </FormProvider>
  );
}