"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { PendingsMobilePage } from "./mobile/PendingsMobilePage";
import PendingsDesktopPage from "./desktop/PendingsDesktop";
import { Accordion } from "@/components/custom/Accordion";
import { ExamPendingModel } from "@/types/diagnostic";
import useSession from "@/hooks/useSession";
import { PendingTableColumns } from "./PendingTableColumns";
import { RenderPendingModal } from "./modals/RenderPendingModal";
import { MdTaskAlt } from "react-icons/md";

interface Props {
 grouped: Record<string, ExamPendingModel[]>;
 fixedCategories: string[];
}

export function GenericPendingsPage({ fixedCategories, grouped }: Props) {
 const isMobile = useMediaQuery("(max-width: 768px)");
 const auth = useSession();
 const role = auth.role as "doctor" | "operation" | "logistics";

 const totalPendings = Object.values(grouped).flat().length;

 if (totalPendings === 0) {
  return (
   <div className="pl-4 border-l-4 border-mainlilly rounded-l-2xl text-zinc-700 flex items-center gap-2">
    <MdTaskAlt className="text-mainlilly" size={20} />
    <span className="text-sm font-semibold">Você não possui pendências</span>
   </div>
  );
 }

 return (
  <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
   {fixedCategories.map((category) => {
    const items = grouped[category] || [];
    const columns = PendingTableColumns[role]?.[category] || [];

    return (
     <Accordion key={category} title={category} badgeText={`${String(items.length).padStart(2, "0")} ${isMobile ? "" : "pendentes"}`}>
      {items.length > 0 ? (
       isMobile ? (
        <PendingsMobilePage
         items={items}
         columns={columns}
         renderModal={(item, onClose) =>
          item ? <RenderPendingModal item={item} onClose={onClose} category={category} role={role} /> : null
         }
        />
       ) : (
        <PendingsDesktopPage
         items={items}
         columns={columns}
         renderModal={(item, onClose) =>
          item ? <RenderPendingModal item={item} onClose={onClose} category={category} role={role} /> : null
         }
        />
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
