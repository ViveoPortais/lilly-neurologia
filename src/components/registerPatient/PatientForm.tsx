import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { FormProvider, NonUndefined, useForm, useFormContext } from "react-hook-form";
import StepIndicator from "../custom/StepIndicator";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { patientSchema } from "@/lib/utils";
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
import { IStringMap } from "@/types";

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
  const [clinicalProfileOptions, setClinicalProfileOptions] = useState<any[]>([]);

  const methods = useForm({
    resolver: zodResolver(patientSchema),
    mode: "onBlur",
  });

  const { watch } = methods;

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
      pickupAddressComplement: "",
      pickupAddressDistrict: "",
      pickupAddressCity: "",
      pickupAddressState: "",
      pickupSector: "",
      pickupContact: "",
      pickupLocalName: "",
      pickupCompanyName: "",
      pickupCNPJ: "",
      localName: "",
      companyName: "",
      cnpj: "",
      logisticsAddressCommercial: false,
      addressCommercial: false,
      addressComplement: "",
      useSameAddress: false,
    });
  };

  const modal = useGenericModal();

  const clinicalProfile = clinicalProfileOptions;

  const getStepFields = () => {
    const hasResponsible = methods.watch("hasResponsible") === "yes";
    const useSameAddress = methods.watch("useSameAddress") === true;

    const pickupFields = [
      "logisticsAddressCommercial",
      "pickupPostalCode",
      "pickupAddressName",
      "pickupNumber",
      "pickupAddressComplement",
      "pickupAddressDistrict",
      "pickupAddressCity",
      "pickupAddressState",
      "pickupSector",
      "pickupContact",
      "pickupLocalName",
      "pickupCompanyName",
      "pickupCNPJ",
    ];

    const addressFields = ["addressCommercial", "addressPostalCode", "addressName", "addressNumber", "addressComplement", "addressDistrict", "addressCity", "addressState", "sector", "contact", "localName", "companyName", "cnpj"];

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

  const validateCommercialFields = () => {

    if (step !== 2) return true;
    
    const formData = methods.getValues();
    let isValid = true;

    methods.clearErrors(["pickupSector", "pickupContact", "pickupLocalName", "pickupCNPJ", "pickupCompanyName", "sector", "contact", "localName", "cnpj", "companyName"]);

    if (!formData.pickupSector?.trim()) {
      methods.setError("pickupSector", {
        type: "required",
        message: "Nome do responsável/setor é obrigatório para endereços comerciais"
      });
      isValid = false;
    }
    if (!formData.pickupContact?.trim()) {
      methods.setError("pickupContact", {
        type: "required",
        message: "Telefone de contato é obrigatório para endereços comerciais"
      });
      isValid = false;
    }
    if (!formData.pickupLocalName?.trim()) {
      methods.setError("pickupLocalName", {
        type: "required",
        message: "Nome do local é obrigatório para endereços comerciais"
      });
      isValid = false;
    }
    if (!formData.pickupCNPJ?.trim()) {
      methods.setError("pickupCNPJ", {
        type: "required",
        message: "CNPJ é obrigatório para endereços comerciais"
      });
      isValid = false;
    }
    if (!formData.pickupCompanyName?.trim()) {
      methods.setError("pickupCompanyName", {
        type: "required",
        message: "Razão social é obrigatória para endereços comerciais"
      });
      isValid = false;
    }

    if (!formData.useSameAddress) {
      if (!formData.sector?.trim()) {
        methods.setError("sector", {
          type: "required",
          message: "Nome do responsável/setor é obrigatório para endereços comerciais"
        });
        isValid = false;
      }
      if (!formData.contact?.trim()) {
        methods.setError("contact", {
          type: "required",
          message: "Telefone de contato é obrigatório para endereços comerciais"
        });
        isValid = false;
      }
      if (!formData.localName?.trim()) {
        methods.setError("localName", {
          type: "required",
          message: "Nome do local é obrigatório para endereços comerciais"
        });
        isValid = false;
      }
      if (!formData.cnpj?.trim()) {
        methods.setError("cnpj", {
          type: "required",
          message: "CNPJ é obrigatório para endereços comerciais"
        });
        isValid = false;
      }
      if (!formData.companyName?.trim()) {
        methods.setError("companyName", {
          type: "required",
          message: "Razão social é obrigatória para endereços comerciais"
        });
        isValid = false;
      }
    }

    return isValid;
  }

  const handleNext = async () => {
    const fields = getStepFields();
    const isValid = await methods.trigger(fields);

    if (!validateClinalProfile() || !validateCommercialFields() || !isValid) {
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
          logisticsAddressCommercial,
          addressCommercial,
          pickupPostalCode,
          pickupAddressName,
          pickupNumber,
          pickupAddressComplement,
          pickupAddressDistrict,
          pickupAddressCity,
          pickupAddressState,
          pickupSector,
          pickupContact,
          pickupLocalName,
          pickupCompanyName,
          pickupCNPJ,
          localName,
          companyName,
          cnpj,
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
          sector: pickupSector,
          contact: pickupContact,
          local:{
            name: pickupLocalName,
            companyName: pickupCompanyName,
            cnpj: pickupCNPJ,
          },
          addressCommercial: true,
        };

        const commonAddressFields = {
          addressPostalCode: data.addressPostalCode,
          addressName: data.addressName,
          addressNumber: data.addressNumber,
          addressComplement: data.addressComplement,
          addressDistrict: data.addressDistrict,
          addressCity: data.addressCity,
          addressState: data.addressState,
          sector: data.sector,
          contact: data.contact,
          local: {
            name: data.localName,
            companyName: data.companyName,
            cnpj: data.cnpj,
          },
          addressCommercial: true,
        }

        const payload: any = {
          ...restData,
          ...commonAddressFields,
          logistics,
          hasClinicalProfile: true,
          clinicalProfile: selectedProfile,
          doctorId: doctor && auth.role !== "doctor" ? doctor : doctorId
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
    const fetchData = async () => {
      dispatch(fetchGenders());
      dispatch(fetchExams());
      dispatch(fetchLabs());
      dispatch(fetchDiseases());
      dispatch(getDoctorInfo());
      
      try {
        const clinicalProfileResult = await dispatch(fetchStringMaps({ attributeName: "Custom1StringMap", entityName: "diagnostic" })).unwrap();
        
        setClinicalProfileOptions(clinicalProfileResult.map((item: any) => ({
          stringMapId: item.stringMapId,
          optionName: item.optionName,
        })));
      } catch (error) {
        console.error("Erro ao buscar perfil clínico:", error);
      }
    };
    
    fetchData();
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
            <Step2 
              setStep={setStep} 
              control={methods.control} 
              errors={methods.formState.errors} 
              setValue={methods.setValue}
            />
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