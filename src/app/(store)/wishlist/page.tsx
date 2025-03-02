"use client"

import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import HandlePagination from "@/components/store-components/HandlePagination";
import Menu from "@/components/store-components/Menu";
import Product from "@/components/store-components/Product/Product";
import useWishlist from "@/hooks/useWishlist";
import { type ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

export default function Page() {
  const { wishlist } = useWishlist();
  const [sortOption, setSortOption] = useState("");
  const [layoutCol, setLayoutCol] = useState<number | null>(4);
  const [type, setType] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 12;
  const offset = currentPage * productsPerPage;

  const handleLayoutCol = (col: number) => {
    setLayoutCol(col);
  };

  const handleType = (type: string) => {
    setType((prevType) => (prevType === type ? undefined : type));
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // Filter product data by type
  let filteredData = wishlist.filter((product) => {
    let isTypeMatched = true;
    if (type) {
      isTypeMatched = product.type === type;
    }

    return isTypeMatched;
  });

  const totalProducts = filteredData.length;
  const selectedType = type;

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

  // Tạo một bản sao của mảng đã lọc để sắp xếp
  const sortedData = [...filteredData];

  if (sortOption === "soldQuantityHighToLow") {
    filteredData = sortedData.sort((a, b) => b.sold - a.sold);
  }

  if (sortOption === "discountHighToLow") {
    filteredData = sortedData.sort(
      (a, b) =>
        Math.floor(100 - (b.price / b.originPrice) * 100) -
        Math.floor(100 - (a.price / a.originPrice) * 100),
    );
  }

  if (sortOption === "priceHighToLow") {
    filteredData = sortedData.sort((a, b) => b.price - a.price);
  }

  if (sortOption === "priceLowToHigh") {
    filteredData = sortedData.sort((a, b) => a.price - b.price);
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
        <Breadcrumb heading="Wish list" subHeading="Wish list" />
      </div>
      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="container">
          <div className="list-product-block relative">
            <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
              <div className="left has-line flex flex-wrap items-center gap-5">
                <div className="choose-layout flex items-center gap-2">
                  <div
                    className={`item three-col flex cursor-pointer items-center justify-center rounded border border-line p-2 ${layoutCol === 3 ? "active" : ""}`}
                    onClick={() => handleLayoutCol(3)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                    </div>
                  </div>
                  <div
                    className={`item four-col flex cursor-pointer items-center justify-center rounded border border-line p-2 ${layoutCol === 4 ? "active" : ""}`}
                    onClick={() => handleLayoutCol(4)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                    </div>
                  </div>
                  <div
                    className={`item five-col flex cursor-pointer items-center justify-center rounded border border-line p-2 ${layoutCol === 5 ? "active" : ""}`}
                    onClick={() => handleLayoutCol(5)}
                  >
                    <div className="flex items-center gap-0.5">
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right flex items-center gap-3">
                <div className="select-block filter-type relative">
                  <select
                    className="caption1 rounded-lg border border-line py-2 pl-3 pr-8 capitalize md:pr-12"
                    name="select-type"
                    id="select-type"
                    onChange={(e) => handleType(e.target.value)}
                    value={type ?? "Type"}
                  >
                    <option value="Type" disabled>
                      Type
                    </option>
                    {[
                      "t-shirt",
                      "dress",
                      "top",
                      "swimwear",
                      "shirt",
                      "underwear",
                      "sets",
                      "accessories",
                    ].map((item, index) => (
                      <option
                        key={index}
                        className={`item cursor-pointer ${type === item ? "active" : ""}`}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4"
                  />
                </div>
                <div className="select-block relative">
                  <select
                    id="select-filter"
                    name="select-filter"
                    className="caption1 rounded-lg border border-line py-2 pl-3 pr-10 md:pr-20"
                    onChange={(e) => {
                      handleSortChange(e.target.value);
                    }}
                    defaultValue={"Sorting"}
                  >
                    <option value="Sorting" disabled>
                      Sorting
                    </option>
                    <option value="soldQuantityHighToLow">Best Selling</option>
                    <option value="discountHighToLow">Best Discount</option>
                    <option value="priceHighToLow">Price High To Low</option>
                    <option value="priceLowToHigh">Price Low To High</option>
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4"
                  />
                </div>
              </div>
            </div>

            <div className="list-filtered mt-4 flex items-center gap-3">
              <div className="total-product">
                {totalProducts}
                <span className="pl-1 text-secondary">Products Found</span>
              </div>
              {selectedType && (
                <>
                  <div className="list flex items-center gap-3">
                    <div className="h-4 w-px bg-line"></div>
                    {selectedType && (
                      <div
                        className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                        onClick={() => {
                          setType(undefined);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedType}</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="clear-btn border-red flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1"
                    onClick={() => {
                      setType(undefined);
                    }}
                  >
                    <Icon.X
                      color="rgb(219, 68, 68)"
                      className="cursor-pointer"
                    />
                    <span className="text-button-uppercase text-red">
                      Clear All
                    </span>
                  </div>
                </>
              )}
            </div>

            <div
              className={`list-product hide-product-sold grid lg:grid-cols-${layoutCol} mt-7 grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px]`}
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
    </>
  );
}
