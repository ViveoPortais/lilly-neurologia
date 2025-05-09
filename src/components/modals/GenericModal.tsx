import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModalType = "success" | "warning" | "error";

interface GenericModalProps {
 type: ModalType;
 title?: string;
 message: string;
 onClose: () => void;
 buttonLabel?: string;
 isOpen: boolean;
}

const iconMap = {
 success: <CheckCircle className="text-green-500 w-10 h-10" />,
 warning: <AlertTriangle className="text-yellow-500 w-10 h-10" />,
 error: <XCircle className="text-red-500 w-10 h-10" />,
};

export default function GenericModal({ type, title, message, onClose, buttonLabel = "Fechar", isOpen }: GenericModalProps) {
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
  setMounted(true);
 }, []);

 if (!isOpen || !mounted) return null;

 return createPortal(
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
   <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center"
   >
    <div className="flex justify-center mb-4">{iconMap[type]}</div>

    {title && <h2 className="text-lg font-semibold text-zinc-800 mb-1">{title}</h2>}

    <p className="text-sm text-zinc-600 mb-6">{message}</p>

    <Button size={`default`} variant={`default`} type="button" className="w-20" onClick={onClose}>
     {buttonLabel}
    </Button>
   </motion.div>
  </div>,
  document.body
 );
}
