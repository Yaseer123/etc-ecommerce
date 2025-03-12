// src/app/admin/faqs/page.tsx
"use client";

import React, { useState } from "react";
import { useAdminFaqs } from "@/hooks/useFaqs";

const AdminFAQsPage = () => {
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

  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [newFaqItem, setNewFaqItem] = useState({
    categoryId: "",
    question: "",
    answer: "",
  });

  const [editingFaqItem, setEditingFaqItem] = useState<{
    id: string;
    categoryId: string;
    question: string;
    answer: string;
  } | null>(null);

  // Handle creating a new category
  const handleCreateCategory = () => {
    if (newCategory.trim() === "") return;

    createCategory.mutate(
      { title: newCategory },
      {
        onSuccess: () => {
          setNewCategory("");
        },
      },
    );
  };

  // Handle updating a category
  const handleUpdateCategory = () => {
    if (!editingCategory || editingCategory.title.trim() === "") return;

    updateCategory.mutate(
      { id: editingCategory.id, title: editingCategory.title },
      {
        onSuccess: () => {
          setEditingCategory(null);
        },
      },
    );
  };

  // Handle deleting a category
  const handleDeleteCategory = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category and all its FAQs?",
      )
    ) {
      deleteCategory.mutate({ id });
    }
  };

  // Handle creating a new FAQ item
  const handleCreateFaqItem = () => {
    if (
      newFaqItem.categoryId === "" ||
      newFaqItem.question.trim() === "" ||
      newFaqItem.answer.trim() === ""
    )
      return;

    createFaqItem.mutate(newFaqItem, {
      onSuccess: () => {
        setNewFaqItem({
          categoryId: newFaqItem.categoryId,
          question: "",
          answer: "",
        });
      },
    });
  };

  // Handle updating a FAQ item
  const handleUpdateFaqItem = () => {
    if (
      !editingFaqItem ||
      editingFaqItem.question.trim() === "" ||
      editingFaqItem.answer.trim() === ""
    )
      return;

    updateFaqItem.mutate(
      {
        id: editingFaqItem.id,
        categoryId: editingFaqItem.categoryId,
        question: editingFaqItem.question,
        answer: editingFaqItem.answer,
      },
      {
        onSuccess: () => {
          setEditingFaqItem(null);
        },
      },
    );
  };

  // Handle deleting a FAQ item
  const handleDeleteFaqItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaqItem.mutate({ id });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto w-full !max-w-[1322px] p-6 px-4">
      <h1 className="mb-8 text-3xl font-bold">Manage FAQs</h1>

      {/* Categories Section */}
      <div className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Categories</h2>

        {/* Add New Category */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-medium">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={editingCategory ? editingCategory.title : newCategory}
              onChange={(e) =>
                editingCategory
                  ? setEditingCategory({
                      ...editingCategory,
                      title: e.target.value,
                    })
                  : setNewCategory(e.target.value)
              }
              placeholder="Category title"
              className="flex-1 rounded border p-2"
            />
            <button
              onClick={
                editingCategory ? handleUpdateCategory : handleCreateCategory
              }
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {editingCategory ? "Update" : "Add"}
            </button>
            {editingCategory && (
              <button
                onClick={() => setEditingCategory(null)}
                className="rounded bg-gray-400 px-4 py-2 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List of Categories */}
        <div className="space-y-3">
          {allFaqs?.map((category) => (
            <div key={category.id} className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-medium">{category.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setEditingCategory({
                        id: category.id,
                        title: category.title,
                      })
                    }
                    className="bg-yellow-500 rounded px-3 py-1 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 rounded px-3 py-1 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {category.faqItems.length} FAQ item(s)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Items Section */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">FAQ Items</h2>

        {/* Add New FAQ Item */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 text-lg font-medium">
            {editingFaqItem ? "Edit FAQ Item" : "Add New FAQ Item"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select
                value={
                  editingFaqItem
                    ? editingFaqItem.categoryId
                    : newFaqItem.categoryId
                }
                onChange={(e) =>
                  editingFaqItem
                    ? setEditingFaqItem({
                        ...editingFaqItem,
                        categoryId: e.target.value,
                      })
                    : setNewFaqItem({
                        ...newFaqItem,
                        categoryId: e.target.value,
                      })
                }
                className="w-full rounded border p-2"
              >
                <option value="">Select a category</option>
                {allFaqs?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Question</label>
              <input
                type="text"
                value={
                  editingFaqItem ? editingFaqItem.question : newFaqItem.question
                }
                onChange={(e) =>
                  editingFaqItem
                    ? setEditingFaqItem({
                        ...editingFaqItem,
                        question: e.target.value,
                      })
                    : setNewFaqItem({ ...newFaqItem, question: e.target.value })
                }
                placeholder="Enter question"
                className="w-full rounded border p-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Answer</label>
              <textarea
                value={
                  editingFaqItem ? editingFaqItem.answer : newFaqItem.answer
                }
                onChange={(e) =>
                  editingFaqItem
                    ? setEditingFaqItem({
                        ...editingFaqItem,
                        answer: e.target.value,
                      })
                    : setNewFaqItem({ ...newFaqItem, answer: e.target.value })
                }
                placeholder="Enter answer"
                rows={4}
                className="w-full rounded border p-2"
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button
                onClick={
                  editingFaqItem ? handleUpdateFaqItem : handleCreateFaqItem
                }
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                {editingFaqItem ? "Update" : "Add"} FAQ
              </button>
              {editingFaqItem && (
                <button
                  onClick={() => setEditingFaqItem(null)}
                  className="rounded bg-gray-400 px-4 py-2 text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List of FAQ Items by Category */}
        <div className="space-y-6">
          {allFaqs?.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden rounded-lg border"
            >
              <div className="bg-gray-100 p-3 font-medium">
                {category.title}
              </div>
              <div className="divide-y">
                {category.faqItems.length === 0 ? (
                  <div className="p-4 italic text-gray-500">
                    No FAQs in this category.
                  </div>
                ) : (
                  category.faqItems.map((faq) => (
                    <div key={faq.id} className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{faq.question}</h4>
                          <p className="mt-1 text-gray-600">{faq.answer}</p>
                        </div>
                        <div className="ml-4 flex gap-2">
                          <button
                            onClick={() =>
                              setEditingFaqItem({
                                id: faq.id,
                                categoryId: faq.categoryId,
                                question: faq.question,
                                answer: faq.answer,
                              })
                            }
                            className="bg-yellow-500 rounded px-3 py-1 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFaqItem(faq.id)}
                            className="bg-red-500 rounded px-3 py-1 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFAQsPage;
