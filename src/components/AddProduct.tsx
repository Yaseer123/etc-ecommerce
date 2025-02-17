"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/trpc/react";

// Define form validation schema
const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive("Price must be a positive number"),
  ),
  categoryId: z.string().min(1, "Category is required"),
});

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const addProduct = api.product.add.useMutation({
    onSuccess: () => {
      toast.success("Product added successfully");
      reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  const [categories, setCategories] = useState([
    { id: "cat1", name: "Electronics" },
    { id: "cat2", name: "Home & Kitchen" },
    { id: "cat3", name: "Fashion" },
  ]);

  const onSubmit = (data) => {
    addProduct.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-4 rounded-lg border p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold">Add New Product</h2>

      {/* Product Name */}
      <div>
        <label className="text-sm font-medium">Product Name</label>
        <Input {...register("name")} placeholder="Enter product name" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register("description")}
          placeholder="Enter product description"
        />
      </div>

      {/* Price */}
      <div>
        <label className="text-sm font-medium">Price ($)</label>
        <Input
          type="number"
          {...register("price")}
          placeholder="Enter product price"
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select onValueChange={(value) => setValue("categoryId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Adding..." : "Add Product"}
      </Button>
    </form>
  );
}
