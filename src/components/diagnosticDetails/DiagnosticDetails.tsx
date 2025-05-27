import { IDiagnosticExamModel } from "@/types/diagnostic";
import dayjs from "dayjs";
import StatusCustom from "../custom/StatusCustom";

type DiagnosticDetailsProps = {
    data : IDiagnosticExamModel;
};

const DiagnosticDetails = ({data}: DiagnosticDetailsProps) => {

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
                    <h1 className="flex flex-row gap-4">
                        Dados do Exame 
                        <StatusCustom type={'ExamStatusStringMap'} statusStringMap={data.examStatusStringMap}/> 
                        {data.reasonExamNotDoneStringMap?.optionName && 
                            <div className="flex items-center gap-2">
                                <span>({data.reasonExamNotDoneStringMap?.optionName})</span>
                            </div>
                        }
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
                            <p>{(data.logisticsAddressCity && data.logisticsAddressState) && `${data.logisticsAddressCity}/${data.logisticsAddressState}`}</p>
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
        </>
    );
};

export default DiagnosticDetails;