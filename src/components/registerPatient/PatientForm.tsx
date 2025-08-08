import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, NonUndefined, useForm } from "react-hook-form";
import StepIndicator from "../custom/StepIndicator";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { patientSchema } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDiseases, fetchExams, fetchGenders, fetchLabs, getDoctorInfo, submitPatientRegistration } from "@/store/slices/registerPatientSlice";
import useSession from "@/hooks/useSession";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useRouter } from "next/navigation";
import { ButtonsNavigation } from "./ButtonsNavigation";
import { cclChecks, dlChecks } from "@/helpers/select-filters";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { IDiagnosticExamModel } from "@/types/diagnostic";

type Props = {
  role: string;
  isMobile: boolean;
  doctor?: string;
};

export default function PatientForm({ role, isMobile, doctor }: Props) {
  const [step, setStep] = useState(1);
  const auth = useSession();
  const dispatch = useAppDispatch();
  const genders = useAppSelector((state) => state.registerPatient.data.genders);
  const exams = useAppSelector((state) => state.registerPatient.data.exams);
  const labs = useAppSelector((state) => state.registerPatient.data.labs);
  const diseases = useAppSelector((state) => state.registerPatient.data.diseases);
  const doctorId = useAppSelector((state) => state.registerPatient.data.doctorId);
  const isSubmitting = useAppSelector((state) => state.registerPatient.isSubmitting);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [checkItems, setCheckItems] = useState<Record<string, boolean>>({});
  const stringMaps = useAppSelector((state) => state.basic.data.stringMaps);
  const router = useRouter();
  const [examExistent, setExamExistent] = useState<IDiagnosticExamModel | null>(null);

  const methods = useForm({
    resolver: zodResolver(patientSchema),
    mode: "onBlur",
  });

  const handleClearForm = () => {
    setSelectedProfile("");
    setCheckItems({});
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
      pickupPostalCode: "",
      pickupAddressName: "",
      pickupNumber: "",
      pickupComplement: "",
      pickupDistrict: "",
      pickupCity: "",
      pickupState: "",
      pickupResponsibleName: "",
      pickupContact: "",
      useSameAddress: false,
    });
  };

  const modal = useGenericModal();

  const clinicalProfile = stringMaps.map((item) => {
    return {
      stringMapId: item.stringMapId,
      optionName: item.optionName,
    };
  });

  const getStepFields = () => {
    const hasResponsible = methods.watch("hasResponsible") === "yes";
    const useSameAddress = methods.watch("useSameAddress") === true;

    const pickupFields = [
      "pickupPostalCode",
      "pickupAddressName",
      "pickupNumber",
      "pickupAddressDistrict",
      "pickupAddressCity",
      "pickupAddressState",
      "pickupSector",
      "pickupContact",
    ];

    const addressFields = ["addressPostalCode", "addressName", "addressNumber", "addressDistrict", "addressCity", "addressState", "sector", "contact"];

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
      ];
    }

    if (step === 2) return [...pickupFields, ...(useSameAddress ? [] : addressFields)];

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

    return [];
  };

  const validateClinalProfile = () => {
    if (!selectedProfile) return false;

    const profileOption = clinicalProfile.find((opt) => opt.stringMapId === selectedProfile);
    const profileName = profileOption?.optionName || "";

    const profileCheckMap: Record<string, string[]> = {
      "Demência Leve": dlChecks,
      "CCL – Comprometimento Cognitivo Leve": cclChecks,
    };

    const requiredChecks = profileCheckMap[profileName] || [];
    const allChecked = requiredChecks.every((label) => checkItems[label]);

    return allChecked;
  };

  const handleNext = async () => {
    const fields = getStepFields();
    const values = Object.fromEntries(fields.map((field) => [field, methods.getValues(field)]));

    const invalidFields = fields.filter((field: any) => {
      const value = values[field];
      return !value || (typeof value === "string" && value.trim() === "") || (value instanceof File === false && typeof value === "object");
    });

    if (invalidFields.length > 0 || !validateClinalProfile()) {
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
      setStep(2);
    } else if (step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
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
    const result = await methods.trigger();
    if (!result) {
      console.log("Erros de validação:", methods.formState.errors);
      return;
    }
    methods.handleSubmit(async (data) => {
      try {
        if (data.hasResponsible === "no") {
          data.birthDateCaregiver = null;
        }

        const {
          termConsentAttach,
          hasResponsible,
          useSameAddress,
          pickupPostalCode,
          pickupAddressName,
          pickupNumber,
          pickupAddressComplement,
          pickupAddressDistrict,
          pickupAddressCity,
          pickupAddressState,
          pickupSector,
          pickupContact,
          ...restData
        } = data;

        const logistics = {
          addressPostalCode: pickupPostalCode,
          addressName: pickupAddressName,
          addressNumber: pickupNumber,
          addressComplement: pickupAddressComplement,
          addressDistrict: pickupAddressDistrict,
          addressCity: pickupAddressCity,
          addressState: pickupAddressState,
          sector: data.sector,
          contact: data.contact,
        };

        const commonAddressFields = useSameAddress
          ? {
              addressPostalCode: pickupPostalCode,
              addressName: pickupAddressName,
              addressNumber: pickupNumber,
              addressComplement: pickupAddressComplement,
              addressDistrict: pickupAddressDistrict,
              addressCity: pickupAddressCity,
              addressState: pickupAddressState,
              sector: pickupSector,
              contact: pickupContact,
            }
          : {};

        const payload: any = {
          ...restData,
          ...commonAddressFields,
          logistics,
          hasClinicalProfile: true,
          clinicalProfile: selectedProfile,
          doctorId: doctor && auth.role !== "doctor" ? doctor : doctorId,
        };

        if (termConsentAttach) {
          payload.termConsentAttach = {
            fileName: termConsentAttach.name,
            documentBody: await readFileAsBase64(termConsentAttach),
            fileSize: termConsentAttach.size.toString(),
          };
        }

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
            () => {}
          );
        }
      } catch (error) {
        console.log("Erro ao registrar paciente:", error);
      }
    })();
  };

  useEffect(() => {
    dispatch(fetchGenders());
    dispatch(fetchExams());
    dispatch(fetchLabs());
    dispatch(fetchDiseases());
    dispatch(getDoctorInfo());
    dispatch(fetchStringMaps({ attributeName: "Custom1StringMap", entityName: "diagnostic" }));
  }, [dispatch]);

  return (
    <FormProvider {...methods}>
      {!isMobile && (
        <div className="flex border-b border-gray-300 mb-6 w-full">
          <div className={`flex-1 text-center px-4 py-2 font-semibold ${step === 1 ? "border-b-2 border-mainlilly text-black" : "text-gray-400"}`}>
            Dados do Paciente
          </div>
          <div className={`flex-1 text-center px-4 py-2 font-semibold ${step === 2 ? "border-b-2 border-mainlilly text-black" : "text-gray-400"}`}>
            Endereço
          </div>
          <div className={`flex-1 text-center px-4 py-2 font-semibold ${step === 3 ? "border-b-2 border-mainlilly text-black" : "text-gray-400"}`}>
            Documentação
          </div>
        </div>
      )}

      {isMobile && <StepIndicator step={step} setStep={setStep} totalSteps={3} />}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
            <Step1
              setStep={setStep}
              control={methods.control}
              errors={methods.formState.errors}
              diseases={diseases}
              exams={exams}
              labs={labs}
              genders={genders}
              setValue={methods.setValue}
              clinalProfile={selectedProfile}
              setClinalProfile={setSelectedProfile}
              checkItems={checkItems}
              setCheckItems={setCheckItems}
              clinicalProfile={clinicalProfile}
              setExamExistent={setExamExistent}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
            <Step2 setStep={setStep} control={methods.control} errors={methods.formState.errors} setValue={methods.setValue} />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
            <Step3 examExistent={examExistent} />
          </motion.div>
        )}
      </AnimatePresence>

      <ButtonsNavigation
        isMobile={isMobile}
        step={step}
        isSubmitting={isSubmitting}
        onBack={handleBack}
        onNext={handleNext}
        onClear={handleClearForm}
        onCancel={() => router.push("/dashboard/starts")}
        onFinish={handleFinish}
      />
    </FormProvider>
  );
}