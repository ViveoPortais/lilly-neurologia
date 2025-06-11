import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { IPatientSampleCollectionViewModel } from "@/types/diagnostic";
import { downloadBase64File } from "@/helpers/fileHelper";

interface Step2Props {
  register: any;
  errors: any;
  data: IPatientSampleCollectionViewModel;
}

export default function Step2({ register, errors, data }: Step2Props) {
  const downloadFichaEmergencia = () => {
    const link = document.createElement("a");
    link.href = "/files/FICHA DE EMERGENCIA - UN3373 LCT.XLS";
    link.download = "ficha-emergencia.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attachments = data?.attachments || [];

  const filesMap = [
    {
      flag: "#BATCH_DECLARATION",
      label: "Declaração de transporte",
    },
    {
      flag: "#ETIQUETA",
      label: "Declaração de Lote Logístico",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-zinc-700">Data Coleta do Material Biológico</label>
          <Input type="date" {...register("collectMaterial")} />
          {errors.collectMaterial && <p className="text-red-500 text-sm mt-1">{errors.collectMaterial.message?.toString()}</p>}
        </div>

        <div>
          <label className="text-sm text-zinc-700">Data Desejada da Retirada da Amostra</label>
          <Input type="date" {...register("doctorSuggestedDate")} />
          {errors.doctorSuggestedDate && <p className="text-red-500 text-sm mt-1">{errors.doctorSuggestedDate.message?.toString()}</p>}
        </div>
      </div>

      <div className="text-sm text-zinc-700 space-y-2 mt-6">
        <p>
          <strong>Atenção</strong>, a coleta da amostra deve utilizar o tubo de fundo falso CSF Sarstedt 75x13mm enviado pelo programa. Após a coleta do
          material biológico, importante mantê-lo acondicionado refrigerado até a retirada para garantir sua estabilidade de até 14 dias. De acordo com o manual
          de instruções do teste Elecsys β-Amyloid (1-42) CDF II recomenda-se que a amostra seja mantida de 2ºC a 8ºC, por até 14 dias, durante o transporte e
          armazenamento, até ao momento da medição.
        </p>
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
        <p className="text-center text-sm text-zinc-700">
          Os documentos abaixo deverão ser entregues à logística no dia da retirada da amostra. Faça a impressão e preencha a ficha de emergência e declaração
          de transporte de maneira apropriada.
        </p>
        <div className="flex flex-col items-center gap-2">
          {filesMap.map(({ flag, label }) => {
            const file = attachments.find((att) => att.flag === flag);
            return (
              file && (
                <Button
                  key={flag}
                  type="button"
                  variant="ghost"
                  onClick={() => downloadBase64File(file.documentBody!, file.fileName!, file.contentType!)}
                  className="w-[250px] md:w-[600px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              )
            );
          })}
          <Button
            type="button"
            variant="ghost"
            onClick={downloadFichaEmergencia}
            className="w-[250px] md:w-[600px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Ficha de emergência
          </Button>
        </div>
      </div>
    </>
  );
}