import { ColumnDef, RowPinning } from "@tanstack/react-table";
import { FiDownload, FiEdit3, FiEye, FiTrash2, FiMoreVertical, FiMoreHorizontal } from "react-icons/fi";
import dayjs from "dayjs";
import { AnnotationModel } from "@/types/general";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Handlers {
 onPreview: (file: AnnotationModel) => void;
 onDownload: (file: AnnotationModel) => void;
 onEdit: (file: AnnotationModel) => void;
 onDelete: (file: AnnotationModel) => void;
}

export const getAnnotationColumns = ({ onPreview, onDownload, onEdit, onDelete }: Handlers): ColumnDef<AnnotationModel>[] => [
{
  header: "Descrição do Arquivo",
  accessorKey: "attachments",
  cell: ({ row }) => {
   return <span>{row.original.name || "-"}</span>;
  },
 },
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
  header: "Ações",
  cell: ({ row }) => {
   const file = row.original.attachments?.[0];
   const isPdf = file?.contentType === "application/pdf";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FiMoreHorizontal className="text-mainlilly" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => isPdf ? onPreview(row.original) : onDownload(row.original)}>
            {isPdf ? <FiEye className="mr-2" /> : <FiDownload className="mr-2" />}
            {isPdf ? "Visualizar" : "Download"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(row.original)}>
            <FiEdit3 className="mr-2" />
            Alterar
          </DropdownMenuItem>
          {row.original.annotationTypeStringMap?.flag == "#CONTENT_LIBRARY" &&
            <DropdownMenuItem onClick={() => onDelete(row.original)} className="text-red-600">
              <FiTrash2 className="mr-2" />
              Excluir
            </DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
 },
];
