import { columnsBlockedUsers } from "@/components/blockedUsers/columnsBlockedUsers";
import { DataTable } from "@/components/dashboard/DataTable";

export default function BlockedUsersPage() {
  return (
    <div className="mt-6">
      <DataTable columns={columnsBlockedUsers} data={[]} hasHeaderNumberOfRows={true} contentHeaderNumberOfRows="Usuários Bloqueados" />
    </div>
  );
}