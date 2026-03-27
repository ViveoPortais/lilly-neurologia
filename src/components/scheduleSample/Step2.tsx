import { Input } from "@/components/ui/input";
import { AlertCircle, Download } from "lucide-react";
import { Button } from "../ui/button";
import { IPatientSampleCollectionViewModel } from "@/types/diagnostic";
import { downloadBase64File } from "@/helpers/fileHelper";
import { Controller } from "react-hook-form";
import { CustomDatePicker } from "../custom/CustomDatepicker";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { IStringMap } from "@/types";

interface Step2Props {
  register: any;
  errors: any;
  control: any;
  data: IPatientSampleCollectionViewModel;
  preferredTimeStringMaps : IStringMap[];
  isRestrictedEdit: boolean;
}

export default function Step2({ register, errors, control, data, preferredTimeStringMaps,isRestrictedEdit }: Step2Props) {
  const isWeekdayAllowed = (date: Date) => {
    const day = date.getDay();
    return day !== 5 && day !== 6 && day !== 0;
  };

  const isCollectDateAllowed = (date: Date) => {
    if (!data?.tubeReceptionDate) return true;
    const minDate = new Date(data.tubeReceptionDate);
    return date >= minDate;
  };
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
        <div className="space-y-1">
          <label className="text-base tracking-wide text-black">Data e Hora da Coleta do Material Biológico</label>
          <Controller
            control={control}
            name="collectMaterial"
            render={({ field }) => (
              <CustomDatePicker
                selected={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="Selecione data e hora"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="dd/MM/yyyy HH:mm"
                filterDate={isCollectDateAllowed}
                name="collectMaterial"
                disabled={isRestrictedEdit}
              />
            )}
          />
          {errors.collectMaterial && <p className="text-red-500 text-sm mt-1">{errors.collectMaterial.message?.toString()}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-base tracking-wide text-black">Data Desejada da Retirada da Amostra</label>
          <Controller
            control={control}
            name="doctorSuggestedDate"
            render={({ field }) => (
              <CustomDatePicker
                selected={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date)}
                placeholder="Selecione uma data"
                filterDate={isWeekdayAllowed}
                name="doctorSuggestedDate"
              />
            )}
          />
          {errors.doctorSuggestedDate && <p className="text-red-500 text-sm mt-1">{errors.doctorSuggestedDate.message?.toString()}</p>}
        </div>
        <div className="space-y-1">
          <Controller
            name="preferredTimeStringMap"
            control={control}
            render={({ field }) => (
              <CustomFilterSelect
                {...field}
                label="Período para Retirada da Amostra"
                options={preferredTimeStringMaps}
              />
            )}
          />
          <p className="text-xs text-black flex  gap-1">
            <AlertCircle className="w-8 h-8" />
            Para retiradas no período da manhã, a amostra precisará ser coletada no dia anterior ou até as 08h, para retiradas no período da tarde, a amostra precisará ser coletada até as 11h.
          </p>
          {errors.preferredTimeStringMap && <p className="text-red-500 text-sm mt-1">{errors.preferredTimeStringMap.message?.toString()}</p>}
        </div>
      </div>

      <div className="text-sm text-zinc-700 space-y-2 mt-6">
        <p>
          <strong>Atenção</strong>, a coleta da amostra deve utilizar o tubo de fundo falso CSF Sarstedt 75x13mm enviado pelo programa. Após a coleta do
          material biológico, importante mantê-lo acondicionado refrigerado até a retirada para garantir sua estabilidade de até 14 dias. De acordo com o manual
          de instruções do teste Elecsys β-Amyloid (1-42) CDF II recomenda-se que a amostra seja mantida de 2ºC a 8ºC, por até 14 dias, durante o transporte e
          armazenamento, até ao momento da análise. Para mais informações sobre o exame e características da amostra acesse a opção Biblioteca de Conteúdos.
        </p>
      </div>
    </>
  );
}