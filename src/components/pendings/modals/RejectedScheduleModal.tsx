import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import dayjs from "dayjs";

interface Props {
  item: ExamPendingModel;
  onClose: () => void;
}

export default function RejectedScheduleModal({ item, onClose }: Props) {
  const { resolve } = useResolveExamPendency();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const suggestedDates = [item.logistcSuggestedDate1, item.logistcSuggestedDate2, item.logistcSuggestedDate3].filter(Boolean);

  const handleSubmit = async () => {
    if (!selectedDate) return;
    await resolve({
      item: {
        ...item,
        dateForCollecting: selectedDate,
      },
      onSuccess: onClose,
    });
  };

  return (
    <div className="text-center">
      <p className="text-sm mb-4">Selecione a melhor data</p>
      <div className="space-y-2">
        {suggestedDates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => setSelectedDate(date!)}
            className={`w-full rounded-md border px-4 py-2 text-sm ${selectedDate === date ? "border-red-500 bg-red-50" : "border-gray-300"}`}
          >
            {date && dayjs(date).format("DD/MM/YYYY")}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6 gap-2">
        <Button variant="outlineMainlilly" onClick={onClose} className="w-1/2">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedDate} className="w-1/2">
          Confirmar
        </Button>
      </div>
    </div>
  );
}