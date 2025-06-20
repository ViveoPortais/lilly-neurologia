import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { Button } from "@/components/ui/button";
import { fetchStringMaps, fetchStringMapsList } from "@/store/slices/basicSlice";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { ExamPendingModel } from "@/types/diagnostic";
import { IStringMap } from "@/types";

const schema = z.object({
  reasonId: z.string().min(1, "Motivo obrigatório"),
});

type FormData = z.infer<typeof schema>;

export default function ReportProblemForm({ onClose, pendencyId, item }: { onClose: () => void; pendencyId: string; item: ExamPendingModel }) {
  const { resolve } = useResolveExamPendency();
  const dispatch = useAppDispatch();
  const [stringMaps, setStringMaps] = useState<IStringMap[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const result = await dispatch(
          fetchStringMapsList({
            entityName: "Logistics",
            attributeName: "IncidentStatusStringMap",
          })
        ).unwrap();

        setStringMaps(result);
      } catch (err) {
        console.error("Erro ao buscar motivos:", err);
      }
    };

    fetchOptions();
  }, [dispatch]);

  const onSubmit = async (data: FormData) => {
    await resolve({
      item: {
        ...item,
        incidentStatusStringMapId: data.reasonId,
      },
      onSuccess: onClose,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <Controller
        name="reasonId"
        control={control}
        render={({ field }) => (
          <CustomFilterSelect
            label="Problema com a Amostra"
            options={stringMaps}
            value={field.value}
            onChange={field.onChange}
            name={field.name}
          />
        )}
      />
      {errors.reasonId && <span className="text-sm text-red-500">{errors.reasonId.message}</span>}
      <Button type="submit" className="w-full">
        Salvar
      </Button>
    </form>
  );
}