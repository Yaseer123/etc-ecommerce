"use client";

import React from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTableColumnHeader } from "@/components/admin-components/DataTableColumnHeader";
import type { Category, Product, StockStatus } from "@prisma/client";
import Link from "next/link";
import { StockStatusModal } from "./StockStatusModal";
import { api } from "@/trpc/react";
import { toast } from "sonner";

// Create a separate component for the actions cell
function ActionCell({ product }: { product: ProductColumns }) {
  const [isStockModalOpen, setIsStockModalOpen] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const utils = api.useUtils();

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted", {
        description: `The product "${product.title}" was successfully deleted.`,
      });
      void utils.product.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Error", {
        description: `Failed to delete product: ${error.message}`,
      });
    },
  });

  const handleDelete = () => {
    deleteProduct.mutate({ id: product.id });
    setIsDeleteAlertOpen(false);
  };

  return (
    <>
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
          <DropdownMenuItem onClick={() => setIsStockModalOpen(true)}>
            Change Stock Status
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/admin/product/edit/${product.id}`}>Edit product</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteAlertOpen(true)}
            className="text-red-600"
          >
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StockStatusModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        productId={product.id}
        currentStatus={product.stockStatus}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product &quot;{product.title}&quot; and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red/90 hover:bg-red/100"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export interface ProductColumns extends Product {
  category: Category | null;
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
    accessorKey: "stockStatus",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Stock Status" />;
    },
    cell: ({ row }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const status = row.getValue("stockStatus") as StockStatus;

      // Define styles based on status
      let badgeStyle = {};
      let dotStyle = {};
      let label = "Unknown";

      if (status === "IN_STOCK") {
        badgeStyle = {
          backgroundColor: "rgba(220, 252, 231, 1)", // light green
          color: "rgba(22, 101, 52, 1)", // dark green
        };
        dotStyle = { backgroundColor: "rgba(34, 197, 94, 1)" }; // green-500
        label = "In Stock";
      } else if (status === "OUT_OF_STOCK") {
        badgeStyle = {
          backgroundColor: "rgba(254, 226, 226, 1)", // light red
          color: "rgba(153, 27, 27, 1)", // dark red
        };
        dotStyle = { backgroundColor: "rgba(239, 68, 68, 1)" }; // red-500
        label = "Out of Stock";
      } else if (status === "PRE_ORDER") {
        badgeStyle = {
          backgroundColor: "rgba(219, 234, 254, 1)", // light blue
          color: "rgba(30, 64, 175, 1)", // dark blue
        };
        dotStyle = { backgroundColor: "rgba(59, 130, 246, 1)" }; // blue-500
        label = "Pre Order";
      }

      const badgeContainerStyle = {
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        padding: "0.125rem 0.625rem",
        fontSize: "0.75rem",
        fontWeight: 500,
        ...badgeStyle,
      };

      const dotContainerStyle = {
        width: "0.5rem",
        height: "0.5rem",
        borderRadius: "9999px",
        marginRight: "0.25rem",
        ...dotStyle,
      };

      return (
        <div style={badgeContainerStyle}>
          <span style={dotContainerStyle}></span>
          {label}
        </div>
      );
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
      return <ActionCell product={product} />;
    },
  },
];
