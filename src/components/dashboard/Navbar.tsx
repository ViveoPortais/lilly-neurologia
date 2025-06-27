"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLateralMenu, useMobilelMenu } from "@/hooks/useMenus";
import { routes } from "@/helpers/routes";
import useSession from "@/hooks/useSession";

import api from "@/services/api";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import NavbarMobile from "../logged/mobile/NavbarMobile";
import NavbarDesktop from "../logged/desktop/NavbarDesktop";
import { motion } from "framer-motion";
import { useState } from "react";
import GenericModalForm from "../modals/GenericModalForm";
import OperationPasswordModal from "../manageFiles/OperationPasswordModal";

type NotificationProps = {
  onOpenNotificationModal: () => void;
  unreadCount: number;
};

export function Navbar(props: NotificationProps) {
 const pathname = usePathname();
 const { isMenuOpen, changeMenu } = useLateralMenu();
 const { isMobileMenuOpen, changeMobileMenu } = useMobilelMenu();
 const auth = useSession();
 const role = auth.role;
 const router = useRouter();
 const generalRoutes = routes[role] || [];
 const isMobile = useMediaQuery("(max-width: 768px)");
 const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
 const [pendingRoute, setPendingRoute] = useState<string | null>(null);

 const handleProtectedRoute = (route: string) => {
  setPendingRoute(route);
  setIsPasswordModalOpen(true);
 };

 function handleLogout() {
  router.push("/");
  auth.onLogout();
  api.defaults.headers.Authorization = "";
 }

 const mobileMenuVariants = {
  hidden: { opacity: 0, x: "-100%" },
  visible: { opacity: 1, x: "0%", transition: { duration: 0.1 } },
 };

 return (
   <>
     {isMobile ? (
       <motion.div
         variants={mobileMenuVariants}
         initial="hidden"
         animate={isMobileMenuOpen ? "visible" : "hidden"}
         className="fixed inset-0 z-[999] bg-white flex flex-col w-full p-4 shadow-lg transition-all"
       >
         <NavbarMobile
           changeMobileMenu={changeMobileMenu}
           generalRoutes={generalRoutes}
           handleLogout={handleLogout}
           pathname={pathname}
           auth={auth}
           isMobileMenuOpen={isMobileMenuOpen}
           handleProtectedRoute={handleProtectedRoute}
           onOpenNotificationModal={props.onOpenNotificationModal}
           unreadCount={props.unreadCount}
         />
       </motion.div>
     ) : (
       <NavbarDesktop
         auth={auth}
         changeMenu={changeMenu}
         generalRoutes={generalRoutes}
         handleLogout={handleLogout}
         isMenuOpen={isMenuOpen}
         pathname={pathname}
         role={role}
         handleProtectedRoute={handleProtectedRoute}
         onOpenNotificationModal={props.onOpenNotificationModal}
         unreadCount={props.unreadCount}
       />
     )}

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
