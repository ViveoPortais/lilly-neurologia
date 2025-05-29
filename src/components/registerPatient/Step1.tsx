import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { maskedField } from "../custom/MaskedField";
import { IStringMap } from "@/types";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { searchPatientByCpf } from "@/store/slices/registerPatientSlice";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useRouter } from "next/navigation";
import { today, validateNoFutureDate } from "@/helpers/helpers";
import { useLoading } from "@/contexts/LoadingContext";
import { cclChecks, dlChecks } from "@/helpers/select-filters";
import { Checkbox } from "../ui/checkbox";
import { fetchAnnotations, fetchDiagnosticDetailsById } from "@/store/slices/diagnosticSlice";
import dayjs from "dayjs";
import { IDiagnosticExamModel } from "@/types/diagnostic";

export const Step1 = ({
 setStep,
 control,
 errors,
 diseases,
 exams,
 labs,
 genders,
 setValue,
 clinalProfile,
 setClinalProfile,
 checkItems,
 setCheckItems,
 clinicalProfile,
 setExamExistent
}: {
 setStep: (step: number) => void;
 control: any;
 errors: any;
 diseases: IStringMap[];
 exams: IStringMap[];
 labs: IStringMap[];
 genders: IStringMap[];
 setValue: any;
 clinalProfile: any;
 setClinalProfile: any;
 checkItems: any;
 setCheckItems: any;
 clinicalProfile: IStringMap[];
 setExamExistent : (arg0: IDiagnosticExamModel | null) => void;
}) => {
 const { register, watch } = useFormContext();
 const hasResponsible = watch("hasResponsible");
 const dispatch = useAppDispatch();
 const modal = useGenericModal();
 const router = useRouter();
 const { show, hide } = useLoading();
 const loading = useAppSelector((state) => state.registerPatient.loadingSearchPatient);
 const [selectedProfileLabel, setSelectedProfileLabel] = useState("");

 const profileCheckMap: Record<string, string[]> = {
  "Demência Leve": dlChecks,
  "CCL – Comprometimento Cognitivo Leve": cclChecks,
 };

 const selectedChecks = profileCheckMap[clinicalProfile.find((opt) => opt.stringMapId === clinalProfile)?.optionName || ""] || [];

 if (loading) show();
 else hide();

 const toggleCheck = (label: string) => {
  setCheckItems((prev: any) => ({
   ...prev,
   [label]: !prev[label],
  }));
 };

 const handleCpfBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
  const onlyDigits = e.target.value.replace(/\D/g, "");
  if (onlyDigits.length === 11) {
   try {
    const res = await dispatch(searchPatientByCpf(e.target.value)).unwrap();
    if (!res.isValidData) {
     modal.showModal(
      {
       type: "warning",
       message: res.additionalMessage,
      },
      () => {}
     );
    } else {
     if (res.value != "") await fillForm(res.value);
    }
   } catch (error) {
    console.error("CPF não encontrado ou erro ao buscar:", error);
   }
  }
 };

 const fillForm = async (id: string) => {
  const exam = await dispatch(fetchDiagnosticDetailsById({ id: id })).unwrap();

  if (exam) {
   setValue("name", exam.namePatient);
   setValue("birthDate", dayjs(exam.patientBirthDate).format("YYYY-MM-DD"));
   setValue("genderId", exam.genderId);

   if (exam.nameCaregiver) {
    setValue("hasResponsible", "yes");
    setValue("nameCaregiver", exam.nameCaregiver);
    setValue("cpfCaregiver", exam.cpfCarefiver);
    setValue("birthDateCaregiver", dayjs(exam.birthdateCaregiver).format("YYYY-MM-DD"));
   } else {
    setValue("hasResponsible", "no");
    setValue("nameCaregiver", "");
    setValue("cpfCaregiver", "");
    setValue("birthDateCaregiver", "");
   }

   setClinalProfile(exam?.clinicalProfile?.id);

   const profileOption = clinicalProfile.find((opt) => opt.stringMapId === exam?.clinicalProfile?.id);
   const profileName = profileOption?.optionName || "";

   const relatedChecks = profileCheckMap[profileName] || [];

   const filledCheckItems = relatedChecks.reduce((acc, label) => {
    acc[label] = true;
    return acc;
   }, {} as Record<string, boolean>);

   setCheckItems(filledCheckItems);

   setValue("disease", exam.diseaseId);
   setValue("examDefinition", exam.examDefinitionId);
   setValue("laboratoryAnalysis", exam.localId);
   setValue("addressPostalCode", exam.logisticsAddressPostalCode);
   setValue("addressName", exam.logisticsAddressName);
   setValue("addressNumber", exam.logisticsAddressNumber);
   setValue("sector", exam.section);
   setValue("responsibleName", exam.mainContact);
   setValue("contact", exam.institutionTelephone);

   setExamExistent(exam);
   setValue("isSecondSolicitation",true);
  }
  else{
    setExamExistent(null);
    setValue("isSecondSolicitation",false)
  }
 };

 useEffect(() => {
  if (hasResponsible === "no") {
   setValue("nameCaregiver", "");
   setValue("cpfCaregiver", "");
   setValue("birthDateCaregiver", "");
  }
 }, [hasResponsible, setValue]);

 return (
  <div>
   <div className="grid md:grid-cols-5 gap-4">
    <Controller
     name="cpf"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       {maskedField(
        "cpf",
        field.onChange,
        field.name,
        "CPF",
        false,
        (e) => {
         field.onBlur();
         handleCpfBlur(e);
        },
        field.value,
        false,
        `w-full`,
        "Digite aqui..."
       )}
       {errors?.cpf && <span className="text-sm text-red-500 mt-1 block">{errors.cpf.message as string}</span>}
      </div>
     )}
    />
    <div className="w-full">
     <Input {...register("name")} placeholder="Nome Completo" inputPlaceholder="Digite aqui..." />
     {errors?.name && <span className="text-sm text-red-500 mt-1 block">{errors.name.message as string}</span>}
    </div>
    <div className="w-full">
     <Input
      {...register("birthDate")}
      type="date"
      placeholder="Data de Nascimento"
      max={today}
      onChange={(e) => validateNoFutureDate(e.target.value, "birthDate", setValue, "Não é permitido cadastrar data futura")}
     />
     {errors?.birthDate && <span className="text-sm text-red-500 mt-1 block">{errors.birthDate.message as string}</span>}
    </div>

    <Controller
     name="genderId"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={genders} value={field.value} onChange={field.onChange} name="genderId" label="Gênero biológico" />
       {errors?.genderId && <span className="text-sm text-red-500 mt-1 block">{errors.genderId.message as string}</span>}
      </div>
     )}
    />

    <div>
     <span className="font-medium block mb-2">Possui Cuidador Responsável?</span>
     <div className="flex gap-x-4">
      {["yes", "no"].map((val) => (
       <label key={val} className="cursor-pointer">
        <input type="radio" value={val} {...register("hasResponsible")} className="peer sr-only text-red" />
        <div
         className="
          flex items-center gap-2
          px-4 py-1 
          border border-red-500 
          rounded-lg
          text-red-500 
          peer-checked:bg-red-500 
          peer-checked:text-white 
          transition-colors
        "
        >
         <div
          className={`
            w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center
          `}
         >
          <div className="w-2 h-2 rounded-full bg-mainlilly peer-checked:block bg-white" />
         </div>
         {val === "yes" ? "Sim" : "Não"}
        </div>
       </label>
      ))}
     </div>
    </div>
   </div>

   {hasResponsible === "yes" && (
    <div className="grid md:grid-cols-3 gap-3 mt-4">
     <div className="w-full">
      <Input {...register("nameCaregiver")} placeholder="Nome do Cuidador" />
      {errors?.nameCaregiver && <span className="text-sm text-red-500 mt-1 block">{errors.nameCaregiver.message as string}</span>}
     </div>
     <Controller
      name="cpfCaregiver"
      control={control}
      render={({ field }) => (
       <div className="w-full">
        {maskedField("cpf", field.onChange, field.name, "CPF do Cuidador", false, field.onBlur, field.value, false, `w-full`)}
        {errors?.cpfCaregiver && <span className="text-sm text-red-500 mt-1 block">{errors.cpfCaregiver.message as string}</span>}
       </div>
      )}
     />
     <div className="w-full">
      <Input
       {...register("birthDateCaregiver")}
       type="date"
       placeholder="Nascimento do Cuidador"
       max={today}
       onChange={(e) => validateNoFutureDate(e.target.value, "birthDateCaregiver", setValue, "Não é permitido cadastrar data futura")}
      />
      {errors?.birthDateCaregiver && <span className="text-sm text-red-500 mt-1 block">{errors.birthDateCaregiver.message as string}</span>}
     </div>
    </div>
   )}
   <div className="grid md:grid-cols-4 gap-3 mt-4">
    <div className="w-full">
     <CustomFilterSelect
      name="clinicalProfile"
      label="Perfil Clínico do Paciente"
      options={clinicalProfile}
      value={clinalProfile}
      onChange={setClinalProfile}
     />
    </div>
    <Controller
     name="disease"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={diseases} value={field.value} onChange={field.onChange} name="disease" label="Patologia" />
       {errors?.disease && <span className="text-sm text-red-500 mt-1 block">{errors.disease.message as string}</span>}
      </div>
     )}
    />
    <Controller
     name="examDefinition"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect options={exams} value={field.value} onChange={field.onChange} name="examDefinition" label="Exame" />
       {errors?.examDefinition && <span className="text-sm text-red-500 mt-1 block">{errors.examDefinition.message as string}</span>}
      </div>
     )}
    />
    <Controller
     name="laboratoryAnalysis"
     control={control}
     render={({ field }) => (
      <div className="w-full">
       <CustomFilterSelect
        options={labs}
        value={field.value}
        onChange={field.onChange}
        name="laboratoryAnalysis"
        label="Laboratório de Análise"
       />
       {errors?.laboratoryAnalysis && (
        <span className="text-sm text-red-500 mt-1 block">{errors.laboratoryAnalysis.message as string}</span>
       )}
      </div>
     )}
    />
   </div>
   {selectedChecks.length > 0 && (
    <div className="grid grid-cols-1 gap-2 mt-4">
     {selectedChecks.map((label) => (
      <label key={label} className="flex items-center gap-3 text-sm text-zinc-700">
       <Checkbox
        checked={!!checkItems[label]}
        onCheckedChange={() => toggleCheck(label)}
        className="border border-[#82786F] data-[state=checked]:bg-white data-[state=checked]:text-[#82786F]"
       />
       <span>{label}</span>
      </label>
     ))}
    </div>
   )}
  </div>
 );
};