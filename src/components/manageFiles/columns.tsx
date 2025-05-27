import { ColumnDef } from "@tanstack/react-table";
import { FiDownload, FiEdit3, FiEye } from "react-icons/fi";
import dayjs from "dayjs";
import { AnnotationModel } from "@/types/general";

interface Handlers {
 onPreview: (file: AnnotationModel) => void;
 onDownload: (file: AnnotationModel) => void;
 onEdit: (file: AnnotationModel) => void;
}

export const getAnnotationColumns = ({ onPreview, onDownload, onEdit }: Handlers): ColumnDef<AnnotationModel>[] => [
 {
  header: "Nome do Arquivo",
  accessorKey: "attachments",
  cell: ({ row }) => {
   const file = row.original.attachments?.[0];
   return <span>{file?.fileName || "-"}</span>;
  },
 },
 {
  header: "Tipo do Arquivo",
  accessorKey: "annotationTypeStringMap.optionName",
  cell: ({ row }) => {
   return <span>{row.original.annotationTypeStringMap?.optionName || "-"}</span>;
  },
 },
 {
  header: "Última Substituição",
  accessorKey: "modifiedOn",
  cell: ({ row }) => {
   const created = row.original.modifiedOn;
   return <span>{created ? dayjs(created).format("DD/MM/YYYY – HH:mm") : "-"}</span>;
  },
 },
 {
  header: "Usuário Substituidor",
  accessorKey: "modifiedByName",
  cell: ({ row }) => {
   return <span>{row.original.modifiedByName || "-"}</span>;
  },
 },
 {
  header: "Visualizar",
  cell: ({ row }) => {
   const file = row.original.attachments?.[0];
   const isPdf = file?.contentType === "application/pdf";
   return (
    <div className="flex justify-start">
     {isPdf ? (
      <FiEye className="text-mainlilly cursor-pointer" onClick={() => onPreview(row.original)} />
     ) : (
      <FiDownload className="text-mainlilly cursor-pointer" onClick={() => onDownload(row.original)} />
     )}
    </div>
   );
  },
 },
 {
  header: "Alterar",
  cell: ({ row }) => (
   <div className="flex justify-start">
    <FiEdit3 className="text-mainlilly cursor-pointer" onClick={() => onEdit(row.original)} />
   </div>
  ),
 },
];
