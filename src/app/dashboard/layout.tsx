"use client";

import { Loading } from "@/components/custom/Loading";
import { Header } from "@/components/dashboard/Header";
import { Navbar } from "@/components/dashboard/Navbar";
import { Footer } from "@/components/Footer";
import FooterMobile from "@/components/logged/mobile/FooterMobile";
import AlterPasswordModal from "@/components/modals/AlterPasswordModal";
import GenericModalForm from "@/components/modals/GenericModalForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLateralMenu } from "@/hooks/useMenus";
import useSession from "@/hooks/useSession";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useNotification } from "@/hooks/useNotifications";
import NotificationContent from "@/components/custom/NotificationContent";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isMenuOpen } = useLateralMenu();
  const { role, isLogged, token, obrigatorioAlterarSenha, primeiroAcesso, setProgramConsent } = useSession();
  const router = useRouter();
  const auth = useSession();
  const [loading, setLoading] = useState(true);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const { notifications, unreadCount, refresh, markAsRead, removeNotification } = useNotification();

  useEffect(() => {
    const checkAuth = async () => {
      //    if (!isLogged) {
      //     router.push("/");
      //     return;
      //    }

      if (token) api.defaults.headers.Authorization = `Bearer ${token}`;

      if (role) {
        setLoading(false);
        return;
      }
    };

    checkAuth();
  }, [isLogged, role, token, router, primeiroAcesso]);

  useEffect(() => {
    if (isLogged && role && !hasOpenedModal) setHasOpenedModal(true);
  }, [isLogged, role, hasOpenedModal]);

  useEffect(() => {
    if ((obrigatorioAlterarSenha || primeiroAcesso) && !hasOpenedModal) {
      setHasOpenedModal(true);
      setIsPasswordModalOpen(true);
    }
  }, [obrigatorioAlterarSenha, primeiroAcesso, hasOpenedModal]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center w-screen h-screen bg-gray-200"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7)), url(/images/Fundo PFV.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <Loading size={60} customClass={"text-mainlilly"} />
      </div>
    );
  }

  return (
    <main className={`h-screen w-screen relative`}>
      <Navbar
        onOpenNotificationModal={() => {
          setNotificationModalOpen(true);
          refresh();
        }}
        unreadCount={unreadCount}
      />

      <div
        className={`lg:absolute lg:right-0 lg:top-0 h-screen overflow-auto ${
          isMenuOpen ? "w-full lg:w-5/6" : "w-full lg:w-[calc(100%-100px)]"
        } transition-all flex flex-col items-center justify-center bg-zinc-100`}
      >
        <ScrollArea className="w-full flex-1">
          <div className="bg-white rounded-2xl shadow-md p-4 min-h-[calc(100vh-5rem)]">
            <Header />
            <div className="py-4">{children}</div>
          </div>
        </ScrollArea>
        {!isMobile ? (
          <div className="w-full bg-white shadow-inner">
            <Footer bgColor="bg-zinc-100" />
          </div>
        ) : (
          <div className="mt-5">
            <FooterMobile />
          </div>
        )}
      </div>
      <GenericModalForm
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Atualizar Senha"
        children={<AlterPasswordModal isOpenExternally={isPasswordModalOpen} onCloseExternally={() => setIsPasswordModalOpen(false)} />}
      />

      <GenericModalForm title="Notificações" isOpen={notificationModalOpen} onClose={() => setNotificationModalOpen(false)}>
        <NotificationContent notifications={notifications} onMarkAsRead={(id) => markAsRead(id)} onRemove={(id) => removeNotification(id)} onClose={() => setNotificationModalOpen(false)} />
      </GenericModalForm>
    </main>
  );
}