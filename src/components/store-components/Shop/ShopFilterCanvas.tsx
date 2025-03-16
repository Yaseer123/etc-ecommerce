"use client";

import React, { useState } from "react";
import { type ProductType } from "@/types/ProductType";
import Sidebar from "./FilterSidebar";
import FilterBlock from "./FilterBlock";
import ProductList from "./ProductList";

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
      <Sidebar
        openSidebar={openSidebar}
        handleOpenSidebar={handleOpenSidebar}
        handlePriceChange={handlePriceChange}
        handleBrand={handleBrand}
        priceRange={priceRange}
        brand={brand}
        data={data}
      />

      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="list-product-block relative">
            <FilterBlock
              handleOpenSidebar={handleOpenSidebar}
              handleLayoutCol={handleLayoutCol}
              handleShowOnlySale={handleShowOnlySale}
              handleSortChange={handleSortChange}
              handleClearAll={handleClearAll}
              layoutCol={layoutCol}
              showOnlySale={showOnlySale}
              sortOption={sortOption}
              totalProducts={totalProducts}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              selectedBrand={selectedBrand}
              setSize={setSize}
              setColor={setColor}
              setBrand={setBrand}
            />
            <ProductList
              data={data}
              layoutCol={layoutCol}
              pageCount={pageCount}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopFilterCanvas;
