"use client";

import { api } from "@/trpc/react";
import type { ProductWithCategory } from "@/types/ProductType";
import { formatPrice } from "@/utils/format";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CategoryDropdown from "../store-components/Category/CategoryDropdown";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar = ({
  placeholder = "What are you looking for today?",
  onSearch,
  className = "",
}: SearchBarProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const debouncedSearchTerm = useDebounce(searchKeyword, 300);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading: isSearchLoading } =
    api.product.search.useQuery(
      { query: debouncedSearchTerm },
      { enabled: debouncedSearchTerm.length > 1 },
    );

  useEffect(() => {
    if (searchKeyword.length > 1) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchKeyword]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    if (onSearch) {
      onSearch(value);
    } else {
      router.push(`/search-result?query=${value}`);
    }
    setSearchKeyword("");
    setShowSearchResults(false);
  };

  return (
    <div
      className={`form-search relative flex h-[44px] w-full items-center pl-2 ${className}`}
      ref={searchContainerRef}
    >
      <CategoryDropdown />
      <div className="search-container relative flex h-full w-full items-center">
        <input
          type="text"
          className="search-input h-full w-full border border-[#ddd] px-4 focus:border-[#ddd]"
          placeholder={placeholder}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(searchKeyword)}
        />
        <button
          className="search-button duration-400 md:text-md hover:bg-green !flex h-full cursor-pointer !items-center !justify-center rounded-[.25rem] !rounded-l-none !rounded-r bg-black px-7 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-black/75 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
          onClick={() => handleSearch(searchKeyword)}
        >
          Search
        </button>
        {showSearchResults && searchKeyword.length > 1 && (
          <div className="search-results absolute left-0 right-0 top-full z-50 mt-1 max-h-[400px] overflow-y-auto rounded-md border border-[#ddd] bg-white shadow-lg focus:border-[#ddd]">
            <div className="px-4 py-2 text-sm font-medium text-gray-900">
              {isSearchLoading ? "Searching..." : "Search Results"}
            </div>
            {isSearchLoading ? (
              <div className="flex h-24 w-full items-center justify-center">
                <SpinnerGap size={24} className="animate-spin text-black" />
              </div>
            ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
              <>
                <div className="max-h-[350px] overflow-y-auto">
                  {searchResults.map((product: ProductWithCategory) => {
                    if (
                      typeof product === "object" &&
                      product !== null &&
                      "id" in product &&
                      "title" in product &&
                      "slug" in product &&
                      Array.isArray(product.images)
                    ) {
                      return (
                        <div
                          key={product.id}
                          className="search-result-item cursor-pointer border-b border-gray-100 px-4 py-2 hover:bg-gray-50"
                          onClick={() => {
                            router.push(`/products/${product.slug}`);
                            setShowSearchResults(false);
                            setSearchKeyword("");
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {product.images[0] && (
                              <div className="h-12 w-12 flex-shrink-0">
                                <Image
                                  src={product.images[0]}
                                  alt={product.title}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="line-clamp-1 text-sm font-medium text-gray-900">
                                {product.title}
                              </div>
                              <div className="line-clamp-1 text-xs text-gray-500">
                                {product.shortDescription}
                              </div>
                              <div className="mt-0.5 text-sm font-medium">
                                {product.discountedPrice != null &&
                                product.discountedPrice < product.price ? (
                                  <>
                                    <span className="discounted-price">
                                      {formatPrice(product.discountedPrice)}
                                    </span>
                                    <span className="ml-2 text-gray-400 line-through">
                                      {formatPrice(product.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-black">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <div
                  className="cursor-pointer bg-gray-50 p-2 text-center text-sm font-medium text-black hover:bg-gray-100"
                  onClick={() => handleSearch(searchKeyword)}
                >
                  View all results
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No products found matching &quot;{searchKeyword}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
