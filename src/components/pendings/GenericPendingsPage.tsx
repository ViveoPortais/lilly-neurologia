"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MdTaskAlt } from "react-icons/md";
import { PendingsMobilePage } from "./mobile/PendingsMobilePage";
import PendingsDesktopPage from "./desktop/PendingsDesktop";
import { Accordion } from "@/components/custom/Accordion";
import { ExamPendingModel } from "@/types/diagnostic";

interface Props {
 pendings: ExamPendingModel[];
}

const fixedCategories = [
 "Documentação",
 "Recebimento do Tubo",
 "Solicitações de Retirada de Amostra",
 "Problema com a Amostra",
 "Aprovação de Vínculo",
];

export function GenericPendingsPage({ pendings }: Props) {
 const isMobile = useMediaQuery("(max-width: 768px)");

 const grouped: Record<string, ExamPendingModel[]> = {
  Documentação: pendings.filter((p) => p.reason === "Documentação pendente"),
  "Recebimento do Tubo": [],
  "Solicitações de Retirada de Amostra": [],
  "Problema com a Amostra": [],
  "Aprovação de Vínculo": [],
 };

 const totalPendings = pendings.length;

//  if (totalPendings === 0) {
//   return (
//    <div className="pl-4 border-l-4 border-mainlilly rounded-l-2xl text-zinc-700 flex items-center gap-2">
//     <MdTaskAlt className="text-mainlilly" size={20} />
//     <span className="text-sm font-semibold">Você não possui pendências</span>
//    </div>
//   );
//  }

 return (
  <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
   {fixedCategories.map((category) => {
    const items = grouped[category] || [];
    return (
     <Accordion key={category} title={category} badgeText={`${String(items.length).padStart(2, "0")} ${isMobile ? '' : 'pendentes'}`}>
      {items.length > 0 ? (
       isMobile ? (
        <PendingsMobilePage items={items} />
       ) : (
        <PendingsDesktopPage items={items} />
       )
      ) : (
       <div className="px-4 py-2 text-sm text-zinc-500">Nenhuma pendência nesta categoria.</div>
      )}
     </Accordion>
    );
   })}
  </div>
 );
}
