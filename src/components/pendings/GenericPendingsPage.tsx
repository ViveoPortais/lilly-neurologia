"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MdTaskAlt } from "react-icons/md";
import { PendingsMobilePage } from "./mobile/PendingsMobilePage";
import PendingsDesktopPage from "./desktop/PendingsDesktop";

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
     <details key={category.title} className="group border border-zinc-200 rounded-xl mb-4 overflow-hidden">
      <summary className="flex justify-between items-center px-4 py-3 text-sm font-semibold bg-white border-b border-zinc-200 cursor-pointer">
       <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{category.title}</span>
        {category.count > 0 && (
         <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
          {String(category.count).padStart(2, "0")} pendentes
         </span>
        )}
       </div>
       <svg
        className="w-4 h-4 text-red-500 transition-transform duration-200 group-open:rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
       >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
       </svg>
      </summary>

      {isMobile ? <PendingsMobilePage items={category.items} /> : <PendingsDesktopPage items={category.items} />}
     </details>
    ))
   )}
  </div>
 );
}
