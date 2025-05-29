import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { Button } from "@/components/ui/button";

const schema = z.object({
  reasonId: z.string().min(1, "Motivo obrigatório"),
});

type FormData = z.infer<typeof schema>;

export default function ReportProblemForm({ onClose, pendencyId }: { onClose: () => void; pendencyId: string }) {
  const dispatch = useAppDispatch();
  const reasons = []; //TODO: Integração com o backend

  const { register, handleSubmit, setValue, formState: { errors }, } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    //TODO: Integração com o backend    
  }, []);

  const onSubmit = (data: FormData) => {
    //TODO: Integração com o backend
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <CustomFilterSelect
        label="Problema com a Amostra"
        options={[]}
        name="reasonId"
        onChange={(val) => setValue("reasonId", val)}
      />
      <Button type="submit" className="w-full">Salvar</Button>
    </form>
  );
}