import { useState } from "react";
import RejectedDocModal from "../modals/RejectedDocModal";
import { ExamPendingModel } from "@/types/diagnostic";

interface Props {
 items: ExamPendingModel[];
}

export default function PendingsDesktopPage({ items }: Props) {
 const [selectedItem, setSelectedItem] = useState<ExamPendingModel | null>(null);

 return (
  <div className="overflow-x-auto px-4 pb-3">
   <table className="min-w-full text-sm text-zinc-700">
    <thead className="border-b bg-white">
     <tr>
      <th className="w-24 px-2 py-2"></th>
      <th className="px-3 py-2 text-left font-medium">Nº Protocolo</th>
      <th className="px-3 py-2 text-left font-medium">Nome do Paciente</th>
      <th className="px-3 py-2 text-left font-medium">Data de Criação da pendência</th>
      <th className="px-3 py-2 text-left font-medium">Data de Reprovação</th>
      <th className="px-3 py-2 text-left font-medium">Motivo</th>
     </tr>
    </thead>
    <tbody>
     {items.map((item) => (
      <tr key={item.id} className="border-t">
       <td className="px-2 py-2">
        <button
         onClick={() => setSelectedItem(item)}
         className="border border-red-500 text-red-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition"
        >
         Resolver
        </button>
       </td>
       <td className="px-3 py-2">{item.numberProtocol}</td>
       <td className="px-3 py-2">{item.patientName}</td>
       <td className="px-3 py-2">{formatDate(item.dateCreate)}</td>
       <td className="px-3 py-2">{formatDate(item.dateUpdate)}</td>
       <td className="px-3 py-2 flex items-center gap-2 text-red-600">
        <span className="h-2 w-2 bg-red-600 rounded-full inline-block"></span>
        <span className="text-xs">{item.reason}</span>
       </td>
      </tr>
     ))}
    </tbody>
   </table>

   {selectedItem && (
    <RejectedDocModal
     open={!!selectedItem}
     onClose={() => setSelectedItem(null)}
     docName={selectedItem.attachments?.[0]?.fileName || "Documento"}
     fileSize={formatFileSize(selectedItem.attachments?.[0]?.fileSize)}
     reason={selectedItem.reason || ""}
    />
   )}
  </div>
 );
}

const formatDate = (date?: string | Date | null) => (date ? new Intl.DateTimeFormat("pt-BR").format(new Date(date)) : "-");

const formatFileSize = (size?: string | number | null) => (size ? `${(Number(size) / 1024).toFixed(1)} KB` : "Tamanho desconhecido");
