"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import type { ProductWithCategory } from "@/types/ProductType";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Eye,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { FeaturedProductModal } from "./FeaturedProductModal";

export default function ProductDataTable() {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = React.useState("position");

  // Reset to page 1 on search or pageSize change
  React.useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const { data, isLoading } = api.product.getAll.useQuery({
    page,
    limit: pageSize,
    search,
    sort,
  });
  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const utils = api.useUtils();
  const updatePositions = api.product.updateProductPositions.useMutation({
    onSuccess: () => {
      toast.success("Product order updated");
      void utils.product.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to update order", { description: error.message });
    },
  });

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted");
      void utils.product.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to delete product", { description: error.message });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const filteredProducts = React.useMemo(() => {
    const base = products.map((product) => ({
      ...(product as ProductWithCategory),
      category: (product as ProductWithCategory).category ?? null,
      featured:
        typeof product.featured === "boolean" ? product.featured : false,
    }));
    return base;
  }, [products]);

  // Pagination helpers
  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, total);
  const pageNumbers = React.useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const handleDelete = (productId: string) => {
    deleteProduct.mutate({ id: productId });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = filteredProducts.findIndex(
        (item) => item.id === active.id,
      );
      const newIndex = filteredProducts.findIndex(
        (item) => item.id === over.id,
      );
      const newItems = arrayMove(filteredProducts, oldIndex, newIndex);
      updatePositions.mutate({
        positions: newItems.map((item, idx) => ({
          id: item.id,
          position: idx,
        })),
      });
    }
  };

  function SortableRow({
    product,
  }: {
    product: ProductWithCategory & { featured: boolean };
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: product.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 1 : 0,
    };
    const [isFeaturedModalOpen, setIsFeaturedModalOpen] = React.useState(false);
    return (
      <TableRow ref={setNodeRef} style={style} {...attributes}>
        <TableCell
          {...listeners}
          style={{ cursor: "grab", width: 32, textAlign: "center" }}
        >
          <MoreHorizontal className="text-gray-400" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-md">
              <Image
                src={product.images[0] ?? "/placeholder.png"}
                alt={product.title}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{product.title}</p>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>৳{product.price.toFixed(2)}</TableCell>
        <TableCell>
          <Badge
            variant={
              product.stockStatus === "IN_STOCK"
                ? "success"
                : product.stockStatus === "OUT_OF_STOCK"
                  ? "destructive"
                  : "outline"
            }
          >
            {product.stockStatus.replace("_", " ")}
          </Badge>
        </TableCell>
        <TableCell>{product.category?.name ?? "Uncategorized"}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsFeaturedModalOpen(true)}>
                {product.featured ? "Remove from Featured" : "Add to Featured"}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/product/edit/${product.id}`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete product
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/products/${product.slug}?id=${product.id}`}
                  target="_blank"
                >
                  <Eye className="mr-2 h-4 w-4" /> View on site
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FeaturedProductModal
            isOpen={isFeaturedModalOpen}
            onClose={() => setIsFeaturedModalOpen(false)}
            productId={product.id}
            currentFeaturedStatus={product.featured}
          />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">All Products</h2>
            <p className="text-sm text-muted-foreground">
              Manage all products in your store
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/featured-products")}
          >
            <Star className="mr-2 h-4 w-4" /> Featured Products
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/product/add")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Products ({total})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <select
              className="rounded border px-2 py-1 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="position">Sort: Position</option>
              <option value="titleAsc">Title A-Z</option>
              <option value="titleDesc">Title Z-A</option>
              <option value="priceAsc">Price Low-High</option>
              <option value="priceDesc">Price High-Low</option>
            </select>
            <select
              className="rounded border px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
            <Button onClick={() => router.push("/admin/product/add")} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-96 w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-96 w-full flex-col items-center justify-center gap-2">
              <Plus className="h-10 w-10 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">
                {search ? "No products match your search" : "No products found"}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/product/add")}
                className="mt-2"
              >
                Add Product
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredProducts.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead style={{ width: 32 }}></TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <SortableRow key={product.id} product={product} />
                        ))}
                      </TableBody>
                    </Table>
                  </SortableContext>
                </DndContext>
              </div>
              {/* Pagination Info and Controls */}
              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIdx}-{endIdx} of {total} results
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </Button>
                  {pageNumbers.map((num) => (
                    <Button
                      key={num}
                      variant={num === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(num)}
                      className={num === page ? "font-bold" : ""}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
