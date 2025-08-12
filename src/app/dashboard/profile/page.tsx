"use client";

import { AccessSection } from "@/components/profile/AccessSection";
import { AddressSection } from "@/components/profile/AddressSection";
import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { PersonalDataSection } from "@/components/profile/PersonalDataSection";
import { Button } from "@/components/ui/button";
import { useGenericModal } from "@/contexts/GenericModalContext";
import useSession from "@/hooks/useSession";
import { doctorProfileSchema, generalProfileSchema, professionalProfileSchema } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMedicalSpecialties, fetchUserData, putUpdateDoctor, putUpdateProfessional, putUpdateUserGeneral } from "@/store/slices/profileSlice";
import { IUpdateDoctorData, IUpdateUserGeneral } from "@/types";
import { IUpdateProfessionalData } from "@/types/professions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { IReturnMessage } from "@/types/general";
import { useLoading } from "@/contexts/LoadingContext";

export default function Profile() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useAppDispatch();
  const auth = useSession();
  const profile = useAppSelector((state) => state.profile.data.userInfo);
  const medicalSpecialties = useAppSelector((state) => state.profile.data.medicalSpecialties);

  let schema;
  
  switch(auth.role){
    case 'doctor':
      schema = doctorProfileSchema;
      break;
    case 'professional':
      schema = professionalProfileSchema;
      break;
    default :
      schema = generalProfileSchema;
      break;
  }

  const methods = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, control, handleSubmit, setValue, setFocus, watch, formState: { errors } } = methods;

  const modal = useGenericModal();

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchMedicalSpecialties())
  }, [dispatch]);

  const loading = useAppSelector((state) => state.profile.loading);

  const {show,hide} = useLoading();

  useEffect(()=>{

      if(loading)
          show()
      else
          hide()

  },[loading]);


  const handleSaveChangesProfile = async (data: any) => {

    let result: IReturnMessage | undefined;

    if (auth.role === 'doctor') {

      const dataUpdate = data as IUpdateDoctorData;
      dataUpdate.id = profile?.value.doctorId;

      result = await dispatch(putUpdateDoctor({ doctor: dataUpdate })).unwrap();

    } else if (auth.role === 'professional') {
      const dataUpdate = data as IUpdateProfessionalData;
      dataUpdate.id = profile?.value.healthProfessionalByProgramId;
      dataUpdate.mobilePhone1 = data.mobilenumber;

      result = await dispatch(putUpdateProfessional({ professional: dataUpdate })).unwrap();
    }
    else{
      const dataUpdate = data as IUpdateUserGeneral;
      
      dataUpdate.userMobilephone = data.mobilenumber;

      result = await dispatch(putUpdateUserGeneral({data:dataUpdate})).unwrap();
    }

    if (result) {

      if (result.isValidData) {
        modal.showModal(
          {
            type: "success",
            title: "Sucesso",
            buttonLabel: "Fechar",
            message: result.additionalMessage
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
            message: result.additionalMessage
          },
          () => { }
        )
      }
    }
  };

  const onConfirm = (data: any) => {
    handleSaveChangesProfile(data);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = (data: any) => {
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

          {(auth.role === 'doctor' || auth.role === 'professional') && (
            <AddressSection
              control={control}
              errors={errors}
              addressPostalCode={profile?.value.addressPostalCode ?? ''}
              addressCity={profile?.value.addressCity ?? ''}
              addressState={profile?.value.addressState ?? ''}
              setValue={setValue}
              setFocus={setFocus}
            />
          )}

          <AccessSection
            emailAddress={profile?.value.emailAddress ?? ''}
            control={control}
            errors={errors}
            setValue={setValue}
          />

          <ConfirmationDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleSubmit(onConfirm)}
            content={`Olá ${auth.name}, você está realizando alterações em seus dados, deseja prosseguir?`}
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
