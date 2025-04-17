import { api } from "@/trpc/server";
import { columns } from "@/app/admin/user/Columns";
import { DataTable } from "@/components/admin-components/DataTable";

export default async function UserDataTable() {
  const data = await api.user.getAll();

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceHolder="Filter users by name"
    />
  );
}
