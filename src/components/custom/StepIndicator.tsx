import clsx from "clsx";

const StepIndicator = ({
  step,
  setStep,
  totalSteps = 3,
}: {
  step: number;
  setStep: (n: number) => void;
  totalSteps?: number;
}) => {
  return (
    <div className="flex justify-between border-b border-neutral-300 mb-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const s = i + 1;
        const isActive = step === s;

        return (
          <button
            key={s}
            className={clsx(
              "flex-1 text-center py-2 font-medium text-sm transition-colors duration-200 relative",
              isActive ? "font-bold text-black" : "text-neutral-400"
            )}
          >
            <div
              className={clsx(
                "absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300",
                isActive ? "bg-mainlilly" : "bg-transparent"
              )}
            />
            <div
              className={clsx(
                "w-full h-full relative z-10",
                isActive ? "bg-gradient-to-b from-red-100 to-transparent" : "bg-transparent"
              )}
            >
              {String(s).padStart(2, "0")}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StepIndicator;
