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

export default function AddProductForm() {
  const router = useRouter();
  const selectedCategoriesRef = useRef<(string | null)[]>([]);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [slug, setSlug] = useState("");
  const [stock, setStock] = useState(0); // New state for stock
  const [brand, setBrand] = useState(""); // New state for brand
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

  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {},
  );

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
      imageId,
      images: images.map((image) => image.src),
      descriptionImageId,
      title,
      shortDescription,
      price,
      stock,
      brand,
      slug,
      categoryId: categoryId,
      description: content,
      attributes: specifications,
      attributeValues: attributeValues,
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
