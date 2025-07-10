"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { DataTable } from "@/components/dashboard/DataTable";
import { columnsBlockedUsers } from "@/components/blockedUsers/columnsBlockedUsers";
import useSession from "@/hooks/useSession";
import { fetchBlockedUsers } from "@/store/slices/blockedUserSlice";

export default function BlockedUsersPage() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((state) => state.blockedUsers);
  const auth = useSession();

  useEffect(() => {
    dispatch(fetchBlockedUsers());
  }, [dispatch]);

  return (
    <div className="mt-6">
      <DataTable columns={columnsBlockedUsers} data={data} hasHeaderNumberOfRows contentHeaderNumberOfRows="Usuários Bloqueados" isLoading={loading} />
    </div>
  );
}