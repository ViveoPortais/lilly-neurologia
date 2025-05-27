import { Input } from "@/components/ui/input";
import { PatientData } from "@/types/diagnostic";

interface Step1Props {
 data: PatientData;
}

export default function Step1({ data }: Step1Props) {
 return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   <Input disabled value={data.fullName} placeholder="Nome Completo do Paciente" />
   <Input disabled value={data.birthdate} placeholder="Data de Nascimento" type="date" />
   <Input disabled value={data.examDefinition} placeholder="Exame" />
   <Input disabled value={data.disease} placeholder="Patologia" />
   <Input disabled value={data.laboratoryAnalysis} placeholder="Laboratório de Análise" />
   <Input disabled value={data.requestDate} placeholder="Data da Solicitação do Exame" type="date" />
   <Input disabled value={data.receiptDate} placeholder="Data Recebimento do Tubo" type="date" />
  </div>
 );
}
