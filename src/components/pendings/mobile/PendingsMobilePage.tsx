import { Pencil } from "lucide-react";

interface PendingsMobilePageProps {
 items: {
  id: string;
  columns: string[];
  reason?: string;
 }[];
}

export function PendingsMobilePage({ items }: PendingsMobilePageProps) {
 return (
  <div className="flex flex-col gap-3 px-2 pb-3">
   {items.map((item) => (
    <div key={item.id} className="border border-zinc-200 rounded-xl p-4 bg-white relative shadow-sm mt-2">
     <button className="absolute top-2 right-2 text-red-500">
      <Pencil size={16} />
     </button>

     <div className="text-xs text-zinc-500">Protocolo {item.columns[0]}</div>

     <div className="grid grid-cols-2 gap-y-2 text-sm text-zinc-700">
      <div>
       <span className="block text-xs text-zinc-500">Paciente</span>
       <span>{item.columns[1]}</span>
      </div>
      <div>
       <span className="block text-xs text-zinc-500">Criação da pendência</span>
       <span>{item.columns[2]}</span>
      </div>
      <div>
       <span className="block text-xs text-zinc-500">Data de Reprovação</span>
       <span>{item.columns[3]}</span>
      </div>
      <div>
       <span className="block text-xs text-zinc-500">Motivo</span>
       <div className="flex items-center gap-2 mt-1">
        <span className="h-2 w-2 rounded-full bg-red-600 inline-block" />
        <span className="text-xs text-red-600">{item.reason}</span>
       </div>
      </div>
     </div>
    </div>
   ))}
  </div>
 );
}
