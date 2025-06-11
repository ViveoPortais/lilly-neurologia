import { Input } from "@/components/ui/input";
import { IPatientSampleCollectionViewModel, PatientData } from "@/types/diagnostic";
import dayjs from "dayjs";
interface Step1Props {
  data: IPatientSampleCollectionViewModel;
}

export default function Step1({ data }: Step1Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input disabled value={data.patientName} placeholder="Nome Completo do Paciente" />
        <Input disabled value={data.dateOfBirth ? dayjs(data.dateOfBirth).format("YYYY-MM-DD") : ""} placeholder="Data de Nascimento" type="date" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input disabled value={data.examRequestDate ? dayjs(data.examRequestDate).format("YYYY-MM-DD") : ""} placeholder="Data da Solicitação do Exame" type="date" />
        <Input disabled value={data.tubeReceptionDate ? dayjs(data.tubeReceptionDate).format("YYYY-MM-DD") : ""} placeholder="Data Recebimento do Tubo" type="date" />
      </div>
    </>
  );
}