import { Button } from "@/components/ui/button";

interface ConclusionOptionsProps {
 onSelect: (step: "problem" | "conclude") => void;
}

export default function ConclusionOptions({ onSelect }: ConclusionOptionsProps) {
 return (
  <div className="flex justify-center gap-4 mt-4">
   <Button variant="outlineMainlilly" onClick={() => onSelect("problem")}>
    Informar Problema
   </Button>
   <Button onClick={() => onSelect("conclude")}>Concluir Análise</Button>
  </div>
 );
}