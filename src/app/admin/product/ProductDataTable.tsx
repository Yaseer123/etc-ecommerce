"use client";

import { DataTable } from "@/components/admin-components/DataTable";
import { columns, type ProductColumns } from "./Columns";
import { api } from "@/trpc/react";

export default function ProductDataTable() {
  const [productsWithCategory] =
    api.product.getProductWithCategoryName.useSuspenseQuery();

  const mappedData = productsWithCategory.map((product) => ({
    ...product,
    descriptionImageId: product.descriptionImageId ?? null,
  }));

  return (
    <DataTable<ProductColumns>
      columns={columns}
      data={mappedData}
      addButton={{ name: "Add Product", href: "/admin/product/add" }}
      filterBy="title"
      searchPlaceHolder="Filter products by title"
    />
  );
}
