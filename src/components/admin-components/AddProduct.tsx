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
import type { CategoryAttribute, CategoryTree } from "@/schemas/categorySchema";
import RichEditor from "../rich-editor";
import { v4 as uuid } from "uuid";
import { Label } from "../ui/label";
import DndImageGallery from "../rich-editor/DndImageGallery";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { renameImages } from "@/app/actions/file";
import { useProductImageStore } from "@/context/admin-context/ProductImageProvider";
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
  const [originPrice, setOriginPrice] = useState(0);
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

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleSubmit = async (content: string) => {
    setPending(true);
    await renameImages(images);

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

    addProduct.mutate({
      imageId,
      images: images.map((image) => image.src),
      descriptionImageId,
      title,
      shortDescription,
      price,
      originPrice,
      stock,
      brand,
      slug,
      categoryId: categoryId,
      description: content,
      attributes: specsObject, // Only include specifications here
      categoryAttributes: attributeValues, // Pass category attributes separately
      estimatedDeliveryTime: estimatedDeliveryTime,
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
        <div>
          <Label>Origin Price</Label>
          <Input
            type="number"
            placeholder="Origin Price"
            value={originPrice}
            onChange={(e) => setOriginPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
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
          <Button onClick={() => setShowImageGallery(imageId)}>
            Show Image Gallery
          </Button>
          {showImageGallery && (
            <DndImageGallery imageId={imageId} onClose={setShowImageGallery} />
          )}
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

function CategorySelector({
  setCategoryId,
  setAttributes,
  categories,
  placeholder,
  depth = 0, // Tracks category level
  selectedCategoriesRef, // Ref to store the category selection path
  onCategoryChange, // Function to reset child selection
}: {
  setCategoryId: Dispatch<SetStateAction<string>>;
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
