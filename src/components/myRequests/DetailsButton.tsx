import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAnnotations, fetchDiagnosticDetailsById } from "@/store/slices/diagnosticSlice";
import { useEffect, useState } from "react";
import ModalDiagnosticDetails from "../diagnosticDetails/ModalDiagnosticDetails";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { IStringMap } from "@/types";

type DetailsButtonProps = {
    id: string;
};

const DetailsButton = ({ id }: DetailsButtonProps) => {

    const loading = useAppSelector((state) => state.diagnostic.loading);
    const exam = useAppSelector((state) => state.diagnostic.data.exam);
    const annotations = useAppSelector((state) => state.diagnostic.data.annotations);
    const [optionsCancellation, setOptionsCancellation] = useState<IStringMap[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const { show, hide } = useLoading();

    useEffect(() => {

        if (loading)
            show()
        else
            hide()

    }, [loading]);



    const dispatch = useAppDispatch();

    const handleOnClick = async () => {
        try{
            await dispatch(fetchDiagnosticDetailsById({ id: id }));
            await dispatch(fetchAnnotations({id: exam?.diagnosticId!}));

            const examNotDoneStringMaps : IStringMap[] = await dispatch(fetchStringMaps({entityName:"Exam", attributeName : "ReasonExamNotDoneStringMap"})).unwrap();

            setOptionsCancellation(examNotDoneStringMaps);
            setIsOpen(true)
        }
        catch(error){

        }
    };

    return (
        <>
            <div className="flex justify-start gap-4 px-2">
                <button
                    onClick={handleOnClick}
                    className="px-3 py-1 border border-red-500 text-red-600 rounded-full text-sm font-semibold hover:bg-red-50"
                >
                    Expandir
                </button>
                <ModalDiagnosticDetails isOpen={isOpen} onClose={() => {setIsOpen(false)}} data={exam} annotations={annotations} optionsCancellation={optionsCancellation}/>
            </div>
        </>
    );
};

export default DetailsButton;