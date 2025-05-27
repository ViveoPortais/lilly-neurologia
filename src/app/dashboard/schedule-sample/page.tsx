"use client";
import { maskedField } from "@/components/custom/MaskedField";
import ScheduleSampleForm from "@/components/scheduleSample/ScheduleSampleForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientData } from "@/types/diagnostic";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScheduleSample() {
 const [dadosPaciente, setDadosPaciente] = useState<PatientData | null>(null);
 const [cpf, setCpf] = useState("");
 const [protocol, setProtocol] = useState("");
 const searchParams = useSearchParams();

 useEffect(() => {
  const cpfParam = searchParams.get("cpf") || "";
  const protocolParam = searchParams.get("protocolo") || "";

  setCpf(cpfParam);
  setProtocol(protocolParam);

  if (cpfParam && protocolParam) {
   // TODO: chamar endpoint aqui
  }
 }, [searchParams]);

 const handleClean = () => {
  setCpf("");
  setProtocol("");
 };

 return (
  <div className="p-6 space-y-6">
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div className="flex flex-col gap-2">
     {maskedField("cpf", (e) => setCpf(e.target.value), "cpf", "CPF do Paciente", false, undefined, cpf, false, "", "Digite aqui...")}
    </div>

    <div className="flex flex-col">
     <Input
      placeholder="Número do Protocolo"
      inputPlaceholder="Digite aqui..."
      value={protocol}
      onChange={(e) => setProtocol(e.target.value)}
     />
    </div>
   </div>

   <div className="flex justify-end gap-4">
    <Button variant="outlineMainlilly" className="w-full md:w-[150px]" onClick={handleClean}>
     Limpar Tudo
    </Button>
    <Button className="w-full md:w-[150px]" disabled={!cpf || !protocol}>Filtrar</Button>
   </div>

   <hr />

   <AnimatePresence mode="wait">
    {dadosPaciente && (
     <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
     >
      <ScheduleSampleForm data={dadosPaciente} />
     </motion.div>
    )}
   </AnimatePresence>
  </div>
 );
}
