"use client";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { api } from "@/trpc/react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { label: <HomeIcon size={16} />, href: "/" },
  { label: "FAQs", href: "/faqs" },
];

const Faqs = () => {
  // Fetch all FAQ categories
  const { data: faqCategories, isLoading: categoriesLoading } =
    api.faq.getAllCategories.useQuery();

  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [activeQuestion, setActiveQuestion] = useState<string | undefined>(
    undefined,
  );

  // Get faqs for active category
  const { data: faqItems, isLoading: faqsLoading } =
    api.faq.getFaqsByCategory.useQuery(
      { categoryId: activeTab ?? "" },
      { enabled: !!activeTab },
    );

  // Set initial active tab when categories are loaded
  useEffect(() => {
    if (faqCategories && faqCategories.length > 0 && !activeTab) {
      setActiveTab(faqCategories[0]?.id);
    }
  }, [faqCategories, activeTab]);

  const handleActiveTab = (tabId: string) => {
    setActiveTab(tabId);
    setActiveQuestion(undefined); // Reset active question when changing tabs
  };

  const handleActiveQuestion = (questionId: string) => {
    setActiveQuestion((prevQuestionId) =>
      prevQuestionId === questionId ? undefined : questionId,
    );
  };

  // Category skeleton loader
  const CategorySkeleton = () => (
    <div className="menu-tab flex flex-col gap-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-7 w-32 animate-pulse rounded bg-gray-200"
        ></div>
      ))}
    </div>
  );

  // FAQ item skeleton loader
  const FaqItemSkeleton = () => (
    <div className="tab-question flex flex-col gap-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="question-item overflow-hidden rounded-[20px] border border-[#ddd] px-7 py-5 focus:border-[#ddd]"
        >
          <div className="heading flex items-center justify-between gap-6">
            <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="FAQs" />
      </div>
      <div className="faqs-block py-10 md:py-20">
        <div className="container">
          <div className="flex justify-between">
            <div className="left w-full md:w-1/4">
              {categoriesLoading ? (
                <CategorySkeleton />
              ) : (
                <div className="menu-tab flex flex-col gap-5">
                  {faqCategories && faqCategories.length > 0 ? (
                    faqCategories.map((category) => (
                      <div
                        key={category.id}
                        className={`tab-item heading6 has-line-before text-secondary2 inline-block w-fit cursor-pointer duration-300 ${
                          activeTab === category.id ? "active" : ""
                        }`}
                        onClick={() => handleActiveTab(category.id)}
                      >
                        {category.title}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="body1 text-secondary">
                        No FAQ categories found.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="right w-full md:w-2/3">
              {faqsLoading ? (
                <FaqItemSkeleton />
              ) : (
                <div
                  className={`tab-question flex flex-col gap-5 ${activeTab ? "active" : ""}`}
                >
                  {faqItems && faqItems.length > 0 ? (
                    faqItems.map((faq) => (
                      <div
                        key={faq.id}
                        className={`question-item cursor-pointer overflow-hidden rounded-[20px] border border-[#ddd] px-7 py-5 focus:border-[#ddd] ${
                          activeQuestion === faq.id ? "open" : ""
                        }`}
                        onClick={() => handleActiveQuestion(faq.id)}
                      >
                        <div className="heading flex items-center justify-between gap-6">
                          <div className="heading6">{faq.question}</div>
                          <CaretRight
                            size={24}
                            className={`transition-transform duration-300 ${
                              activeQuestion === faq.id ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                        {activeQuestion === faq.id && (
                          <div className="content body1 mt-4 text-secondary">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="body1 text-secondary">
                        No FAQ items found for this category.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faqs;
