import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { Button } from "@/components/ui/button";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { ExamPendingModel } from "@/types/diagnostic";

const schema = z.object({
  reasonId: z.string().min(1, "Motivo obrigatório"),
});

type FormData = z.infer<typeof schema>;

export default function ReportProblemForm({ onClose, pendencyId, item }: { onClose: () => void; pendencyId: string; item: ExamPendingModel }) {
  const { resolve } = useResolveExamPendency();
  const dispatch = useAppDispatch();
  const { stringMaps } = useAppSelector((state) => state.basic.data);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    dispatch(fetchStringMaps({ entityName: "Logistics", attributeName: "IncidentStatusStringMap" }));
  }, [dispatch]);

  const onSubmit = async (data: FormData) => {
        await resolve({
      item: {
        ...item,
        incidentStatusStringMapId: data.reasonId
      },
      onSuccess: onClose,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <CustomFilterSelect label="Problema com a Amostra" options={stringMaps} name="reasonId" onChange={(val) => setValue("reasonId", val)} />
      <Button type="submit" className="w-full">
        Salvar
      </Button>
    </form>
  );
}