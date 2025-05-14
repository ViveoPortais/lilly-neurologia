"use-client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLateralMenu } from "@/hooks/useMenus";
import GenericModalForm from "@/components/modals/GenericModalForm";
import FormAddLink from "./FormAddLink";

interface ModalAddLinkProps {
}


export default function ModalAddLink({}: ModalAddLinkProps) {

  const [isOpen, setIsOpen] = useState(false);

  const { isMenuOpen } = useLateralMenu();

  return (
    <div className={`w-[90vw] ${isMenuOpen ? "lg:w-[70vw]" : "lg:w-[calc(95vw-100px)]"} mx-auto`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-300 border-l-8  border-l-mainlilly rounded-2xl pl-3 pr-4 py-4 shadow-sm gap-4">
        <p className="text-xl text-gray-800 px-4">
          Adicione um vínculo com um médico para acompanhar diferentes solicitações.
        </p>
        <Button className="ml-4 px-10 py-2 font-semibold text-base" onClick={() => setIsOpen(true)}>
          Solicitar Novo Vínculo
        </Button>
        <GenericModalForm title={"Vincular Médico"} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <FormAddLink onClose={() => setIsOpen(false)}/>
        </GenericModalForm>
      </div>
    </div>
  );
}