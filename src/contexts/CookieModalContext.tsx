"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import CookieModal from "@/components/modals/CookieModal";
import Cookies from "js-cookie";

interface CookieModalContextData {
 openCookieModal: () => void;
 closeCookieModal: () => void;
}

const CookieModalContext = createContext<CookieModalContextData | undefined>(undefined);

export function CookieModalProvider({ children }: { children: ReactNode }) {
 const [isOpen, setIsOpen] = useState(false);

 const openCookieModal = useCallback(() => {
  setIsOpen(true);
 }, []);

 const closeCookieModal = useCallback(() => {
  setIsOpen(false);
 }, []);

 useEffect(() => {
  const consentGiven = Cookies.get("NecessaryCookies") === "true";
  if (!consentGiven) {
   openCookieModal();
  }
 }, [openCookieModal]);

 return (
  <CookieModalContext.Provider value={{ openCookieModal, closeCookieModal }}>
   {children}
   {isOpen && <CookieModal onClose={closeCookieModal} />}
  </CookieModalContext.Provider>
 );
}

export function useCookieModal() {
 const context = useContext(CookieModalContext);
 if (!context) {
  throw new Error("useCookieModal deve ser usado dentro de um CookieModalProvider");
 }
 return context;
}
