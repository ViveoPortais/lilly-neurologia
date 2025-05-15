import { useState } from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/custom/CustomSelect";

interface AttachmentItem {
 id: string;
 title: string;
 size: string;
}

interface OperationRejectedDocModalProps {
 onClose: () => void;
}

const mockAttachments: AttachmentItem[] = [
 { id: "1", title: "Termo de Consentimento Assinado", size: "100 KB" },
 { id: "2", title: "Pedido Médico", size: "100 KB" },
];

export default function OperationRejectedDocModal({ onClose }: OperationRejectedDocModalProps) {
 const [rejectionReasonMap, setRejectionReasonMap] = useState<Record<string, string>>({});
 const [statusMap, setStatusMap] = useState<Record<string, "approved" | "rejected" | null>>({});
 const [uploadFileName, setUploadFileName] = useState<string | null>(null);

 const handleDecision = (id: string, decision: "approved" | "rejected") => {
  setStatusMap((prev) => ({ ...prev, [id]: decision }));
 };

 const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) setUploadFileName(file.name);
 };

 return (
  <div className="space-y-4">
   <div className="space-y-2 border border-dashed border-zinc-300 rounded-lg p-4 bg-[#f9f9f9]">
    {mockAttachments.map((doc) => {
     const status = statusMap[doc.id];
     const isApproved = status === "approved";
     const isRejected = status === "rejected";

     const rejectionOptions = doc.title.toLowerCase().includes("termo")
      ? [
         { id: "1", value: "Documento Inválido" },
         { id: "2", value: "Termo Incompleto" },
         { id: "3", value: "Termo sem Aceite" },
         { id: "4", value: "Termo não assinado" },
        ]
      : [
         { id: "1", value: "Pedido Não Assinado e ou Não Carimbado" },
         { id: "2", value: "Documento Inválido" },
         { id: "3", value: "Divergente do modelo do programa" },
        ];

     return (
      <div
       key={doc.id}
       className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-zinc-300 rounded-lg px-4 py-3 bg-white gap-2"
      >
       <div className="flex items-start gap-2 relative w-full sm:w-auto">
        <AiFillFilePdf className="text-red-600 mt-1 shrink-0" size={20} />
        <div className="flex flex-col max-w-full sm:max-w-[160px]">
         <span className="text-sm font-medium text-zinc-800 truncate" title={doc.title}>
          {doc.title}
         </span>
         <span className="text-xs text-zinc-500 text-left">{doc.size}</span>
        </div>
        <FiDownload className="text-zinc-500 absolute right-0 top-1 sm:static sm:ml-2 cursor-pointer" size={16} />
       </div>

       <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-between sm:justify-end gap-2">
        {isApproved ? (
         <span className="flex items-center gap-1 text-green-600 font-semibold border border-green-500 px-3 py-1 rounded-md text-sm w-full sm:w-[100px] justify-center">
          <FaCheckCircle size={14} /> Aprovado
         </span>
        ) : isRejected ? (
         <div className="w-full sm:w-[180px]">
          <CustomSelect
           name={`reason-${doc.id}`}
           label="Motivo"
           value={rejectionReasonMap[doc.id]}
           onChange={(value) => setRejectionReasonMap((prev) => ({ ...prev, [doc.id]: value }))}
           options={rejectionOptions}
          />
         </div>
        ) : (
         <>
          <button
           className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border font-semibold transition w-full sm:w-[100px] justify-center border-green-500 text-green-600 hover:bg-green-50"
           onClick={() => handleDecision(doc.id, "approved")}
          >
           <FaCheckCircle size={14} />
           Aprovar
          </button>
          <button
           className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border font-semibold transition w-full sm:w-[100px] justify-center border-red-500 text-red-600 hover:bg-red-50"
           onClick={() => handleDecision(doc.id, "rejected")}
          >
           <FaTimesCircle size={14} />
           Reprovar
          </button>
         </>
        )}
       </div>
      </div>
     );
    })}
   </div>

   <div className="border border-dashed border-zinc-300 rounded-lg p-4 text-center bg-[#f9f9f9]">
    <label className="block text-sm font-medium text-zinc-700 mb-2">Upload de Etiqueta para Logística</label>
    <label className="w-full cursor-pointer bg-[#8d9ea7] text-white py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-[#8d9ea7]/75 transition">
     <UploadIcon size={18} />
     Upload da Etiqueta
     <input type="file" className="hidden" onChange={handleUpload} />
    </label>
    {uploadFileName && <div className="text-xs text-zinc-500 mt-1 truncate">Arquivo: {uploadFileName}</div>}
   </div>

   <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
    <Button type="button" variant="outlineMainlilly" className="w-full sm:w-1/2" onClick={onClose}>
     Cancelar
    </Button>
    <Button type="button" className="w-full sm:w-1/2">
     Salvar
    </Button>
   </div>
  </div>
 );
}