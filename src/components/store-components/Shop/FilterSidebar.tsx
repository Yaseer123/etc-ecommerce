import React from "react";
import { X, CheckSquare } from "@phosphor-icons/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import type { ProductWithCategory } from "@/types/ProductType";
import FilterByCategory from "./FilterByCategory";

interface SidebarProps {
  openSidebar: boolean;
  handleOpenSidebar: () => void;
  handlePriceChange: (values: number | number[]) => void;
  handleCategory: (categoryId: string, categoryName: string) => void;
  handleBrand: (brand: string) => void;
  priceRange: { min: number; max: number };
  brand: string | null | undefined;
  data: Array<ProductWithCategory>;
}

const FilterSidebar: React.FC<SidebarProps> = ({
  openSidebar,
  handleOpenSidebar,
  handlePriceChange,
  handleCategory,
  handleBrand,
  priceRange,
  brand,
  data,
}) => {
  return (
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
          <X
            size={20}
            weight="bold"
            onClick={handleOpenSidebar}
            className="cursor-pointer"
          />
        </div>

        <div className="filter-categories mt-8 pb-5">
          <div className="heading6">Categories</div>
          <div className="list-categories mt-4">
            <FilterByCategory handleCategory={handleCategory} />
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
                    ({data.filter((dataItem) => dataItem.brand === item).length}
                    )
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
