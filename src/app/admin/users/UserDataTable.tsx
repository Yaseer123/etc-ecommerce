"use client";

import { api } from "@/trpc/react";
import { columns } from "@/app/admin/users/Columns";
import { DataTable } from "@/components/DataTable";

export default function UserDataTable() {
  const [users] = api.user.getAll.useSuspenseQuery();

  return <DataTable columns={columns} data={users} />;
}
