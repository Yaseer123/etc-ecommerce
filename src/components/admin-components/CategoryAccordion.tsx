"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";
import { FaGear } from "react-icons/fa6"; // Import gear/settings icon
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { api } from "@/trpc/react";
import Image from "next/image";
import { removeImage, uploadFile } from "@/app/actions/file";
import type { Category } from "@prisma/client";
import Link from "next/link"; // Import Link component

interface CategoryTree extends Category {
  subcategories: Category[];
}

interface CategoryAccordionProps {
  categories: CategoryTree[];
  onDelete: (id: string) => void; // Callback for deleting a category
}

export function CategoryAccordion({
  categories,
  onDelete,
}: CategoryAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onDelete={onDelete}
        />
      ))}
    </Accordion>
  );
}

function CategoryItem({
  category,
  onDelete,
}: {
  category: CategoryTree;
  onDelete: (id: string) => void;
}) {
  const handleDelete = () => {
    onDelete(category.id); // Pass the category ID for deletion
  };

  const utils = api.useUtils();
  const editCategory = api.category.edit.useMutation({
    onSuccess: async () => {
      // Invalidate the query to refresh the data
      await utils.category.getAll.invalidate();
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false); // New state for disabling the button
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category.image,
  );

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

  const handleRemoveImage = async () => {
    setIsRemovingImage(true); // Set loading state to true
    try {
      if (category.imageId) {
        await removeImage(category.imageId); // Remove the old image from the server
      }
      setNewImage(null);
      setImagePreview(null); // Clear the image preview
    } finally {
      setIsRemovingImage(false); // Reset loading state
    }
  };

  const handleSave = async () => {
    let imageUrl = category.image;
    let imageId = category.imageId;

    if (newImage) {
      if (imageId) await removeImage(imageId); // Remove the old image if it exists
      const formData = new FormData();
      formData.append("file", newImage);

      const uploadResponse = await uploadFile(formData);
      if (uploadResponse) {
        imageUrl = uploadResponse.secure_url;
        imageId = uploadResponse.public_id;
      }
    } else if (!imagePreview) {
      // If the image is removed, set the image URL and ID to null
      imageUrl = null;
      imageId = null;
    }

    editCategory.mutate({
      id: category.id,
      name: newCategoryName,
      image: imageUrl,
      imageId: imageId,
    });

    setIsEditing(false);
  };

  return (
    <AccordionItem
      value={category.id.toString()}
      className="mb-2 rounded-lg border"
    >
      <div className="flex items-center justify-between rounded-md bg-gray-100 p-3">
        <AccordionTrigger
          disabled={category.subcategories.length === 0}
          className="flex flex-1 gap-3 text-left"
        >
          {/* Display the category image */}
          {imagePreview && (
            <Image
              src={imagePreview}
              alt={category.name}
              width={40}
              height={40}
              className="mr-2 rounded-md object-cover"
            />
          )}
          {isEditing ? (
            <Input
              type="text"
              value={newCategoryName}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await handleSave();
                }
              }}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="bg-white"
            />
          ) : (
            category.name
          )}
        </AccordionTrigger>
        <div className="flex items-center gap-x-1">
          {/* Replace Edit button with Link to category management page */}
          <Link href={`/admin/category/${category.id}`}>
            <Button variant="outline" className="flex items-center gap-1">
              <FaGear size={20} />
              <span className="hidden sm:inline">Manage</span>
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="ml-2">
                <MdDelete size={35} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  category and all its subcategories.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isEditing && (
        <div className="p-3">
          <label className="text-sm font-medium">{category.image ? "Edit Image" : "Add Image"}</label>
          <Input
            type="file"
            onClick={(e) => e.stopPropagation()}
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
          {imagePreview && (
            <div className="mt-2 flex gap-4">
              <Image
                src={imagePreview}
                alt="Preview"
                width={128}
                height={128}
                className="rounded-md object-cover"
              />
              <Button
                variant="destructive"
                onClick={handleRemoveImage}
                disabled={isRemovingImage} // Disable the button while removing
                className="mt-2"
              >
                {isRemovingImage ? "Removing..." : "Remove Image"}
              </Button>
            </div>
          )}
          <Button onClick={handleSave} className="mt-2">
            Save Changes
          </Button>
        </div>
      )}

      <AccordionContent className="p-3">
        {/* Recursive Rendering of Subcategories */}
        {category.subcategories.length > 0 && (
          <div className="ml-4 mt-2 border-l-2 pl-4">
            <CategoryAccordion
              categories={category.subcategories as CategoryTree[]}
              onDelete={onDelete} // Pass down the delete handler
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
