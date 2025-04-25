// src/app/admin/faqs/page.tsx
"use client";

import React, { useState } from "react";
import { useAdminFaqs } from "@/hooks/useFaqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Edit,
  Loader2,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react";
import { toast } from "sonner"; // Updated: Using sonner for toast

export default function AdminFAQsPage() {
  const {
    allFaqs,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createFaqItem,
    updateFaqItem,
    deleteFaqItem,
  } = useAdminFaqs();

  // State for category management
  const [newCategory, setNewCategory] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // State for FAQ item management
  const [newFaqItem, setNewFaqItem] = useState({
    categoryId: "",
    question: "",
    answer: "",
  });
  const [faqItemDialogOpen, setFaqItemDialogOpen] = useState(false);
  const [editingFaqItem, setEditingFaqItem] = useState<{
    id: string;
    categoryId: string;
    question: string;
    answer: string;
  } | null>(null);

  // State for active tab
  const [activeTab, setActiveTab] = useState("categories");

  // Function to handle category creation
  const handleCreateCategory = () => {
    if (newCategory.trim() === "") {
      // Updated: Using sonner toast
      toast.error("Validation Error", {
        description: "Category title is required",
      });
      return;
    }

    createCategory.mutate(
      { title: newCategory },
      {
        onSuccess: () => {
          // Updated: Using sonner toast
          toast.success("Success", {
            description: "Category created successfully",
          });
          setNewCategory("");
          setCategoryDialogOpen(false);
        },
        onError: (error) => {
          // Updated: Using sonner toast
          toast.error("Error", {
            description: error.message || "Failed to create category",
          });
        },
      },
    );
  };

  // Function to handle category update
  const handleUpdateCategory = () => {
    if (!editingCategory || editingCategory.title.trim() === "") {
      // Updated: Using sonner toast
      toast.error("Validation Error", {
        description: "Category title is required",
      });
      return;
    }

    updateCategory.mutate(
      { id: editingCategory.id, title: editingCategory.title },
      {
        onSuccess: () => {
          // Updated: Using sonner toast
          toast.success("Success", {
            description: "Category updated successfully",
          });
          setEditingCategory(null);
          setCategoryDialogOpen(false);
        },
        onError: (error) => {
          // Updated: Using sonner toast
          toast.error("Error", {
            description: error.message || "Failed to update category",
          });
        },
      },
    );
  };

  // Function to handle category deletion
  const handleDeleteCategory = (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${title}" category and all its FAQs?`,
      )
    ) {
      deleteCategory.mutate(
        { id },
        {
          onSuccess: () => {
            // Updated: Using sonner toast
            toast.success("Success", {
              description: "Category deleted successfully",
            });
          },
          onError: (error) => {
            // Updated: Using sonner toast
            toast.error("Error", {
              description: error.message || "Failed to delete category",
            });
          },
        },
      );
    }
  };

  // Function to handle FAQ item creation
  const handleCreateFaqItem = () => {
    if (
      newFaqItem.categoryId === "" ||
      newFaqItem.question.trim() === "" ||
      newFaqItem.answer.trim() === ""
    ) {
      // Updated: Using sonner toast
      toast.error("Validation Error", {
        description: "All fields are required",
      });
      return;
    }

    createFaqItem.mutate(newFaqItem, {
      onSuccess: () => {
        // Updated: Using sonner toast
        toast.success("Success", {
          description: "FAQ item added successfully",
        });
        setNewFaqItem({
          categoryId: "",
          question: "",
          answer: "",
        });
        setFaqItemDialogOpen(false);
      },
      onError: (error) => {
        // Updated: Using sonner toast
        toast.error("Error", {
          description: error.message || "Failed to create FAQ item",
        });
      },
    });
  };

  // Function to handle FAQ item update
  const handleUpdateFaqItem = () => {
    if (
      !editingFaqItem ||
      editingFaqItem.categoryId === "" ||
      editingFaqItem.question.trim() === "" ||
      editingFaqItem.answer.trim() === ""
    ) {
      // Updated: Using sonner toast
      toast.error("Validation Error", {
        description: "All fields are required",
      });
      return;
    }

    updateFaqItem.mutate(
      {
        id: editingFaqItem.id,
        categoryId: editingFaqItem.categoryId,
        question: editingFaqItem.question,
        answer: editingFaqItem.answer,
      },
      {
        onSuccess: () => {
          // Updated: Using sonner toast
          toast.success("Success", {
            description: "FAQ item updated successfully",
          });
          setEditingFaqItem(null);
          setFaqItemDialogOpen(false);
        },
        onError: (error) => {
          // Updated: Using sonner toast
          toast.error("Error", {
            description: error.message || "Failed to update FAQ item",
          });
        },
      },
    );
  };

  // Function to handle FAQ item deletion
  const handleDeleteFaqItem = (id: string, question: string) => {
    if (window.confirm(`Are you sure you want to delete "${question}"?`)) {
      deleteFaqItem.mutate(
        { id },
        {
          onSuccess: () => {
            // Updated: Using sonner toast
            toast.success("Success", {
              description: "FAQ item deleted successfully",
            });
          },
          onError: (error) => {
            // Updated: Using sonner toast
            toast.error("Error", {
              description: error.message || "Failed to delete FAQ item",
            });
          },
        },
      );
    }
  };

  // Open category dialog for editing
  const openEditCategoryDialog = (category: { id: string; title: string }) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  // Open FAQ item dialog for editing
  const openEditFaqItemDialog = (faqItem: {
    id: string;
    categoryId: string;
    question: string;
    answer: string;
  }) => {
    setEditingFaqItem(faqItem);
    setFaqItemDialogOpen(true);
  };

  // Open FAQ item dialog for creation with preselected category
  const openCreateFaqItemDialog = (categoryId?: string) => {
    setEditingFaqItem(null);
    if (categoryId) {
      setNewFaqItem({ ...newFaqItem, categoryId });
    }
    setFaqItemDialogOpen(true);
  };

  // Calculate total FAQs count
  const totalFaqCount =
    allFaqs?.reduce((sum, category) => sum + category.faqItems.length, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
          <p className="text-muted-foreground">
            Create and manage frequently asked questions for your website.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setNewFaqItem({
                categoryId: "",
                question: "",
                answer: "",
              });
              setFaqItemDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add FAQ
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setEditingCategory(null);
              setNewCategory("");
              setCategoryDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allFaqs?.length ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFaqCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Categories and FAQs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="faqs">All FAQs</TabsTrigger>
        </TabsList>

        {/* Categories Tab Content */}
        <TabsContent value="categories">
          {allFaqs?.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No categories found</AlertTitle>
              <AlertDescription>
                Get started by adding your first FAQ category.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allFaqs?.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle>{category.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openEditCategoryDialog(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteCategory(category.id, category.title)
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>
                      {category.faqItems.length} FAQs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    {category.faqItems.length > 0 ? (
                      <ScrollArea className="h-32">
                        <ul className="space-y-1">
                          {category.faqItems.slice(0, 5).map((faq) => (
                            <li key={faq.id} className="truncate text-sm">
                              • {faq.question}
                            </li>
                          ))}
                          {category.faqItems.length > 5 && (
                            <li className="pt-1 text-xs text-muted-foreground">
                              + {category.faqItems.length - 5} more
                            </li>
                          )}
                        </ul>
                      </ScrollArea>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No FAQs in this category yet
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => openCreateFaqItemDialog(category.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add FAQ to this category
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* FAQs Tab Content */}
        <TabsContent value="faqs">
          {totalFaqCount === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No FAQs found</AlertTitle>
              <AlertDescription>
                Get started by adding your first FAQ.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {allFaqs?.map(
                (category) =>
                  category.faqItems.length > 0 && (
                    <Card key={category.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{category.title}</span>
                          <Badge variant="outline">
                            {category.faqItems.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                          {category.faqItems.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <div className="flex items-center justify-between">
                                <AccordionTrigger className="text-base">
                                  {faq.question}
                                </AccordionTrigger>
                                <div className="mr-6 flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditFaqItemDialog(faq);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFaqItem(faq.id, faq.question);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <AccordionContent>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                  {faq.answer
                                    .split("\n")
                                    .map((paragraph, idx) => (
                                      <p
                                        key={idx}
                                        className="mb-2 text-muted-foreground"
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                      <CardFooter className="flex justify-center border-t pt-4">
                        <Button
                          variant="outline"
                          onClick={() => openCreateFaqItemDialog(category.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add FAQ to this
                          category
                        </Button>
                      </CardFooter>
                    </Card>
                  ),
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below"
                : "Enter details for the new category"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter category title"
                value={editingCategory ? editingCategory.title : newCategory}
                onChange={(e) =>
                  editingCategory
                    ? setEditingCategory({
                        ...editingCategory,
                        title: e.target.value,
                      })
                    : setNewCategory(e.target.value)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingCategory ? handleUpdateCategory : handleCreateCategory
              }
              disabled={createCategory.isPending || updateCategory.isPending}
            >
              {(createCategory.isPending || updateCategory.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Item Dialog */}
      <Dialog open={faqItemDialogOpen} onOpenChange={setFaqItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingFaqItem ? "Edit FAQ" : "Add New FAQ"}
            </DialogTitle>
            <DialogDescription>
              {editingFaqItem
                ? "Update the FAQ details below"
                : "Enter details for the new FAQ"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={
                  editingFaqItem
                    ? editingFaqItem.categoryId
                    : newFaqItem.categoryId
                }
                onValueChange={(value) =>
                  editingFaqItem
                    ? setEditingFaqItem({
                        ...editingFaqItem,
                        categoryId: value,
                      })
                    : setNewFaqItem({
                        ...newFaqItem,
                        categoryId: value,
                      })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {allFaqs?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                placeholder="Enter FAQ question"
                value={
                  editingFaqItem ? editingFaqItem.question : newFaqItem.question
                }
                onChange={(e) =>
                  editingFaqItem
                    ? setEditingFaqItem({
                        ...editingFaqItem,
                        question: e.target.value,
                      })
                    : setNewFaqItem({
                        ...newFaqItem,
                        question: e.target.value,
                      })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                placeholder="Enter FAQ answer"
                value={
                  editingFaqItem ? editingFaqItem.answer : newFaqItem.answer
                }
                onChange={(e) =>
                  editingFaqItem
                    ? setEditingFaqItem({
                        ...editingFaqItem,
                        answer: e.target.value,
                      })
                    : setNewFaqItem({
                        ...newFaqItem,
                        answer: e.target.value,
                      })
                }
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Use line breaks for paragraphs. HTML formatting is supported.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFaqItemDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingFaqItem ? handleUpdateFaqItem : handleCreateFaqItem
              }
              disabled={createFaqItem.isPending || updateFaqItem.isPending}
            >
              {(createFaqItem.isPending || updateFaqItem.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingFaqItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
