import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { fileToBase64 } from "@/helpers/fileHelper";
import { ExamPendingModel } from "@/types/diagnostic";
import FileDownload from "@/components/custom/FileDownload";
import { useLoading } from "@/contexts/LoadingContext";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { UploadButton } from "@/components/custom/UploadButton";

interface RejectedDocModalProps {
 open: boolean;
 onClose: () => void;
 item: ExamPendingModel;
}

export default function RejectedDocModal({ open, onClose, item }: RejectedDocModalProps) {
 const [uploadedFile, setUploadedFile] = useState<File | null>(null);
 const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
 const { show } = useLoading();
 const { resolve } = useResolveExamPendency();
 if (!open || !item) return null;

 const handleConfirm = async () => {
  if (!uploadedFile || !attachmentBase64) return;

  const attachment = {
   fileName: uploadedFile.name,
   contentType: uploadedFile.type,
   documentBody: attachmentBase64,
   fileSize: uploadedFile.size.toString(),
   fileType: uploadedFile.type,
  };

  const updatedModel = {
   ...item,
   attachments: [attachment],
  };

  show();

  resolve({
   item: updatedModel,
   onSuccess: onClose,
  });
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

    {item.attachments?.[0] && (
     <FileDownload
      annotationType={item.attachments[0].annotationTypeName ?? ""}
      attachment={{
       contentType: item.attachments[0].contentType ?? "",
       documentBody: item.attachments[0].documentBody ?? "",
       fileName: item.attachments[0].fileName ?? "",
       fileSize: item.attachments[0].fileSize ?? "",
       fileType: item.attachments[0].fileType ?? "",
      }}
     />
    )}

    <div className="border border-zinc-300 bg-[#efe9e9] mt-4 text-left p-3 rounded-md">
     <label className="text-sm font-semibold text-zinc-800 mb-1 block">Motivo</label>
     <div className="text-sm text-zinc-700">{item.reason}</div>
    </div>

    <div className="mt-6 space-y-2">
     <FileDownload
      annotationType="Download documento modelo"
      attachment={{
       fileName: item.attachments![0].fileName ?? "",
       contentType: item.attachments![0].contentType ?? "",
       documentBody: item.attachments![0].documentBody ?? "",
       fileSize: item.attachments![0].fileSize ?? "",
       fileType: item.attachments![0].fileType ?? "",
      }}
     />
     <UploadButton
      fieldName="docUpload"
      label="Upload Novo Documento"
      onFileValid={async (file) => {
       setUploadedFile(file);
       const base64 = await fileToBase64(file);
       setAttachmentBase64(base64);
      }}
      onError={() => {
       setUploadedFile(null);
       setAttachmentBase64(null);
      }}
     />
     <div className="flex py-2 mt-2 justify-center gap-2">
      <Button type="button" disabled={!uploadedFile || !attachmentBase64} onClick={handleConfirm}>
       Confirmar
      </Button>
     </div>
    </div>
   </motion.div>
  </div>
 );
}