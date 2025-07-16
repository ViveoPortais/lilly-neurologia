"use client";
import { ColumnDef } from "@tanstack/react-table";
import { HiCheck } from "react-icons/hi";
import { FaCircle } from "react-icons/fa";
import { useState } from "react";
import DesbloquearUsuarioModal from "./DesbloquearUsuarioModal";
import GenericModalForm from "../modals/GenericModalForm";
import { IBlockedUser } from "@/types/user";
import dayjs from "dayjs";

export const columnsBlockedUsers: ColumnDef<IBlockedUser>[] = [
  {
    accessorKey: "dateCreate",
    header: "Data do Cadastro",
    cell: ({ row }) => dayjs(row.original.dateCreate).format("DD/MM/YYYY HH:mm"),
  },
  {
    accessorKey: "userEmail",
    header: "E-mail do Usuário",
    cell: ({ row }) => row.original.userEmail,
  },
  {
    accessorKey: "reasonStateCode",
    header: "Motivo",
    cell: ({ row }) => {
      const motivo = row.original.reasonStateCode;

      return <span title={motivo}>{motivo}</span>;
    },
  },
  {
    accessorKey: "dateAccessTry",
    header: "Data da Tentativa",
    cell: ({ row }) => dayjs(row.original.dateAccessTry).format("DD/MM/YYYY HH:mm"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <div className="flex items-center gap-2">
          <FaCircle className={`text-${status === "Bloqueado" ? "mainlilly" : "green"} text-xs`} />
          {status === "Bloqueado" ? "Bloqueado" : "Ativo"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      return row.original.status === "Bloqueado" ? (
        <>
          <HiCheck className="text-red-600 cursor-pointer" onClick={() => setOpen(true)} />
          {open && (
            <GenericModalForm title="Desbloquear Usuário" isOpen onClose={() => setOpen(false)}>
              <DesbloquearUsuarioModal user={row.original} onClose={() => setOpen(false)} />
            </GenericModalForm>
          )}
        </>
      ) : null;
    },
  },
];