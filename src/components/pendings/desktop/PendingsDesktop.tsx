import { useState } from "react";
import RejectedDocModal from "../modals/RejectedDocModal";
import { ExamPendingModel } from "@/types/diagnostic";
import { formatDate, formatFileSize } from "@/helpers/helpers";
import { ColumnConfig } from "../PendingTableColumns";

interface Props {
  items: ExamPendingModel[];
  columns: ColumnConfig[];
  renderModal: (item: ExamPendingModel | null, onClose: () => void) => React.ReactNode;
  role?: string;
}

export default function PendingsDesktopPage({ items, columns, renderModal, role }: Props) {
  const [selectedItem, setSelectedItem] = useState<ExamPendingModel | null>(null);

  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.dateCreate!).getTime();
    const dateB = new Date(b.dateCreate!).getTime();
    return dateA - dateB;
  });

  const displayItems = role === "operation" ? sortedItems : items;

  return (
    <div className="overflow-x-auto px-4 pb-3">
      <table className="min-w-full text-sm text-zinc-700">
        <thead className="border-b bg-white">
          <tr>
            <th className="w-24 px-2 py-2"></th>
            {columns.map((col, idx) => (
              <th key={idx} className="px-3 py-2 text-left font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-2 py-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="border border-red-500 text-red-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition"
                >
                  Resolver
                </button>
              </td>
              {columns.map((col, idx) => (
                <td key={idx} className="px-3 py-2">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && renderModal(selectedItem, () => setSelectedItem(null))}
    </div>
  );
}