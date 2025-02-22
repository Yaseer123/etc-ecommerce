"use client";

import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";
import { api } from "@/trpc/react";

export default function ProductDataTable() {
  const [productsWithCategory] =
    api.product.getProductWithCategoryName.useSuspenseQuery();
  return (
    <DataTable
      columns={columns}
      data={productsWithCategory}
      addButton={{ name: "Add Product", href: "/admin/product/add" }}
    />
  );
}
