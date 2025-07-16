import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useRef, useState } from "react";
import { useDownloadReqConFiles } from "@/hooks/useDownloadReqConFile";
import { downloadBase64File } from "@/helpers/fileHelper";
import { IDiagnosticExamModel } from "@/types/diagnostic";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export interface Step3Props {
  examExistent: IDiagnosticExamModel | null;
}

export const Step3 = ({ examExistent }: Step3Props) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const modal = useGenericModal();

  const [consentFileName, setConsentFileName] = useState("");
  const { consentAndPrescriptionFile } = useDownloadReqConFiles();

  const consentInputRef = useRef<HTMLInputElement | null>(null);

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
      //    if (fieldName === "medicalRequestAttach") setRequestFileName("");
      return;
    }

    setValue(fieldName, file);
    if (fieldName === "termConsentAttach") setConsentFileName(file.name);
    //   if (fieldName === "medicalRequestAttach") setRequestFileName(file.name);
  };

  const renderUploadBlock = () => {
    const { ref, onChange, ...rest } = register("termConsentAttach");

    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
        <p className="font-semibold text-left">Termo de Consentimento/Pedido Médico</p>

        <p className="text-sm text-gray-600 text-center">Faça o download do documento</p>
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            disabled={!consentAndPrescriptionFile?.attachments?.[0]}
            onClick={() => {
              const file = consentAndPrescriptionFile?.attachments?.[0];
              if (file) {
                downloadBase64File(file.documentBody!, file.fileName!, file.contentType!);
              }
            }}
            className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download do documento
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

        <input
          type="file"
          accept={ACCEPTED_FORMATS.join(",")}
          ref={consentInputRef}
          onChange={(e) => {
            onChange(e);
            handleFileValidation(e, "termConsentAttach");
          }}
          className="hidden"
          {...rest}
        />

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
            onClick={() => consentInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload do documento assinado
          </Button>
        </div>

        {consentFileName && (
          <p className="text-xs text-zinc-600 text-center">
            Arquivo selecionado: <span className="font-medium">{consentFileName}</span>
          </p>
        )}

        {errors.termConsentAttach && <span className="text-sm text-red-500 block text-center">{errors.termConsentAttach?.message as string}</span>}

        <p className="text-xs text-center text-red-500 mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" />
          Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG
        </p>
      </div>
    );
  };

  return <div className="md:p-4 p-0 space-y-6 border border-gray-300 rounded-xl">{renderUploadBlock()}</div>;
};