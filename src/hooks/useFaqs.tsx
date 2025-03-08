
import { useState } from "react";
import { api } from "@/trpc/react";

export const useFaqs = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [activeQuestion, setActiveQuestion] = useState<string | undefined>();

  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } =
    api.faq.getAllCategories.useQuery();

  // Fetch FAQs for the active category
  const { data: categoryFaqs, isLoading: faqsLoading } =
    api.faq.getFaqsByCategory.useQuery(
      { categoryId: activeCategory ?? "" },
      { enabled: !!activeCategory },
    );

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveQuestion(undefined);
  };

  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    setActiveQuestion((prev) => (prev === questionId ? undefined : questionId));
  };

  return {
    categories,
    categoryFaqs,
    activeCategory,
    activeQuestion,
    categoriesLoading,
    faqsLoading,
    handleCategoryChange,
    toggleQuestion,
  };
};

// Admin hooks for managing FAQs
// Adjust the import path as needed

export const useAdminFaqs = () => {
  // Get the utility functions for query invalidation
  const utils = api.useUtils();

  // Fetch all FAQs with categories for admin panel
  const { data: allFaqs, isLoading } = api.faq.getAllFaqs.useQuery();

  // Function to invalidate related queries
  const invalidateQueries = (): void => {
    void utils.faq.getAllFaqs.invalidate();
    void utils.faq.getAllCategories.invalidate();
    void utils.faq.getFaqsByCategory.invalidate();
  };

  // Create category mutation
  const createCategory = api.faq.createCategory.useMutation({
    onSuccess: invalidateQueries,
  });

  // Update category mutation
  const updateCategory = api.faq.updateCategory.useMutation({
    onSuccess: invalidateQueries,
  });

  // Delete category mutation
  const deleteCategory = api.faq.deleteCategory.useMutation({
    onSuccess: invalidateQueries,
  });

  // Create FAQ item mutation
  const createFaqItem = api.faq.createFaqItem.useMutation({
    onSuccess: invalidateQueries,
  });

  // Update FAQ item mutation
  const updateFaqItem = api.faq.updateFaqItem.useMutation({
    onSuccess: invalidateQueries,
  });

  // Delete FAQ item mutation
  const deleteFaqItem = api.faq.deleteFaqItem.useMutation({
    onSuccess: invalidateQueries,
  });

  // Reorder categories mutation
  const reorderCategories = api.faq.reorderCategories.useMutation({
    onSuccess: invalidateQueries,
  });

  // Reorder FAQ items mutation
  const reorderFaqItems = api.faq.reorderFaqItems.useMutation({
    onSuccess: invalidateQueries,
  });

  return {
    allFaqs,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createFaqItem,
    updateFaqItem,
    deleteFaqItem,
    reorderCategories,
    reorderFaqItems,
  };
};
