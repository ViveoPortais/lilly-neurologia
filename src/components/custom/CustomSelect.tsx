"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as SelectPrimitive from "@radix-ui/react-select";

import React, { ElementRef, forwardRef } from "react";
import { InputLoading } from "./InputLoading";
import { LucideIcon } from "lucide-react";

interface IOption {
 id: string;
 value: string;
 icon?: LucideIcon;
}

interface CustomSelectProps {
 name: string;
 options: IOption[];
 label?: React.ReactNode;
 value?: any;
 onChange?: (value: any) => void;
 onBlur?: (value: any) => void;
 customClass?: string;
 isLoading?: boolean;
 params?: any;
 title?: string;
 disabled? : boolean;
}

const CustomSelect = forwardRef<ElementRef<typeof SelectPrimitive.Trigger>, CustomSelectProps>(
 ({ name, label, options, value, onChange, onBlur, customClass, isLoading, params, title,disabled, ...props }, ref) => {
  if (isLoading) return <InputLoading />;

  return (
   <Select name={name} value={value} onValueChange={onChange} disabled={disabled == true} {...props}>
    <div className="w-full">
     <label title={title} className="w-full text-start text-base trackin-wide text-black">
      {label}
     </label>
     <SelectTrigger
      ref={ref}
      onBlur={onBlur}
      className={`mt-1 md:col-span-3 py-6 md:px-4 ${customClass} border border-[#c4b9b9] focus:outline-none focus:ring-transparent`}
     >
      <SelectValue placeholder="Selecione..." />
     </SelectTrigger>
    </div>

    <SelectContent>
     {options.map(({ id, value, icon: Icon }) => {
      return (
       <SelectItem key={id} value={id} className="py-4">
        <div className="flex items-center gap-2">
         {Icon && <Icon size={16} className="text-muted-foreground" />}
         {value}
        </div>
       </SelectItem>
      );
     })}
    </SelectContent>
   </Select>
  );
 }
);

export { CustomSelect };
