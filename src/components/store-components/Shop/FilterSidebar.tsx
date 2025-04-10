import React from "react";
import { X, CheckSquare } from "@phosphor-icons/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import FilterByCategory from "./FilterByCategory";

interface SidebarProps {
  openSidebar: boolean;
  handleOpenSidebar: () => void;
  handlePriceChange: (values: number | number[]) => void;
  handleCategory: (categoryId: string, categoryName: string) => void;
  handleBrand: (brand: string) => void;
  priceRange: { min: number; max: number };
  brand: string | null | undefined;
  brands: string[];
  brandCounts: Record<string, number>;
  initialPriceRange: { min: number; max: number };
}

const FilterSidebar: React.FC<SidebarProps> = ({
  openSidebar,
  handleOpenSidebar,
  handlePriceChange,
  handleCategory,
  handleBrand,
  priceRange,
  brand,
  brands,
  brandCounts,
  initialPriceRange,
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
            defaultValue={[0, 1000]}
            min={initialPriceRange.min}
            max={initialPriceRange.max}
            allowCross={false}
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
            {brands.map((item, index) => (
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
                      checked={brand?.toLowerCase() === item}
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
                <div className="text-secondary2">({brandCounts[item]})</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
