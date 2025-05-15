"use client";

import { Loading } from "@/components/custom/Loading";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface LoadingContextProps {
 show: () => void;
 hide: () => void;
}

const LoadingContext = createContext<LoadingContextProps|undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
 const [isOpen, setIsOpen] = useState(false);

 const show = () => {
  setIsOpen(true);
 };

 const hide = () => {
  setIsOpen(false);
 };


 return (
  <LoadingContext.Provider value={{ show, hide }}>
   {children}
   {isOpen && <Loading />}
  </LoadingContext.Provider>
 );
}

export function useLoading() {
 const context = useContext(LoadingContext);
 if (!context) {
  throw new Error("useLoading deve ser usado dentro de um LoadingProvider");
 }
 return context;
}
