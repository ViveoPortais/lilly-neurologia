import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertCircle, LinkIcon, Pen } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useDownloadReqConFiles } from "@/hooks/useDownloadReqConFile";
import { downloadBase64File } from "@/helpers/fileHelper";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export const Step3Doctor = () => {
 const {
  register,
  setValue,
  formState: { errors },
 } = useFormContext();
 const modal = useGenericModal();

 const [consentType, setConsentType] = useState("");
 const [requestType, setRequestType] = useState("");
 const [consentFileName, setConsentFileName] = useState("");
 const [requestFileName, setRequestFileName] = useState("");
 const { consentFile, requestFile } = useDownloadReqConFiles();

 const consentInputRef = useRef<HTMLInputElement | null>(null);
 const requestInputRef = useRef<HTMLInputElement | null>(null);

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
   setValue(fieldName, null);
   event.target.value = "";
   if (fieldName === "termConsentAttach") setConsentFileName("");
   if (fieldName === "medicalRequestAttach") setRequestFileName("");
   return;
  }

  setValue(fieldName, file);
  if (fieldName === "termConsentAttach") setConsentFileName(file.name);
  if (fieldName === "medicalRequestAttach") setRequestFileName(file.name);
 };

 const renderUpload = (
  fieldName: string,
  label: string,
  inputRef: React.RefObject<HTMLInputElement>,
  fileName: string,
  downloadLabel: string
 ) => (
  <div className="w-full flex flex-col items-center gap-2">
   <Button
    type="button"
    variant="ghost"
    disabled={fieldName === "termConsentAttach" ? !consentFile?.attachments?.[0] : !requestFile?.attachments?.[0]}
    onClick={() => {
     const file = fieldName === "termConsentAttach" ? consentFile?.attachments?.[0] : requestFile?.attachments?.[0];
     if (file) {
      downloadBase64File(file.documentBody!, file.fileName!, file.contentType!);
     }
    }}
    className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
   >
    <Download className="w-4 h-4 mr-2" />
    {downloadLabel}
   </Button>

   <input
    type="file"
    accept={ACCEPTED_FORMATS.join(",")}
    onChange={(e) => handleFileValidation(e, fieldName)}
    ref={inputRef}
    className="hidden"
   />

   <Button
    type="button"
    variant="ghost"
    className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
    onClick={() => inputRef.current?.click()}
   >
    <Upload className="w-4 h-4 mr-2" />
    {label}
   </Button>

   {fileName && (
    <p className="text-xs text-zinc-600 text-center">
     Arquivo selecionado: <span className="font-medium">{fileName}</span>
    </p>
   )}

   {errors[fieldName] && <span className="text-sm text-red-500 block text-center">{errors[fieldName]?.message as string}</span>}
  </div>
 );

 const renderSection = (title: string, fieldPrefix: string, selectedType: string, setSelectedType: (val: string) => void) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
   <div className="text-sm font-medium">{title}</div>

   <div>
    <label className="flex justify-center text-sm font-medium mb-1 block">Selecione o tipo de assinatura do {title}</label>
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

     {renderUpload(
      fieldPrefix === "consent" ? "termConsentAttach" : "medicalRequestAttach",
      fieldPrefix === "consent" ? "Upload do termo assinado" : "Upload do pedido médico",
      fieldPrefix === "consent" ? consentInputRef : requestInputRef,
      fieldPrefix === "consent" ? consentFileName : requestFileName,
      fieldPrefix === "consent" ? "Download do termo" : "Download do pedido médico"
     )}

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
  <div className="md:p-4 p-0 space-y-6 border border-gray-300 rounded-xl">
   {renderSection("Termo de Consentimento", "consent", consentType, setConsentType)}
   {renderSection("Pedido Médico", "medicalRequest", requestType, setRequestType)}
  </div>
 );
};