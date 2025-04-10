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
  
  const initialPriceRange = (() => {
    const prices = data.map((product) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  })();

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(initialPriceRange);
  

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
    if (Array.isArray(values)) {
      setPriceRange({ min: values[0] ?? 0, max: values[1] ?? 0 });
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
        isBrandMatched = product.brand.toLowerCase() === brand.toLowerCase();
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

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.brand.toLowerCase())));
  }, [data]);

  const brandCounts = useMemo(() => {
    return uniqueBrands.reduce(
      (acc, brand) => {
        acc[brand] = data.filter(
          (item) => item.brand.toLowerCase() === brand,
        ).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [uniqueBrands, data]);

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
        brands={uniqueBrands}
        brandCounts={brandCounts}
        initialPriceRange={initialPriceRange}
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
