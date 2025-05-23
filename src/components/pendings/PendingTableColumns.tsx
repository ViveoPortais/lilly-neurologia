import { ExamPendingModel } from "@/types/diagnostic";
import { formatDate } from "@/helpers/helpers";

export type ColumnConfig = {
 label: string;
 render: (item: ExamPendingModel) => React.ReactNode;
};

type Role = "doctor" | "operation";
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

export const PendingTableColumns: Record<Role, TableColumnMap> = {
 doctor: {
  Documentação: [
   { label: "Nº Protocolo", render: (item) => item.numberProtocol },
   { label: "Nome do Paciente", render: (item) => item.patientName },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   { label: "Data de Reprovação", render: (item) => formatDate(item.dateUpdate) },
   motivoColumn,
  ],
  "Solicitações de Retirada de Amostra": [
   { label: "Nº Protocolo", render: (item) => item.numberProtocol },
   { label: "Nome do Paciente", render: (item) => item.patientName },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   { label: "Data da Coleta", render: (item) => formatDate(item.dateUpdate) },
   motivoColumn,
  ],
  "Problema com a Amostra": [
   { label: "Nº Protocolo", render: (item) => item.numberProtocol },
   { label: "Nome do Paciente", render: (item) => item.patientName },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   { label: "Data da Coleta", render: (item) => formatDate(item.dateUpdate) },
   motivoColumn,
  ],
  "Aprovação de Vínculo": [
   { label: "Nome do Profissional", render: (item) => item.patientName },
   { label: "Data de Solicitação do Vínculo", render: (item) => formatDate(item.dateCreate) },
   { label: "Data do Registro", render: (item) => formatDate(item.dateUpdate) },
   motivoColumn,
  ],
 },

 operation: {
  Documentação: [
   { label: "Número do Protocolo", render: (item) => item.numberProtocol },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   { label: "Data de Envio", render: (item) => formatDate(item.dateUpdate) },
   { label: "Nome do Médico/Profissional", render: (item) => item.doctorName || "-" },
   motivoColumn,
  ],
  "Gerar Declaração de Lote": [
   { label: "Número do Protocolo", render: (item) => item.numberProtocol },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   motivoColumn,
  ],
  "Confirma Entrega de Amostra": [
   { label: "Número do Protocolo", render: (item) => item.numberProtocol },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   { label: "Data de Envio", render: (item) => formatDate(item.dateUpdate) },
   { label: "Nome do Médico/Profissional", render: (item) => item.doctorName || "-" },
   motivoColumn,
  ],
  "Concluir Análise": [
   { label: "Número do Protocolo", render: (item) => item.numberProtocol },
   { label: "Data da Criação da pendência", render: (item) => formatDate(item.dateCreate) },
   { label: "Data de Envio", render: (item) => formatDate(item.dateUpdate) },
   { label: "Nome do Médico/Profissional", render: (item) => item.doctorName || "-" },
   motivoColumn,
  ],
 },
};
