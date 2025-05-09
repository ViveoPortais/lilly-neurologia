import { ReactNode, useState} from "react";
import { motion } from "framer-motion";
import {HiX} from "react-icons/hi"


interface GenericModalFormProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}


export default function GenericModalForm({
    title,
    isOpen,
    onClose,
    children
}: GenericModalFormProps) {

  return(
    <>
      {isOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center"
            >
              {title && 
                <div className="flex justify-between border-b border-b-gray-400 pb-2 mb-4">
                  <h2 className="flex justify-start text-2xl font-semibold text-zinc-800">{title}</h2>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-black bg-white hover:bg-gray-100 transition duration-200"
                    aria-label="Fechar"
                  >
                    <HiX className="text-black text-lg" />
                  </button>
                </div>
              }

              {children && <div>{children}</div>}

            </motion.div>
          </div>
          )
      }
  </>
  );
}
