"use client";
import React from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { useFaqs } from "@/hooks/useFaqs"; // Adjust the import path as needed

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "FAQs", href: "/faqs" },
];

const Faqs = () => {
  const {
    categories,
    categoryFaqs,
    activeCategory,
    activeQuestion,
    categoriesLoading,
    faqsLoading,
    handleCategoryChange,
    toggleQuestion,
  } = useFaqs();

  if (categoriesLoading) {
    return (
      <div className="container py-20 text-center">
        <p>Loading FAQs...</p>
      </div>
    );
  }

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="FAQs" />
      </div>
      <div className="faqs-block py-10 md:py-20">
        <div className="container">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="left md:w-1/4">
              <div className="menu-tab flex flex-col gap-5">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    className={`tab-item heading6 has-line-before inline-block w-fit cursor-pointer text-secondary2 duration-300 hover:text-black ${
                      activeCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.title}
                  </div>
                ))}
              </div>
            </div>
            <div className="right md:w-2/3">
              {faqsLoading && activeCategory ? (
                <p>Loading questions...</p>
              ) : categoryFaqs && categoryFaqs.length > 0 ? (
                <div
                  className={`tab-question flex flex-col gap-5 ${activeCategory ? "active" : ""}`}
                >
                  {categoryFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className={`question-item cursor-pointer overflow-hidden rounded-[20px] border border-line px-7 py-5 ${
                        activeQuestion === faq.id ? "open" : ""
                      }`}
                      onClick={() => toggleQuestion(faq.id)}
                    >
                      <div className="heading flex items-center justify-between gap-6">
                        <div className="heading6">{faq.question}</div>
                        <Icon.CaretRight
                          size={24}
                          className={`transform duration-300 ${
                            activeQuestion === faq.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`content body1 mt-3 text-secondary ${
                          activeQuestion === faq.id ? "block" : "hidden"
                        }`}
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p>No FAQs available for this category.</p>
                </div>
              )}
              {categories && categories.length === 0 && (
                <div className="py-8 text-center">
                  <p>No FAQ categories available.</p>
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
