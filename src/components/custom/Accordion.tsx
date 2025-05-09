import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
 title: string;
 badgeText?: string;
 children: React.ReactNode;
 openByDefault?: boolean;
}

export function Accordion({ title, badgeText, children, openByDefault = false }: AccordionProps) {
 const [isOpen, setIsOpen] = useState(openByDefault);

 return (
  <div className="border border-zinc-200 rounded-xl mb-4 overflow-hidden">
   <button
    onClick={() => setIsOpen(!isOpen)}
    className="flex w-full justify-between items-center px-4 py-3 text-sm font-semibold bg-white border-b border-zinc-200 cursor-pointer"
   >
    <div className="flex items-center gap-2">
     <span>{title}</span>
     {badgeText && <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">{badgeText}</span>}
    </div>
    <svg
     className={`w-4 h-4 text-red-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
     fill="none"
     stroke="currentColor"
     viewBox="0 0 24 24"
    >
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
   </button>

   <AnimatePresence initial={false}>
    {isOpen && (
     <motion.div
      key="content"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
     >
      <div className="p-4">{children}</div>
     </motion.div>
    )}
   </AnimatePresence>
  </div>
 );
}
