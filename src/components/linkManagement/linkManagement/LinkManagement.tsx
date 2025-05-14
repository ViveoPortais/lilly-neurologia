import { DataTable } from "@/components/dashboard/DataTable";
import { columnsDoctor, columnsProfessional } from "./columns";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHealthProfessionalByProgramDoctorByPrograms } from "@/store/slices/linkManagementeSlice";
import ModalAddLink from "../modalAddLink/ModalAddLink";
import { Loading } from "@/components/custom/Loading";


export default function LinkManagement() {

    const dispatch = useAppDispatch();
    const auth = useSession();
    const healthProfessionalByProgramDoctorByPrograms = useAppSelector((state) => state.linkManagement.data.healthProfessionalByProgramDoctorByPrograms);

    let contentHeaderByProfile = "";

    switch (auth.role) {
        case "doctor":
            contentHeaderByProfile = "Total de assistentes vinculados"
            break;
        case "professional":
            contentHeaderByProfile = "Total de médicos vinculados"
            break;
        default:
            contentHeaderByProfile = "Total de vínculos"
            break;
    }

    useEffect(() => {
        dispatch(fetchHealthProfessionalByProgramDoctorByPrograms());
    }, [dispatch]);


    return (
        <>
            {auth.role === "professional" &&
                (
                    <div className="mb-6">
                        <ModalAddLink />
                    </div>
                )
            }
            <div>
                <DataTable
                    columns={auth.role == 'doctor' ? columnsDoctor : columnsProfessional}
                    data={healthProfessionalByProgramDoctorByPrograms}
                    hasHeaderNumberOfRows={true}
                    contentHeaderNumberOfRows={contentHeaderByProfile}
                />
            </div>
        </>);
}