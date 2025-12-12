import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { resendDigitalSignatureSchema } from "@/lib/utils";
import { useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchDiagnosticDetailsById, fetchDigitalSignatureDetails, postResendDigitalSignature } from "@/store/slices/diagnosticSlice";
import { IDiagnosticExamModel, IResendDigitalSignatureRequest } from "@/types/diagnostic";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { Input } from "../ui/input";
import { AlertCircle } from "lucide-react";

type ResendDigitalSignatureFormProps = {
    exam: IDiagnosticExamModel;
    onClose : () => void;
};

const ResendDigitalSignatureForm = ({ exam , onClose}: ResendDigitalSignatureFormProps) => {
    const methods = useForm<any>({
        resolver: zodResolver(resendDigitalSignatureSchema),
        mode: "onChange"
    });

    const { register, handleSubmit, formState: { errors, isValid } } = methods;

    const consentInputRef = useRef<HTMLInputElement | null>(null);

    const modal = useGenericModal();
    const dispatch = useAppDispatch();

    const { show, hide } = useLoading();


    const onSubmit = async (data: any) => {

        try {
            show();
            let payload: IResendDigitalSignatureRequest = {
                examId: exam.id,
                signers: [
                    {
                        email: data.email,
                        name: exam.namePatient ?? '',
                        role: 'Patient'
                    },
                    {
                        email : exam.emaillAddressDoctor ?? '',
                        name: exam.doctorName ?? '',
                        role : 'Doctor'
                    }
                ]
            }

            const response = await dispatch(postResendDigitalSignature(payload)).unwrap();

            if (response.isValidData) {
                await dispatch(fetchDiagnosticDetailsById({ id: exam.id }));
                await dispatch(fetchDigitalSignatureDetails({ id: exam.id }));
                hide();
                modal.showModal(
                    {
                        type: "success",
                        title: "Sucesso",
                        message: response.additionalMessage,
                    },
                    () => {onClose()}
                );
            } else {
                hide();
                modal.showModal(
                    {
                        type: "error",
                        title: "Erro",
                        message: response.additionalMessage,
                    },
                    () => {onClose()}
                );
            }
        }
        catch (error) { console.error(error) }
        finally { hide() }
    }


    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="py-4">

                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col w-full text-left gap-4">
                        <Input
                            type="email"
                            placeholder={`Digite o e-mail do paciente/responsável`}
                            {...register("email", {
                                required: "E-mail é obrigatório",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "E-mail inválido",
                                },
                            })}
                            className="text-sm placeholder:text-gray-500"
                        />
                        {errors?.email && <span className="flex text-sm text-red-500 mt-1 block">{errors.email.message as string}</span>}
                    <div className="flex items-start gap-1 w-full">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="flex-1 min-w-0 whitespace-normal break-words text-sm text-black">
                            Ao prosseguir, todas as assinaturas anteriores serão invalidadas e
                            um novo processo de assinatura será iniciado para todos os envolvidos.
                        </p>
                    </div>
                    </div>
                    <div className="flex">
                        <Button type="submit" variant={"default"} size="lg" disabled={!isValid} className="w-full">Salvar</Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default ResendDigitalSignatureForm;