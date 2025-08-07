"use client";

import { ptBR } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { forwardRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";

interface CustomDatePickerProps {
  selected?: Date;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  filterDate?: (date: Date) => boolean;
  name?: string;
  inputClassName?: string;
}

export const CustomDatePicker = ({ selected, onChange, placeholder, minDate, maxDate, filterDate, name, inputClassName = "" }: CustomDatePickerProps) => {
  return (
    <DatePicker
      locale={ptBR}
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      filterDate={filterDate}
      placeholderText={placeholder}
      dateFormat="dd/MM/yyyy"
      name={name}
      showPopperArrow={false}
      wrapperClassName="w-full"
      className={cn(
        "block w-full rounded-md border border-[#c4b9b9] bg-white px-4 py-3 text-base text-black focus:outline-none focus:ring-1 focus:ring-red-500",
        inputClassName
      )}
    />
  );
};