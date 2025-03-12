"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { type ProductType } from "@/types/ProductType";
import Product from "../Product/Product";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import HandlePagination from "../HandlePagination";

interface Props {
  data: Array<ProductType>;
  productPerPage: number;
  // dataType: string | null;
  // productStyle: string;
}

const ShopFilterCanvas: React.FC<Props> = ({
  data,
  productPerPage,
  // dataType,
  // productStyle,
}) => {
  const [layoutCol, setLayoutCol] = useState<number | null>(4);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  // const [type, setType] = useState<string | null>(dataType);
  const [size, setSize] = useState<string | null>();
  const [color, setColor] = useState<string | null>();
  const [brand, setBrand] = useState<string | null>();
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(
    data.reduce(
      (acc, product) => ({
        max: Math.max(acc.max, product.price),
        min: Math.min(acc.min, product.price),
      }),
      { max: -Infinity, min: Infinity },
    ),
  );
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

  const handleOpenSidebar = () => {
    setOpenSidebar((toggleOpen) => !toggleOpen);
  };

  // const handleType = (type: string) => {
  //   setType((prevType) => (prevType === type ? null : type));
  //   setCurrentPage(0);
  // };

  const handleSize = (size: string) => {
    setSize((prevSize) => (prevSize === size ? null : size));
    setCurrentPage(0);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values) && values.length >= 2) {
      setPriceRange({ min: Number(values[0]), max: Number(values[1]) });
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

  // Filter product data by dataType
  let filteredData = data.filter((product) => {
    let isShowOnlySaleMatched = true;
    if (showOnlySale) {
      isShowOnlySaleMatched = product.sale;
    }

    // let isDataTypeMatched = true;
    // if (dataType) {
    //   isDataTypeMatched = product.type === dataType;
    // }

    // let isTypeMatched = true;
    // if (type) {
    //   dataType = type;
    //   isTypeMatched = product.type === type;
    // }

    let isSizeMatched = true;
    if (size) {
      isSizeMatched = product.sizes.includes(size);
    }

    let isPriceRangeMatched = true;
    if (priceRange.min !== 0 || priceRange.max !== 100) {
      isPriceRangeMatched =
        product.price >= priceRange.min && product.price <= priceRange.max;
    }

    // let isColorMatched = true;
    // if (color) {
    //   isColorMatched = product.variation.some((item) => item.color === color);
    // }

    let isBrandMatched = true;
    if (brand) {
      isBrandMatched = product.brand === brand;
    }

    return (
      isShowOnlySaleMatched &&
      // isDataTypeMatched &&
      // isTypeMatched &&
      isSizeMatched &&
      // isColorMatched &&
      isBrandMatched &&
      isPriceRangeMatched &&
      product.category === "fashion"
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
  // const selectedType = type;
  const selectedSize = size;
  const selectedColor = color;
  const selectedBrand = brand;

  if (filteredData.length === 0) {
    filteredData = [
      {
        id: "no-data",
        category: "no-data",
        // type: "no-data",
        name: "no-data",
        // gender: "no-data",
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
        // variation: [],
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
    // setType(null);
    setSize(null);
    setColor(null);
    setBrand(null);
    setPriceRange({ min: 0, max: 100 });
    setCurrentPage(0);
    // dataType = null;
    // setType(dataType);
  };

  return (
    <>
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="relative mx-auto w-full !max-w-[1322px] px-4 pb-10 pt-24 lg:pt-[134px]">
            <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
              <div className="text-content">
                <div className="heading2 text-center">Shop</div>
                <div className="link mt-3 flex items-center justify-center gap-1 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                  <Link href={"/"}>Homepage</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="capitalize text-secondary2">Shop</div>
                </div>
              </div>
              {/* <div className="list-tab mt-12 flex flex-wrap items-center justify-center gap-8 gap-y-5 overflow-hidden lg:mt-[70px]">
                {["t-shirt", "dress", "top", "swimwear", "shirt"].map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`tab-item text-sm leading-5 font-semibold uppercase md:text-xs md:leading-4 has-line-before line-2px cursor-pointer ${dataType === item ? "active" : ""}`}
                      onClick={() => handleType(item)}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`sidebar style-canvas ${openSidebar ? "open" : ""}`}
        onClick={handleOpenSidebar}
      >
        <div
          className="sidebar-main"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="heading flex items-center justify-between">
            <div className="heading5">Filters</div>
            <Icon.X
              size={20}
              weight="bold"
              onClick={handleOpenSidebar}
              className="cursor-pointer"
            />
          </div>
          <div className="filter-size mt-8 border-b border-line pb-8">
            <div className="heading6">Size</div>
            <div className="list-size mt-4 flex flex-wrap items-center gap-3 gap-y-4">
              {["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((item, index) => (
                <div
                  key={index}
                  className={`size-item text-button flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line ${size === item ? "active" : ""}`}
                  onClick={() => handleSize(item)}
                >
                  {item}
                </div>
              ))}
              <div
                className={`size-item text-button flex items-center justify-center rounded-full border border-line px-4 py-2 ${size === "freesize" ? "active" : ""}`}
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
              defaultValue={[priceRange.min, priceRange.max]}
              min={priceRange.min}
              max={priceRange.max}
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
          <div className="filter-brand mt-8 pb-8">
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
                        <Icon.CheckSquare
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
      </div>

      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="list-product-block relative">
            <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
              <div className="left has-line flex flex-wrap items-center gap-5">
                <div
                  className="filter-sidebar-btn flex cursor-pointer items-center gap-2"
                  onClick={handleOpenSidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4 21V14"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 10V3"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 21V12"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V3"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 21V16"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 12V3"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 14H7"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 8H15"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 16H23"
                      stroke="#1F1F1F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Filters</span>
                </div>
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
                <label
                  htmlFor="select-filter"
                  className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                >
                  Sort by
                </label>
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
              {(selectedSize ?? selectedColor ?? selectedBrand) && (
                <>
                  <div className="list flex items-center gap-3">
                    <div className="h-4 w-px bg-line"></div>
                    {/* {selectedType && (
                      <div
                        className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                        onClick={() => {
                          setType(null);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedType}</span>
                      </div>
                    )} */}
                    {selectedSize && (
                      <div
                        className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                        onClick={() => {
                          setSize(null);
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
                          setColor(null);
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
                          setBrand(null);
                        }}
                      >
                        <Icon.X className="cursor-pointer" />
                        <span>{selectedBrand}</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="clear-btn flex cursor-pointer items-center gap-1 rounded-full border border-red px-2 py-1"
                    onClick={handleClearAll}
                  >
                    <Icon.X
                      color="rgb(219, 68, 68)"
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-semibold uppercase leading-5 text-red md:text-xs md:leading-4">
                      Clear All
                    </span>
                  </div>
                </>
              )}
            </div>

            <div
              className={`list-product hide-product-sold grid lg:grid-cols-${layoutCol} mt-7 grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px]`}
            >
              {data.map((item) =>
                item.id === "no-data" ? (
                  <div key={item.id} className="no-data-product">
                    No products match the selected criteria.
                  </div>
                ) : (
                  <Product
                    key={item.id}
                    data={item}
                    type="marketplace"
                    // style={productStyle}
                  />
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

export default ShopFilterCanvas;
