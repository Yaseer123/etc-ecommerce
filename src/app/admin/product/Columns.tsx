"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { type Product } from "@prisma/client";
import Link from "next/link";

export interface ProductColumns extends Product {
  category: {
    name: string;
  } | null;
}

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Price" />;
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price")).toFixed(2);
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "BDT",
      //   currencySign: "accounting",
      // }).format(price);

      return <div className="text-right font-medium">{price}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    accessorFn: (row) => row.category?.name ?? "No Category",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={async () =>
                await navigator.clipboard.writeText(product.id)
              }
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/admin/product/edit/${product.id}`}>
                Edit product
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
