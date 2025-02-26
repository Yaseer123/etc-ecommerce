"use client";

import { api } from "@/trpc/react";
import { columns } from "@/app/admin/user/Columns";
import { DataTable } from "@/components/DataTable";

export default function UserDataTable() {
  const [users] = api.user.getAll.useSuspenseQuery();

  return (
    <DataTable
      columns={columns}
      data={users}
      searchPlaceHolder="Filter users by name"
    />
  );
}
