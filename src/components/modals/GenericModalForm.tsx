import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";

type Size = "2xl" | "lg" | "xl" | "sm";

interface GenericModalFormProps {
 title: string;
 isOpen: boolean;
 onClose: () => void;
 children?: ReactNode | ((onClose: () => void) => ReactNode);
 size?: Size;
}

export default function GenericModalForm({ title, isOpen, onClose, children, size = "2xl" }: GenericModalFormProps) {
 const sizeClasses: Record<Size, string> = {
  sm: "lg:max-w-sm",
  lg: "lg:max-w-lg",
  xl: "lg:max-w-xl",
  "2xl": "lg:max-w-2xl",
 };

 return (
  <>
   {isOpen && (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
     <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl pt-8 pb-4 px-5 shadow-lg w-full max-w-full overflow-x-hidden ${sizeClasses[size]}`}
     >
      {title && (
       <div className="flex justify-between border-b border-b-gray-400 pb-2 mb-4">
        <h2 className="flex justify-start text-2xl text-zinc-800">{title}</h2>
        <button
         onClick={onClose}
         className="flex items-center justify-center w-8 h-8 rounded-full border border-black border-2 bg-white hover:bg-gray-100 transition duration-200"
         aria-label="Fechar"
        >
         <HiX className="text-black text-base font-bold" />
        </button>
       </div>
      )}

      {children && <div className="w-full max-w-full">{children && typeof children === "function" ? children(onClose) : children}</div>}
     </motion.div>
    </div>
   )}
  </>
 );
}