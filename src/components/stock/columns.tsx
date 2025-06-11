import CircleStatusCustom from "@/components/custom/CircleStatusCustom";
import { IDiagnosticExamModel } from "@/types/diagnostic";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import StatusCustom from "../custom/StatusCustom";
import { IStockModel } from "@/types/logistics";

export const columns: ColumnDef<IStockModel>[] = [
    {
        accessorKey: "logisticsStuff.name",
        header: "Equipamento",
        cell: ({ row }) => {
            return row.original.logisticsStuff?.name;
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantidade Recebida",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            return row.original.quantity;
        },
    },
    {
        accessorKey: "finalQuantity",
        header: "Quantidade em Estoque",
        cell: ({ row }) => {
            return row.original.finalQuantity;
        }
    },
    {
        accessorKey: "expirationDate",
        header: "Validade do Lote",
        cell: ({ row }) => {
            const date = row.original.expirationDate;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        }
    },
    {
        accessorKey: "createdOn",
        header: "Data do Recebimento",
        meta: {
            hideOnMobile: true
        },
        cell: ({ row }) => {
            const date = row.original.createdOn;
            return date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "";
        },
    },

]
