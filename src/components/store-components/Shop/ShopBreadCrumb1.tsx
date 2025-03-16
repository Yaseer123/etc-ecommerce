"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CaretRight,
  CheckSquare,
  CaretDown,
  X,
} from "@phosphor-icons/react/dist/ssr";
import Product from "../Product/Product";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import HandlePagination from "../HandlePagination";
import { type ProductType } from "@/types/ProductType";

interface Props {
  data: Array<ProductType>;
  productPerPage: number;
  dataType: string | null | undefined;
  gender: string | null;
  category: string | null;
}

const ShopBreadCrumb1: React.FC<Props> = ({
  data,
  productPerPage,
  dataType,
  gender,
  category,
}) => {
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [type, setType] = useState<string | null | undefined>(dataType);
  const [size, setSize] = useState<string | null>();
  const [color, setColor] = useState<string | null>();
  const [brand, setBrand] = useState<string | null>();
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = productPerPage;
  const offset = currentPage * productsPerPage;

  const handleShowOnlySale = () => {
    setShowOnlySale((toggleSelect) => !toggleSelect);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handleType = (type: string | null) => {
    setType((prevType) => (prevType === type ? null : type));
    setCurrentPage(0);
  };

  const handleSize = (size: string) => {
    setSize((prevSize) => (prevSize === size ? null : size));
    setCurrentPage(0);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0], max: values[1] });
      setCurrentPage(0);
    }
  };

  const handleColor = (color: string) => {
    setColor((prevColor) => (prevColor === color ? null : color));
    setCurrentPage(0);
  };

  const handleBrand = (brand: string) => {
    setBrand((prevBrand) => (prevBrand === brand ? null : brand));
    setCurrentPage(0);
  };

  // Filter product
  let filteredData = data.filter((product) => {
    let isShowOnlySaleMatched = true;
    if (showOnlySale) {
      isShowOnlySaleMatched = product.sale;
    }

    let isDatagenderMatched = true;
    if (gender) {
      isDatagenderMatched = product.gender === gender;
    }

    let isDataCategoryMatched = true;
    if (category) {
      isDataCategoryMatched = product.category === category;
    }

    let isDataTypeMatched = true;
    if (dataType) {
      isDataTypeMatched = product.type === dataType;
    }

    let isTypeMatched = true;
    if (type) {
      dataType = type;
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
      isDatagenderMatched &&
      isDataCategoryMatched &&
      isDataTypeMatched &&
      isTypeMatched &&
      isSizeMatched &&
      isColorMatched &&
      isBrandMatched &&
      isPriceRangeMatched
    );
  });

  // Create a copy array filtered to sort
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
    dataType = null;
    setShowOnlySale(false);
    setSortOption("");
    setType(null);
    setSize(null);
    setColor(null);
    setBrand(null);
    setPriceRange({ min: 0, max: 100 });
    setCurrentPage(0);
    handleType(null);
  };

  return (
    <>
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="relative mx-auto w-full !max-w-[1322px] px-4 pb-10 pt-24 lg:pt-[134px]">
            <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
              <div className="text-content">
                <div className="heading2 text-center">
                  {dataType === null ? "Shop" : dataType}
                </div>
                <div className="link mt-3 flex items-center justify-center gap-1 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                  <Link href={"/"}>Homepage</Link>
                  <CaretRight size={14} className="text-secondary2" />
                  <div className="capitalize text-secondary2">
                    {dataType === null ? "Shop" : dataType}
                  </div>
                </div>
              </div>
              <div className="list-tab mt-12 flex flex-wrap items-center justify-center gap-8 gap-y-5 overflow-hidden lg:mt-[70px]">
                {["t-shirt", "dress", "top", "swimwear", "shirt"].map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`tab-item has-line-before line-2px cursor-pointer text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4 ${dataType === item ? "active" : ""}`}
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
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex gap-y-8 max-md:flex-col-reverse max-md:flex-wrap">
            <div className="sidebar w-full md:w-1/3 md:pr-12 lg:w-1/4">
              <div className="filter-type border-b border-line pb-8">
                <div className="heading6">Products Type</div>
                <div className="list-type mt-4">
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
                    <div
                      key={index}
                      className={`item flex cursor-pointer items-center justify-between ${dataType === item ? "active" : ""}`}
                      onClick={() => handleType(item)}
                    >
                      <div className="has-line-before capitalize text-secondary hover:text-black">
                        {item}
                      </div>
                      <div className="text-secondary2">
                        (
                        {
                          data.filter(
                            (dataItem) =>
                              dataItem.type === item &&
                              dataItem.category === "fashion",
                          ).length
                        }
                        )
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-size mt-8 border-b border-line pb-8">
                <div className="heading6">Size</div>
                <div className="list-size mt-4 flex flex-wrap items-center gap-3 gap-y-4">
                  {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map(
                    (item, index) => (
                      <div
                        key={index}
                        className={`size-item flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6 ${size === item ? "active" : ""}`}
                        onClick={() => handleSize(item)}
                      >
                        {item}
                      </div>
                    ),
                  )}
                  <div
                    className={`size-item flex items-center justify-center rounded-full border border-line px-4 py-2 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6 ${size === "freesize" ? "active" : ""}`}
                    onClick={() => handleSize("freesize")}
                  >
                    Freesize
                  </div>
                </div>
              </div>
              <div className="filter-price mt-8 border-b border-line pb-8">
                <div className="heading6">Price Range</div>
                <Slider
                  range
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  onChange={handlePriceChange}
                  className="mt-5"
                />
                <div className="price-block mt-4 flex flex-wrap items-center justify-between">
                  <div className="min flex items-center gap-1">
                    <div>Min price:</div>
                    <div className="price-min">
                      $<span>{priceRange.min}</span>
                    </div>
                  </div>
                  <div className="min flex items-center gap-1">
                    <div>Max price:</div>
                    <div className="price-max">
                      $<span>{priceRange.max}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-color mt-8 border-b border-line pb-8">
                <div className="heading6">colors</div>
                <div className="list-color mt-4 flex flex-wrap items-center gap-3 gap-y-4">
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "pink" ? "active" : ""}`}
                    onClick={() => handleColor("pink")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-[#F4C5BF]"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      pink
                    </div>
                  </div>
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "red" ? "active" : ""}`}
                    onClick={() => handleColor("red")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-red"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      red
                    </div>
                  </div>
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "green" ? "active" : ""}`}
                    onClick={() => handleColor("green")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-green"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      green
                    </div>
                  </div>
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "yellow" ? "active" : ""}`}
                    onClick={() => handleColor("yellow")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-yellow"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      yellow
                    </div>
                  </div>
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "purple" ? "active" : ""}`}
                    onClick={() => handleColor("purple")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-purple"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      purple
                    </div>
                  </div>
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "black" ? "active" : ""}`}
                    onClick={() => handleColor("black")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-black"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      black
                    </div>
                  </div>
                  <div
                    className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${color === "white" ? "active" : ""}`}
                    onClick={() => handleColor("white")}
                  >
                    <div className="color h-5 w-5 rounded-full bg-[#F6EFDD]"></div>
                    <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">
                      white
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-brand mt-8">
                <div className="heading6">Brands</div>
                <div className="list-brand mt-4">
                  {["adidas", "hermes", "zara", "nike", "gucci"].map(
                    (item, index) => (
                      <div
                        key={index}
                        className="brand-item flex items-center justify-between"
                      >
                        <div className="left flex cursor-pointer items-center">
                          <div className="block-input">
                            <input
                              type="checkbox"
                              name={item}
                              id={item}
                              checked={brand === item}
                              onChange={() => handleBrand(item)}
                            />
                            <CheckSquare
                              size={20}
                              weight="fill"
                              className="icon-checkbox"
                            />
                          </div>
                          <label
                            htmlFor={item}
                            className="brand-name cursor-pointer pl-2 capitalize"
                          >
                            {item}
                          </label>
                        </div>
                        <div className="text-secondary2">
                          (
                          {
                            data.filter(
                              (dataItem) =>
                                dataItem.brand === item &&
                                dataItem.category === "fashion",
                            ).length
                          }
                          )
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
            <div className="list-product-block w-full md:w-2/3 md:pl-3 lg:w-3/4">
              <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
                <div className="left has-line flex flex-wrap items-center gap-5">
                  <div className="choose-layout flex items-center gap-2">
                    <div className="item three-col active flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-line">
                      <div className="flex items-center gap-0.5">
                        <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                        <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                        <span className="h-4 w-[3px] rounded-sm bg-secondary2"></span>
                      </div>
                    </div>
                    <Link
                      href={"/shop/sidebar-list"}
                      className="item row flex h-8 w-8 cursor-pointer items-center justify-center rounded border border-line"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="h-[3px] w-4 rounded-sm bg-secondary2"></span>
                        <span className="h-[3px] w-4 rounded-sm bg-secondary2"></span>
                        <span className="h-[3px] w-4 rounded-sm bg-secondary2"></span>
                      </div>
                    </Link>
                  </div>
                  <div className="check-sale flex items-center gap-2">
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
                <div className="right flex items-center gap-3">
                  <div className="select-block relative">
                    <select
                      id="select-filter"
                      name="select-filter"
                      className="rounded-lg border border-line py-2 pl-3 pr-10 text-base font-normal leading-[22] md:pr-20 md:text-[13px] md:leading-5"
                      onChange={(e) => {
                        handleSortChange(e.target.value);
                      }}
                      defaultValue={"Sorting"}
                    >
                      <option value="Sorting" disabled>
                        Sorting
                      </option>
                      <option value="soldQuantityHighToLow">
                        Best Selling
                      </option>
                      <option value="discountHighToLow">Best Discount</option>
                      <option value="priceHighToLow">Price High To Low</option>
                      <option value="priceLowToHigh">Price Low To High</option>
                    </select>
                    <CaretDown
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
                            setType(null);
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>{selectedType}</span>
                        </div>
                      )}
                      {selectedSize && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                          onClick={() => {
                            setSize(null);
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>{selectedSize}</span>
                        </div>
                      )}
                      {selectedColor && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                          onClick={() => {
                            setColor(null);
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>{selectedColor}</span>
                        </div>
                      )}
                      {selectedBrand && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                          onClick={() => {
                            setBrand(null);
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>{selectedBrand}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="clear-btn flex cursor-pointer items-center gap-1 rounded-full border border-red px-2 py-1"
                      onClick={handleClearAll}
                    >
                      <X color="rgb(219, 68, 68)" className="cursor-pointer" />
                      <span className="text-sm font-semibold uppercase leading-5 text-red md:text-xs md:leading-4">
                        Clear All
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="list-product hide-product-sold mt-7 grid grid-cols-2 gap-[20px] sm:gap-[30px] lg:grid-cols-3">
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
                <div className="list-pagination mt-7 flex items-center md:mt-10">
                  <HandlePagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopBreadCrumb1;
