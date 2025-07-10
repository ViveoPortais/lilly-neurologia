"use client";
import { ColumnDef } from "@tanstack/react-table";
import { HiCheck } from "react-icons/hi";
import { FaCircle } from "react-icons/fa";
import { useState } from "react";
import DesbloquearUsuarioModal from "./DesbloquearUsuarioModal";
import GenericModalForm from "../modals/GenericModalForm";
import { IBlockedUser } from "@/types/user";

export const columnsBlockedUsers: ColumnDef<IBlockedUser>[] = [
  {
    accessorKey: "dateCreate",
    header: "Data do Cadastro",
    cell: ({ row }) => row.original.dateCreate,
  },
  {
    accessorKey: "userEmail",
    header: "E-mail do Usuário",
    cell: ({ row }) => row.original.userEmail,
  },
  {
    accessorKey: "reasonStateCode",
    header: "Motivo",
    cell: ({ row }) => row.original.reasonStateCode,
  },
  {
    accessorKey: "dateAccessTry",
    header: "Data da Tentativa",
    cell: ({ row }) => row.original.dateAccessTry,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <div className="flex items-center gap-2">
          <FaCircle className={`text-[${status === "blocked" ? "red" : "green"}] text-xs`} />
          {status === "blocked" ? "Bloqueado" : "Ativo"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      return row.original.status === "blocked" ? (
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