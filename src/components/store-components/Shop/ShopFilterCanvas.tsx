"use client";

import React, { useState, useMemo } from "react";
import { type ProductWithCategory } from "@/types/ProductType";
import FilterSidebar from "./FilterSidebar";
import FilterBlock from "./FilterBlock";
import ProductList from "./ProductList";

interface Props {
  data: Array<ProductWithCategory>;
  productPerPage: number;
}

const ShopFilterCanvas: React.FC<Props> = ({ data, productPerPage }) => {
  const [layoutCol, setLayoutCol] = useState<number | null>(4);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  const [category, setCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(
    data.reduce(
      (acc, product) => ({
        max: Math.max(acc.max, product.price),
        min: Math.min(acc.min, product.price),
      }),
      { max: Infinity, min: 0 },
    ),
  );
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = productPerPage;
  const offset = currentPage * productsPerPage;

  const handleCategory = (categoryId: string, categoryName: string) => {
    setCategory({ id: categoryId, name: categoryName });
    setCurrentPage(0);
  };

  const handleLayoutCol = (col: number) => {
    setLayoutCol(col);
  };

  const handleShowOnlySale = () => {
    setShowOnlySale((prev) => !prev);
    setCurrentPage(0);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handleOpenSidebar = () => {
    setOpenSidebar((prev) => !prev);
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values) && values.length >= 2) {
      setPriceRange({ min: Number(values[0]), max: Number(values[1]) });
      setCurrentPage(0);
    }
  };

  const handleBrand = (brand: string) => {
    setBrand((prevBrand) => (prevBrand === brand ? null : brand));
    setCurrentPage(0);
  };

  const handleClearAll = () => {
    setBrand(null);
    setPriceRange({ min: 0, max: Infinity });
    setCategory(null);
    setCurrentPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((product) => {
      let isShowOnlySaleMatched = true;
      if (showOnlySale) {
        isShowOnlySaleMatched = product.sale;
      }

      const isPriceRangeMatched =
        product.price >= priceRange.min && product.price <= priceRange.max;

      let isBrandMatched = true;
      if (brand) {
        isBrandMatched = product.brand === brand;
      }

      let isCategoryMatched = true;
      if (category) {
        isCategoryMatched = product.category?.name === category.name;
      }

      return (
        isShowOnlySaleMatched &&
        isBrandMatched &&
        isPriceRangeMatched &&
        isCategoryMatched
      );
    });
  }, [data, showOnlySale, priceRange, brand, category]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    if (sortOption === "soldQuantityHighToLow") {
      return sorted.sort((a, b) => b.sold - a.sold);
    }
    if (sortOption === "discountHighToLow") {
      return sorted.sort(
        (a, b) =>
          Math.floor(100 - (b.price / b.originPrice) * 100) -
          Math.floor(100 - (a.price / a.originPrice) * 100),
      );
    }
    if (sortOption === "priceHighToLow") {
      return sorted.sort((a, b) => b.price - a.price);
    }
    if (sortOption === "priceLowToHigh") {
      return sorted.sort((a, b) => a.price - b.price);
    }
    return sorted;
  }, [filteredData, sortOption]);

  const totalProducts = sortedData.length;
  const pageCount = Math.ceil(totalProducts / productsPerPage);

  const currentProducts = useMemo(() => {
    return sortedData.slice(offset, offset + productsPerPage);
  }, [sortedData, offset, productsPerPage]);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <FilterSidebar
        openSidebar={openSidebar}
        handleOpenSidebar={handleOpenSidebar}
        handlePriceChange={handlePriceChange}
        handleBrand={handleBrand}
        handleCategory={handleCategory}
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
              selectedBrand={brand}
              selectedCategory={category}
              setBrand={setBrand}
              setCategory={setCategory}
            />
            <ProductList
              data={currentProducts}
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
