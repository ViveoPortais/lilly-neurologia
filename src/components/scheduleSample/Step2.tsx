import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

interface Step2Props {
 register: any;
 errors: any;
}

export default function Step2({ register, errors }: Step2Props) {
 return (
  <>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div>
     <label className="text-sm text-zinc-700">Data Coleta do Material Biológico</label>
     <Input type="date" {...register("collectDate")} />
     {errors.collectDate && <p className="text-red-500 text-sm mt-1">{errors.collectDate.message?.toString()}</p>}
    </div>

    <div>
     <label className="text-sm text-zinc-700">Data Desejada da Retirada da Amostra</label>
     <Input type="date" {...register("desiredDate")} />
     {errors.desiredDate && <p className="text-red-500 text-sm mt-1">{errors.desiredDate.message?.toString()}</p>}
    </div>
   </div>

   <div className="text-sm text-zinc-700 space-y-2 mt-6">
    <p>
     <strong>Atenção</strong>, a coleta da amostra deve utilizar o tubo de fundo falso CSF Sarstedt 75x13mm enviado pelo programa. Após a
     coleta do material biológico, importante mantê-lo acondicionado refrigerado até a retirada para garantir sua estabilidade de até 14
     dias. De acordo com o manual de instruções do teste Elecsys β-Amyloid (1-42) CDF II recomenda-se que a amostra seja mantida de 2ºC a
     8ºC, por até 14 dias, durante o transporte e armazenamento, até ao momento da medição.
    </p>
   </div>

   <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-4 bg-gray-50">
    <p className="text-center text-sm text-zinc-700">
     Os documentos abaixo deverão ser entregues à logística no dia da retirada da amostra. Faça a impressão e preencha a ficha de emergência
     e declaração de transporte de maneira apropriada.
    </p>
    <div className="space-y-2">
     <a
      href="#"
      className="flex items-center justify-center gap-2 w-full h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300 rounded"
     >
      <Download className="w-4 h-4 mr-2" /> Declaração de transporte
     </a>
     <a
      href="#"
      className="flex items-center justify-center gap-2 w-full h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300 rounded"
     >
      <Download className="w-4 h-4 mr-2" /> Ficha de emergência
     </a>
     <a
      href="#"
      className="flex items-center justify-center gap-2 w-full h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300 rounded"
     >
      <Download className="w-4 h-4 mr-2" /> Declaração de Lote Logístico
     </a>
    </div>
   </div>
  </>
 );
}
