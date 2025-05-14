import CircleStatusCustom from "@/components/custom/CircleStatusCustom";
import {IHealthProfessionalByProgramDoctorByProgram } from "@/types/professions";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import AproveReproveButtons from "./AproveReproveButtons";
import DeleteButton from "./DeleteButton";


export const columnsDoctor: ColumnDef<IHealthProfessionalByProgramDoctorByProgram>[] = [
    {
        accessorKey : "id",
        header :"Aprovar/Reprovar",
        cell : ({row}) =>{
            const { statusCodeStringMap ,id } = row.original;
            switch(statusCodeStringMap.flag){
                case "#PENDENT":
                    return (
                        <div>
                            <AproveReproveButtons id={id}/>
                        </div>
                    );
                case "#ACTV":
                    return(
                        <div>
                            <DeleteButton id={id}/>
                        </div>
                    )
            }
            
        },
    },
    {
        accessorKey : "requestDate",
        header : "Data Solicitação",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const date = row.original.createdOn;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
    {
        accessorKey : "healthProfessionalByProgram.name",
        header : "Nome do Profissional",
        cell : ({row}) =>{
            return row.original.healthProfessionalByProgram.name;
        }
    },
    {
        accessorKey : "professionalEmail",
        header : "Email do Profissional",
        cell : ({row}) =>{
            return row.original.healthProfessionalByProgram.emailAddress1;
        }
    },
    {
        accessorKey : "status",
        header : "Status",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const { statusCodeStringMap } = row.original;
            let color = "";

            switch(statusCodeStringMap.flag){
                case "#PENDENT":
                    color = "bg-yellow-400";
                    break;
                case "#IACTV":
                case "#REJECTED":
                    color = "bg-red-600"
                    break;
                case "#ACTV":
                    color = "bg-green-500"
                break;
            }
        
            return (
                <div className="flex items-center gap-2">
                    <CircleStatusCustom color={color} />
                    <span>{statusCodeStringMap.optionName}</span>
               </div>
            );
          },
    },
    {
        accessorKey : "aproveDate",
        header : "Data de Aprovação",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const date = row.original.aproveDate;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
]

export const columnsProfessional: ColumnDef<IHealthProfessionalByProgramDoctorByProgram>[] = [
    {
        accessorKey : "id",
        header :"Remover vínculo",
        cell : ({row}) =>{
            const { statusCodeStringMap,id } = row.original;
            switch(statusCodeStringMap.flag){
                case "#ACTV":
                    return(
                        <div>
                            <DeleteButton id={id}/>
                        </div>
                    )
            }
            
        },
    },
    {
        accessorKey : "requestDate",
        header : "Data Solicitação",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const date = row.original.createdOn;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
    {
        accessorKey : "doctorByProgram.name",
        header : "Nome do Médico",
        cell : ({row}) =>{
            return row.original.doctorByProgram.name;
        }
    },
    {
        accessorKey : "licenseNumber",
        header : "CRM",
        cell : ({row}) =>{
            return row.original.doctorByProgram.licenseNumber;
        }
    },
    {
        accessorKey : "doctorByProgram.licenseState",
        header : "UF",
        cell : ({row}) =>{
            return row.original.doctorByProgram.licenseState;
        }
    },
    {
        accessorKey : "status",
        header : "Status",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const { statusCodeStringMap } = row.original;
            let color = "";

            switch(statusCodeStringMap.flag){
                case "#PENDENT":
                    color = "bg-yellow-400";
                    break;
                case "#IACTV":
                case "#REJECTED":
                    color = "bg-red-600"
                    break;
                case "#ACTV":
                    color = "bg-green-500"
                break;
            }
        
            return (
                <div className="flex items-center gap-2">
                    <CircleStatusCustom color={color} />
                    <span>{statusCodeStringMap.optionName}</span>
               </div>
            );
          },
    },
    {
        accessorKey : "aproveDate",
        header : "Data de Aprovação",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const date = row.original.aproveDate;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
    {
        accessorKey : "reproveDate",
        header : "Data de Exclusão",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const date = row.original.reproveDate;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },
]