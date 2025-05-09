import { useState } from "react";
import RejectedDocModal from "../modals/RejectedDocModal";

interface PendingsDesktopPageProps {
 items: {
  id: string;
  columns: string[];
  reason?: string;
 }[];
}

export default function PendingsDesktopPage({ items }: PendingsDesktopPageProps) {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [selectedItem, setSelectedItem] = useState<{ id: string; reason?: string } | null>(null);

 const handleOpen = (item: { id: string; reason?: string }) => {
  setSelectedItem(item);
  setIsModalOpen(true);
 };

 const handleClose = () => {
  setIsModalOpen(false);
  setSelectedItem(null);
 };
 return (
  <div className="overflow-x-auto px-4 pb-3">
   <table className="min-w-full text-sm text-zinc-700">
    <thead className="border-b bg-white">
     <tr>
      <th className="w-24 px-2 py-2"></th>
      <th className="px-3 py-2 text-left font-medium">Nº Protocolo</th>
      <th className="px-3 py-2 text-left font-medium">Nome do Paciente</th>
      <th className="px-3 py-2 text-left font-medium">Data da Criação da pendência</th>
      <th className="px-3 py-2 text-left font-medium">Data de Reprovação</th>
      <th className="px-3 py-2 text-left font-medium">Motivo</th>
     </tr>
    </thead>
    <tbody>
     {items.map((item) => (
      <tr key={item.id} className="border-t">
       <td className="px-2 py-2">
        <button
         onClick={() => handleOpen(item)}
         className="border border-red-500 text-red-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition"
        >
         Resolver
        </button>
       </td>
       {item.columns.map((col, index) => (
        <td key={index} className="px-3 py-2">
         {col}
        </td>
       ))}
       <td className="px-3 py-2 flex items-center gap-2 text-red-600">
        <span className="h-2 w-2 bg-red-600 rounded-full inline-block"></span>
        <span className="text-xs">{item.reason}</span>
       </td>
      </tr>
     ))}
    </tbody>
   </table>
   <RejectedDocModal
    open={isModalOpen}
    onClose={handleClose}
    docName="Termo de Consentimento Assinado"
    fileSize="100 KB"
    reason={selectedItem?.reason || ""}
   />
  </div>
 );
}
