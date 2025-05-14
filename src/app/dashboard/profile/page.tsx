"use client";

import { AccessSection } from "@/components/profile/AccessSection";
import { AddressSection } from "@/components/profile/AddressSection";
import { ConfirmationDialog } from "@/components/profile/ConfirmationDialog";
import { PersonalDataSection } from "@/components/profile/PersonalDataSection";
import { Button } from "@/components/ui/button";
import { useGenericModal } from "@/contexts/GenericModalContext";
import useSession from "@/hooks/useSession";
import { doctorProfileSchema, professionalProfileSchema } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMedicalSpecialties, fetchUserData, putUpdateDoctor, putUpdateProfessional } from "@/store/slices/profileSlice";
import { IUpdateDoctorData } from "@/types";
import { IUpdateProfessionalData } from "@/types/professions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

export default function Profile() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useAppDispatch();
  const auth = useSession();
  const profile = useAppSelector((state) => state.profile.data.userInfo);
  const medicalSpecialties = useAppSelector((state) => state.profile.data.medicalSpecialties);
  const resultUpdate = useAppSelector((state) => state.profile.data.resultUpdate);

  const schema = auth.role === 'doctor' ? doctorProfileSchema : professionalProfileSchema;

  const methods = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register,control, handleSubmit, setValue,setFocus, watch, formState: { errors } } = methods;

  const modal = useGenericModal();

  useEffect(() => {
      dispatch(fetchUserData());
      dispatch(fetchMedicalSpecialties())
  }, [dispatch]);

  useEffect(() => {
    if (resultUpdate) {

      if (resultUpdate.isValidData) {
        modal.showModal(
          {
            type: "success",
            title: "Sucesso",
            buttonLabel: "Fechar",
            message: resultUpdate.additionalMessage
          },
          () => { }
        )
        dispatch(fetchUserData())
      }
      else {
        modal.showModal(
          {
            type: "error",
            title: "Erro",
            buttonLabel: "Fechar",
            message: resultUpdate.additionalMessage
          },
          () => { }
        )
      }
    }
  }, [resultUpdate]);



  const handleSaveChangesProfile = (data: any) => {
    if (auth.role === 'doctor') {

      const dataUpdate = data as IUpdateDoctorData;
      dataUpdate.id = profile?.value.doctorId;

      dispatch(putUpdateDoctor({doctor : dataUpdate}))

    } else if (auth.role === 'professional') {
      const dataUpdate = data as IUpdateProfessionalData;
      dataUpdate.id = profile?.value.healthProfessionalByProgramId;
      dataUpdate.mobilePhone1 = data.mobilenumber;

      dispatch(putUpdateProfessional({professional : dataUpdate}))
    }
  };

  const onConfirm = (data: any) => {
    handleSaveChangesProfile(data);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = (data:any) => {
    setIsDialogOpen(true);
  };

  return (
    <div className="h-full w-full md:px-6">
      <FormProvider {...methods}>
      <form
        className="flex flex-col gap-4 h-full pb-12"
        onSubmit={handleSubmit(handleFormSubmit)}
      >

        <PersonalDataSection
          control={control}
          emailAddress={profile?.value.emailAddress ?? ''}
          errors={errors}
          licenseNumber={profile?.value.licenseNumber ?? ''}
          licenseState={profile?.value.licenseState ?? ''}
          name={profile?.value.name ?? ''}
          specialties={medicalSpecialties}
          profileType={auth.role}
          mobilenumber={profile?.value.mobilephone ?? ''}
          cpf={profile?.value.cpf ?? ''}
          medicalSpecialty={profile?.value.medicalSpecialty ?? ''}
          setValue={setValue}
        />

        <AddressSection
          control={control}
          errors={errors}
          addressPostalCode={profile?.value.addressPostalCode ?? ''}
          addressCity={profile?.value.addressCity ?? ''}
          addressState={profile?.value.addressState ?? ''}
          setValue={setValue}
          setFocus={setFocus}
        />
        <AccessSection
          emailAddress={profile?.value.emailAddress ?? ''}
          control = {control}
          errors = {errors}
          setValue = {setValue}
        />

        <ConfirmationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleSubmit(onConfirm)}
          userName={auth.name}
        />

        <div className="flex flex-col md:flex-row justify-center md:justify-start">
          <div className="md:basis-1/6">
            <Button type="submit" size="lg" className='w-full'>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
      </FormProvider>
    </div>
  );
}
