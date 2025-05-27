import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, UploadIcon } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";

export default function OperationGenerateDeclarationModal({ onClose }: { onClose: () => void }) {
 const [file, setFile] = useState<File | null>(null);
 const modal = useGenericModal();

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (selected) setFile(selected);
 };

 const handleCancel = () => {
  modal.showModal({ type: "success", message: "Pendência resolvida com sucesso!" });
  onClose();
 };

 const handleSave = () => {
  if (!file) return;
  modal.showModal({ type: "success", message: "Pendência resolvida com sucesso!" });
  onClose();
 };

 return (
  <div className="space-y-4 p-1">
   <p className="text-sm text-zinc-700">Insira a declaração de Lote Logístico gerado no Matrix.</p>

   <div className="relative w-full">
    <input type="file" accept=".pdf" id="uploadDeclaration" onChange={handleFileChange} className="hidden" />
    <label className="w-full cursor-pointer bg-[#8d9ea7] text-white py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-[#8d9ea7]/75 transition">
     <UploadIcon size={18} />
     Upload Declaração de Lote Logístico
     <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
    </label>
    {file && <span className="block mt-2 text-sm text-zinc-600 truncate">{file.name}</span>}
   </div>

   <div className="flex gap-2">
    <Button variant="outlineMainlilly" className="w-1/2" onClick={handleCancel}>
     Cancelar
    </Button>
    <Button className="w-1/2" onClick={handleSave} disabled={!file}>
     Salvar
    </Button>
   </div>
  </div>
 );
}
