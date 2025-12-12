import { useGenericModal } from "@/contexts/GenericModalContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchTermAttachFilled } from "@/store/slices/diagnosticSlice";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Download, Upload } from "lucide-react";
import { IDocumentFilledRequestModel } from "@/types/diagnostic";

type RenderUploadTermProps = {
    label: string,
    inputRef: React.RefObject<HTMLInputElement>,
    downloadLabel: string,
    fieldOnForm:string
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FORMATS = [".pdf", ".jpg", ".jpeg", ".png"];

export function RenderUploadTerm({ label, inputRef, downloadLabel, fieldOnForm }: RenderUploadTermProps) {

    const {
        register,
        setValue,
        formState: { errors },
        watch,
        getValues,
        trigger
    } = useFormContext();

    const modal = useGenericModal();
    const dispatch = useAppDispatch();
    const { show, hide } = useLoading();

    const [consentFileName, setConsentFileName] = useState("");

    const handleDownloadAttachmentFilled = async () => {

        show();
        try {
            const formValues = getValues();

            if (formValues.birthDateCaregiver == "")
                formValues.birthDateCaregiver = null;

            const {
                pickupPostalCode,
                pickupAddressName,
                pickupNumber,
                pickupAddressComplement,
                pickupAddressDistrict,
                pickupAddressCity,
                pickupAddressState,
            } = formValues;

            const logistics = {
                addressPostalCode: pickupPostalCode,
                addressName: pickupAddressName,
                addressNumber: pickupNumber,
                addressComplement: pickupAddressComplement,
                addressDistrict: pickupAddressDistrict,
                addressCity: pickupAddressCity,
                addressState: pickupAddressState,
                sector: formValues.sector,
                contact: formValues.contact,
            };

            formValues.logistics = logistics;

            const payload : IDocumentFilledRequestModel = {
                examCreateModel : formValues,
                annotationTypeStringMapFlag : "#CONSENT_TERM_NEURO_AND_MED_PRESC"
            }

            const res = await dispatch(fetchTermAttachFilled({ data: payload})).unwrap();
            if (res) {
                const url = window.URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
                const a = document.createElement("a");

                a.href = url;
                a.download = `Termo de Consentimento ${watch("name")}`;
                document.body.appendChild(a);
                a.click();
            }
        }
        catch (error) {
            toast.error('Não foi possível fazer o download do documento, contate o administrador do sistema');
        }
        finally {
            hide();
        }

    }



    const handleFileValidation = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        const sizeMB = file.size / (1024 * 1024);

        const isValidExtension = ACCEPTED_FORMATS.includes(extension);
        const isValidSize = sizeMB <= MAX_FILE_SIZE_MB;

        if (!isValidExtension || !isValidSize) {
            modal.showModal({
                type: "warning",
                title: "Arquivo inválido",
                message: "O arquivo deve ser PDF, JPG ou PNG e ter no máximo 5MB.",
            });
            setValue(fieldName, null);
            event.target.value = "";
            if (fieldName === fieldOnForm) setConsentFileName("");
            return;
        }

        setValue(fieldName, file);

        trigger();
        
        if (fieldName === fieldOnForm) setConsentFileName(file.name);
    };

    return (
        <>
            <div className="w-full flex flex-col items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        handleDownloadAttachmentFilled();
                    }}
                    className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadLabel}
                </Button>

                <input type="file" accept={ACCEPTED_FORMATS.join(",")} onChange={(e) => handleFileValidation(e, fieldOnForm)} ref={inputRef} className="hidden" />

                <Button
                    type="button"
                    variant="ghost"
                    className="w-[300px] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {label}
                </Button>

                {consentFileName && (
                    <p className="text-xs text-zinc-600 text-center">
                        Arquivo selecionado: <span className="font-medium">{consentFileName}</span>
                    </p>
                )}
            </div>
        </>
    )
}
