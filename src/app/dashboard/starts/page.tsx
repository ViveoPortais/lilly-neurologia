"use client";

import ContentCard from "@/components/ContentCard";
import OperationPasswordModal from "@/components/manageFiles/OperationPasswordModal";
import GenericModalForm from "@/components/modals/GenericModalForm";
import { routes } from "@/helpers/routes";
import { useModalContent } from "@/hooks/useModal";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetMessagesCount, selectMessageCount } from "@/store/slices/callTrackingSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
 const router = useRouter();
 const auth = useSession();
 const modal = useModalContent();
 const countMessage = useAppSelector(selectMessageCount);
 const userRoutes = routes[auth.role] || [];
 const dispatch = useAppDispatch();
 const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
 const [pendingRoute, setPendingRoute] = useState<string | null>(null);

 useEffect(() => {
  dispatch(fetchGetMessagesCount(auth.programCode));
 }, []);

 const handleCardClick = (route: string, openModal?: boolean) => {
  if (openModal) {
   setPendingRoute(route);
   setIsPasswordModalOpen(true);
  } else {
   router.push(route);
  }
 };

 const filteredRoutes = userRoutes.filter((route) => route.text !== "Início");

 return (
  <>
   <div className="grid grid-cols-2 md:grid-cols-3 gap-5 my-5">
    {filteredRoutes.map((item, index) => (
     <ContentCard
      key={index}
      title={item.text}
      bgColor={item.text === "Minhas Pendências" ? "bg-mainlilly" : "bg-colorcard"}
      hasIcon={true}
      svgIcon={item.icon}
      buttonText="Acessar"
      onButtonClick={() => handleCardClick(item.route, item.openModal)}
      customIconText={item.text === "Minhas Pendências" ? " " : undefined}
      customBottomText={item.text === "Minhas Pendências" ? `${countMessage ?? 0} pendentes` : undefined}
      hideButton={item.text === "Minhas Pendências" ? false : undefined}
     />
    ))}
   </div>
   <GenericModalForm title="Senha de Acesso" isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
    {(onClose) => (
     <OperationPasswordModal
      onClose={onClose}
      onConfirm={() => {
       onClose();
       if (pendingRoute) {
        router.push(pendingRoute);
       }
      }}
     />
    )}
   </GenericModalForm>
  </>
 );
};

export default Page;
