"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import { MagnifyingGlass, X, SpinnerGap } from "@phosphor-icons/react/dist/ssr";

// Import shadcn components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MobileSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSearchDialog({
  open,
  onOpenChange,
}: MobileSearchDialogProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  // Reset search when dialog opens
  useEffect(() => {
    if (open) {
      setSearchKeyword("");
    }
  }, [open]);

  // Use the useDebounce hook with 300ms delay
  const debouncedSearchTerm = useDebounce(searchKeyword, 300);

  // Use trpc to fetch search results with loading state
  const { data: searchResults, isLoading: isSearchLoading } =
    api.product.search.useQuery(
      { query: debouncedSearchTerm },
      {
        enabled: debouncedSearchTerm.length > 1,
      },
    );

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
    onOpenChange(false);
  };

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-gray-200 bg-white shadow-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <div className="flex w-full items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pr-10"
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSearch(searchKeyword)
                }
                autoFocus
              />
              {searchKeyword && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchKeyword("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button
              type="button"
              onClick={() => handleSearch(searchKeyword)}
              disabled={!searchKeyword.trim()}
            >
              <MagnifyingGlass className="mr-2" size={16} />
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchKeyword.length > 1 && (
            <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-md border border-gray-200">
              {isSearchLoading ? (
                <div className="flex h-24 w-full items-center justify-center">
                  <SpinnerGap size={24} className="animate-spin text-black" />
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div>
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="cursor-pointer border-b border-gray-100 p-3 hover:bg-gray-50"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <div className="h-14 w-14 flex-shrink-0">
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              width={56}
                              height={56}
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
                          <div className="mt-0.5 text-sm font-medium text-black">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full rounded-none border-t border-gray-100 py-2 text-sm font-medium"
                    onClick={() => handleSearch(searchKeyword)}
                  >
                    View all results
                  </Button>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No products found matching &quot;{searchKeyword}&quot;
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
