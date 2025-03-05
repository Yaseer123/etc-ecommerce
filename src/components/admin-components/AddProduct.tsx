"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { type CategoryTree } from "@/schemas/categorySchema";
import RichEditor from "../rich-editor";
import { v4 as uuid } from "uuid";
import { Label } from "../ui/label";
import DndImageGallery from "../rich-editor/DndImageGallery";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { renameImages } from "@/app/actions/file";
import { useProductImageStore } from "@/context/admin-context/ProductImageProvider";

export default function AddProductForm() {
  const router = useRouter();
  const selectedCategoriesRef = useRef<(string | null)[]>([]);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [slug, setSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [imageId] = useState(uuid());
  const [descriptionImageId] = useState(uuid());
  const [categoryId, setCategoryId] = useState<string>("");

  const [showImageGallery, setShowImageGallery] = useState("");
  const { loadImages, images } = useProductImageStore();

  const handleShowImageGallery = (state: string) => {
    setShowImageGallery(state);
  };

  useEffect(() => {
    void (async () => {
      try {
        await loadImages(imageId);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    })();
  }, [loadImages, imageId]);

  useEffect(() => {
    const name = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setSlug(name);
  }, [setSlug, title]);

  const addProduct = api.product.add.useMutation({
    onSuccess: () => {
      toast.success("Product added successfully");
      selectedCategoriesRef.current = [];
      router.push("/admin/product");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product");
    },
    onSettled: () => {
      setPending(false);
    },
  });

  const [categories] = api.category.getAll.useSuspenseQuery();

  const handleSubmit = async (content: string) => {
    setPending(true);
    await renameImages(images);
    addProduct.mutate({
      imageId,
      descriptionImageId,
      title,
      shortDescription,
      price,
      slug,
      categoryId: categoryId,
      description: content,
    });
  };

  return (
    <RichEditor
      content=""
      handleSubmit={handleSubmit}
      imageId={descriptionImageId}
      pending={pending}
      submitButtonText="Add New Product"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Product Title</Label>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div>
          <Label>Short Description</Label>
          <Textarea
            placeholder="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <CategorySelector
            setCategoryId={setCategoryId}
            categories={categories}
            placeholder="Select Category"
            selectedCategoriesRef={selectedCategoriesRef}
            onCategoryChange={(level) => {
              selectedCategoriesRef.current =
                selectedCategoriesRef.current.slice(0, level + 1);
            }}
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="mt-auto flex flex-col gap-y-1">
          <Label>Images</Label>
          <Button onClick={() => handleShowImageGallery(imageId)}>
            Show Image Gallery
          </Button>
          {showImageGallery && (
            <DndImageGallery
              imageId={imageId}
              onClose={handleShowImageGallery}
            />
          )}
        </div>
      </div>
    </RichEditor>
  );
}

function CategorySelector({
  setCategoryId,
  categories,
  placeholder,
  depth = 0, // Tracks category level
  selectedCategoriesRef, // Ref to store the category selection path
  onCategoryChange, // Function to reset child selection
}: {
  setCategoryId: Dispatch<SetStateAction<string>>;
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
          setCategoryId(value);

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
            setCategoryId={setCategoryId}
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
