import {useEffect, useRef} from "react";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { AlertCircle, LinkIcon, Pen } from "lucide-react";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { IDiagnosticExamModel } from "@/types/diagnostic";
import { RenderUploadTerm } from "./RenderUploadTerm";
import useSession from "@/hooks/useSession";



export interface Step3DoctorProps {
  examExistent: IDiagnosticExamModel | null;
}

export const Step3 = ({ examExistent }: Step3DoctorProps) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch
  } = useFormContext();

  const auth = useSession();
  const consentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (auth.role === "professional") {
      handleTypeOfSignature("false");
    }
  }, [auth.role]);

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
                onChange={(value) => { handleTypeOfSignature(value) }}
                options={[
                  { id: "false", value: "Manual", icon: Pen },
                  { id: "true", value: "Assinatura Digital (via DocuSign)", icon: LinkIcon },
                ]}
                label="Selecione o tipo de assinatura"
                name="hasDigitalSignature"
                value={watch("hasDigitalSignature") === false ? "false" : watch("hasDigitalSignature") === true ? "true" : ""}
                disabled={auth.role == "professional" ? true : false}
              />
            </div>
          </div>
        </div>

        {watch("hasDigitalSignature") === false && (
          <>
            <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

            {<RenderUploadTerm
              label="Upload do documento assinado"
              inputRef={consentInputRef}
              downloadLabel="Download do documento"
            />}
          </>
        )}

        {watch("hasDigitalSignature") === true && (
          <>
          <div className="flex flex-col gap-2 w-full max-w-[300px] mx-auto">
            <Input
              type="email"
              placeholder={`Digite o e-mail do ${watch("hasResponsible") === 'yes' ? 'cuidador responsável' : 'paciente'}`}
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
              Atenção, o e-mail informado deve ser o do {watch("hasResponsible") === 'yes' ? 'cuidador responsável' : 'paciente'}.
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