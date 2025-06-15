"use client";

import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import HandlePagination from "@/components/store-components/HandlePagination";
import Product from "@/components/store-components/Product/Product";
import { api } from "@/trpc/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { HomeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

export default function WishlistPage() {
  const { data: session } = useSession(); // Check if the user is logged in

  const {
    data: wishList,
    isLoading,
    isError,
  } = api.wishList.getWishList.useQuery(undefined, {
    enabled: !!session?.user, // Only fetch wishlist if the user is logged in
  });

  const [layoutCol, setLayoutCol] = useState<number | null>(4);
  const [sortOption, setSortOption] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 12;
  const offset = currentPage * productsPerPage;

  const handleLayoutCol = (col: number) => {
    setLayoutCol(col);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const sortedData = useMemo(() => {
    if (!wishList) return [];
    const sorted = [...wishList];

    if (sortOption === "priceHighToLow") {
      return sorted.sort((a, b) => b.product.price - a.product.price);
    }
    if (sortOption === "priceLowToHigh") {
      return sorted.sort((a, b) => a.product.price - b.product.price);
    }
    return sorted;
  }, [wishList, sortOption]);

  const totalProducts = sortedData.length;
  const pageCount = Math.ceil(totalProducts / productsPerPage);

  const currentProducts = useMemo(() => {
    return sortedData.slice(offset, offset + productsPerPage);
  }, [sortedData, offset, productsPerPage]);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  const breadcrumbItems = [
    {
      label: <HomeIcon size={16} />,
      href: "/",
    },
    {
      label: "Wishlist",
      href: "/wishlist",
    },
  ];

  if (!session?.user) {
    return (
      <>
        <div id="header" className="relative w-full">
          <Breadcrumb items={breadcrumbItems} pageTitle="Wishlist" />
        </div>
        <div className="py-10 md:py-14 lg:py-20">
          <div className="mx-auto w-full !max-w-[1322px] px-4">
            <div className="text-center text-lg font-semibold text-gray-600">
              Login to view your wishlist.
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <div id="header" className="relative w-full">
          <Breadcrumb items={breadcrumbItems} pageTitle="Wishlist" />
        </div>
        <div className="py-10 md:py-14 lg:py-20">
          <div className="mx-auto w-full !max-w-[1322px] px-4">
            <div className="text-center text-lg font-semibold text-gray-600">
              Loading your wishlist...
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div id="header" className="relative w-full">
          <Breadcrumb items={breadcrumbItems} pageTitle="Wishlist" />
        </div>
        <div className="py-10 md:py-14 lg:py-20">
          <div className="mx-auto w-full !max-w-[1322px] px-4">
            <div className="text-center text-lg font-semibold text-red-600">
              Failed to load your wishlist. Please try again later.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="Wishlist" />
      </div>
      <div className="py-10 md:py-14 lg:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="list-product-block relative">
            <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
              <div className="left has-line flex flex-wrap items-center gap-5">
                <div className="choose-layout flex items-center gap-2">
                  {/* Three-column layout */}
                  <div
                    className={`duration-400 flex cursor-pointer items-center justify-center rounded border border-[#ddd] p-2 transition-all ease-in-out hover:border-black focus:border-[#ddd] ${
                      layoutCol === 3
                        ? "border-black bg-black hover:bg-black/75"
                        : ""
                    }`}
                    onClick={() => handleLayoutCol(3)}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <span
                          key={index}
                          className={`h-4 w-[3px] rounded-sm ${
                            layoutCol === 3 ? "bg-white" : "bg-secondary2"
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>

                  {/* Four-column layout */}
                  <div
                    className={`duration-400 flex cursor-pointer items-center justify-center rounded border border-[#ddd] p-2 transition-all ease-in-out hover:border-black focus:border-[#ddd] ${
                      layoutCol === 4
                        ? "border-black bg-black hover:bg-black/75"
                        : ""
                    }`}
                    onClick={() => handleLayoutCol(4)}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <span
                          key={index}
                          className={`h-4 w-[3px] rounded-sm ${
                            layoutCol === 4 ? "bg-white" : "bg-secondary2"
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>

                  {/* Five-column layout */}
                  <div
                    className={`duration-400 flex cursor-pointer items-center justify-center rounded border border-[#ddd] p-2 transition-all ease-in-out hover:border-black focus:border-[#ddd] ${
                      layoutCol === 5
                        ? "border-black bg-black hover:bg-black/75"
                        : ""
                    }`}
                    onClick={() => handleLayoutCol(5)}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={`h-4 w-[3px] rounded-sm ${
                            layoutCol === 5 ? "bg-white" : "bg-secondary2"
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="right flex items-center gap-3">
                <div className="relative">
                  <select
                    id="select-filter"
                    name="select-filter"
                    className="rounded-lg border border-[#ddd] py-2 pl-3 pr-10 text-base font-normal leading-[22] focus:border-[#ddd] md:pr-20 md:text-[13px] md:leading-5"
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
            </div>

            {totalProducts === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-6 h-16 w-16 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v1.5M3 8.25l1.5 10.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25L21 8.25M3 8.25h18"
                  />
                </svg>
                <div className="mb-2 text-2xl font-semibold text-gray-700">
                  Your wishlist is empty
                </div>
                <div className="mb-6 max-w-md text-center text-gray-500">
                  Add products to your wishlist to keep track of items you love.
                  Start exploring our collection and add your favorites!
                </div>
                <a
                  href="/products"
                  className="inline-block rounded bg-black px-6 py-3 font-semibold text-white shadow transition hover:bg-black/80"
                >
                  Browse Products
                </a>
              </div>
            ) : (
              <div
                className={`list-product grid lg:grid-cols-${layoutCol} mt-7 grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px]`}
              >
                {currentProducts.map((item) =>
                  item.id === "no-data" ? (
                    <div key={item.id} className="no-data-product">
                      No products match the selected criteria.
                    </div>
                  ) : (
                    <Product key={item.id} data={item.product} style="" />
                  ),
                )}
              </div>
            )}

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
}
