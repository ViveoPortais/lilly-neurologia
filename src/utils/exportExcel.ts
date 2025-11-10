import { IDiagnosticExamModel } from "@/types/diagnostic";
import * as XLSX from "xlsx";

export function exportDiagnosticsToExcel(myExams: IDiagnosticExamModel[], fileName = "Solicitacoes.xlsx") {
  if (!myExams || myExams.length === 0) {
    console.warn("Nenhum registro encontrado para exportar.");
    return;
  }

  const dataToExport = myExams.map((exam: IDiagnosticExamModel) => ({
    "Data da Solicitação": formatDate(exam.createdOn),
    "Número do Protocolo": exam.voucher ?? "",
    "Nome do Paciente": exam.namePatient ?? "",
    "Data de Nascimento": formatDate(exam.patientBirthDate),
    "CPF": exam.cpf ?? "",
    "Médico": exam.doctorName ?? "",
    "CRM/UF": `${exam.licenseNumber ?? ""}/${exam.licenseState ?? ""}`,
    "Patologia": exam.diseaseName ?? "",
    "Laboratório": exam.localName ?? "",
    "Exame": exam.examDefinition ?? "",
    "Status do Exame": exam.examStatusStringMap?.optionName ?? "",
    "Data da Coleta do Material Biológico" : formatDate(exam.scheduledDate),
    "Data Sugerida para Retirada da Amostra" :formatDate(exam.doctorSuggestedDate),
    "Data Escolhida para Retirada da Amostra":formatDate(exam.dateForCollecting),
    "Data de Confirmação da Retirada da Amostra":formatDate(exam.confirmWithdrawalDate),
    "Motivo Pendência/Cancelamento": exam.reasonExamNotDoneStringMap?.optionName ?? "",
    "Resultado" : exam.resultStringMap?.optionName ?? "",
    "Data do Resultado": formatDate(exam.analysisEndDate),
    "Peptideo Beta Amiloide 1-42 (B4 42)": exam.betaAmyloidPeptide42 ?? "",
    "Proteína Tau Fosforilada" : exam.phosphorylatedTau ?? "",
    "Razão pTau/BA42":exam.pTauToBA42Ratio ?? "",
    "Proteína Tau Total (tTau)":exam.totalTau ?? ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  worksheet["!cols"] = [{ wch: 20 }, { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 35 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitações");

  XLSX.writeFile(workbook, fileName);
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}