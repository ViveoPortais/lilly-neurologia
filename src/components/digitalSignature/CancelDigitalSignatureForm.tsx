import { Controller, FormProvider, useForm } from "react-hook-form";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { cancelDigitalSignatureSchema} from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { RenderUploadTerm } from "../registerPatient/RenderUploadTerm";
import { IStringMap } from "@/types";
import { useAppDispatch } from "@/store/hooks";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { isValid } from "zod";
import { fileToBase64 } from "@/helpers/fileHelper";
import { fetchAnnotations, fetchDiagnosticDetailsById, fetchMyDiagnostics, postCancelDigitalSignatureDetails } from "@/store/slices/diagnosticSlice";
import { ICancelDigitalSignatureRequest, IDiagnosticExamModel, IDiagnosticFilterModel } from "@/types/diagnostic";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { AlertCircle } from "lucide-react";

type CancelDigitalSignatureFormProps = {
    exam : IDiagnosticExamModel;
    onClose: () => void;
};

const CancelDigitalSignatureForm = ({exam, onClose }: CancelDigitalSignatureFormProps) => {
    const methods = useForm<any>({
        resolver: zodResolver(cancelDigitalSignatureSchema),
        mode: "onChange"
    });

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isValid } } = methods;

    const consentInputRef = useRef<HTMLInputElement | null>(null);

    const modal = useGenericModal();
    const [reasons, setReasons] = useState<IStringMap[]>([]);
    const dispatch = useAppDispatch();

    const { show, hide } = useLoading();

    useEffect(() => {
        const fetchData = async () => {
            const result = await dispatch(fetchStringMaps({ attributeName: "Custom4StringMap", entityName: "Exam" })).unwrap();
            setReasons(result);
        };
        fetchData();
    }, [dispatch]);

    const onSubmit = async (data: any) => {

        try {
            show();
            let payload = { ...data, examId : exam.id}

            if (data.attachment) {
                payload.attachment = {
                    fileName: data.attachment.name,
                    documentBody: await fileToBase64(data.attachment),
                    fileSize: data.attachment.size.toString(),
                };
            }

            const response = await dispatch(postCancelDigitalSignatureDetails(payload)).unwrap();

            if (response.isValidData) {
                await dispatch(fetchDiagnosticDetailsById({ id: exam.id }));
                await dispatch(fetchAnnotations({ id: exam.id }));
                const filterDiagnostic: IDiagnosticFilterModel = {};
                dispatch(fetchMyDiagnostics({ filterDiagnostic: filterDiagnostic }));
                hide();
                modal.showModal(
                    {
                        type: "success",
                        title: "Sucesso",
                        message: response.additionalMessage,
                    },
                    () => {}
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
        finally {hide()}
    }


    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="py-4">

                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col w-full text-left">
                        <Controller
                            name="reasonCancelDigitalSignature"
                            control={methods.control}
                            render={({ field }) => (
                                <CustomFilterSelect
                                    {...field}
                                    label="Motivo do Cancelamento"
                                    options={reasons}
                                />
                            )}
                        />
                        {errors?.reasonCancelDigitalSignature && <span className="flex text-sm text-red-500 mt-1 block">{errors.reasonCancelDigitalSignature.message as string}</span>}
                    </div>
                    <div className="flex items-center text-center gap-1 w-full max-w-full">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-black text-center leading-relaxed break-words">
                            Para cancelar o processo de assinatura digital, insira o Termo de Consentimento Assinado.
                        </p>
                    </div>
                    <div className="flex w-full text-left">
                        <RenderUploadTerm
                            label="Upload do documento assinado"
                            inputRef={consentInputRef}
                            downloadLabel="Download do documento"
                            fieldOnForm="attachment"
                        />
                    </div>
                    {errors?.attachment && <span className="flex text-sm text-red-500 mt-1 block">{errors.attachment.message as string}</span>}
                    <div className="flex">
                        <Button type="submit" variant={"default"} size="lg" disabled={!isValid} className="w-full">Salvar</Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CancelDigitalSignatureForm;