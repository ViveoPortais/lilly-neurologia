import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DownloadIcon, UploadIcon, X } from "lucide-react";
import { AiFillFilePdf } from "react-icons/ai";

interface RejectedDocModalProps {
 open: boolean;
 onClose: () => void;
 docName: string;
 fileSize: string;
 reason: string;
}

export default function RejectedDocModal({ open, onClose, docName, fileSize, reason }: RejectedDocModalProps) {
 if (!open) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
   <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="relative bg-white rounded-xl p-6 shadow-lg max-w-sm w-full max-h-screen overflow-y-auto"
   >
    <div className="flex items-center justify-between mb-1">
     <h2 className="text-lg font-semibold text-zinc-800">Documentação reprovada</h2>
     <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700" aria-label="Fechar modal">
      <X size={20} />
     </button>
    </div>
    <hr className="mb-4 border-zinc-200" />

    <div className="flex items-center gap-3 border border-zinc-300 p-3 rounded-md">
     <AiFillFilePdf className="text-red-600" size={24} />
     <div>
      <p className="text-sm font-medium text-zinc-800">{docName}</p>
      <p className="text-xs text-zinc-500">{fileSize}</p>
     </div>
    </div>

    <div className="border border-zinc-300 bg-[#efe9e9] mt-4 text-left p-3 rounded-md">
     <label className="text-sm font-semibold text-zinc-800 mb-1 block">Motivo</label>
     <div className="text-sm text-zinc-700">{reason}</div>
    </div>

    <div className="mt-6 space-y-2">
     <button className="w-full bg-[#8d9ea7] text-white py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-[#8d9ea7]/75 transition">
      <DownloadIcon size={18} />
      Download documento modelo
     </button>
     <button className="w-full bg-[#8d9ea7] text-white py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-[#8d9ea7]/75 transition">
      <UploadIcon size={18} />
      Upload Novo Documento
     </button>
     <div className="flex py-2 mt-2 justify-center gap-2">
      <Button type="button">Confirmar</Button>
     </div>
    </div>
   </motion.div>
  </div>
 );
}
