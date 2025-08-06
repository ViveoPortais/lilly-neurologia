import { Pencil } from "lucide-react";
import RejectedDocModal from "../modals/RejectedDocModal";
import { useState } from "react";
import { ExamPendingModel } from "@/types/diagnostic";
import { formatDate, formatFileSize } from "@/helpers/helpers";
import { ColumnConfig } from "../PendingTableColumns";

interface Props {
  items: ExamPendingModel[];
  columns: ColumnConfig[];
  renderModal: (item: ExamPendingModel | null, onClose: () => void) => React.ReactNode;
  role?: string;
}

export function PendingsMobilePage({ items, columns, renderModal, role }: Props) {
  const [selectedItem, setSelectedItem] = useState<ExamPendingModel | null>(null);
  const filteredColumns = columns.filter((col) => col.label !== "Nº Protocolo" && col.label !== "Número do Protocolo");

  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.dateCreate!).getTime();
    const dateB = new Date(b.dateCreate!).getTime();
    return dateA - dateB;
  });

  const displayItems = role === "operation" ? sortedItems : items;

  return (
    <div className="flex flex-col gap-3 px-2 pb-3">
      {displayItems.map((item) => (
        <div key={item.id} className="border border-zinc-200 rounded-xl p-4 bg-white relative shadow-sm mt-2">
          <button onClick={() => setSelectedItem(item)} className="absolute top-2 right-2 text-red-500">
            <Pencil size={16} />
          </button>

          <div className="text-xs text-zinc-500">Protocolo {item.numberProtocol}</div>

          <div className="grid grid-cols-2 gap-y-2 text-sm text-zinc-700 mt-2">
            {filteredColumns.map((col, index) => (
              <div key={index}>
                <span className="block text-xs text-zinc-500">{col.label}</span>
                <div>{col.render(item)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedItem && renderModal(selectedItem, () => setSelectedItem(null))}
    </div>
  );
}