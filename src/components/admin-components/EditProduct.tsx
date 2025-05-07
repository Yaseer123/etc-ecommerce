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
import { useProductImageStore } from "@/context/ProductImageProvider";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryAttribute } from "@/schemas/categorySchema";

// Sortable item component for specifications
function SortableSpecificationItem({
  id,
  spec,
  index,
  onRemove,
  onChange,
}: {
  id: string;
  spec: { key: string; value: string };
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, field: "key" | "value", value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 flex items-center gap-2 rounded-md bg-gray-50 p-2"
    >
      <div {...attributes} {...listeners} className="cursor-grab touch-none">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Key"
        value={spec.key}
        onChange={(e) => onChange(index, "key", e.target.value)}
      />
      <Input
        type="text"
        placeholder="Value"
        value={spec.value}
        onChange={(e) => onChange(index, "value", e.target.value)}
      />
      <Button variant="destructive" onClick={() => onRemove(index)}>
        Remove
      </Button>
    </div>
  );
}

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
  const [discountedPrice, setDiscountedPrice] = useState<number>(
    Number(product?.discountedPrice ?? 0),
  );
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [pending, setPending] = useState(false);
  const [imageId] = useState(product?.imageId ?? uuid());
  const [descriptionImageId] = useState(product?.descriptionImageId ?? uuid());
  const [categoryId, setCategoryId] = useState<string>(
    product?.categoryId ?? "",
  );
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<
    number | undefined
  >(product?.estimatedDeliveryTime ?? undefined);
  // Remove the published state

  // Add states for category attributes
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<
    Record<string, string | number | boolean>
  >({});

  // Convert specifications object to array format for drag and drop
  const [specifications, setSpecifications] = useState<
    Array<{ key: string; value: string }>
  >(() => {
    const attrs = product?.attributes as Record<string, string> | undefined;
    return attrs
      ? Object.entries(attrs).map(([key, value]) => ({ key, value }))
      : [];
  });

  const { loadImages, images } = useProductImageStore();
  const [showImageGallery, setShowImageGallery] = useState("");

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Load category attributes when component mounts or category changes
  const [categories] = api.category.getAll.useSuspenseQuery();

  useEffect(() => {
    if (categoryId) {
      // Find the category in the tree structure
      const findCategory = (
        cats: typeof categories,
        id: string,
      ): (typeof categories)[0] | undefined => {
        for (const category of cats) {
          if (category.id === id) {
            return category;
          }
          if (category.subcategories?.length) {
            const found = findCategory(category.subcategories, id);
            if (found) return found;
          }
        }
        return undefined;
      };

      const category = findCategory(categories, categoryId);

      if (category?.attributes) {
        // Handle both string and array formats for attributes
        if (typeof category.attributes === "string") {
          try {
            const parsedAttributes = JSON.parse(
              category.attributes,
            ) as CategoryAttribute[];
            setAttributes(parsedAttributes);
          } catch (error) {
            console.error("Failed to parse category attributes:", error);
            setAttributes([]);
          }
        } else if (Array.isArray(category.attributes)) {
          setAttributes(category.attributes);
        } else {
          setAttributes([]);
        }
      } else {
        setAttributes([]);
      }
    }
  }, [categoryId, categories]);

  // Initialize attribute values from product data
  useEffect(() => {
    if (product?.attributes) {
      // Check if there are any category attributes in the existing product
      const productData = product.attributes as {
        categoryAttributes?: Record<string, string | number | boolean>;
      };

      if (productData.categoryAttributes) {
        setAttributeValues(productData.categoryAttributes);
      }
    }
  }, [product]);

  // Initialize attributeValues when attributes change
  useEffect(() => {
    // Only run this effect when attributes change, not when attributeValues changes
    const initialValues: Record<string, string | number | boolean> = {};

    attributes.forEach((attr) => {
      // Check if we already have a value for this attribute from the product
      if (attributeValues[attr.name] !== undefined) {
        initialValues[attr.name] = attributeValues[attr.name] ?? "";
      } else if (
        attr.type === "select" &&
        attr.options &&
        attr.options.length > 0
      ) {
        initialValues[attr.name] = attr.options[0] ?? "";
      } else {
        initialValues[attr.name] = "";
      }
    });

    // Only update if there are differences to avoid infinite loops
    const needsUpdate = attributes.some(
      (attr) => initialValues[attr.name] !== attributeValues[attr.name],
    );

    if (needsUpdate) {
      setAttributeValues((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [attributeValues, attributes]); // Remove attributeValues from dependencies

  const handleAttributeChange = (
    name: string,
    value: string | number | boolean,
  ) => {
    setAttributeValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    void (async () => {
      try {
        if (imageId && product?.images) {
          await loadImages(imageId, product.images);
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    })();
  }, [loadImages, imageId, product?.images]);

  const handleShowImageGallery = (state: string) => {
    if (state) {
      // Clear previous images when opening gallery
      setShowImageGallery(state);

      // Load images for the new gallery
      void (async () => {
        try {
          await loadImages(state, product?.images ?? []);
        } catch (error) {
          console.error("Failed to load images for gallery:", error);
        }
      })();
    } else {
      setShowImageGallery("");
    }
  };

  useEffect(() => {
    const name = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setSlug(name);
  }, [setSlug, title]);

  const updateProduct = api.product.update.useMutation({
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
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleSpecificationChange = (
    index: number,
    fieldName: "key" | "value",
    value: string,
  ) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      const currentSpec = updated[index];
      if (!currentSpec) return updated;

      updated[index] = {
        key: fieldName === "key" ? value : currentSpec.key,
        value: fieldName === "value" ? value : currentSpec.value,
      };
      return updated;
    });
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSpecifications((items) => {
        const oldIndex = items.findIndex(
          (_, index) => `spec-${index}` === active.id,
        );
        const newIndex = items.findIndex(
          (_, index) => `spec-${index}` === over.id,
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSubmit = async (content: string) => {
    setPending(true);

    // Convert specifications array back to object for submission
    const specsObject = specifications.reduce(
      (acc, { key, value }) => {
        if (key) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    // Log the image order being submitted to database
    console.log(
      "Updating product with images in order:",
      images.map((img) => img.src),
    );

    updateProduct.mutate({
      id: productId,
      // Use ordered images from state - these reflect drag and drop ordering
      images: images.map((image) => image.src),
      descriptionImageId,
      title,
      shortDescription,
      price,
      discountedPrice,
      slug,
      categoryId: categoryId,
      description: content,
      attributes: specsObject, // Only include specifications here
      categoryAttributes: attributeValues, // Pass category attributes separately
      stock,
      brand,
      // Remove the published field
      estimatedDeliveryTime: estimatedDeliveryTime,
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
            value={price === 0 ? "" : price}
            onChange={(e) =>
              setPrice(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
        <div>
          <Label>Discounted Price</Label>
          <Input
            type="number"
            placeholder="Discounted Price"
            value={discountedPrice === 0 ? "" : discountedPrice}
            onChange={(e) =>
              setDiscountedPrice(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            placeholder="Stock"
            value={stock === 0 ? "" : stock}
            onChange={(e) =>
              setStock(e.target.value ? Number(e.target.value) : 0)
            }
          />
        </div>
        <div>
          <Label>Brand</Label>
          <Input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div>
          <Label>Estimated Delivery Time (Days)</Label>
          <Input
            type="number"
            placeholder="Delivery Time in Days"
            min="1"
            value={estimatedDeliveryTime ?? ""}
            onChange={(e) =>
              setEstimatedDeliveryTime(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>

        <div className="mt-auto flex flex-col gap-y-1">
          <Label>Images</Label>
          <div className="mb-4">
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

        {/* Category Attribute Fields */}
        {attributes.length > 0 && (
          <div className="col-span-2 mt-4">
            <h3 className="mb-3 text-lg font-medium">Category Attributes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {attributes.map((attr) => (
                <div key={attr.name} className="flex flex-col gap-2">
                  <Label htmlFor={attr.name}>
                    {attr.name}{" "}
                    {attr.required && <span className="text-red-500">*</span>}
                  </Label>

                  {attr.type === "select" && attr.options && (
                    <Select
                      value={attributeValues[attr.name]?.toString() ?? ""}
                      onValueChange={(value) =>
                        handleAttributeChange(attr.name, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${attr.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {attr.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="col-span-2">
          <Label>Specifications</Label>
          <div className="space-y-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={specifications.map((_, index) => `spec-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                {specifications.map((spec, index) => (
                  <SortableSpecificationItem
                    key={`spec-${index}`}
                    id={`spec-${index}`}
                    spec={spec}
                    index={index}
                    onChange={handleSpecificationChange}
                    onRemove={handleRemoveSpecification}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <Button onClick={handleAddSpecification}>Add Specification</Button>
          </div>
        </div>
      </div>
    </RichEditor>
  );
}
