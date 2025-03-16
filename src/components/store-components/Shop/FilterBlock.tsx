import React from "react";
import { X, CaretDown } from "@phosphor-icons/react";

interface FilterBlockProps {
  handleOpenSidebar: () => void;
  handleLayoutCol: (col: number) => void;
  handleShowOnlySale: () => void;
  handleSortChange: (option: string) => void;
  handleClearAll: () => void;
  layoutCol: number | null;
  showOnlySale: boolean;
  sortOption: string;
  totalProducts: number;
  selectedSize: string | null | undefined;
  selectedColor: string | null | undefined;
  selectedBrand: string | null | undefined;
  setSize: (size: string | null) => void;
  setColor: (color: string | null) => void;
  setBrand: (brand: string | null) => void;
}

const FilterBlock: React.FC<FilterBlockProps> = ({
  handleOpenSidebar,
  handleLayoutCol,
  handleShowOnlySale,
  handleSortChange,
  handleClearAll,
  layoutCol,
  showOnlySale,
  sortOption,
  totalProducts,
  selectedSize,
  selectedColor,
  selectedBrand,
  setSize,
  setColor,
  setBrand,
}) => {
  return (
    <>
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
              checked={showOnlySale}
            />
            <label htmlFor="filter-sale" className="cation1 cursor-pointer">
              Show only products on sale
            </label>
          </div>
        </div>
        <div className="right flex items-center gap-3">
          <label htmlFor="select-filter" className="caption1 capitalize">
            Sort by
          </label>
          <div className="select-block relative">
            <select
              id="select-filter"
              name="select-filter"
              className="caption1 rounded-lg border border-line py-2 pl-3 pr-10 md:pr-20"
              onChange={(e) => {
                handleSortChange(e.target.value);
              }}
              defaultValue={sortOption}
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
        {(selectedSize ?? selectedColor ?? selectedBrand) && (
          <>
            <div className="list flex items-center gap-3">
              <div className="h-4 w-px bg-line"></div>

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
    </>
  );
};

export default FilterBlock;
