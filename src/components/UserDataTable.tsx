"use client";

import { api } from "@/trpc/react";
import { DataTable } from "./DataTable";
import { columns } from "@/app/admin/users/Columns";

export default function UserDataTable() {
  const [users] = api.user.getAll.useSuspenseQuery();

  return <DataTable columns={columns} data={users} />;
}
