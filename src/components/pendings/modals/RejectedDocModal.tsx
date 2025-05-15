import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DownloadIcon, UploadIcon, X } from "lucide-react";
import { AiFillFilePdf } from "react-icons/ai";
import { useAppDispatch } from "@/store/hooks";
import { examResolvePendency } from "@/store/slices/pendingsSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { downloadBase64File, fileToBase64 } from "@/helpers/fileHelper";

interface RejectedDocModalProps {
 open: boolean;
 onClose: () => void;
 docName: string;
 fileSize: string;
 reason: string;
 selectedItem: string;
 documentBody: string;
 contentType: string;
}

export default function RejectedDocModal({
 open,
 onClose,
 docName,
 fileSize,
 reason,
 selectedItem,
 documentBody,
 contentType,
}: RejectedDocModalProps) {
 const [uploadedFile, setUploadedFile] = useState<File | null>(null);
 const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
 const dispatch = useAppDispatch();
 if (!open || !selectedItem) return null;

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
   setUploadedFile(file);
   const base64 = await fileToBase64(file);
   setAttachmentBase64(base64);
  }
 };

 const handleDownload = () => {
  if (!documentBody || !docName || !contentType) {
   toast.warning("Documento indisponível para download.");
   return;
  }

  downloadBase64File(documentBody, docName, contentType);
 };

 const handleConfirm = async () => {
  if (!uploadedFile || !attachmentBase64) return;

  const attachment = {
   fileName: uploadedFile.name,
   contentType: uploadedFile.type,
   documentBody: attachmentBase64,
   fileSize: uploadedFile.size.toString(),
   fileType: uploadedFile.type,
   annotationTypeStringMapCode: null,
   healthProgramCode: "1001",
  };

  await dispatch(
   examResolvePendency({
    id: selectedItem,
    Attachments: [attachment],
   })
  );

  onClose();
 };

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
     <button
      onClick={handleDownload}
      className="w-full bg-[#8d9ea7] text-white py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-[#8d9ea7]/75 transition"
     >
      <DownloadIcon size={18} />
      Download documento modelo
     </button>
     <label className="w-full cursor-pointer bg-[#8d9ea7] text-white py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-[#8d9ea7]/75 transition">
      <UploadIcon size={18} />
      Upload Novo Documento
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
     </label>
     {uploadedFile && (
      <div className="text-sm text-zinc-600 mt-1 text-center">
       Arquivo selecionado: <span className="font-medium">{uploadedFile.name}</span>
      </div>
     )}
     <div className="flex py-2 mt-2 justify-center gap-2">
      <Button type="button" disabled={!uploadedFile || !attachmentBase64}>
       Confirmar
      </Button>
     </div>
    </div>
   </motion.div>
  </div>
 );
}