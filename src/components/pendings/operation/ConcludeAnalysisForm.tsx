import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { validateNoFutureDate } from "@/helpers/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";

const schema = z.object({
  conclusionDate: z.string().min(1, "Data obrigatória"),
  ba42: z.string().min(1),
  ptau: z.string().min(1),
  ratio: z.string().min(1),
  ttau: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function ConcludeAnalysisForm({ onClose, pendencyId, item }: { onClose: () => void; pendencyId: string; item: ExamPendingModel }) {
  const { resolve } = useResolveExamPendency();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateNoFutureDate(e.target.value, "conclusionDate", setValue, "A data de conclusão não pode ser futura.");
  };

  const onSubmit = async (data: FormData) => {
    await resolve({
      item: {
        ...item,
        examAnalysis: {
          analysisEndDate: data.conclusionDate,
          betaAmyloidPeptide42: data.ba42,
          phosphorylatedTau: data.ptau,
          pTauToBA42Ratio: data.ratio,
          totalTau: data.ttau,
        },
      },
      onSuccess: onClose,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <Input
        type="date"
        {...register("conclusionDate")}
        placeholder="Data de Conclusão"
        onChange={handleDateChange}
        value={watch("conclusionDate")}
        className="w-full border rounded px-3 py-2"
      />
      {errors.conclusionDate && <span className="text-red-500 text-sm">{errors.conclusionDate.message}</span>}

      <div className="grid gap-4">
        <Input {...register("ba42")} placeholder="Peptídeo Beta Amiloide 1-42 (BA42)" />
        <Input {...register("ptau")} placeholder="Proteína Tau Fosforilada (pTau)" />
        <Input {...register("ratio")} placeholder="Razão pTau/BA42" />
        <Input {...register("ttau")} placeholder="Proteína Tau Total (tTau)" />
        <Input {...register("username")} placeholder="Digite o usuário" />
        <Input {...register("password")} placeholder="Digite sua senha" type="password" className="input" />
      </div>

      <Button type="submit" className="w-full" disabled={!watch("conclusionDate") || !isValid}>
        Salvar
      </Button>
    </form>
  );
}