import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FiEdit3, FiMail, FiMoreHorizontal, FiXCircle } from "react-icons/fi";
import { useState } from "react";
import { ConfirmationDialog } from "../custom/ConfirmationDialog";
import GenericModalForm from "../modals/GenericModalForm";
import CancelDigitalSignatureForm from "./CancelDigitalSignatureForm";
import { IDiagnosticExamModel, IResendDigitalSignatureRequest } from "@/types/diagnostic";
import { useAppDispatch } from "@/store/hooks";
import { fetchDiagnosticDetailsById, postResendDigitalSignature } from "@/store/slices/diagnosticSlice";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import ResendDigitalSignatureForm from "./ResendDigitalSignatureForm";

type DigitalSignatureDropdownProps = {
    exam: IDiagnosticExamModel;
    showCancel: boolean;
    showResend: boolean;
};

const DigitalSignatureDropdown = ({ exam, showCancel, showResend }: DigitalSignatureDropdownProps) => {
    const [showResendConfirmation, setShowResendConfirmation] = useState(false);
    const [showModalCancelSignature, setShowModalCancelSignature] = useState(false);
    const [showModalResendDigitalSignature, setShowModalResendDigitalSignature] = useState(false);

    const dispatch = useAppDispatch();
    const modal = useGenericModal();

    const { show, hide } = useLoading();

    const handleResendConfirm = async () => {
        try {

            show();
            setShowResendConfirmation(false);

            let payload : IResendDigitalSignatureRequest = {examId : exam.id}

            const response = await dispatch(postResendDigitalSignature(payload)).unwrap();

            if (response.isValidData) {
                await dispatch(fetchDiagnosticDetailsById({id : exam.id}));
                hide();
                modal.showModal(
                    {
                        type: "success",
                        title: "Sucesso",
                        message: response.additionalMessage,
                    },
                    () => { }
                );
            } else {
                hide();
                modal.showModal(
                    {
                        type: "error",
                        title: "Erro",
                        message: response.additionalMessage,
                    },
                    () => { }
                );
            }

        }
        catch (error) { console.error(error) }
        finally { hide() };

    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <FiMoreHorizontal className="text-mainlilly" size={25} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-lg">
                    {showResend &&
                        <>
                            <DropdownMenuItem onClick={() => setShowResendConfirmation(true)} className="cursor-pointer">
                                <FiMail className="mr-2" />
                                Reenviar assinatura digital
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowModalResendDigitalSignature(true)} className="cursor-pointer">
                                <FiEdit3 className="mr-2" />
                                Enviar para outro e-mail
                            </DropdownMenuItem>
                        </>
                    }
                    {showCancel &&
                        <DropdownMenuItem onClick={() => setShowModalCancelSignature(true)} className="text-red-600 cursor-pointer">
                            <FiXCircle className="mr-2" />
                            Cancelar assinatura digital
                        </DropdownMenuItem>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmationDialog
                open={showResendConfirmation}
                onClose={() => setShowResendConfirmation(false)}
                onConfirm={() => handleResendConfirm()}
                content={`Tem certeza que deseja reenviar a assinatura digital para os mesmos e-mails?`}
            />
            <GenericModalForm title="Cancelar Assinatura Digital" isOpen={showModalCancelSignature} onClose={() => setShowModalCancelSignature(false)}>
                <CancelDigitalSignatureForm exam={exam} onClose={() => setShowModalCancelSignature(false)}/>
            </GenericModalForm>
            <GenericModalForm title="Reenviar Assinatura Digital" isOpen={showModalResendDigitalSignature} onClose={() => setShowModalResendDigitalSignature(false)}>
                <ResendDigitalSignatureForm exam={exam} onClose={() => setShowModalResendDigitalSignature(false)}/>
            </GenericModalForm>
        </>
    );
}

export default DigitalSignatureDropdown;