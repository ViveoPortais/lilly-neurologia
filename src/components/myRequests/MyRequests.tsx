"use client";

import { DataTable } from "@/components/dashboard/DataTable";
import { columns } from "./columns";
import { useEffect } from "react";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms } from "@/store/slices/linkManagementeSlice";
import { useLoading } from "@/contexts/LoadingContext";
import { fetchMyDiagnostics } from "@/store/slices/diagnosticSlice";
import { IDiagnosticFilterModel } from "@/types/diagnostic";
import Filter from "./Filter";
import { fetchStringMaps } from "@/store/slices/basicSlice";


export default function MyRequests() {

    const dispatch = useAppDispatch();
    const myExams = useAppSelector((state) => state.diagnostic.data.myExams);
    const loading = useAppSelector((state) => state.diagnostic.loading);

    const { show, hide } = useLoading();

    useEffect(() => {
        if (loading)
            show()
        else
            hide()
    }, [loading])

    useEffect(() => {
        const filterDiagnostic: IDiagnosticFilterModel = {}
        dispatch(fetchMyDiagnostics({ filterDiagnostic: filterDiagnostic }));

    }, [dispatch]);


    return (
        <>
            <div>
                <Filter />
            </div>
            <div>
                <DataTable
                    columns={columns}
                    data={myExams}
                    hasHeaderNumberOfRows={true}
                    contentHeaderNumberOfRows={"Total de pacientes cadastrados"}
                />
            </div>
        </>);
}