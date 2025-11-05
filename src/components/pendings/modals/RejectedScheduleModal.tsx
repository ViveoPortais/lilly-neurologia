import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import dayjs from "dayjs";
import { useAppDispatch } from "@/store/hooks";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { IStringMap } from "@/types";

interface Props {
  item: ExamPendingModel;
  onClose: () => void;
}

export default function RejectedScheduleModal({ item, onClose }: Props) {
  const { resolve } = useResolveExamPendency();
  const dispatch = useAppDispatch();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [suggestedDates, setSuggestedDates] = useState<Array<{date: string, preferredTimeMap: IStringMap | undefined}>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const preferredTimeMaps = await dispatch(fetchStringMaps({ attributeName: "PreferredTimeStringMap", entityName: "LogisticsSchedule" })).unwrap();
      
      const suggestions = [
        { date: item.logistcSuggestedDate1, customStringMap: item.custom1StringMap },
        { date: item.logistcSuggestedDate2, customStringMap: item.custom2StringMap },
        { date: item.logistcSuggestedDate3, customStringMap: item.custom3StringMap }
      ]
      .map(suggestion => ({
        date: suggestion.date!,
        preferredTimeMap: preferredTimeMaps.find((map: IStringMap) => map.flag === suggestion.customStringMap?.flag)
      }));
      
      setSuggestedDates(suggestions);
    };
    fetchData();
  }, [dispatch, item]);

  const handleSubmit = async () => {
    if (selectedIndex === null) return;
    const selectedSuggestion = suggestedDates[selectedIndex];
    await resolve({
      item: {
        ...item,
        dateForCollecting: selectedSuggestion.date,
        preferredTimeStringMapId: selectedSuggestion.preferredTimeMap?.stringMapId!
      },
      onSuccess: onClose,
    });
  };

  return (
    <div className="text-center">
      <p className="text-sm mb-4">Selecione a melhor data</p>
      <div className="space-y-3">
        {suggestedDates.map((suggestion, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={`${suggestion.date}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`w-full rounded-md border px-4 py-2 text-sm ${isSelected ? "border-red-500 bg-red-50" : "border-gray-300"}`}
            >
              {`${dayjs(suggestion.date).format("DD/MM/YYYY")} - ${suggestion.preferredTimeMap?.optionName || 'Período não definido'}`}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-6 gap-2">
        <Button variant="outlineMainlilly" onClick={onClose} className="w-1/2">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={selectedIndex === null} className="w-1/2">
          Confirmar
        </Button>
      </div>
    </div>
  );
}