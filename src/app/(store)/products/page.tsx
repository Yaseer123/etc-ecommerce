"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { api } from "@/trpc/react";
import { type ProductWithCategory } from "@/types/ProductType";
import ProductList from "@/components/store-components/Shop/ProductList";
import { CheckSquare, CaretDown, X } from "@phosphor-icons/react/dist/ssr";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import FilterByCategory from "@/components/store-components/Shop/FilterByCategory";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract filter parameters from URL
  const categoryId = searchParams?.get("category") ?? "";
  const onSale = searchParams?.get("sale") === "true";
  const brandParam = searchParams?.get("brand") ?? "";
  const minPrice = searchParams?.get("minPrice")
    ? Number(searchParams?.get("minPrice"))
    : undefined;
  const maxPrice = searchParams?.get("maxPrice")
    ? Number(searchParams?.get("maxPrice"))
    : undefined;
  const sortOption = searchParams?.get("sort") ?? "";
  const pageParam = searchParams?.get("page")
    ? Number(searchParams.get("page"))
    : 0;

  // State from URL parameters
  const [showOnlySale, setShowOnlySale] = useState(onSale);
  const [currentSortOption, setCurrentSortOption] = useState(sortOption);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [brand, setBrand] = useState<string | null>(brandParam || null);
  const [category, setCategory] = useState<{
    id: string;
    name: string;
  } | null>(categoryId ? { id: categoryId, name: "" } : null);

  // Fetch products with filters
  const { data: products, isLoading } = api.product.getAllWithFilters.useQuery({
    categoryId: categoryId || undefined,
    onSale: onSale || undefined,
    brand: brandParam || undefined,
    minPrice,
    maxPrice,
    sort: sortOption || undefined,
  });

  // Fetch global price range from all products in database
  const { data: globalPriceRange } = api.product.getPriceRange.useQuery();

  // Set default price range based on global min/max from database
  const [initialPriceRange, setInitialPriceRange] = useState({
    min: 0,
    max: 1000,
  });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: minPrice ?? 0,
    max: maxPrice ?? 1000,
  });

  // Setup initial price range based on global product prices from database
  useEffect(() => {
    if (globalPriceRange) {
      const dbMinPrice = globalPriceRange.min;
      const dbMaxPrice = globalPriceRange.max;

      // Set the initial range from database values
      setInitialPriceRange({ min: dbMinPrice, max: dbMaxPrice });

      // Set current range based on URL params if present, otherwise use global range
      setPriceRange({
        min: minPrice ?? dbMinPrice,
        max: maxPrice ?? dbMaxPrice,
      });
    }
  }, [globalPriceRange, minPrice, maxPrice]);

  // When category is loaded, update the name
  useEffect(() => {
    if (
      categoryId &&
      products &&
      products.length > 0 &&
      category?.id === categoryId &&
      !category.name
    ) {
      const categoryItem = products.find(
        (p) => p.categoryId === categoryId,
      )?.category;
      if (categoryItem?.name) {
        setCategory({ id: categoryId, name: categoryItem.name });
      }
    }
  }, [products, categoryId, category?.id, category?.name]); // Remove category from the dependency array

  // Update URL when filters change - use a memoized function to prevent recreation
  const updateUrlParams = useMemo(() => {
    return (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams?.toString());

      // Update or remove each parameter
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 0 when filters change
      if (!("page" in newParams)) {
        params.set("page", "0");
      }

      // Build the new URL
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      // Use replace instead of push to prevent scroll to top, and add scroll: false option
      router.replace(newUrl, { scroll: false });
    };
  }, [searchParams, router]);

  // Filter handlers
  const handleCategory = (categoryId: string, categoryName: string) => {
    setCategory({ id: categoryId, name: categoryName });
    updateUrlParams({ category: categoryId });
  };

  const handleShowOnlySale = () => {
    const newValue = !showOnlySale;
    setShowOnlySale(newValue);
    updateUrlParams({ sale: newValue ? "true" : null });
  };

  const handleSortChange = (option: string) => {
    setCurrentSortOption(option);
    updateUrlParams({ sort: option === "Sorting" ? null : option });
  };

  const handlePriceChange = (values: number | number[]) => {
    if (Array.isArray(values)) {
      const newPriceRange = { min: values[0] ?? 0, max: values[1] ?? 0 };
      setPriceRange(newPriceRange);

      // Only update URL if price range has changed significantly (debounce)
      const minPrice =
        newPriceRange.min !== initialPriceRange.min
          ? String(newPriceRange.min)
          : null;
      const maxPrice =
        newPriceRange.max !== initialPriceRange.max
          ? String(newPriceRange.max)
          : null;

      updateUrlParams({
        minPrice,
        maxPrice,
      });
    }
  };

  const handleBrand = (newBrand: string) => {
    const updatedBrand = brand === newBrand ? null : newBrand;
    setBrand(updatedBrand);
    updateUrlParams({ brand: updatedBrand });
  };

  const handleClearAll = () => {
    setBrand(null);
    setPriceRange(initialPriceRange);
    setCategory(null);
    setShowOnlySale(false);
    setCurrentSortOption("");

    // Clear all filter params
    updateUrlParams({
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      sale: null,
      sort: null,
      page: "0",
    });
  };

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
    updateUrlParams({ page: selected.toString() });
  };

  // Pagination setup
  const productsPerPage = 12;
  const offset = currentPage * productsPerPage;
  const totalProducts = products?.length ?? 0;
  const pageCount = Math.ceil(totalProducts / productsPerPage);

  // Get current page of products
  const currentProducts = useMemo(() => {
    return products?.slice(offset, offset + productsPerPage) ?? [];
  }, [products, offset, productsPerPage]);

  // Extract unique brands from products
  const uniqueBrands = useMemo(() => {
    if (!products) return [];
    return Array.from(
      new Set(products.map((item) => item.brand.toLowerCase())),
    );
  }, [products]);

  // Count products per brand
  const brandCounts = useMemo(() => {
    if (!products) return {};
    return uniqueBrands.reduce(
      (acc, brand) => {
        acc[brand] = products.filter(
          (item) => item.brand.toLowerCase() === brand,
        ).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [uniqueBrands, products]);

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "products",
      href: "/products",
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} pageTitle="Shop" />
      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="container">
          <div className="flex gap-y-8 max-md:flex-col-reverse max-md:flex-wrap">
            {/* Sidebar */}
            <div className="sidebar w-full md:w-1/3 md:pr-12 lg:w-1/4">
              <div className="filter-type pb-4">
                <div className="heading6">Categories</div>
                <div className="list-type mt-4">
                  <FilterByCategory handleCategory={handleCategory} />
                </div>
              </div>

              <div className="filter-price mt-8 border-b border-line pb-8">
                <div className="heading6">Price Range</div>
                <Slider
                  range
                  value={[priceRange.min, priceRange.max]}
                  min={initialPriceRange.min}
                  max={initialPriceRange.max}
                  onChange={handlePriceChange}
                  className="mt-5"
                />
                <div className="price-block mt-4 flex flex-col gap-3">
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

              <div className="filter-brand mt-8">
                <div className="heading6">Brands</div>
                <div className="list-brand mt-4">
                  {uniqueBrands.map((item, index) => (
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
                        ({brandCounts[item] ?? 0})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="list-product-block w-full md:w-2/3 md:pl-3 lg:w-3/4">
              <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
                <div className="left has-line flex flex-wrap items-center gap-5">
                  <div className="check-sale flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="filterSale"
                      id="filter-sale"
                      className="border-line"
                      checked={showOnlySale}
                      onChange={handleShowOnlySale}
                    />
                    <label
                      htmlFor="filter-sale"
                      className="caption1 cursor-pointer"
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
                      className="caption1 rounded-lg border border-line py-2 pl-3 pr-10 md:pr-20"
                      onChange={(e) => {
                        handleSortChange(e.target.value);
                      }}
                      value={currentSortOption || "Sorting"}
                    >
                      <option value="Sorting" disabled>
                        Sorting
                      </option>
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
                {(category ??
                  brand ??
                  (priceRange.min !== initialPriceRange.min ||
                    priceRange.max !== initialPriceRange.max ||
                    showOnlySale)) && (
                  <>
                    <div className="list flex items-center gap-3">
                      <div className="h-4 w-px bg-line"></div>
                      {category && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                          onClick={() => {
                            setCategory(null);
                            updateUrlParams({ category: null });
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>{category.name}</span>
                        </div>
                      )}
                      {brand && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                          onClick={() => {
                            setBrand(null);
                            updateUrlParams({ brand: null });
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>{brand}</span>
                        </div>
                      )}
                      {(priceRange.min !== initialPriceRange.min ||
                        priceRange.max !== initialPriceRange.max) && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1"
                          onClick={() => {
                            setPriceRange(initialPriceRange);
                            updateUrlParams({ minPrice: null, maxPrice: null });
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>
                            ${priceRange.min} - ${priceRange.max}
                          </span>
                        </div>
                      )}
                      {showOnlySale && (
                        <div
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1"
                          onClick={() => {
                            setShowOnlySale(false);
                            updateUrlParams({ sale: null });
                          }}
                        >
                          <X className="cursor-pointer" />
                          <span>On Sale</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="clear-btn flex cursor-pointer items-center gap-1 rounded-full border border-red px-2 py-1"
                      onClick={handleClearAll}
                    >
                      <X color="rgb(219, 68, 68)" className="cursor-pointer" />
                      <span className="text-button-uppercase text-red">
                        Clear All
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Product list with loading state */}
              {isLoading ? (
                <div className="flex h-60 items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <ProductList
                  data={currentProducts as ProductWithCategory[]}
                  layoutCol={4}
                  pageCount={pageCount}
                  handlePageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
