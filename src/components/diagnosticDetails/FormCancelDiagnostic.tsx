import { Controller, FormProvider, useForm } from "react-hook-form";
import { UFlist } from "@/helpers/select-filters";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms } from "@/store/slices/linkManagementeSlice";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { IOption, IStringMap } from "@/types";
import { fetchMyDiagnostics, postCancellationExam } from "@/store/slices/diagnosticSlice";
import { IExamCancellationModel, IDiagnosticFilterModel } from "@/types/diagnostic";
import { zodResolver } from "@hookform/resolvers/zod";
import { examCancellationModelSchema } from "@/lib/utils";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";


interface CalcelDiagnosticProps {
    onClose: () => void;
    options: IStringMap[]
}

export default function FormAddLink({ onClose, options }: CalcelDiagnosticProps) {

    const methods = useForm<IExamCancellationModel>({
        resolver: zodResolver(examCancellationModelSchema),
        mode: "onBlur"
    });

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = methods;

    const dispatch = useAppDispatch();
    const exam = useAppSelector((state) => state.diagnostic.data.exam);
    const modal = useGenericModal();


    const onCloseModal = async () => {
        onClose();
        reset();
        const filterDiagnostic: IDiagnosticFilterModel = {}
        await dispatch(fetchMyDiagnostics({ filterDiagnostic: filterDiagnostic }));
    }


    const onSubmit = async (data: IExamCancellationModel) => {
        try {

            data.id = exam?.id;

            const response = await dispatch(postCancellationExam({ examCancellationModel: data })).unwrap();

            if (response) {
                if (response.isValidData) {
                    modal.showModal(
                        {
                            type: "success",
                            title: "Sucesso",
                            buttonLabel: "Fechar",
                            message: response.additionalMessage
                        },
                        onCloseModal
                    )
                }
                else {
                    modal.showModal(
                        {
                            type: "error",
                            title: "Erro",
                            buttonLabel: "Fechar",
                            message: response.additionalMessage
                        },
                        onCloseModal
                    )
                }
            }
        }
        catch (error: string | any) {
            modal.showModal(
                {
                    type: "error",
                    buttonLabel: "Fechar",
                    message: error
                },
                onCloseModal
            )
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="py-4">

                <div className="flex flex-col gap-6">
                    <div className="flex w-full text-left">
                        <Controller
                            name="examCancellationReason"
                            control={methods.control}
                            render={({ field }) => (
                                <CustomFilterSelect
                                    {...field}
                                    label="Motivo do Cancelamento"
                                    options={options}
                                />
                            )}
                        />
                        {errors?.examCancellationReason && <span className="flex text-sm text-red-500 mt-1 block">{errors.examCancellationReason.message as string}</span>}
                    </div>
                    <div className="flex">
                        <Button type="submit" variant={"default"} size="lg" className="w-full" disabled={!watch("examCancellationReason")}>Cancelar Protocolo</Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}