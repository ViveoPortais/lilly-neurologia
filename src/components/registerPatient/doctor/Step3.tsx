import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertCircle, LinkIcon, Pen } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useDownloadReqConFiles } from "@/hooks/useDownloadReqConFile";
import { downloadBase64File } from "@/helpers/fileHelper";
import { IDiagnosticExamModel } from "@/types/diagnostic";
import { IAnnotationModel } from "@/types/general";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import { fetchAnnotations, fetchTermAttachFilled } from "@/store/slices/diagnosticSlice";
import { formToJSON } from "axios";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { FaBullseye } from "react-icons/fa";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export interface Step3DoctorProps {
  examExistent: IDiagnosticExamModel | null;
}

export const Step3Doctor = ({ examExistent }: Step3DoctorProps) => {
  const {
    register,
    setValue,
    formState: { errors },
    getValues,
    watch
  } = useFormContext();
  const modal = useGenericModal();

  const { show, hide } = useLoading();

  const [consentFileName, setConsentFileName] = useState("");
  const dispatch = useAppDispatch();

  const consentInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadAttachmentFilled = async () => {

    show();
    try {
      const payload = getValues();

      if (payload.birthDateCaregiver == "")
        payload.birthDateCaregiver = null;

      const res = await dispatch(fetchTermAttachFilled({ data: payload })).unwrap();
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
        const a = document.createElement("a");

        a.href = url;
        a.download = `Termo de Consentimento ${watch("name")}`;
        document.body.appendChild(a);
        a.click();
      }
    }
    catch (error) {
      toast.error('Não foi possível fazer o download do documento, contate o administrador do sistema');
    }
    finally {
      hide();
    }

  }

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
      //    if (fieldName === "medicalRequestAttach") setRequestFileName("");
      return;
    }

    setValue(fieldName, file);
    if (fieldName === "termConsentAttach") setConsentFileName(file.name);
    //   if (fieldName === "medicalRequestAttach") setRequestFileName(file.name);
  };

  const renderUpload = (label: string, inputRef: React.RefObject<HTMLInputElement>, fileName: string, downloadLabel: string) => (
    <div className="w-full flex flex-col items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          handleDownloadAttachmentFilled();
        }}
        className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
      >
        <Download className="w-4 h-4 mr-2" />
        {downloadLabel}
      </Button>

      <input type="file" accept={ACCEPTED_FORMATS.join(",")} onChange={(e) => handleFileValidation(e, "termConsentAttach")} ref={inputRef} className="hidden" />

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
    </div>
  );

  const handleTypeOfSignature = (value : any)=>{
    setValue("hasDigitalSignature", value === "true")
  }

  return (
    <div className="md:p-4 p-0 space-y-6 border border-gray-300 rounded-xl">
      <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
        <div className="text-sm font-medium">Termo de Consentimento/Pedido Médico</div>

        <div>
          <label className="flex justify-center text-sm font-medium mb-1 block">Selecione o tipo de assinatura</label>
          <div className="flex justify-center">
            <div className="w-[300px]">
              <CustomSelect
                onChange={(value) => {handleTypeOfSignature(value)}}
                options={[
                  { id: "false", value: "Manual", icon: Pen },
                  { id: "true", value: "Assinatura Digital (via DocuSign)", icon: LinkIcon },
                ]}
                label="Selecione o tipo de assinatura"
                name="hasDigitalSignature"
              />
            </div>
          </div>
        </div>

        {watch("hasDigitalSignature") === false && (
          <>
            <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

            {renderUpload("Upload do documento assinado", consentInputRef, consentFileName, "Download do documento")}

            <p className="text-xs text-center text-red-500 mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG
            </p>
          </>
        )}

        {watch("hasDigitalSignature") === true && (
          <>
          <div className="flex flex-col gap-2 w-full max-w-[300px] mx-auto">
            <Input
              type="email"
              placeholder="Digite o e-mail do paciente"
              {...register("emailAddress", {
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido",
                },
              })}
              className="text-sm placeholder:text-gray-500"
            />
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Atenção, o e-mail informado deve ser o do paciente.
            </p>
            {errors?.emailAddress && <span className="text-sm text-red-500 mt-1 block">{errors.emailAddress.message as string}</span>}
          </div>
          </>
        )}
        {errors.termConsentAttach && <span className="text-sm text-red-500 block text-center">{errors.termConsentAttach?.message as string}</span>}
      </div>
    </div>
  );
};