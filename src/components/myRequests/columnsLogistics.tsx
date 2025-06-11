import { AttachmentModel, IDiagnosticExamModel } from "@/types/diagnostic";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import DetailsButton from "./DetailsButton";
import StatusCustom from "../custom/StatusCustom";
import { Button } from "../ui/button";
import { FiDownload } from "react-icons/fi";
import { downloadBase64File } from "@/helpers/fileHelper";

export const columnsLogistics: ColumnDef<IDiagnosticExamModel>[] = [
  {
    accessorKey: "id",
    header: "Detalhes",
    cell: ({ row }) => {
      const { id } = row.original;
      return (<DetailsButton id={id} />);
    },
  },
  {
    accessorKey: "createdOn",
    header: " Data da Solicitação",
    meta: {
      hideOnMobile: true,
    },
    cell: ({ row }) => {
      const date = row.original.createdOn;
      return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
    },
  },
  {
    accessorKey: "voucher",
    header: "Número do Protocolo",
    cell: ({ row }) => {
      return row.original.voucher;
    },
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => {
      return row.original.cpf;
    },
  },
  {
    accessorKey: "namePatient",
    header: "Nome do Paciente",
    meta: {
      hideOnMobile: true,
    },
    cell: ({ row }) => {
      return row.original.namePatient;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      hideOnMobile: true,
    },
    cell: ({ row }) => {
      const { examStatusStringMap } = row.original;
      return <StatusCustom type={"ExamStatusStringMap"} statusStringMap={examStatusStringMap} />;
    },
  },
  {
    accessorKey: "labelAttachment",
    header: "Etiquetas",
    cell: ({ row }) => {
      const label: AttachmentModel | undefined = row.original.labelAttachment?.[0];

      if (!label) return null;

      return (
        <Button title="Baixar Etiqueta" onClick={() => downloadBase64File(label.documentBody!, label.fileName!, label.contentType!)}>
          <FiDownload size={20} />
        </Button>
      );
    },
  },
];