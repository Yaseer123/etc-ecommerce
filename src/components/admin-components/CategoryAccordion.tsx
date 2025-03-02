"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
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
import { useClickAway } from "@uidotdev/usehooks";
import { api } from "@/trpc/react";

interface Category {
  id: string;
  name: string;
  subcategories: Category[];
}

interface CategoryAccordionProps {
  categories: Category[];
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
  category: Category;
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
  const [newCategoryName, setNewCategoryName] = useState(category.name);

  const inputRef = useClickAway<HTMLInputElement>(() => {
    setIsEditing(false);
  });

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
          {isEditing ? (
            <Input
              ref={inputRef}
              type="text"
              value={newCategoryName}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editCategory.mutate({
                    id: category.id,
                    name: newCategoryName,
                  });
                  setIsEditing(false);
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
          <Button onClick={() => setIsEditing(true)}>
            <MdEdit size={35} />
          </Button>
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

      <AccordionContent className="p-3">
        {/* Recursive Rendering of Subcategories */}
        {category.subcategories.length > 0 && (
          <div className="ml-4 mt-2 border-l-2 pl-4">
            <CategoryAccordion
              categories={category.subcategories}
              onDelete={onDelete} // Pass down the delete handler
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
