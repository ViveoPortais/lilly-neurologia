import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertCircle, Mail, LinkIcon, Pencil, Pen } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomSelect } from "@/components/custom/CustomSelect";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export const Step3Doctor = () => {
 const { register, setValue } = useFormContext();
 const modal = useGenericModal();

 const [consentType, setConsentType] = useState("");
 const [requestType, setRequestType] = useState("");

 const handleFileValidation = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  const sizeMB = file.size / (1024 * 1024);

  const isValidExtension = ACCEPTED_FORMATS.includes(extension);
  const isValidSize = sizeMB <= MAX_FILE_SIZE_MB;

  if (!isValidExtension || !isValidSize) {
   modal.showModal({
    type: "warning",
    title: "Arquivo inválido",
    message: "O arquivo deve ser PDF, JPG ou PNG e ter no máximo 5MB.",
   });
   setValue(fieldName as any, null);
   event.target.value = "";
  }
 };

 const renderSection = (title: string, fieldPrefix: string, selectedType: string, setSelectedType: (val: string) => void) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
   <div className="text-sm font-medium">{title}</div>

   <div>
    <label className="text-sm font-medium mb-1 block">Selecione o tipo de assinatura do {title}</label>
    <div className="flex justify-center">
     <div className="w-[300px]">
      <CustomSelect
       value={selectedType}
       onChange={(value: any) => setSelectedType(value)}
       options={[
        { id: "manual", value: "Manual", icon: Pen },
        { id: "digital", value: "Assinatura Digital (via DocuSign)", icon: LinkIcon },
       ]}
       label="Selecione o tipo de assinatura"
       name="signatureType"
      />
     </div>
    </div>
   </div>

   {selectedType === "manual" && (
    <>
     <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

     <div className="flex flex-col items-center gap-2">
      <Button
       type="button"
       variant="ghost"
       className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
       onClick={() => {}}
      >
       <Download className="w-4 h-4 mr-2" />
       Download do Termo assinado
      </Button>

      <label className="w-[300px]">
       <Input
        type="file"
        accept={ACCEPTED_FORMATS.join(",")}
        {...register(`${fieldPrefix}Upload`)}
        onChange={(e) => handleFileValidation(e, `${fieldPrefix}Upload`)}
        className="hidden"
       />
       <Button variant="ghost" className="w-full h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300" type="button">
        <Upload className="w-4 h-4 mr-2" />
        Upload do Termo assinado
       </Button>
      </label>
     </div>

     <p className="text-xs text-center text-red-500 mt-2 flex items-center justify-center gap-1">
      <AlertCircle className="w-4 h-4" />
      Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG
     </p>
    </>
   )}

   {selectedType === "digital" && (
    <div className="flex flex-col gap-2 w-full">
     <Input
      type="email"
      placeholder="Digite o e-mail do paciente"
      {...register(`${fieldPrefix}Email`, {
       required: true,
       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      })}
      className="w-full text-sm placeholder:text-gray-500"
     />

     <p className="text-xs text-red-500 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      Atenção, o e-mail informado deve ser o do paciente ou responsável.
     </p>
    </div>
   )}
  </div>
 );

 return (
  <div className="p-4 space-y-6 border border-gray-300 rounded-xl">
   <div className="flex items-center justify-center gap-2 text-sm text-red-600 text-center">
    <AlertCircle className="w-4 h-4" />
    <p>Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG</p>
   </div>

   {renderSection("Termo de Consentimento", "consent", consentType, setConsentType)}
   {renderSection("Pedido Médico", "medicalRequest", requestType, setRequestType)}
  </div>
 );
};
