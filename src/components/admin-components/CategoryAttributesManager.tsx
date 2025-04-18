"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusCircle,
  X,
  ArrowLeft,
  Save,
  Trash2,
  Upload,
  Layout,
  Database,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { removeImage, uploadFile } from "@/app/actions/file";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
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

interface CategoryAttributesManagerProps {
  categoryId: string;
}

// Define the attribute schema
const attributeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["text", "number", "boolean", "select"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
});

const attributeFormSchema = z.object({
  attributes: z.array(attributeSchema),
});

const detailsFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type AttributeFormType = z.infer<typeof attributeFormSchema>;
type DetailsFormType = z.infer<typeof detailsFormSchema>;

export default function CategoryAttributesManager({
  categoryId,
}: CategoryAttributesManagerProps) {
  const { data: category, isLoading } = api.category.getById.useQuery({
    id: categoryId,
  });

  // Check if category has a parent
  const isParentCategory = category && category.parentId === null;

  // Replace alert with toast for better notifications
  const { mutate: updateAttributes, isPending: isSavingAttributes } =
    api.category.updateAttributes.useMutation({
      onSuccess: () => {
        toast.success("Category attributes have been updated successfully.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update attributes");
      },
    });

  const { mutate: editCategory, isPending: isSavingDetails } =
    api.category.edit.useMutation({
      onSuccess: () => {
        toast.success("Category details have been updated successfully.");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update category details");
      },
    });

  // Add mutation for removing all attributes from database
  const { mutate: removeAllAttributes, isPending: isRemovingAllAttributes } =
    api.category.updateAttributes.useMutation({
      onSuccess: () => {
        toast.success("All attributes have been removed from the category.");
        attributesForm.reset({ attributes: [] });
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to remove attributes");
      },
    });

  // Add mutation for removing a single attribute
  const {
    mutate: removeSingleAttribute,
    isPending: isRemovingSingleAttribute,
  } = api.category.removeAttribute.useMutation({
    onSuccess: (data) => {
      toast.success("Attribute has been removed successfully.");

      // Update the form with the returned attributes
      try {
        if (typeof data.attributes === "string") {
          const attrs = JSON.parse(
            data.attributes,
          ) as AttributeFormType["attributes"];
          if (Array.isArray(attrs)) {
            attributesForm.reset({ attributes: attrs });
          }
        } else if (Array.isArray(data.attributes)) {
          attributesForm.reset({
            attributes: data.attributes as AttributeFormType["attributes"],
          });
        }
      } catch (error) {
        console.error("Failed to parse updated attributes:", error);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove attribute");
    },
  });

  // State for image handling
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRemovingImage, setIsRemovingImage] = useState(false);

  // State for handling attribute removal confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Initialize form for category details
  const detailsForm = useForm<DetailsFormType>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      name: "",
    },
  });

  // Initialize form for attributes
  const attributesForm = useForm<AttributeFormType>({
    resolver: zodResolver(attributeFormSchema),
    defaultValues: {
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: attributesForm.control,
    name: "attributes",
  });

  // Set form values and state when category data is loaded
  useEffect(() => {
    if (category) {
      detailsForm.reset({ name: category.name });
      setImagePreview(category.image);

      try {
        if (typeof category.attributes === "string") {
          // Try to parse if it's a string
          const attrs = JSON.parse(
            category.attributes,
          ) as AttributeFormType["attributes"];
          if (Array.isArray(attrs)) {
            attributesForm.reset({ attributes: attrs });
          } else {
            attributesForm.reset({ attributes: [] });
            console.warn("Attributes data is not an array");
          }
        } else if (Array.isArray(category.attributes)) {
          // Use directly if it's already an array
          attributesForm.reset({
            attributes: category.attributes as AttributeFormType["attributes"],
          });
        } else {
          attributesForm.reset({ attributes: [] });
          console.warn("No valid attributes data found");
        }
      } catch (error) {
        console.error("Failed to parse category attributes:", error);
        attributesForm.reset({ attributes: [] });
      }
    }
  }, [category, attributesForm, detailsForm]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleRemoveImage = async () => {
    setIsRemovingImage(true);
    try {
      if (category?.imageId) {
        await removeImage(category.imageId);
      }
      setNewImage(null);
      setImagePreview(null);
    } finally {
      setIsRemovingImage(false);
    }
  };

  // Save category details
  const onSubmitDetails = async (data: DetailsFormType) => {
    let imageUrl = category?.image ?? null;
    let imageId = category?.imageId ?? null;

    if (newImage) {
      if (imageId) await removeImage(imageId);
      const formData = new FormData();
      formData.append("file", newImage);

      const uploadResponse = await uploadFile(formData);
      if (uploadResponse) {
        imageUrl = uploadResponse.secure_url;
        imageId = uploadResponse.public_id;
      }
    } else if (imagePreview === null && category?.imageId) {
      await removeImage(category.imageId);
      imageUrl = null;
      imageId = null;
    }

    editCategory({
      id: categoryId,
      name: data.name,
      image: imageUrl,
      imageId: imageId,
    });
  };

  // Handle attribute form submission
  const onSubmitAttributes = (data: AttributeFormType) => {
    updateAttributes({
      id: categoryId,
      attributes: data.attributes,
    });
  };

  // Handle removing all attributes from database
  const handleRemoveAllAttributes = () => {
    removeAllAttributes({
      id: categoryId,
      attributes: [],
    });
  };

  // Handle removing a single attribute
  const handleRemoveSingleAttribute = (index: number) => {
    const currentAttributes = attributesForm.getValues().attributes;
    const attributeName = currentAttributes[index]?.name;

    if (category && attributeName) {
      removeSingleAttribute({
        categoryId: categoryId,
        attributeName: attributeName,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!category) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Category not found or has been deleted.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="sticky top-0 z-10 flex flex-col items-center justify-between gap-4 bg-background/95 py-4 backdrop-blur sm:flex-row">
        <div className="flex items-center gap-3">
          <Link href="/admin/category">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">
              Manage category details and attributes
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Category Details</span>
          </TabsTrigger>
          <TabsTrigger value="attributes" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Category Attributes</span>
          </TabsTrigger>
        </TabsList>

        {/* Category Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Layout className="h-5 w-5 text-primary" />
                Edit Category Details
              </CardTitle>
              <CardDescription>
                Update the basic details for this category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...detailsForm}>
                <form
                  onSubmit={detailsForm.handleSubmit(onSubmitDetails)}
                  className="space-y-8"
                >
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-8">
                      <FormField
                        control={detailsForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Category Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter category name"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-3">
                        <Label className="text-base">Category Image</Label>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "group relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all",
                                !imagePreview && "bg-muted hover:bg-muted/70",
                              )}
                            >
                              {imagePreview ? (
                                <>
                                  <Image
                                    src={imagePreview}
                                    alt="Category preview"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-all group-hover:opacity-100">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={handleRemoveImage}
                                      disabled={isRemovingImage}
                                      className="gap-2"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      {isRemovingImage
                                        ? "Removing..."
                                        : "Remove Image"}
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <div className="p-6 text-center">
                                  <Upload className="mx-auto h-10 w-10 text-muted-foreground/80" />
                                  <p className="mt-2 text-muted-foreground">
                                    Drag and drop an image or click to browse
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="relative aspect-square max-h-[300px] w-auto overflow-hidden rounded-md border shadow-md"
                        >
                          <Image
                            src={imagePreview}
                            alt="Category preview"
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSavingDetails}
                    className="w-full gap-2 sm:w-auto"
                    size="lg"
                  >
                    <Save className="h-4 w-4" />
                    {isSavingDetails ? "Saving..." : "Save Details"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category Attributes Tab */}
        <TabsContent value="attributes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Database className="h-5 w-5 text-primary" />
                Category Attributes
              </CardTitle>
              <CardDescription>
                Define attributes that will be available for products in this
                category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isParentCategory ? (
                <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800">
                  <AlertTitle className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Attributes Not Allowed
                  </AlertTitle>
                  <AlertDescription>
                    Attributes can only be added to subcategories. Parent
                    categories cannot have attributes directly. Please create
                    subcategories under this category and add attributes to
                    them.
                  </AlertDescription>
                </Alert>
              ) : (
                <Form {...attributesForm}>
                  <form
                    onSubmit={attributesForm.handleSubmit(onSubmitAttributes)}
                    className="space-y-6"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-medium">
                            Product Attributes
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Attributes help customers filter and find products
                            easily
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            append({
                              name: "",
                              type: "text",
                              options: [],
                              required: false,
                            })
                          }
                          className="gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Attribute
                        </Button>
                      </div>

                      {fields.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                          <Database className="h-12 w-12 text-muted-foreground/50" />
                          <h3 className="mt-4 text-lg font-medium">
                            No attributes defined
                          </h3>
                          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                            Attributes help customers filter and find products.
                            Examples include size, color, material, etc.
                          </p>
                          <Button
                            type="button"
                            onClick={() =>
                              append({
                                name: "",
                                type: "text",
                                options: [],
                                required: false,
                              })
                            }
                            className="mt-4 gap-2"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add Your First Attribute
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                          {fields.map((field, index) => (
                            <motion.div
                              key={field.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="overflow-hidden">
                                <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="font-normal"
                                    >
                                      #{index + 1}
                                    </Badge>
                                    <h4 className="font-medium">
                                      {attributesForm.watch(
                                        `attributes.${index}.name`,
                                      ) || "New Attribute"}
                                    </h4>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // If this is an existing attribute in the database, remove it from there
                                      if (
                                        category &&
                                        attributesForm.watch(
                                          `attributes.${index}.name`,
                                        )
                                      ) {
                                        handleRemoveSingleAttribute(index);
                                      } else {
                                        // Otherwise just remove it from the form
                                        remove(index);
                                      }
                                    }}
                                    disabled={isRemovingSingleAttribute}
                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="space-y-4 p-4">
                                  <FormField
                                    control={attributesForm.control}
                                    name={`attributes.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Color, Size, Material..."
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={attributesForm.control}
                                    name={`attributes.${index}.type`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="text">
                                              Text
                                            </SelectItem>
                                            <SelectItem value="number">
                                              Number
                                            </SelectItem>
                                            <SelectItem value="boolean">
                                              Boolean (Yes/No)
                                            </SelectItem>
                                            <SelectItem value="select">
                                              Select (Options)
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormDescription>
                                          Determines how this attribute will be
                                          displayed
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  {attributesForm.watch(
                                    `attributes.${index}.type`,
                                  ) === "select" && (
                                    <FormField
                                      control={attributesForm.control}
                                      name={`attributes.${index}.options`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Options</FormLabel>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder="Red, Green, Blue"
                                              value={(field.value ?? []).join(
                                                ", ",
                                              )}
                                              onChange={(e) => {
                                                const options = e.target.value
                                                  .split(",")
                                                  .map((opt) => opt.trim())
                                                  .filter((opt) => opt !== "");
                                                field.onChange(options);
                                              }}
                                            />
                                          </FormControl>
                                          <FormDescription>
                                            Enter options separated by commas
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  )}

                                  <FormField
                                    control={attributesForm.control}
                                    name={`attributes.${index}.required`}
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                          <FormLabel className="text-base">
                                            Required
                                          </FormLabel>
                                          <FormDescription>
                                            Make this attribute mandatory for
                                            all products
                                          </FormDescription>
                                        </div>
                                        <FormControl>
                                          <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {fields.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="submit"
                          disabled={isSavingAttributes}
                          size="lg"
                          className="gap-2 sm:w-auto"
                        >
                          <Save className="h-4 w-4" />
                          {isSavingAttributes
                            ? "Saving..."
                            : "Save All Attributes"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={() => setIsDeleteDialogOpen(true)}
                          className="gap-2 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
                          disabled={isRemovingAllAttributes}
                        >
                          <Trash2 className="h-4 w-4" />
                          {isRemovingAllAttributes
                            ? "Removing..."
                            : "Remove All Attributes"}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Confirmation Dialog for removing all attributes */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove All Attributes</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all attributes for this category. Products
                  using these attributes may be affected. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleRemoveAllAttributes}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remove All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
