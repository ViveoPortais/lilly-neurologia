import * as React from "react";
import { cn } from "@/lib/utils";
import { MdInfo, MdOutlineEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { CiLock, CiLogin } from "react-icons/ci";
import { InputLoading } from "../custom/InputLoading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 icon?: React.ReactNode;
 isLoading?: boolean;
 maxLength?: number;
 tooltip?: boolean;
 textTooltip?: string;
 inputPlaceholder?: string;
}

const iconsMap = {
 email: <MdOutlineEmail size={20} />,
 password: <CiLock size={20} />,
 login: <CiLogin size={20} />,
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, type = "text", icon, isLoading, maxLength, tooltip, textTooltip, inputPlaceholder, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  if (isLoading) return <InputLoading />;

  const handleTogglePassword = () => {
   setShowPassword(!showPassword);
  };

  return (
   <div className={cn("w-full", className)}>
    <div className="flex gap-1 mb-1">
     <label className="text-base tracking-wide text-black">
      {props.placeholder}
      {props.required && <span className="text-red-500 ml-1">*</span>}
     </label>
     {tooltip && (
      <div className="flex items-center text-gray-500">
       <TooltipProvider>
        <Tooltip>
         <TooltipTrigger disabled>
          <MdInfo size={20} />
         </TooltipTrigger>
         <TooltipContent>
          <p>{textTooltip}</p>
         </TooltipContent>
        </Tooltip>
       </TooltipProvider>
      </div>
     )}
    </div>

    <div
     className={cn(
      "flex items-center gap-2 w-full rounded-md border px-4 py-3 text-base",
      props.disabled ? "bg-stone-200 border-[#c4b9b9] text-black font-bold" : "bg-white border-[#c4b9b9] text-black",
      className
     )}
    >
     {icon && iconsMap[icon as keyof typeof iconsMap]}
     <input
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      className={cn(
       "w-full focus-visible:outline-none disabled:cursor-not-allowed",
       type === "file"
        ? "file:border-0 file:bg-transparent file:text-sm file:md:text-base file:font-medium"
        : "placeholder:text-muted-foreground"
      )}
      ref={ref}
      {...props}
      placeholder={inputPlaceholder ?? props.placeholder}
      maxLength={type === "text" ? maxLength : undefined}
     />
     {type === "password" && (
      <button type="button" onClick={handleTogglePassword} className="ml-2 text-gray-500 hover:text-gray-700">
       {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
      </button>
     )}
    </div>
   </div>
  );
 }
);
Input.displayName = "Input";

export { Input };
