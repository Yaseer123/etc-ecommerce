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
  // Change from string to string array for multiple brands
  const [brands, setBrands] = useState<string[]>(
    brandParam ? brandParam.split(",") : [],
  );
  const [category, setCategory] = useState<{
    id: string;
    name: string;
  } | null>(categoryId ? { id: categoryId, name: "" } : null);

  // Add a dedicated query to fetch category information
  const { data: categoryData } = api.category.getById.useQuery(
    { id: categoryId },
    {
      enabled: !!categoryId,
      staleTime: Infinity,
      gcTime: Infinity,
    },
  );

  // Update category name when category data is fetched
  useEffect(() => {
    if (categoryId && categoryData) {
      setCategory({ id: categoryId, name: categoryData.name });
    }
  }, [categoryId, categoryData]);

  // Define the possible types for attribute filter values
  type AttributeFilterValue = string | string[];

  // Add state for category attributes
  const [attributeFilters, setAttributeFilters] = useState<
    Record<string, AttributeFilterValue>
  >({});

  // Fetch products with filters
  const { data: products, isLoading } = api.product.getAllWithFilters.useQuery({
    categoryId: categoryId || undefined,
    onSale: onSale || undefined,
    brands: brands.length > 0 ? brands : undefined, // Update parameter name to match server
    minPrice,
    maxPrice,
    sort: sortOption || undefined,
    attributes:
      Object.keys(attributeFilters).length > 0 ? attributeFilters : undefined,
  });

  // Fetch brands based on selected category - Improved caching strategy
  const { data: categoryBrands = [] } =
    api.product.getBrandsByCategory.useQuery(
      {
        categoryId: categoryId || undefined,
      },
      {
        // Only fetch when the category changes
        enabled: true,
        // Prevent automatic refetching when other parameters change
        staleTime: Infinity,
        // Force cache to remain valid unless manually invalidated
        gcTime: Infinity,
        // Equivalent behavior to keepPreviousData
        placeholderData: (previousData) => previousData,
        // Prevent refetches on window focus
        refetchOnWindowFocus: false,
        // Prevent refetches when reconnecting
        refetchOnReconnect: false,
      },
    );

  // Fetch category attributes when a category is selected
  const { data: categoryAttributes = [] } =
    api.product.getCategoryAttributes.useQuery(
      { categoryId },
      {
        enabled: !!categoryId,
        staleTime: Infinity,
        gcTime: Infinity,
      },
    );

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

  // When category is loaded, update the name - keep as fallback
  useEffect(() => {
    if (
      categoryId &&
      products &&
      products.length > 0 &&
      category?.id === categoryId &&
      !category.name &&
      !categoryData // Only use this fallback if the dedicated query didn't work
    ) {
      const categoryItem = products.find(
        (p) => p.categoryId === categoryId,
      )?.category;
      if (categoryItem?.name) {
        setCategory({ id: categoryId, name: categoryItem.name });
      }
    }

    // Check if current brands exist in the new category
    if (categoryId && categoryBrands && brands.length > 0) {
      const validBrands = brands.filter((brand) =>
        categoryBrands.includes(brand.toLowerCase()),
      );

      // If any brands were removed, update state and URL
      if (validBrands.length !== brands.length) {
        setBrands(validBrands);
        if (validBrands.length === 0) {
          updateUrlParams({ brand: null });
        } else {
          updateUrlParams({ brand: validBrands.join(",") });
        }
      }
    }

    // If category is cleared, also clear brand selection
    if (!categoryId && brands.length > 0) {
      setBrands([]);
      updateUrlParams({ brand: null });
    }
  }, [
    products,
    categoryId,
    category?.id,
    category?.name,
    categoryBrands,
    brands,
    updateUrlParams,
    categoryData,
  ]);

  // Initialize attribute filters from URL on category change
  useEffect(() => {
    if (categoryId && categoryAttributes.length > 0) {
      const newFilters: Record<string, string | string[]> = {};
      let hasFilters = false;

      // Look for attributes in URL params
      categoryAttributes.forEach((attr) => {
        const paramValue = searchParams?.get(attr.name);
        if (paramValue) {
          hasFilters = true;

          // All attributes are now "select" type only
          if (paramValue.includes(",")) {
            // Handle multiple values (array)
            newFilters[attr.name] = paramValue.split(",");
          } else {
            newFilters[attr.name] = paramValue;
          }
        }
      });

      // Only update state if there are new filters and they're different from current filters
      if (
        hasFilters &&
        JSON.stringify(newFilters) !== JSON.stringify(attributeFilters)
      ) {
        setAttributeFilters(newFilters);
      }
    } else if (!categoryId && Object.keys(attributeFilters).length > 0) {
      // Clear attribute filters when category is removed
      setAttributeFilters({});
    }
  }, [categoryId, categoryAttributes, searchParams, attributeFilters]);

  // Separate effect specifically for clearing filters when category changes
  useEffect(() => {
    // When category changes, clear attribute filters
    if (!categoryId) {
      // Only clear if there are filters to clear
      if (Object.keys(attributeFilters).length > 0) {
        setAttributeFilters({});
      }
    }
  }, [attributeFilters, categoryId]);

  // Filter handlers
  const handleCategory = (categoryId: string, categoryName: string) => {
    // Reset all filter states
    setBrands([]);
    setPriceRange(initialPriceRange);
    setShowOnlySale(false);
    setCurrentSortOption("");
    setCurrentPage(0);

    // Clear attribute filters
    if (Object.keys(attributeFilters).length > 0) {
      setAttributeFilters({});
    }

    // Set the new category
    setCategory({ id: categoryId, name: categoryName });

    // Get parameters to clear all attribute URL parameters
    const attrParams: Record<string, null> = {};
    Object.keys(attributeFilters).forEach((key) => {
      attrParams[key] = null;
    });

    // Update URL with only the new category and reset page to 0
    updateUrlParams({
      category: categoryId,
      brand: null,
      minPrice: null,
      maxPrice: null,
      sale: null,
      sort: null,
      page: "0",
      ...attrParams,
    });
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

  // Modified to handle multiple brands
  const handleBrand = (brandName: string) => {
    let updatedBrands: string[];

    if (brands.includes(brandName)) {
      // Remove if already selected
      updatedBrands = brands.filter((b) => b !== brandName);
    } else {
      // Add if not already selected
      updatedBrands = [...brands, brandName];
    }

    setBrands(updatedBrands);

    // Update URL parameter
    if (updatedBrands.length === 0) {
      updateUrlParams({ brand: null });
    } else {
      updateUrlParams({ brand: updatedBrands.join(",") });
    }
  };

  const handleAttributeChange = (
    name: string,
    value: string | string[] | null,
  ) => {
    // Clone the current filters
    const updatedFilters = { ...attributeFilters };

    if (value === null) {
      // If the attribute already doesn't exist, no need to update
      if (!(name in updatedFilters)) {
        return;
      }

      // Remove the filter
      delete updatedFilters[name];
    } else {
      // Get the current value of the attribute if it exists
      const currentValue = updatedFilters[name];

      if (typeof value === "string") {
        if (!currentValue) {
          // If no current value, set as array with single value
          updatedFilters[name] = [value];
        } else if (Array.isArray(currentValue)) {
          // If current value is array, toggle the value
          if (currentValue.includes(value)) {
            // Remove if already selected
            const newValues = currentValue.filter((v) => v !== value);
            if (newValues.length === 0) {
              // Remove attribute if no values left
              delete updatedFilters[name];
            } else {
              updatedFilters[name] = newValues;
            }
          } else {
            // Add if not already selected
            updatedFilters[name] = [...currentValue, value];
          }
        } else {
          // If current value is a string, convert to array
          updatedFilters[name] = [currentValue, value];
        }
      } else if (Array.isArray(value)) {
        // Direct array assignment (used when loading from URL)
        if (value.length === 0) {
          delete updatedFilters[name];
        } else {
          updatedFilters[name] = value;
        }
      }
    }

    // Update state
    setAttributeFilters(updatedFilters);

    // Update URL parameter
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      updateUrlParams({ [name]: null });
    } else {
      const arrayValue = Array.isArray(updatedFilters[name])
        ? updatedFilters[name]
        : [updatedFilters[name]!];
      const paramValue = arrayValue.join(",");
      updateUrlParams({ [name]: paramValue });
    }
  };

  const clearAttributeFilters = () => {
    // Generate parameters to clear all attribute URL parameters
    const attrParams: Record<string, null> = {};
    Object.keys(attributeFilters).forEach((key) => {
      attrParams[key] = null;
    });

    // Clear attribute filter state
    if (Object.keys(attributeFilters).length > 0) {
      setAttributeFilters({});
    }

    return attrParams;
  };

  const handleClearAll = () => {
    setBrands([]); // Update to clear brands array
    setPriceRange(initialPriceRange);
    setCategory(null);
    setShowOnlySale(false);
    setCurrentSortOption("");

    // Clear attribute filters and get URL parameters to reset
    const attrParams = clearAttributeFilters();

    // Clear all filter params, including attribute filters
    updateUrlParams({
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      sale: null,
      sort: null,
      page: "0",
      ...attrParams,
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

  // Count products per brand - now using the category-filtered brands

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
                      ৳<span>{priceRange.min}</span>
                    </div>
                  </div>
                  <div className="min flex items-center gap-1">
                    <div>Max price:</div>
                    <div className="price-max">
                      ৳<span>{priceRange.max}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Only show brands filter when a category is selected */}
              {category && categoryId && (
                <div className="filter-brand mt-8">
                  <div className="heading6">Brands</div>
                  <div className="list-brand mt-4">
                    {isLoading ? (
                      <div className="my-2 text-secondary">
                        Loading brands...
                      </div>
                    ) : categoryBrands.length === 0 ? (
                      <div className="my-2 text-secondary">
                        No brands available
                      </div>
                    ) : (
                      categoryBrands.map((item, index) => (
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
                                checked={brands.includes(item)}
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
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Category attribute filters section */}
              {category && categoryId && categoryAttributes.length > 0 && (
                <div className="filter-attributes mt-8 border-t border-line pt-8">
                  <div className="heading6">Specifications</div>

                  {categoryAttributes.map((attr, index) => {
                    // Skip if no available options
                    const options = attr.options || attr.availableValues || [];
                    if (options.length === 0) {
                      return null;
                    }

                    // Format attribute name for display
                    const displayName = attr.name
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase());

                    return (
                      <div
                        key={index}
                        className="filter-attribute border-b border-line py-4"
                      >
                        <div className="caption1 mb-3 font-medium">
                          {displayName}
                        </div>

                        {/* Updated to support multi-select */}
                        <div className="flex flex-col gap-2">
                          {options.map((option, idx) => {
                            // Check if this option is selected
                            const isSelected = Array.isArray(
                              attributeFilters[attr.name],
                            )
                              ? (
                                  attributeFilters[attr.name] as string[]
                                )?.includes(option)
                              : attributeFilters[attr.name] === option;

                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between"
                              >
                                <div className="left flex cursor-pointer items-center">
                                  <div className="block-input">
                                    <input
                                      type="checkbox"
                                      id={`${attr.name}-${option}`}
                                      checked={isSelected}
                                      onChange={() => {
                                        // Multi-select behavior
                                        handleAttributeChange(
                                          attr.name,
                                          option,
                                        );
                                      }}
                                    />
                                    <CheckSquare
                                      size={20}
                                      weight="fill"
                                      className="icon-checkbox"
                                    />
                                  </div>
                                  <label
                                    htmlFor={`${attr.name}-${option}`}
                                    className="cursor-pointer pl-2 capitalize"
                                  >
                                    {option}
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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

              <div className="list-filtered mt-4 flex flex-wrap items-center gap-3">
                <div className="total-product">
                  {totalProducts}
                  <span className="pl-1 text-secondary">Products Found</span>
                </div>
                {(category ??
                  brands.length > 0 ??
                  (Object.keys(attributeFilters).length > 0 ||
                    priceRange.min !== initialPriceRange.min ||
                    priceRange.max !== initialPriceRange.max ||
                    showOnlySale)) && (
                  <>
                    <div className="list flex flex-wrap items-center gap-3">
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
                      {/* Modified to show all selected brands */}
                      {brands.map((brandName, index) => (
                        <div
                          key={`brand-${index}`}
                          className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                          onClick={() => handleBrand(brandName)}
                        >
                          <X className="cursor-pointer" />
                          <span>{brandName}</span>
                        </div>
                      ))}
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
                            ৳{priceRange.min} - ৳{priceRange.max}
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
                      {/* Attribute filter pills */}
                      {Object.entries(attributeFilters).map(([key, value]) => {
                        // Format key for display
                        const displayKey = key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase());

                        // Format value for display
                        const displayValue = Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "boolean"
                            ? "Yes"
                            : String(value);

                        return (
                          <div
                            key={key}
                            className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1"
                            onClick={() => {
                              // Use the handler directly without modifying state again
                              handleAttributeChange(key, null);
                            }}
                          >
                            <X className="cursor-pointer" />
                            <span>
                              {displayKey}: {displayValue}
                            </span>
                          </div>
                        );
                      })}
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
