import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { validateNoFutureDate } from "@/helpers/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function ConcludeAnalysisForm({ onClose, pendencyId }: { onClose: () => void; pendencyId: string }) {
 const dispatch = useAppDispatch();
 const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors },
 } = useForm<FormData>({
  resolver: zodResolver(schema),
 });

 const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  validateNoFutureDate(e.target.value, "conclusionDate", setValue, "A data de conclusão não pode ser futura.");
 };

 const onSubmit = (data: FormData) => {
  //TODO: Integração com o backend
  onClose();
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

   <Button type="submit" className="w-full" disabled={!watch("conclusionDate") || Object.keys(errors).length > 0}>
    Salvar
   </Button>
  </form>
 );
}