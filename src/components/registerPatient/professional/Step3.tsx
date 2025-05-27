import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useRef, useState } from "react";
import { useDownloadReqConFiles } from "@/hooks/useDownloadReqConFile";
import { downloadBase64File } from "@/helpers/fileHelper";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export const Step3 = () => {
 const {
  register,
  setValue,
  formState: { errors },
 } = useFormContext();
 const modal = useGenericModal();

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
   if (fieldName === "termConsentAttach") setConsentFileName("");
   if (fieldName === "medicalRequestAttach") setRequestFileName("");
   return;
  }

  setValue(fieldName, file);
  if (fieldName === "termConsentAttach") setConsentFileName(file.name);
  if (fieldName === "medicalRequestAttach") setRequestFileName(file.name);
 };

 const renderUploadBlock = (
  title: string,
  fieldName: "termConsentAttach" | "medicalRequestAttach",
  inputRef: React.RefObject<HTMLInputElement>,
  fileName: string,
  downloadLabel: string,
  uploadLabel: string
 ) => {
  const { ref, onChange, ...rest } = register(fieldName);

  return (
   <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
    <p className="font-semibold text-left">{title}</p>

    <p className="text-sm text-gray-600 text-center">Faça o download do {title}</p>
    <div className="flex justify-center">
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
    </div>

    <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

    <input
     type="file"
     accept={ACCEPTED_FORMATS.join(",")}
     ref={inputRef}
     onChange={(e) => {
      onChange(e);
      handleFileValidation(e, fieldName);
     }}
     className="hidden"
     {...rest}
    />

    <div className="flex justify-center">
     <Button
      type="button"
      variant="ghost"
      className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
      onClick={() => inputRef.current?.click()}
     >
      <Upload className="w-4 h-4 mr-2" />
      {uploadLabel}
     </Button>
    </div>

    {fileName && (
     <p className="text-xs text-zinc-600 text-center">
      Arquivo selecionado: <span className="font-medium">{fileName}</span>
     </p>
    )}

    {errors[fieldName] && <span className="text-sm text-red-500 block text-center">{errors[fieldName]?.message as string}</span>}

    <p className="text-xs text-center text-red-500 mt-2 flex items-center justify-center gap-1">
     <AlertCircle className="w-4 h-4" />
     Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG
    </p>
   </div>
  );
 };

 return (
  <div className="md:p-4 p-0 space-y-6 border border-gray-300 rounded-xl">
   {renderUploadBlock(
    "Termo de Consentimento",
    "termConsentAttach",
    consentInputRef,
    consentFileName,
    "Download do termo",
    "Upload do termo assinado"
   )}
   {renderUploadBlock(
    "Pedido Médico",
    "medicalRequestAttach",
    requestInputRef,
    requestFileName,
    "Download do pedido médico",
    "Upload do pedido médico"
   )}
  </div>
 );
};