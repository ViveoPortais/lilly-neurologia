"use client";

import useSession from "@/hooks/useSession";
import { usePathname, useRouter } from "next/navigation";
import { useKeenSlider } from "keen-slider/react";
import { routes } from "@/helpers/routes";
import { useState } from "react";
import GenericModalForm from "@/components/modals/GenericModalForm";
import OperationPasswordModal from "@/components/manageFiles/OperationPasswordModal";

export default function FooterMobile() {
 const auth = useSession();
 const pathname = usePathname();
 const router = useRouter();
 const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
 const [pendingRoute, setPendingRoute] = useState<string | null>(null);

 const currentRoutes = routes[auth.role] || [];

 const handleFooterClick = (route: string, openModal?: boolean) => {
  if (openModal) {
   setPendingRoute(route);
   setIsPasswordModalOpen(true);
  } else {
   router.push(route);
  }
 };

 const [sliderRef] = useKeenSlider<HTMLDivElement>({
  slides: {
   perView: 3,
   spacing: 10,
  },
 });

 return (
  <>
   <div className="fixed bottom-0 left-0 right-0 bg-zinc-100 h-20 shadow-inner rounded-t-2xl px-4">
    <div ref={sliderRef} className="keen-slider h-full flex items-center">
     {currentRoutes.map(({ route, icon: Icon, openModal }, index) => {
      const isActive = pathname === route;
      return (
       <div key={index} className="keen-slider__slide flex justify-center items-center">
        <button
         onClick={() => handleFooterClick(route, openModal)}
         className={`flex flex-col items-center justify-center transition-all duration-200 ${
          isActive ? "text-mainlilly scale-110" : "text-black opacity-70 hover:opacity-100"
         }`}
        >
         <Icon className="w-6 h-6" />
        </button>
       </div>
      );
     })}
    </div>
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
}
