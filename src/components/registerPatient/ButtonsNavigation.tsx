import { Button } from "@/components/ui/button";

type ButtonsNavigationProps = {
 isMobile: boolean;
 step: number;
 isSubmitting: boolean;
 onBack: () => void;
 onNext: () => void;
 onClear: () => void;
 onCancel: () => void;
 onFinish: () => void;
};

export function ButtonsNavigation({ isMobile, step, isSubmitting, onBack, onNext, onClear, onCancel, onFinish }: ButtonsNavigationProps) {
 return (
  <div className={`w-full flex flex-col gap-4 mt-6 ${isMobile ? "mb-10" : ""}`}>
   <div className={`w-full flex ${isMobile ? "flex-col gap-2" : "flex-row justify-between"}`}>
    <div className={`${step > 1 ? "" : "invisible"}`}>
     {step > 1 && (
      <Button
       variant="outlineMainlilly"
       size={isMobile ? "default" : "lg"}
       className={`${isMobile ? "w-full" : "min-w-[220px] py-3"} text-base font-semibold`}
       onClick={onBack}
      >
       Voltar
      </Button>
     )}
    </div>

    <div className="flex gap-2">
     {step === 1 && (
      <>
       <Button
        variant="outlineMainlilly"
        size={isMobile ? "default" : "lg"}
        className={`${isMobile ? "w-full" : "min-w-[220px] py-3"} text-base font-semibold`}
        onClick={onClear}
       >
        Limpar Tudo
       </Button>
       <Button
        onClick={onNext}
        size={isMobile ? "default" : "lg"}
        className={`${isMobile ? "w-full" : "min-w-[220px] py-3"} text-base font-semibold`}
       >
        Avançar
       </Button>
      </>
     )}

     {step === 2 && (
      <Button
       onClick={onNext}
       size={isMobile ? "default" : "lg"}
       className={`${isMobile ? "w-full" : "min-w-[220px] py-3"} text-base font-semibold`}
      >
       Avançar
      </Button>
     )}

     {step === 3 && (
      <>
       <Button
        variant="outlineMainlilly"
        size={isMobile ? "default" : "lg"}
        className={`${isMobile ? "w-full" : "min-w-[220px] py-3"} text-base font-semibold`}
        onClick={onCancel}
       >
        Cancelar
       </Button>
       <Button
        onClick={onFinish}
        size={isMobile ? "default" : "lg"}
        className={`${isMobile ? "w-full" : "min-w-[220px] py-3"} text-base font-semibold`}
        disabled={isSubmitting}
        isLoading={isSubmitting}
       >
        Finalizar
       </Button>
      </>
     )}
    </div>
   </div>
  </div>
 );
}
