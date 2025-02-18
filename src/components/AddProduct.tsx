"use client";

import { useForm, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRef, useState } from "react";
import { Product, productSchema } from "@/schemas/productSchema";
import { CategoryTree } from "@/schemas/categorySchema";

export default function AddProductForm() {
  const selectedCategoriesRef = useRef<(string | null)[]>([]);
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
      selectedCategoriesRef.current = [];
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  const [categories] = api.category.getAll.useSuspenseQuery();

  const onSubmit = (data: Product) => {
    addProduct.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-4 rounded-lg shadow-sm"
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
        <label className="text-sm font-medium">Price (BDT)</label>
        <Input
          type="number"
          {...register("price", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)), // Convert to number
            valueAsNumber: true, // Ensures input is treated as a number
          })}
          placeholder="Enter product price"
        />
        {errors.price && (
          <p className="text-sm text-red-500">{errors.price.message}</p>
        )}
      </div>

      {/* Category Selection */}
      <div>
        <label className="text-sm font-medium">Category</label>
        {/* <CategorySelector
          setValue={setValue}
          categories={categories}
          placeholder="Select Category"
        /> */}
        <CategorySelector
          setValue={setValue}
          categories={categories}
          placeholder="Select Category"
          selectedCategoriesRef={selectedCategoriesRef}
          onCategoryChange={(level) => {
            selectedCategoriesRef.current = selectedCategoriesRef.current.slice(
              0,
              level + 1,
            );
          }}
        />
        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting} className="w-96">
        {isSubmitting ? "Adding..." : "Add Product"}
      </Button>
    </form>
  );
}

function CategorySelector({
  setValue,
  categories,
  placeholder,
  depth = 0, // Tracks category level
  selectedCategoriesRef, // Ref to store the category selection path
  onCategoryChange, // Function to reset child selection
}: {
  setValue: UseFormSetValue<Product>;
  categories: CategoryTree[];
  placeholder: string;
  depth?: number;
  selectedCategoriesRef: React.MutableRefObject<(string | null)[]>;
  onCategoryChange?: (level: number) => void;
}) {
  const [subCategories, setSubCategories] = useState<CategoryTree[]>([]);

  return (
    <>
      <Select
        onValueChange={(value) => {
          setValue("categoryId", value);

          // Find selected category
          const category = categories.find((cat) => cat.id === value);
          setSubCategories(category?.subcategories ?? []);

          // Update ref with selected category at current depth
          selectedCategoriesRef.current[depth] = value;

          // Reset all selections beyond this level
          if (onCategoryChange) onCategoryChange(depth);
        }}
        value={selectedCategoriesRef.current[depth] ?? ""}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Render child selector if subcategories exist */}
      {subCategories.length > 0 && selectedCategoriesRef.current[depth] && (
        <div className="my-4">
          <CategorySelector
            placeholder="Select subcategory"
            setValue={setValue}
            categories={subCategories}
            depth={depth + 1}
            selectedCategoriesRef={selectedCategoriesRef}
            onCategoryChange={(level) => {
              // Reset all selections below this level
              selectedCategoriesRef.current =
                selectedCategoriesRef.current.slice(0, level + 1);
            }}
          />
        </div>
      )}
    </>
  );
}

// function CategorySelector({
//   setValue,
//   categories,
//   placeholder,
// }: {
//   setValue: UseFormSetValue<Product>;
//   categories: CategoryTree[];
//   placeholder: string;
// }) {
//   const [subCategories, setSubCategories] = useState<CategoryTree[]>([]);
//   return (
//     <>
//       <Select
//         onValueChange={(value) => {
//           setValue("categoryId", value);
//           const category = categories.find((cat) => cat.id === value);
//           setSubCategories(category?.subcategories ?? []);
//         }}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder={placeholder} />
//         </SelectTrigger>
//         <SelectContent>
//           {categories.map((cat) => (
//             <SelectItem key={cat.id} value={cat.id}>
//               {cat.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//       {subCategories.length > 0 && (
//         <div className="my-4">
//           <CategorySelector
//             placeholder="Select subcategory"
//             setValue={setValue}
//             categories={subCategories}
//           />
//         </div>
//       )}
//     </>
//   );
// }
