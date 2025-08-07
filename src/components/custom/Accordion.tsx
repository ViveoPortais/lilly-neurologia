import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
  title: string;
  badgeText?: string;
  badgeIsZero?: boolean;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle: () => void;
  className?: string;
  id?: string;
}

export function Accordion({ title, badgeText, badgeIsZero = false, children, isOpen, onToggle, id, className }: AccordionProps) {
  return (
    <div id={id} className={`border border-zinc-200 rounded-xl mb-4 overflow-hidden ${className ?? ""}`}>
      <button
        onClick={onToggle}
        className="flex w-full justify-between items-center px-4 py-3 text-sm font-semibold bg-white border-b border-zinc-200 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badgeText && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeIsZero ? "bg-zinc-200 text-zinc-500" : "bg-red-100 text-black"}`}>
              {badgeText}
            </span>
          )}
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