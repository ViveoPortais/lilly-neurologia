import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Download, Upload, AlertCircle } from "lucide-react";
import { useGenericModal } from "@/contexts/GenericModalContext";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export const Step3 = () => {
 const { register, setValue } = useFormContext();
 const modal = useGenericModal();

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

 return (
  <div className="p-4 space-y-6 border border-gray-300 rounded-xl">
   <div className="flex items-center justify-center gap-2 text-sm text-red-600 text-center">
    <AlertCircle className="w-4 h-4" />
    <p>Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG</p>
   </div>

   <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4">
    <p className="font-semibold text-left">Termo de Consentimento</p>

    <p className="text-sm text-gray-600 text-center">Faça o download do Termo de Consentimento</p>

    <div className="flex justify-center">
     <Button variant="outlineMainlilly" className="text-sm text-gray-500 w-[280px]" disabled>
      <Download className="w-4 h-4 mr-2" />
      Download do Termo de Consentimento
     </Button>
    </div>

    <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

    <div className="flex justify-center">
     <label>
      <Input
       type="file"
       accept={ACCEPTED_FORMATS.join(",")}
       {...register("consentForm")}
       onChange={(e) => handleFileValidation(e, "consentForm")}
       className="hidden"
      />
      <Button variant="outlineMainlilly" className="text-sm text-gray-500 w-[280px]" disabled>
       <Upload className="w-4 h-4 mr-2" />
       Upload do Termo assinado
      </Button>
     </label>
    </div>
   </div>

   <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4">
    <p className="font-semibold text-left">Pedido Médico</p>

    <p className="text-sm text-gray-600 text-center">Faça o download do Pedido Médico</p>

    <div className="flex justify-center">
     <Button variant="outlineMainlilly" className="text-sm text-gray-500 w-[280px]" disabled>
      <Download className="w-4 h-4 mr-2" />
      Download do Pedido Médico
     </Button>
    </div>

    <p className="text-sm text-gray-600 text-center">Após o paciente/cuidador assinar, por favor realize o upload</p>

    <div className="flex justify-center">
     <label>
      <Input
       type="file"
       accept={ACCEPTED_FORMATS.join(",")}
       {...register("medicalRequest")}
       onChange={(e) => handleFileValidation(e, "medicalRequest")}
       className="hidden"
      />
      <Button variant="outlineMainlilly" className="text-sm text-gray-500 w-[280px]" disabled>
       <Upload className="w-4 h-4 mr-2" />
       Upload do Pedido Médico
      </Button>
     </label>
    </div>
   </div>
  </div>
 );
};
