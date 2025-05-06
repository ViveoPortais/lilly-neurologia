"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { PdfViewerModal } from "@/components/modals/PdfViewerModal";

interface PdfModalProps {
 pdfUrl: string;
 showAgree?: boolean;
 showDisagree?: boolean;
 showDownload?: boolean;
 onAgree?: () => void;
 onDisagree?: () => void;
}

interface PdfModalContextData {
 openPdfModal: (props: PdfModalProps) => void;
 closePdfModal: () => void;
}

const PdfModalContext = createContext<PdfModalContextData | undefined>(undefined);

export function PdfModalProvider({ children }: { children: ReactNode }) {
 const [isOpen, setIsOpen] = useState(false);
 const [props, setProps] = useState<PdfModalProps | null>(null);

 const openPdfModal = useCallback((modalProps: PdfModalProps) => {
  setProps(modalProps);
  setIsOpen(true);
 }, []);

 const closePdfModal = useCallback(() => {
  setIsOpen(false);
  setProps(null);
 }, []);

 return (
  <PdfModalContext.Provider value={{ openPdfModal, closePdfModal }}>
   {children}
   {props && <PdfViewerModal open={isOpen} onClose={closePdfModal} {...props} />}
  </PdfModalContext.Provider>
 );
}

export function usePdfModal() {
 const context = useContext(PdfModalContext);
 if (!context) {
  throw new Error("usePdfModal deve ser usado dentro de um PdfModalProvider");
 }
 return context;
}
