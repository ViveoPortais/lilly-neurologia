"use client";
import { IDiagnosticExamModel } from "@/types/diagnostic";
import dayjs from "dayjs";
import StatusCustom from "../custom/StatusCustom";
import { getCategoryFromFlag, resolvableFlags } from "@/helpers/resolveHelper";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setSelectedDoctorId } from "@/store/slices/registerPatientSlice";
import { IStringMap } from "@/types";
import { FaCircleExclamation, FaChevronDown, FaChevronUp, } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LuPencil } from "react-icons/lu";
import { FiEdit3 } from "react-icons/fi";

type DiagnosticDetailsProps = {
  data: IDiagnosticExamModel;
  role?: string;
};

const DiagnosticDetails = ({ data, role }: DiagnosticDetailsProps) => {
  const router = useRouter();
  const statusFlag = data.examStatusStringMap?.flag ?? "";
  const dispatch = useAppDispatch();
  const [scheduleOpen, setScheduleOpen] = useState(true);

  const handleRedirectToPendings = () => {
    const category = getCategoryFromFlag(statusFlag);
    if (!category) return;

    if (role === "professional" && data.doctorId) {
      dispatch(setSelectedDoctorId(data.doctorId));
    }

    const url = `/dashboard/doctor/pendings?resolveId=${data.id}&category=${encodeURIComponent(category)}`;

    router.push(url);
  };

  const handleEditSampleDate = (isRestrictedEdit : boolean) => {
    const queryParams = new URLSearchParams({ examId: data.id });

    if (data.doctorId) {
      queryParams.set("selectedDoctorId", data.doctorId);
    }

    queryParams.set("IsEdit", "true");

    queryParams.set("isRestrictedEdit", isRestrictedEdit.toString());

    router.push(`/dashboard/schedule-sample?${queryParams.toString()}`);
  };

  const isWithin24BusinessHours = (targetDate: string | Date) => {
    const now = dayjs();
    const target = dayjs(targetDate);

    let businessHoursCount = 0;
    let current = now;

    while (current.isBefore(target) && businessHoursCount < 24) {
      if (current.day() >= 1 && current.day() <= 5) {
        businessHoursCount += 24;
      }
      current = current.add(1, 'day');
    }

    return businessHoursCount >= 24;
  };


  const isWithin48BusinessHours = (targetDate: string | Date) => {
    const now = dayjs();
    const target = dayjs(targetDate);

    let businessHoursCount = 0;
    let current = now;

    while (current.isBefore(target) && businessHoursCount < 48) {
      if (current.day() >= 1 && current.day() <= 5) {
        businessHoursCount += 24;
      }
      current = current.add(1, 'day');
    }

    return businessHoursCount >= 48;
  };

  const renderResultsByFlag = (data: IDiagnosticExamModel) => {

    switch (data.resultStringMap?.flag) {
      case "#RESULTINCONCLUSIVE":
        return (
          <div className="md:basis-1/4">
            <p className="flex flex-row gap-2">
              Resultado Inconclusivo
              <FaCircleExclamation size={15} className="flex my-auto text-black bg-white rounded rounded-full" title="O exame foi realizado, porém não foi possível obter um resultado conclusivo nesta análise." />
            </p>
          </div>
        );
      default:
        return (
          <>
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
          </>
        );
    }

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
          <h1 className="flex flex-wrap items-baseline gap-2 md:gap-4">
            Dados do Exame
            <StatusCustom type={"ExamStatusStringMap"} statusStringMap={data.examStatusStringMap} />
            {data.reasonExamNotDoneStringMap?.optionName && (
              <div className="flex items-center gap-2">
                <span>({data.reasonExamNotDoneStringMap?.optionName})</span>
              </div>
            )}

            {/* {((data.examStatusStringMap?.flag === 'EXAM_WAITING_WITHDRAWAL' ||
              data.examStatusStringMap?.flag === 'EXAM_WAITING_LOGISTICS_BATCH' ||
              data.examStatusStringMap?.flag === 'EXAM_WAITING_PRINT_DOCUMENTS') && data.withdrawalDate != null) && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Data de retirada da amostra : <strong className="text-black">{dayjs(data.withdrawalDate).format("DD/MM/YYYY")} - {data.preferredTimeStringMap?.optionName}</strong></span>
                </div>
              )} */}


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

        </div>
      </div>


      {(role != "logistics" && data.examStatusStringMap?.flag === "EXAM_REPORT_AVAILABLE") && (
        <div className="flex flex-col md:flex-row gap-4 text-left">
          <div className="w-full contentDetails">
            <h1>Resultados</h1>
            <div className="flex flex-col md:flex-row gap-6">
              {renderResultsByFlag(data)}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 text-left">
        <div className="w-full contentDetails">
          <button
            onClick={() => setScheduleOpen(!scheduleOpen)}
            className="w-full flex justify-between items-center text-left mb-4 pe-6"
          >
            <div className="flex items-center gap-4">
              <h1>Dados do Agendamento</h1>
            </div>
            {scheduleOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <AnimatePresence>
            {scheduleOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {data.scheduledDate && (

                    <div className="basis-1/5">
                      <label>Data da Coleta do Material Biológico</label>
                      <p className="flex flex-row gap-4">
                        {dayjs(data.scheduledDate).format('DD/MM/YYYY HH:mm')}
                        {((data.examStatusStringMap?.flag === 'EXAM_WAITING_LOGISTICS_BATCH' || data.examStatusStringMap?.flag === 'EXAM_WITHDRAWAL_WAITING_APROVATION') &&
                          role === 'doctor') &&

                          <FiEdit3
                            size={20}
                            className={`mt-1 ${isWithin24BusinessHours(data.scheduledDate)
                              ? "text-mainlilly cursor-pointer"
                              : "disabled text-gray-400 cursor-not-allowed opacity-50"
                              }`}
                            onClick={isWithin24BusinessHours(data.scheduledDate) ? () => {handleEditSampleDate(false)} : undefined}
                            title={isWithin24BusinessHours(data.scheduledDate)
                              ? "O prazo para coleta da amostra deve ser até no máximo 24 horas antes da data da retirada da amostra."
                              : "Função bloqueada devido prazo menor que 24 horas da data da retirada da amostra."}
                          />
                        }
                      </p>
                    </div>

                  )}

                  {data.examStatusStringMap?.flag === 'EXAM_WITHDRAWAL_WAITING_APROVATION' ? 
                  (
                    <div className="basis-1/5">
                      <label>Data Sugerida da Retirada da Amostra</label>
                      <p className="flex flex-row gap-4">
                          {data.doctorSuggestedDate ?
                            `${dayjs(data.doctorSuggestedDate).format('DD/MM/YYYY HH:mm')} - ${data.preferredTimeStringMap?.optionName}` :
                            `--/--/---- --:--`
                          }
                        {(role === 'doctor' && data.doctorSuggestedDate) &&

                          <FiEdit3
                            size={20}
                            className={`mt-1 ${isWithin48BusinessHours(data.doctorSuggestedDate)
                              ? "text-mainlilly cursor-pointer"
                              : "disabled text-gray-400 cursor-not-allowed opacity-50"
                              }`}
                            onClick={isWithin48BusinessHours(data.doctorSuggestedDate) ? () => {handleEditSampleDate(true)} : undefined}
                            title={isWithin48BusinessHours(data.doctorSuggestedDate)
                              ? "O prazo para coleta da amostra deve ser até no máximo 48 horas antes da data da retirada da amostra."
                              : "Função bloqueada devido prazo menor que 48 horas da data da retirada da amostra."}
                          />
                        }
                      </p>
                    </div>
                  ) : 
                  (
                      <div className="basis-1/5">
                        <label>Data Escolhida para Retirada da Amostra</label>
                        <p className="flex flex-row gap-4">
                          {data.withdrawalDate ?
                            `${dayjs(data.withdrawalDate).format('DD/MM/YYYY HH:mm')} - ${data.preferredTimeStringMap?.optionName}` :
                            `--/--/---- --:--`
                          }
                          {(role === 'doctor' && data.withdrawalDate && data.examStatusStringMap?.flag === 'EXAM_WAITING_LOGISTICS_BATCH') &&

                            <FiEdit3
                              size={20}
                              className={`mt-1 ${isWithin48BusinessHours(data.withdrawalDate)
                                ? "text-mainlilly cursor-pointer"
                                : "disabled text-gray-400 cursor-not-allowed opacity-50"
                                }`}
                              onClick={isWithin48BusinessHours(data.withdrawalDate) ? () => {handleEditSampleDate(true)} : undefined}
                              title={isWithin48BusinessHours(data.withdrawalDate)
                                ? "O prazo para coleta da amostra deve ser até no máximo 48 horas antes da data da retirada da amostra."
                                : "Função bloqueada devido prazo menor que 48 horas da data da retirada da amostra."}
                            />
                        }
                        </p>
                      </div>
                  )}


                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default DiagnosticDetails;