"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { type ProductType } from "@/types/ProductType";
import productData from "@/data/Product.json";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import Footer from "@/components/store-components/Footer";
import HandlePagination from "@/components/store-components/HandlePagination";
import Product from "@/components/store-components/Product/Product";
import Menu from "@/components/store-components/Menu";
import TopNav from "@/components/store-components/TopNav";

export default function Page() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8;
  const offset = currentPage * productsPerPage;
  let filteredData = productData;

  const router = useRouter();

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
  };

  const searchParams = useSearchParams();
  let query = searchParams.get("query")!;

  if (query === null) {
    query = "dress";
  } else {
    filteredData = productData.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()),
    );
  }

  if (filteredData.length === 0) {
    filteredData = [
      {
        id: "no-data",
        category: "no-data",
        type: "no-data",
        name: "no-data",
        gender: "no-data",
        new: false,
        sale: false,
        rate: 0,
        price: 0,
        originPrice: 0,
        brand: "no-data",
        sold: 0,
        quantity: 0,
        quantityPurchase: 0,
        sizes: [],
        variation: [],
        thumbImage: [],
        images: [],
        description: "no-data",
        action: "no-data",
        slug: "no-data",
      },
    ];
  }

  // Find page number base on filteredData
  const pageCount = Math.ceil(filteredData.length / productsPerPage);

  // If page number 0, set current page = 0
  if (pageCount === 0) {
    setCurrentPage(0);
  }

  // Get product data for current page
  let currentProducts: ProductType[];

  if (filteredData.length > 0) {
    currentProducts = filteredData.slice(offset, offset + productsPerPage);
  } else {
    currentProducts = [];
  }

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="Search Result" subHeading="Search Result" />
      </div>
      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="container">
          <div className="heading flex flex-col items-center">
            <div className="heading4 text-center">
              Found {filteredData.length} results for {String.raw`"`}
              {query}
              {String.raw`"`}
            </div>
            <div className="input-block mt-5 h-[44px] w-full sm:mt-8 sm:w-3/5 md:h-[52px] lg:w-1/2">
              <div className="relative h-full w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-32 md:pr-[150px]"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(searchKeyword)
                  }
                />
                <button
                  className="button-main absolute bottom-1 right-1 top-1 flex items-center justify-center"
                  onClick={() => handleSearch(searchKeyword)}
                >
                  search
                </button>
              </div>
            </div>
          </div>
          <div className="list-product-block relative pt-6 md:pt-10">
            <div className="heading6">product Search: {query}</div>
            <div
              className={`list-product hide-product-sold mt-5 grid grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px] lg:grid-cols-4`}
            >
              {currentProducts.map((item) =>
                item.id === "no-data" ? (
                  <div key={item.id} className="no-data-product">
                    No products match the selected criteria.
                  </div>
                ) : (
                  <Product key={item.id} data={item} type="grid" style="" />
                ),
              )}
            </div>

            {pageCount > 1 && (
              <div className="list-pagination mt-7 flex items-center justify-center md:mt-10">
                <HandlePagination
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
