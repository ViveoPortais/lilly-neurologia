"use client";

import GenericModal from "@/components/modals/GenericModal";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type ModalType = "success" | "warning" | "error";

interface ModalState {
    type: ModalType;
    title?: string;
    message: string;
    buttonLabel?: string;
}

interface ModalContextProps {
    showModal: (modal: ModalState, onClose?: () => void) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function GenericModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalState, setModalState] = useState<ModalState | null>(null);
    const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | undefined>();

    const formatMessage = (message: string) => {
        if (typeof message === 'string') {
            return message.replace(/\/n/g, '\n');
        }

        return message;
    }

    const showModal = useCallback((modal: ModalState, onClose?: () => void) => {

        const formatedModal = {
            ...modal,
            message: formatMessage(modal.message)
        }
        setModalState(modal);
        setIsOpen(true);
        setOnCloseCallback(() => onClose);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setModalState(null);
        if (onCloseCallback) onCloseCallback();
    }, [onCloseCallback]);

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            <GenericModal
                type={modalState?.type ?? "success"}
                title={modalState?.title}
                message={modalState?.message ?? ""}
                buttonLabel={modalState?.buttonLabel}
                isOpen={isOpen}
                onClose={closeModal}
            />
        </ModalContext.Provider>
    );
}

export function useGenericModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useGenericModal deve ser usado dentro de um GenericModalProvider");
    }
    return context;
}
