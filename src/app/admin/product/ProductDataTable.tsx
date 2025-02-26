"use client";

import { DataTable } from "@/components/DataTable";
import { columns } from "./Columns";
import { api } from "@/trpc/react";

export default function ProductDataTable() {
  const [productsWithCategory] =
    api.product.getProductWithCategoryName.useSuspenseQuery();

  const mappedData = productsWithCategory.map((product) => ({
    ...product,
    descriptionImageId: product.descriptionImageId ?? null,
  }));

  return (
    <DataTable
      columns={columns}
      data={mappedData}
      addButton={{ name: "Add Product", href: "/admin/product/add" }}
      filterBy="title"
    />
  );
}
