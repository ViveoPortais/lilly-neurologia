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
import React, { useEffect,useRef, useState } from "react";

import { getConsentStatus, updateConsentStatus } from "@/services/user";
import { usePdfModal } from "@/contexts/PdfModalContext";
import { toast } from "react-toastify";
import { getLatestRegistrationConsent } from "@/services/annotation";
import { base64ToBlobUrl } from "@/helpers/fileHelper";
import { isConsentOk, ensureConsentOk, primeConsentOk, clearAllConsentCaches } from "@/lib/consentCache";


const Page = () => {
 const router = useRouter();
 const auth = useSession();
 const modal = useModalContent();
 const countMessage = useAppSelector(selectMessageCount);
 const userRoutes = routes[auth.role] || [];
 const dispatch = useAppDispatch();
 const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
 const [pendingRoute, setPendingRoute] = useState<string | null>(null);
 const { openPdfModal, closePdfModal } = usePdfModal();
 const [checkingConsent, setCheckingConsent] = useState(true);
 const ranRef = useRef(false);

useEffect(() => {
  if (ranRef.current) return;
  ranRef.current = true;

  (async () => {
    // se já checou/aceitou nesta sessão, não chama API
    if (isConsentOk()) {
      dispatch(fetchGetMessagesCount(auth.programsCode[0]));
      setCheckingConsent(false);
      return;
    }

    // primeira checagem da sessão → 1 chamada ao endpoint
    const ok = await ensureConsentOk(() => getConsentStatus());
    if (!ok) {
      const doc = await getLatestRegistrationConsent();
      if (!doc?.documentBody) {
        toast.error("Não foi possível carregar o termo.");
        clearAllConsentCaches();
        auth.onLogout();
        router.replace("/signin");
        return;
      }
      const pdfUrl = base64ToBlobUrl(doc.documentBody, doc.contentType || "application/pdf");

      openPdfModal({
        pdfUrl,
        showAgree: true,
        showDisagree: true,
        showDownload: true,
        disableClose: true,
        onAgree: async () => {
          try {
            await updateConsentStatus(true);
            primeConsentOk(true); 
            closePdfModal();
            dispatch(fetchGetMessagesCount(auth.programsCode[0]));
            setCheckingConsent(false);
          } catch (e: any) {
            toast.error(e?.response?.data ?? e?.message ?? "Falha ao registrar aceite.");
            closePdfModal();
            auth.onLogout();
            clearAllConsentCaches();
            router.replace("/signin");
          }
        },
        onDisagree: () => {
          closePdfModal();
          clearAllConsentCaches();
          auth.onLogout();
          router.replace("/signin");
        },
      });
      return;
    }

    dispatch(fetchGetMessagesCount(auth.programsCode[0]));
    setCheckingConsent(false);
  })();
}, [auth, dispatch, router]);

const handleCardClick = async (route: string, openModal?: boolean) => {
  if (!isConsentOk()) {
    const ok = await ensureConsentOk(() => getConsentStatus());
    if (!ok) return; 
  }

  if (openModal) {
    setPendingRoute(route);
    setIsPasswordModalOpen(true);
  } else {
    router.push(route);
  }
};
 const filteredRoutes = userRoutes.filter((route) => route.text !== "Início");

const requestConsentIfNeeded = async (): Promise<boolean> => {
  try {
    const res: { value: boolean } = await getConsentStatus();
    const needsReaccept = res.value === false;
    if (!needsReaccept) return true;

    const doc = await getLatestRegistrationConsent();
    if (!doc?.documentBody) {
      toast.error("Não foi possível carregar o termo.");
      return false;
    }
    const pdfUrl = base64ToBlobUrl(doc.documentBody, doc.contentType || "application/pdf");

    return await new Promise<boolean>((resolve) => {
      openPdfModal({
        pdfUrl,
        showAgree: true,
        showDisagree: true,
        showDownload: true,
        disableClose: true, 
        onAgree: async () => {
          try {
            await updateConsentStatus(true);
            closePdfModal();
            resolve(true);
          } catch (e: any) {
            toast.error(e?.response?.data ?? e?.message ?? "Falha ao registrar aceite.");
            closePdfModal();
            resolve(false);
          }
        },
        onDisagree: () => {
          closePdfModal();
          resolve(false);
        },
      });
    });
  } catch (e: any) {
    const msg = e?.response?.data ?? e?.message ?? "Erro ao verificar termo.";
    toast.error(msg);
    return false;
  }
};

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
