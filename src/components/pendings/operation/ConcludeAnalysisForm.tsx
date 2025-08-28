import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { validateNoFutureDate } from "@/helpers/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExamPendingModel } from "@/types/diagnostic";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import dayjs from "dayjs";

const createSchema = (minDate: string) => z.object({
  conclusionDate: z.string().min(1, "Data obrigatória")
    .refine((date) => !date || date <= dayjs().format("YYYY-MM-DD"), {
      message: "A data de conclusão não pode ser futura"
    })
    .refine((date) => !minDate || !date || date >= minDate, {
      message: "A data de conclusão não pode ser inferior a data de envio"
    }),
  ba42: z.string(),
  ptau: z.string(),
  ratio: z.string(),
  ttau: z.string(),
  username: z.string().min(1),
  password: z.string().min(1),
  resultInconclusive: z.boolean()
}).refine(
  (data)=>{
    if(!data.resultInconclusive){
      return data.ba42 && data.ptau && data.ratio && data.ttau;
    }
    return true;
  }
);

export default function ConcludeAnalysisForm({ onClose, pendencyId, item }: { onClose: () => void; pendencyId: string; item: ExamPendingModel }) {
  const { resolve } = useResolveExamPendency();
  const dispatch = useAppDispatch();
  
  const minDate = item.sentDate ? dayjs(item.sentDate).format("YYYY-MM-DD") : "";
  const schema = createSchema(minDate);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      resultInconclusive: false,
    },
    mode : "onChange"
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("conclusionDate", e.target.value, { shouldValidate: true });
  };

  const handleChangeResultInconclusive = (value : boolean)=>{
    setValue("resultInconclusive", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if(value){
      setValue("ba42","");
      setValue("ptau","");
      setValue("ratio","");
      setValue("ttau","");
    }


  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await resolve({
      item: {
        ...item,
        examAnalysis: {
          analysisEndDate: data.conclusionDate,
          betaAmyloidPeptide42: data.ba42,
          phosphorylatedTau: data.ptau,
          pTauToBA42Ratio: data.ratio,
          totalTau: data.ttau,
          loginMatrix: data.username,
          passwordMatrix: data.password,
          resultInconclusive : data.resultInconclusive
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
        max={dayjs().format("YYYY-MM-DD")}
        min={minDate || undefined}
      />
      {errors.conclusionDate && <span className="text-red-500 text-sm">{errors.conclusionDate.message}</span>}

      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="flex text-base tracking-wide text-black">Resultado inconclusivo?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("resultInconclusive")}
                onChange={() => handleChangeResultInconclusive(true)}
                checked={watch("resultInconclusive") === true}
                className="hidden peer"
              />
              <div className="w-4 h-4 rounded-full border border-mainlilly flex items-center justify-center peer-checked:bg-mainlilly">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
              <span>Sim</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                {...register("resultInconclusive")}
                onChange={() => handleChangeResultInconclusive(false)}
                checked={watch("resultInconclusive") === null ? true : watch("resultInconclusive") === false}
                className="hidden peer"
              />  
              <div className="w-4 h-4 rounded-full border border-mainlilly flex items-center justify-center peer-checked:bg-mainlilly">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
              <span>Não</span>
            </label>
          </div>
          {errors.resultInconclusive && (
            <span className="text-red-500 text-sm">Selecione se o resultado é inconclusivo.</span>
          )}
        </div>
        <Input {...register("ba42")} placeholder="Peptídeo Beta Amiloide 1-42 (BA42)" disabled={watch("resultInconclusive")} />
        <Input {...register("ptau")} placeholder="Proteína Tau Fosforilada (pTau)" disabled={watch("resultInconclusive")}/>
        <Input {...register("ratio")} placeholder="Razão pTau/BA42" disabled={watch("resultInconclusive")}/>
        <Input {...register("ttau")} placeholder="Proteína Tau Total (tTau)" disabled={watch("resultInconclusive")}/>
        <Input {...register("username")} placeholder="Usuário Matrix" />
        <Input {...register("password")} placeholder="Senha" type="password" className="input" />
      </div>

      <Button type="submit" className="w-full" disabled={!watch("conclusionDate") || !isValid}>
        Salvar
      </Button>
    </form>
  );
}