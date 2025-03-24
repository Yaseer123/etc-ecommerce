"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useEffect, useRef, useState } from "react";
import RichEditor from "../rich-editor";
import { v4 as uuid } from "uuid";
import { Label } from "../ui/label";
import DndImageGallery from "../rich-editor/DndImageGallery";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import PreSelectedCategory from "./PreSelectedCategory";
import { renameImages } from "@/app/actions/file";
import { useProductImageStore } from "@/context/admin-context/ProductImageProvider";

export default function EditProductForm({ productId }: { productId: string }) {
  const [product] = api.product.getProductByIdAdmin.useSuspenseQuery({
    id: productId,
  });

  const router = useRouter();
  const selectedCategoriesRef = useRef<(string | null)[]>([]);

  const [title, setTitle] = useState(product?.title ?? "");
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription ?? "",
  );
  const [price, setPrice] = useState(product?.price ?? 0);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [pending, setPending] = useState(false);
  const [imageId] = useState(product?.imageId ?? uuid());
  const [descriptionImageId] = useState(product?.descriptionImageId ?? uuid());
  const [categoryId, setCategoryId] = useState<string>(
    product?.categoryId ?? "",
  );

  const [specifications, setSpecifications] = useState<Record<string, string>>(
    (product?.attributes as Record<string, string>) ?? {},
  );

  const { loadImages, images } = useProductImageStore();

  const [showImageGallery, setShowImageGallery] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        await loadImages(imageId);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    })();
  }, [loadImages, imageId]);

  const handleShowImageGallery = (state: string) => {
    setShowImageGallery(state);
  };

  useEffect(() => {
    const name = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setSlug(name);
  }, [setSlug, title]);

  const addProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      selectedCategoriesRef.current = [];
      router.push("/admin/product");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
    onSettled: () => {
      setPending(false);
    },
  });

  const handleAddSpecification = () => {
    setSpecifications((prev) => ({
      ...prev,
      "": "", // Add an empty key-value pair
    }));
  };

  const handleSpecificationChange = (
    key: string,
    value: string,
    isKey: boolean,
  ) => {
    setSpecifications((prev) => {
      const updated = { ...prev };
      if (isKey) {
        // Handle key change
        const existingValue = updated[key] ?? "";
        delete updated[key];
        updated[value] = existingValue;
      } else {
        // Handle value change
        updated[key] = value;
      }
      return updated;
    });
  };

  const handleRemoveSpecification = (key: string) => {
    setSpecifications((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleSubmit = async (content: string) => {
    setPending(true);
    await renameImages(images);
    addProduct.mutate({
      id: productId,
      imageId,
      descriptionImageId,
      title,
      shortDescription,
      price,
      slug,
      categoryId: categoryId,
      description: content,
      attributes: specifications, // Pass updated specifications as JSON
    });
  };

  if (!product) return null;

  return (
    <RichEditor
      content={product.description ?? ""}
      handleSubmit={handleSubmit}
      imageId={descriptionImageId}
      pending={pending}
      submitButtonText="Update Product"
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
          <PreSelectedCategory
            targetCategory={categoryId}
            setCategoryId={setCategoryId}
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
        <div className="col-span-2">
          <Label>Specifications</Label>
          <div className="space-y-2">
            {Object.entries(specifications).map(([key, value], index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Key"
                  value={key}
                  onChange={(e) =>
                    handleSpecificationChange(key, e.target.value, true)
                  }
                />
                <Input
                  type="text"
                  placeholder="Value"
                  value={value}
                  onChange={(e) =>
                    handleSpecificationChange(key, e.target.value, false)
                  }
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveSpecification(key)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={handleAddSpecification}>Add Specification</Button>
          </div>
        </div>
      </div>
    </RichEditor>
  );
}
