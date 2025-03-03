"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType } from "@/types/ProductType";
import Product from "../Product/Product";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import HandlePagination from "../Other/HandlePagination";

interface Props {
  data: Array<ProductType>;
  productPerPage: number;
}

const ShopFilterOptions: React.FC<Props> = ({ data, productPerPage }) => {
  const [layoutCol, setLayoutCol] = useState<number | null>(4);
  const [sortOption, setSortOption] = useState("");
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [type, setType] = useState<string | undefined>();
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();
  const [brand, setBrand] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = productPerPage;
  const offset = currentPage * productsPerPage;

  const handleLayoutCol = (col: number) => {
    setLayoutCol(col);
  };

  const handleShowOnlySale = () => {
    setShowOnlySale((toggleSelect) => !toggleSelect);
    setCurrentPage(0);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handleType = (type: string) => {
    setType((prevType) => (prevType === type ? undefined : type));
    setCurrentPage(0);
  };

  const handleSize = (size: string) => {
    setSize((prevSize) => (prevSize === size ? undefined : size));
    setCurrentPage(0);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setCurrentPage(0);
    }
  };

  const handleColor = (color: string) => {
    setColor((prevColor) => (prevColor === color ? undefined : color));
    setCurrentPage(0);
  };

  const handleBrand = (brand: string) => {
    setBrand((prevBrand) => (prevBrand === brand ? undefined : brand));
    setCurrentPage(0);
  };

  // Filter product data by dataType
  let filteredData = data.filter((product) => {
    let isShowOnlySaleMatched = true;
    if (showOnlySale) {
      isShowOnlySaleMatched = product.sale;
    }

    let isTypeMatched = true;
    if (type) {
      isTypeMatched = product.type === type;
    }

    let isSizeMatched = true;
    if (size) {
      isSizeMatched = product.sizes.includes(size);
    }

    let isPriceRangeMatched = true;
    if (priceRange.min !== 0 || priceRange.max !== 100) {
      isPriceRangeMatched =
        product.price >= priceRange.min && product.price <= priceRange.max;
    }

    let isColorMatched = true;
    if (color) {
      isColorMatched = product.variation.some((item) => item.color === color);
    }

    let isBrandMatched = true;
    if (brand) {
      isBrandMatched = product.brand === brand;
    }

    return (
      isShowOnlySaleMatched &&
      isTypeMatched &&
      isSizeMatched &&
      isColorMatched &&
      isBrandMatched &&
      isPriceRangeMatched &&
      product.category === "fashion"
    );
  });

  // Create a copy array filtered to sort
  let sortedData = [...filteredData];

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

  const totalProducts = filteredData.length;
  const selectedType = type;
  const selectedSize = size;
  const selectedColor = color;
  const selectedBrand = brand;

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

  const handleClearAll = () => {
    setType(undefined);
    setSize(undefined);
    setColor(undefined);
    setBrand(undefined);
    setPriceRange({ min: 0, max: 100 });
    setCurrentPage(0);
  };

  return (
    <>
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container relative pb-10 pt-24 lg:pt-[134px]">
            <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
              <div className="text-content">
                <div className="heading2 text-center">
                  {type === undefined ? "Shop" : type}
                </div>
                <div className="link caption1 mt-3 flex items-center justify-center gap-1">
                  <Link href={"/"}>Homepage</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="capitalize text-secondary2">
                    {type === undefined ? "Shop" : type}
                  </div>
                </div>
              </div>
              <div className="list-tab mt-12 flex flex-wrap items-center justify-center gap-8 gap-y-5 overflow-hidden lg:mt-[70px]">
                {["t-shirt", "dress", "top", "swimwear", "shirt"].map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`tab-item text-button-uppercase has-line-before line-2px cursor-pointer ${type === item ? "active" : ""}`}
                      onClick={() => handleType(item)}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="container">
          <div className="list-product-block relative">
            <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
              <div className="left flex flex-wrap items-center gap-5">
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
                <div className="check-sale flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="filterSale"
                    id="filter-sale"
                    className="border-line"
                    onChange={handleShowOnlySale}
                  />
                  <label
                    htmlFor="filter-sale"
                    className="cation1 cursor-pointer"
                  >
                    Show only products on sale
                  </label>
                </div>
              </div>
              <div className="right flex flex-wrap items-center gap-5 gap-y-3">
                <div className="select-block filter-type relative">
                  <select
                    className="caption1 rounded-lg border border-line py-2 pl-3 pr-8 capitalize md:pr-12"
                    name="select-type"
                    id="select-type"
                    onChange={(e) => handleType(e.target.value)}
                    value={type === undefined ? "Type" : type}
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
                <div className="select-block filter-size relative">
                  <select
                    className="caption1 rounded-lg border border-line py-2 pl-3 pr-8 capitalize md:pr-12"
                    name="select-size"
                    id="select-size"
                    onChange={(e) => handleSize(e.target.value)}
                    value={size === undefined ? "Size" : size}
                  >
                    <option value="Size" disabled>
                      Size
                    </option>
                    {["XS", "S", "M", "L", "XL", "2XL", "freesize"].map(
                      (item, index) => (
                        <option
                          key={index}
                          className={`item cursor-pointer ${size === item ? "active" : ""}`}
                        >
                          {item}
                        </option>
                      ),
                    )}
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4"
                  />
                </div>
                <div className="select-block filter-color relative">
                  <select
                    className="caption1 rounded-lg border border-line py-2 pl-3 pr-8 capitalize md:pr-12"
                    name="select-color"
                    id="select-color"
                    onChange={(e) => handleColor(e.target.value)}
                    value={color === undefined ? "Color" : color}
                  >
                    <option value="Color" disabled>
                      Color
                    </option>
                    {[
                      "red",
                      "green",
                      "yellow",
                      "purple",
                      "black",
                      "pink",
                      "white",
                    ].map((item, index) => (
                      <option
                        key={index}
                        className={`item cursor-pointer ${color === item ? "active" : ""}`}
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
                <div className="select-block filter-brand relative">
                  <select
                    className="caption1 rounded-lg border border-line py-2 pl-3 pr-8 capitalize md:pr-12"
                    name="select-brand"
                    id="select-brand"
                    onChange={(e) => handleBrand(e.target.value)}
                    value={brand === undefined ? "Brand" : brand}
                  >
                    <option value="Brand" disabled>
                      Brand
                    </option>
                    {["adidas", "hermes", "zara", "nike", "gucci"].map(
                      (item, index) => (
                        <option
                          key={index}
                          className={`item cursor-pointer ${brand === item ? "active" : ""}`}
                        >
                          {item}
                        </option>
                      ),
                    )}
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
              {(selectedType ||
                selectedSize ||
                selectedColor ||
                selectedBrand) && (
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
                    {selectedSize && (
                      <div
                        className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                        onClick={() => {
                          setSize(undefined);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedSize}</span>
                      </div>
                    )}
                    {selectedColor && (
                      <div
                        className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                        onClick={() => {
                          setColor(undefined);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedColor}</span>
                      </div>
                    )}
                    {selectedBrand && (
                      <div
                        className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                        onClick={() => {
                          setBrand(undefined);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedBrand}</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="clear-btn border-red flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1"
                    onClick={handleClearAll}
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
                  <Product key={item.id} data={item} type="grid" />
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
};

export default ShopFilterOptions;
