"use client";
import { IDiagnosticExamModel } from "@/types/diagnostic";
import dayjs from "dayjs";
import StatusCustom from "../custom/StatusCustom";
import { getCategoryFromFlag, resolvableFlags } from "@/helpers/resolveHelper";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedDoctorId } from "@/store/slices/registerPatientSlice";

type DiagnosticDetailsProps = {
  data: IDiagnosticExamModel;
  role?: string;
};

const DiagnosticDetails = ({ data, role }: DiagnosticDetailsProps) => {
  const router = useRouter();
  const statusFlag = data.examStatusStringMap?.flag ?? "";
  const dispatch = useAppDispatch();

  const handleRedirectToPendings = () => {
    const category = getCategoryFromFlag(statusFlag);
    if (!category) return;

    if (role === "professional" && data.doctorId) {
      dispatch(setSelectedDoctorId(data.doctorId));
    }

    const url = `/dashboard/doctor/pendings?resolveId=${data.id}&category=${encodeURIComponent(category)}`;

    router.push(url);
  };
  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 text-left">
        <div className="basis-[33%] contentDetails">
          <h1>Dados do Médico</h1>
          <div className="flex flex-row gap-6">
            <div className="basis-1/2">
              <label>CRM/UF</label>
              <p>{`${data.licenseNumber}-${data.licenseState}`}</p>
            </div>
            <div className="basis-1/2">
              <label>Nome do Médico</label>
              <p>{data.doctorName}</p>
            </div>
          </div>
        </div>
        <div className="basis-[67%] contentDetails">
          <h1>Dados do Paciente</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:basis-1/3">
              <label>CPF</label>
              <p>{data.cpf}</p>
            </div>
            <div className="md:basis-1/3">
              <label>Nome Completo do Paciente</label>
              <p>{data.namePatient}</p>
            </div>
            <div className="md:basis-1/3">
              <label>Data de Nascimento</label>
              <p>{dayjs(data.patientBirthDate).format("DD/MM/YYYY")}</p>
            </div>
          </div>
        </div>
      </div>
      {data.nameCaregiver && (
        <div className="flex flex-col md:flex-row gap-4 text-left">
          <div className="w-full contentDetails">
            <h1>Dados do Cuidador</h1>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:basis-1/3">
                <label>Nome Completo do Cuidador</label>
                <p>{data.nameCaregiver}</p>
              </div>
              <div className="md:basis-1/3">
                <label>CPF</label>
                <p>{data.cpfCarefiver}</p>
              </div>
              <div className="md:basis-1/3">
                <label>Data de Nascimento</label>
                <p>{dayjs(data.birthdateCaregiver).format("DD/MM/YYYY")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 text-left">
        <div className="w-full contentDetails">
          <h1 className="flex flex-wrap items-center gap-2 md:gap-4">
            Dados do Exame
            <StatusCustom type={"ExamStatusStringMap"} statusStringMap={data.examStatusStringMap} />
            {data.reasonExamNotDoneStringMap?.optionName && (
              <div className="flex items-center gap-2">
                <span>({data.reasonExamNotDoneStringMap?.optionName})</span>
              </div>
            )}
            {resolvableFlags.includes(statusFlag) && (role === "doctor" || role === "professional") && (
              <div className="w-full md:w-auto mt-1 md:mt-0">
                <button
                  onClick={handleRedirectToPendings}
                  className="border border-red-500 text-red-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition"
                >
                  Resolver
                </button>
              </div>
            )}
          </h1>
          <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="md:basis-1/6">
              <label>Patologia</label>
              <p>{data.diseaseName}</p>
            </div>
            <div className="md:basis-1/6">
              <label>Exame</label>
              <p>{data.examDefinition}</p>
            </div>
            <div className="md:basis-1/6">
              <label>Laboratório de Análise</label>
              <p>{data.localName}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="md:basis-1/6">
              <label>CEP da Coleta</label>
              <p>{data.logisticsAddressPostalCode}</p>
            </div>
            <div className="md:basis-1/6">
              <label>Endereço da Coleta</label>
              <p>{data.logisticsAddressCity && data.logisticsAddressState && `${data.logisticsAddressCity}/${data.logisticsAddressState}`}</p>
            </div>
            <div className="md:basis-1/6">
              <label>Logradouro</label>
              <p>{`${data.logisticsAddressName}, ${data.logisticsAddressNumber}`}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 py-4">
            <div className="md:basis-1/6">
              <label>Local de Retirada</label>
              <p>{data.section}</p>
            </div>
            <div className="md:basis-1/6">
              <label>Nome do Responsável/Setor</label>
              <p>{data.mainContact}</p>
            </div>
            <div className="md:basis-1/6">
              <label>Telefone de Contato</label>
              <p>{data.institutionTelephone}</p>
            </div>
          </div>
        </div>
      </div>
      {data.betaAmyloidPeptide42 && role === "operation" && (
        <div className="flex flex-col md:flex-row gap-4 text-left">
          <div className="w-full contentDetails">
            <h1>Resultado</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:basis-1/4">
                <label>Peptídeo Beta Amiloide 1-42 (BA 42)</label>
                <p>{data.betaAmyloidPeptide42}</p>
              </div>
              <div className="md:basis-1/4">
                <label>Proteina Tau Fosforilada</label>
                <p>{data.phosphorylatedTau}</p>
              </div>
              <div className="md:basis-1/4">
                <label>Razão pTau/BA42</label>
                <p>{data.pTauToBA42Ratio}</p>
              </div>
              <div className="md:basis-1/4">
                <label>Proteina Tau Total(tTau)</label>
                <p>{data.totalTau}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiagnosticDetails;