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
  showTimeSelect?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  dateFormat?: string;
}

export const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholder, 
  minDate, 
  maxDate, 
  filterDate, 
  name, 
  inputClassName = "",
  showTimeSelect = false,
  timeFormat = "HH:mm",
  timeIntervals = 15,
  dateFormat = "dd/MM/yyyy"
}: CustomDatePickerProps) => {

  const finalDateFormat = showTimeSelect ? "dd/MM/yyyy HH:mm" : dateFormat;
  
  return (
    <DatePicker
      locale={ptBR}
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      filterDate={filterDate}
      placeholderText={placeholder}
      dateFormat={finalDateFormat}
      name={name}
      showPopperArrow={false}
      wrapperClassName="w-full"
      showTimeSelect={showTimeSelect}
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
      timeCaption="Hora"
      className={cn(
        "block w-full rounded-md border border-[#c4b9b9] bg-white px-4 py-3 text-base text-black focus:outline-none focus:ring-1 focus:ring-red-500",
        inputClassName
      )}
    />
  );
};