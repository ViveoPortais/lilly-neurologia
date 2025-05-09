"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MdTaskAlt } from "react-icons/md";
import { PendingsMobilePage } from "./mobile/PendingsMobilePage";
import PendingsDesktopPage from "./desktop/PendingsDesktop";
import { Accordion } from "@/components/custom/Accordion";

interface GenericPendingsProps {
 categories: {
  title: string;
  count: number;
  items: {
   id: string;
   columns: string[];
   reason?: string;
  }[];
 }[];
}

export function GenericPendingsPage({ categories }: GenericPendingsProps) {
 const totalPendings = categories.reduce((sum, cat) => sum + cat.count, 0);
 const isMobile = useMediaQuery("(max-width: 768px)");

 return (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
   {totalPendings === 0 ? (
    <div className="pl-4 border-l-4 border-mainlilly rounded-l-2xl text-zinc-700 flex items-center gap-2">
     <MdTaskAlt className="text-mainlilly" size={20} />
     <span className="text-sm font-semibold">Você não possui pendências</span>
    </div>
   ) : (
    categories.map((category) => (
     <Accordion
      key={category.title}
      title={category.title}
      badgeText={category.count > 0 ? `${String(category.count).padStart(2, "0")} pendentes` : undefined}
     >
      {isMobile ? <PendingsMobilePage items={category.items} /> : <PendingsDesktopPage items={category.items} />}
     </Accordion>
    ))
   )}
  </div>
 );
}
