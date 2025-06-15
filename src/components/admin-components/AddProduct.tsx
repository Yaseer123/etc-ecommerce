"use client";

import { uploadFile } from "@/app/actions/file";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProductImageStore } from "@/context/admin-context/ProductImageProvider";
import type { CategoryAttribute, CategoryTree } from "@/schemas/categorySchema";
import { productSchema } from "@/schemas/productSchema";
import { api } from "@/trpc/react";
import type { Variant } from "@/types/ProductType";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { IoMdClose } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import RichEditor from "../rich-editor";
import DndImageGallery from "../rich-editor/DndImageGallery";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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

export default function AddProductForm() {
  const router = useRouter();
  const selectedCategoriesRef = useRef<(string | null)[]>([]);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [slug, setSlug] = useState("");
  const [stock, setStock] = useState(0); // New state for stock
  const [brand, setBrand] = useState(""); // New state for brand
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState<
    number | undefined
  >(undefined);
  const [pending, setPending] = useState(false);
  const [imageId] = useState(uuid());
  const [descriptionImageId] = useState(uuid());
  const [categoryId, setCategoryId] = useState<string>("");
  const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
  const [attributeValues, setAttributeValues] = useState<
    Record<string, string | number | boolean>
  >({});

  const [showImageGallery, setShowImageGallery] = useState("");
  const { loadImages, images } = useProductImageStore();

  // Changed from Record to array of objects for drag and drop support
  const [specifications, setSpecifications] = useState<
    Array<{ key: string; value: string }>
  >([]);

  // Add state for the specification rich editor
  const [specTextContent, setSpecTextContent] = useState("");

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add state for default product color and size
  const [defaultColor, setDefaultColor] = useState<string>("");
  const [defaultSize, setDefaultSize] = useState<string>("");

  // Variants state
  const [enableVariants, setEnableVariants] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([
    {
      price: undefined,
      discountedPrice: undefined,
      stock: undefined,
      images: [],
      imageId: uuid(),
    },
  ]);

  // Variant image gallery logic
  const { loadImages: loadVariantImages, images: variantImages } =
    useProductImageStore();
  const [showVariantGallery, setShowVariantGallery] = useState<number | null>(
    null,
  );
  const [variantGalleryOpen, setVariantGalleryOpen] = useState(false);
  const [variantGalleryIdx, setVariantGalleryIdx] = useState<number | null>(
    null,
  );

  // Helper: validate a single field
  function validateField(field: string, value: any) {
    try {
      productSchema.pick({ [field]: true }).parse({ [field]: value });
      return "";
    } catch (e: any) {
      return e.errors?.[0]?.message || "Invalid value";
    }
  }

  // Helper: validate all fields
  function validateAllFields() {
    // List all fields in productSchema
    const allFields = [
      "title",
      "slug",
      "shortDescription",
      "price",
      "discountedPrice",
      "stock",
      "brand",
      "imageId",
      "images",
      "categoryId",
      "descriptionImageId",
      "attributes",
      "estimatedDeliveryTime",
      "categoryAttributes",
      // description is handled separately
    ];
    const newErrors: Record<string, string> = {};
    let parsedErrors: Record<string, string> = {};
    try {
      productSchema.parse({
        title,
        slug,
        shortDescription,
        price,
        discountedPrice,
        stock,
        brand,
        imageId,
        images: images.map((image) => image.src),
        categoryId,
        descriptionImageId,
        attributes: specifications.reduce(
          (acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        ),
        estimatedDeliveryTime,
        categoryAttributes: attributeValues,
        description: "", // RichEditor content, validated separately if needed
      });
    } catch (e) {
      // e is ZodError
      if (
        e &&
        typeof e === "object" &&
        "errors" in e &&
        Array.isArray((e as any).errors)
      ) {
        for (const err of (e as any).errors) {
          if (err.path && err.path[0]) {
            parsedErrors[err.path[0]] = err.message;
          }
        }
      }
    }
    // Set all fields, even if no error
    for (const field of allFields) {
      newErrors[field] = parsedErrors[field] || "";
    }
    // Custom error for categoryId if not selected
    if (!categoryId) {
      newErrors["categoryId"] = "Category is required.";
    }
    return newErrors;
  }

  // Real-time validation handlers
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    setErrors((prev) => ({
      ...prev,
      title: validateField("title", e.target.value),
    }));
  }
  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    setErrors((prev) => ({
      ...prev,
      slug: validateField("slug", e.target.value),
    }));
  }
  function handleShortDescriptionChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setShortDescription(e.target.value);
    setErrors((prev) => ({
      ...prev,
      shortDescription: validateField("shortDescription", e.target.value),
    }));
  }
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value ? Number(e.target.value) : 0;
    setPrice(val);
    setErrors((prev) => ({ ...prev, price: validateField("price", val) }));
  }
  function handleDiscountedPriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value ? Number(e.target.value) : 0;
    setDiscountedPrice(val);
    setErrors((prev) => ({ ...prev, discountedPrice: "" })); // Not required
  }
  function handleStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value ? Number(e.target.value) : 0;
    setStock(val);
    setErrors((prev) => ({ ...prev, stock: validateField("stock", val) }));
  }
  function handleBrandChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBrand(e.target.value);
    setErrors((prev) => ({
      ...prev,
      brand: validateField("brand", e.target.value),
    }));
  }
  function handleEstimatedDeliveryTimeChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const val = e.target.value ? Number(e.target.value) : undefined;
    setEstimatedDeliveryTime(val);
    setErrors((prev) => ({ ...prev, estimatedDeliveryTime: "" })); // Optional
  }

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

  // Initialize attributeValues when attributes change
  useEffect(() => {
    const initialValues: Record<string, string | number | boolean> = {};
    attributes.forEach((attr) => {
      // Set default values based on type
      if (attr.type === "select" && attr.options && attr.options.length > 0) {
        initialValues[attr.name] = attr.options[0] ?? "";
      } else {
        initialValues[attr.name] = "";
      }
    });
    setAttributeValues(initialValues);
  }, [attributes]);

  const handleAttributeChange = (
    name: string,
    value: string | number | boolean,
  ) => {
    setAttributeValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProduct = api.product.add.useMutation({
    onSuccess: () => {
      toast.success("Product added successfully");
      selectedCategoriesRef.current = [];
      // Clear form only on success
      setTitle("");
      setShortDescription("");
      setPrice(0);
      setDiscountedPrice(0);
      setSlug("");
      setStock(0);
      setBrand("");
      setEstimatedDeliveryTime(undefined);
      setCategoryId("");
      setAttributes([]);
      setAttributeValues({});
      setSpecifications([]);
      // Navigate after clearing
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
      // Update the specific field based on fieldName
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

  // Helper to parse and add specs from rich editor
  const addSpecsFromRichEditor = (html: string) => {
    // Split HTML by <br>, </p>, and </div> tags to get logical lines
    const htmlLines = html
      .replace(/<\/?(div|p)[^>]*>/gi, "\n")
      .replace(/<br\s*\/?>(?![\s\S]*<br)/gi, "\n")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setSpecifications((prev) => {
      const existingKeys = new Set(prev.map((s) => s.key.trim().toLowerCase()));
      const newSpecs = htmlLines
        .map((line) => {
          if (line.includes(":")) {
            const [key, ...rest] = line.split(":");
            if (typeof key === "string") {
              return { key: key.trim(), value: rest.join(":").trim() };
            }
          } else {
            return { key: line, value: "" };
          }
          return null;
        })
        .filter(
          (spec): spec is { key: string; value: string } =>
            !!spec &&
            typeof spec.key === "string" &&
            spec.key.trim().length > 0 &&
            !existingKeys.has(spec.key.trim().toLowerCase()),
        );
      return [...prev, ...newSpecs];
    });
  };

  // Variant handlers
  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number | undefined,
  ) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };
  const handleVariantImageGallery = (index: number) => {
    setVariantGalleryIdx(index);
    setVariantGalleryOpen(true);
  };
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        price: undefined,
        discountedPrice: undefined,
        stock: undefined,
        images: [],
        imageId: uuid(),
      },
    ]);
  };
  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };
  const handleVariantImagesUpdate = (index: number, newImages: string[]) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], images: newImages };
      return updated;
    });
  };

  const handleSubmit = async (content: string) => {
    setPending(true);
    const newErrors = validateAllFields();
    setErrors(newErrors);
    const errorMessages = Object.values(newErrors).filter(Boolean);
    if (errorMessages.length > 0) {
      setPending(false);
      toast.error(errorMessages.join(" | "));
      return;
    }
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
      "Submitting images in order:",
      images.map((img) => img.src),
    );
    addProduct.mutate({
      imageId,
      images: images.map((image) => image.src),
      descriptionImageId,
      title,
      shortDescription,
      price,
      discountedPrice,
      stock,
      brand,
      slug,
      categoryId: categoryId,
      description: content,
      attributes: specsObject, // Only include specifications here
      categoryAttributes: attributeValues, // Pass category attributes separately
      estimatedDeliveryTime: estimatedDeliveryTime,
      variants:
        enableVariants && variants.length > 0
          ? variants.map((v) => ({
              color: v.color ?? undefined,
              size: v.size ?? undefined,
              images: v.images ?? [],
              price:
                v.price !== undefined && v.price !== null && v.price !== ""
                  ? Number(v.price)
                  : undefined,
              discountedPrice:
                v.discountedPrice !== undefined &&
                v.discountedPrice !== null &&
                v.discountedPrice !== ""
                  ? Number(v.discountedPrice)
                  : undefined,
              stock:
                v.stock !== undefined && v.stock !== null && v.stock !== ""
                  ? Number(v.stock)
                  : undefined,
            }))
          : undefined,
    });
    // Do not clear the form here! Only clear on success.
  };

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      categoryId: validateField("categoryId", categoryId),
    }));
  }, [categoryId]);

  return (
    <RichEditor
      content=""
      handleSubmit={handleSubmit}
      imageId={descriptionImageId}
      pending={pending}
      submitButtonText="Add Product"
    >
      <div className="grid grid-cols-1 gap-x-3 gap-y-4 p-2 md:p-0">
        {/* Default Product Color/Size */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Default Product Color (optional)</Label>
          <Input
            type="text"
            placeholder="Color"
            value={defaultColor}
            onChange={(e) => setDefaultColor(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Default Product Size (optional)</Label>
          <Input
            type="text"
            placeholder="Size"
            value={defaultSize}
            onChange={(e) => setDefaultSize(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        {/* Variants Toggle */}
        <div className="flex items-center gap-2">
          <Switch
            checked={enableVariants}
            onCheckedChange={setEnableVariants}
          />
          <Label className="text-base">Enable color/size/image variants</Label>
        </div>
        {/* Variants UI */}
        {enableVariants && (
          <div className="flex flex-col gap-4 rounded-md border bg-gray-50 p-3">
            <Label className="text-base">Product Variants</Label>
            {variants.map((variant, idx) => (
              <div
                key={idx}
                className="mb-2 flex flex-col items-center gap-2 border-b pb-2 md:flex-row"
              >
                <Input
                  type="text"
                  placeholder="Color (optional)"
                  value={variant.color}
                  onChange={(e) =>
                    handleVariantChange(idx, "color", e.target.value)
                  }
                  className="w-32"
                />
                <Input
                  type="text"
                  placeholder="Size (optional)"
                  value={variant.size}
                  onChange={(e) =>
                    handleVariantChange(idx, "size", e.target.value)
                  }
                  className="w-32"
                />
                <Input
                  type="number"
                  placeholder="Price (optional)"
                  value={variant.price ?? ""}
                  onChange={(e) =>
                    handleVariantChange(idx, "price", e.target.value)
                  }
                  className="w-32"
                />
                <Input
                  type="number"
                  placeholder="Discounted Price (optional)"
                  value={variant.discountedPrice ?? ""}
                  onChange={(e) =>
                    handleVariantChange(idx, "discountedPrice", e.target.value)
                  }
                  className="w-32"
                />
                <Input
                  type="number"
                  placeholder="Stock (optional)"
                  value={variant.stock ?? ""}
                  onChange={(e) =>
                    handleVariantChange(idx, "stock", e.target.value)
                  }
                  className="w-32"
                />
                <Button
                  type="button"
                  onClick={() => handleVariantImageGallery(idx)}
                  className="w-40"
                >
                  Add Images
                </Button>
                {/* Show variant images */}
                {variant.images && variant.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {variant.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="variant-img"
                        className="h-12 w-12 rounded object-cover"
                      />
                    ))}
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveVariant(idx)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddVariant} className="w-40">
              Add Variant
            </Button>
          </div>
        )}
        {/* Variant Image Gallery Modal */}
        {variantGalleryOpen &&
          variantGalleryIdx !== null &&
          variants[variantGalleryIdx] !== undefined && (
            <VariantImageGalleryModal
              variantIndex={variantGalleryIdx}
              images={variants[variantGalleryIdx]?.images || []}
              onClose={() => setVariantGalleryOpen(false)}
              onImagesChange={(imgs: string[]) =>
                handleVariantImagesUpdate(variantGalleryIdx, imgs)
              }
            />
          )}
        {/* Product Title */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Product Title</Label>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
            className={errors.title ? "border-red-500" : ""}
            style={{ width: "100%" }}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        {/* Slug */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Slug</Label>
          <Input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={handleSlugChange}
            className={errors.slug ? "border-red-500" : ""}
            style={{ width: "100%" }}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
          )}
        </div>
        {/* Short Description */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Short Description</Label>
          <Textarea
            placeholder="Short Description"
            value={shortDescription}
            onChange={handleShortDescriptionChange}
            className={errors.shortDescription ? "border-red-500" : ""}
            style={{ width: "100%" }}
          />
          {errors.shortDescription && (
            <p className="mt-1 text-sm text-red-500">
              {errors.shortDescription}
            </p>
          )}
        </div>
        {/* Category */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base font-medium">Category</Label>
          <CategorySelector
            setAttributes={setAttributes}
            setCategoryId={setCategoryId}
            categories={categories}
            placeholder="Select Category"
            selectedCategoriesRef={selectedCategoriesRef}
            onCategoryChange={(level) => {
              selectedCategoriesRef.current =
                selectedCategoriesRef.current.slice(0, level + 1);
            }}
          />
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-500">{errors.categoryId}</p>
          )}
        </div>
        {/* Price */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Price</Label>
          <Input
            type="number"
            placeholder="Price"
            value={price === 0 ? "" : price}
            onChange={handlePriceChange}
            className={errors.price ? "border-red-500" : ""}
            style={{ width: "100%" }}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>
        {/* Discounted Price */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Discounted Price</Label>
          <Input
            type="number"
            placeholder="Discounted Price"
            value={discountedPrice === 0 ? "" : discountedPrice}
            onChange={handleDiscountedPriceChange}
            style={{ width: "100%" }}
          />
        </div>
        {/* Stock */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Stock</Label>
          <Input
            type="number"
            placeholder="Stock"
            value={stock === 0 ? "" : stock}
            onChange={handleStockChange}
            className={errors.stock ? "border-red-500" : ""}
            style={{ width: "100%" }}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-500">{errors.stock}</p>
          )}
        </div>
        {/* Brand */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Brand</Label>
          <Input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={handleBrandChange}
            className={errors.brand ? "border-red-500" : ""}
            style={{ width: "100%" }}
          />
          {errors.brand && (
            <p className="mt-1 text-sm text-red-500">{errors.brand}</p>
          )}
        </div>
        {/* Estimated Delivery Time */}
        <div className="flex w-full flex-col space-y-2">
          <Label className="text-base">Estimated Delivery Time (Days)</Label>
          <Input
            type="number"
            placeholder="Delivery Time in Days"
            min="1"
            value={estimatedDeliveryTime ?? ""}
            onChange={handleEstimatedDeliveryTimeChange}
            style={{ width: "100%" }}
          />
        </div>
        {/* Images */}
        <div className="mt-auto flex w-full flex-col gap-y-1">
          <Label className="text-base">
            Images
            <span className="ml-2 text-xs text-gray-500">
              (Recommended: 1000x1000px or larger, square)
            </span>
          </Label>
          <Button
            onClick={() => setShowImageGallery(imageId)}
            className="w-full"
          >
            Show Image Gallery
          </Button>
          {showImageGallery && (
            <DndImageGallery imageId={imageId} onClose={setShowImageGallery} />
          )}
        </div>
        {/* Divider */}
        <div className="col-span-1 my-2 border-b border-gray-200 md:col-span-2" />
        {/* Category Attribute Fields */}
        {attributes.length > 0 && (
          <div className="col-span-1 mt-4 md:col-span-2">
            <h3 className="mb-3 text-lg font-medium">Category Attributes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {attributes.map((attr) => (
                <div key={attr.name} className="flex w-full flex-col gap-2">
                  <Label htmlFor={attr.name} className="text-base">
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${attr.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {attr.options.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="w-full"
                          >
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
        {/* Divider */}
        <div className="col-span-1 my-2 border-b border-gray-200 md:col-span-2" />
        {/* Specifications */}
        <div className="col-span-1 w-full md:col-span-2">
          <Label className="text-base">Specifications</Label>
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
            <Button onClick={handleAddSpecification} className="w-full">
              Add Specification
            </Button>
            <div className="mt-4">
              <Label className="mb-1 block text-base">
                Or paste/write specifications below (format: Key: Value per
                line)
              </Label>
              <Textarea
                placeholder={`Color: Red
Size: Large
Material: Cotton`}
                value={specTextContent}
                onChange={(e) => setSpecTextContent(e.target.value)}
                className="min-h-[100px] w-full"
              />
              <Button
                className="mt-2 w-full"
                type="button"
                onClick={() => {
                  addSpecsFromRichEditor(specTextContent);
                  setSpecTextContent("");
                }}
              >
                Add from Textarea
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RichEditor>
  );
}

type SetCategoryIdType =
  | Dispatch<SetStateAction<string>>
  | ((id: string) => void);
function CategorySelector({
  setCategoryId,
  setAttributes,
  categories,
  placeholder,
  depth = 0, // Tracks category level
  selectedCategoriesRef, // Ref to store the category selection path
  onCategoryChange, // Function to reset child selection
}: {
  setCategoryId: SetCategoryIdType;
  setAttributes: Dispatch<SetStateAction<CategoryAttribute[]>>;
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

          // Check if the category has attributes and update the state
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
            // Reset attributes if none found
            setAttributes([]);
          }

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
            setAttributes={setAttributes}
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

// VariantImageGalleryModal for uploading images to a specific variant
function VariantImageGalleryModal({
  variantIndex,
  images,
  onClose,
  onImagesChange,
}: {
  variantIndex: number;
  images: string[];
  onClose: () => void;
  onImagesChange: (imgs: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList | File[]) => {
    setIsUploading(true);
    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        // Use a folder for variant images for clarity
        const res = await uploadFile(formData, `variant-${variantIndex}`);
        if (res?.secure_url) {
          newImages.push(res.secure_url);
        }
      }
      onImagesChange([...newImages, ...images]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    setIsUploading(false);
  };

  const handleRemove = (img: string) => {
    onImagesChange(images.filter((i) => i !== img));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-md bg-white p-6">
        <button className="absolute right-4 top-4" onClick={onClose}>
          <IoMdClose size={24} />
        </button>
        <h2 className="mb-4 text-lg font-semibold">
          Upload Images for Variant
        </h2>
        {/* Styled upload area */}
        <label
          htmlFor="variant-image-upload"
          className="mb-4 flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
        >
          <IoCloudUploadOutline size={30} className="text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">Image file</p>
          <input
            id="variant-image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              if (e.target.files) await handleUpload(e.target.files);
            }}
            disabled={isUploading}
          />
        </label>
        <div className="mb-4 flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt="variant-img"
                className="h-16 w-16 rounded object-cover"
              />
              <button
                className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow"
                onClick={() => handleRemove(img)}
                type="button"
              >
                <IoMdClose size={16} />
              </button>
            </div>
          ))}
        </div>
        {isUploading && (
          <div className="mb-2 text-sm text-gray-500">Uploading...</div>
        )}
        <Button onClick={onClose} className="mt-2 w-full">
          Done
        </Button>
      </div>
    </div>
  );
}
