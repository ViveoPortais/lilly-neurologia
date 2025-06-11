import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, UploadIcon } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { ExamPendingModel } from "@/types/diagnostic";
import { fileToBase64 } from "@/helpers/fileHelper";
import { UploadButton } from "@/components/custom/UploadButton";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";

export default function OperationGenerateDeclarationModal({ onClose, item }: { onClose: () => void; item: ExamPendingModel }) {
 const [file, setFile] = useState<File | null>(null);
 const modal = useGenericModal();
 const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
 const { resolve } = useResolveExamPendency();

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (selected) setFile(selected);
 };

 const handleCancel = () => {
  modal.showModal({ type: "success", message: "Pendência resolvida com sucesso!" });
  onClose();
 };

 const handleSave = async () => {
  const logistAttachments =
   file && attachmentBase64
    ? {
       fileName: file.name,
       contentType: file.type,
       documentBody: attachmentBase64,
       fileSize: file.size.toString(),
       fileType: file.type,
       flag: "#ETIQUETA",
      }
    : undefined;

  const itemWithLogist = {
   ...item,
   logistAttachments,
  };

  await resolve({
   item: itemWithLogist,
   onSuccess: onClose,
  });
 };

 return (
  <div className="space-y-4 p-1">
   <p className="text-sm text-zinc-700">Insira a declaração de Lote Logístico gerado no Matrix.</p>

   <div className="relative w-full">
    <UploadButton
     fieldName="uploadDeclaration"
     label="Upload declaração de lote logístico"
     onFileValid={async (file: File) => {
      const base64 = await fileToBase64(file);
      setFile(file);
      setAttachmentBase64(base64);
     }}
     onError={() => {
      setFile(null);
      setAttachmentBase64(null);
     }}
    />
   </div>

   <div className="flex gap-2">
    <Button variant="outlineMainlilly" className="w-full md:w-1/2" onClick={handleCancel}>
     Cancelar
    </Button>
    <Button className="w-full md:w-1/2" onClick={handleSave} disabled={!file}>
     Salvar
    </Button>
   </div>
  </div>
 );
}