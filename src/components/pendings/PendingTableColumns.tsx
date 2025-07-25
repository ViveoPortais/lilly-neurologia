import { ExamPendingModel, IConfirmSampleDeliveryModel } from "@/types/diagnostic";
import { formatDate } from "@/helpers/helpers";
import dayjs from "dayjs";
import { downloadBase64File } from "@/helpers/fileHelper";
import { Button } from "../ui/button";
import { FiDownload } from "react-icons/fi";

export type ColumnConfig = {
  label: string;
  render: (item: ExamPendingModel) => React.ReactNode;
};

type Role = "doctor" | "operation" | "logistics" | "professional";
type TableColumnMap = Record<string, ColumnConfig[]>;

const motivoColumn: ColumnConfig = {
  label: "Motivo",
  render: (item: ExamPendingModel) => (
    <span className="text-red-600 text-xs flex items-center gap-2">
      <span className="h-2 w-2 bg-red-600 rounded-full inline-block" />
      {item.reason}
    </span>
  ),
};

const etiquetaColumn: ColumnConfig = {
  label: "Etiqueta",
  render: (item) => {
    const file = item.attachments?.[0];

    if (!file || !file.documentBody) return "-";

    return (
      <Button
        title="Baixar Etiqueta"
        onClick={() => downloadBase64File(file.documentBody || "", file.fileName || "etiqueta.pdf", file.contentType || "application/pdf")}
      >
        <FiDownload size={20} />
      </Button>
    );
  },
};

export const PendingTableColumns: Record<Role, TableColumnMap> = {
  doctor: {
    Documentação: [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data de Reprovação", render: (item) => dayjs(item.dateUpdate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Solicitações de Retirada de Amostra": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Problema com a Amostra": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data da Coleta", render: (item) => dayjs(item.examCollectionDate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Aprovação de Vínculo": [
      { label: "Nome do Profissional", render: (item) => item.nameHealthProfessional },
      { label: "Data de Solicitação do Vínculo", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data do Registro", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
  },

  operation: {
    Documentação: [
      { label: "Número do Protocolo", render: (item) => item.numberProtocol },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data de Envio", render: (item) => dayjs(item.dateUpdate).format("DD/MM/YYYY") },
      { label: "Nome do Médico/Profissional", render: (item) => item.doctorName || "-" },
      motivoColumn,
    ],
    "Gerar Declaração de Lote": [
      { label: "Número do Protocolo", render: (item) => item.numberProtocol },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Confirmar Entrega de Amostra": [
      { label: "Número do Protocolo", render: (item) => item.numberProtocol },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      {
        label: "Data de Envio",
        render: (item) => {
          const data = item as IConfirmSampleDeliveryModel;
          return dayjs(data.sentDate).format("DD/MM/YYYY");
        },
      },
      { label: "Nome do Médico/Profissional", render: (item) => item.doctorName || "-" },
      motivoColumn,
    ],
    "Concluir Análise": [
      { label: "Número do Protocolo", render: (item) => item.numberProtocol },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      {
        label: "Data de Envio",
        render: (item) => {
          const data = item as IConfirmSampleDeliveryModel;
          return dayjs(data.sentDate).format("DD/MM/YYYY");
        },
      },
      { label: "Nome do Médico/Profissional", render: (item) => item.doctorName || "-" },
      motivoColumn,
    ],
  },

  logistics: {
    "Solicitações de Envio de Tubo": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data de Criação da Pendência", render: (item) => dayjs(item.dateUpdate).format("DD/MM/YYYY") },
      { label: "Data do Pedido", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      etiquetaColumn,
      motivoColumn,
    ],
    "Confirmar Entrega de Tubo": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateUpdate).format("DD/MM/YYYY") },
      { label: "Data do Pedido", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Solicitações de Retirada": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data da Coleta do Exame", render: (item) => dayjs(item.examCollectionDate).format("DD/MM/YYYY") || "-" },
      { label: "Data da Retirada", render: (item) => dayjs(item.examPickupDate).format("DD/MM/YYYY") || "-" },
      motivoColumn,
    ],
    "Confirmar Retirada da Amostra": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Data da criação da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data da Coleta do Exame", render: (item) => dayjs(item.examCollectionDate).format("DD/MM/YYYY") },
      { label: "Data da Retirada", render: (item) => dayjs(item.dateForCollecting).format("DD/MM/YYYY") },
      motivoColumn,
    ],
  },
  professional: {
    Documentação: [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data de Reprovação", render: (item) => dayjs(item.dateUpdate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Solicitações de Retirada de Amostra": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data da Coleta", render: (item) => dayjs(item.dateUpdate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
    "Problema com a Amostra": [
      { label: "Nº Protocolo", render: (item) => item.numberProtocol },
      { label: "Nome do Paciente", render: (item) => item.patientName },
      { label: "Data da pendência", render: (item) => dayjs(item.dateCreate).format("DD/MM/YYYY") },
      { label: "Data da Coleta", render: (item) => dayjs(item.examCollectionDate).format("DD/MM/YYYY") },
      motivoColumn,
    ],
  },
};