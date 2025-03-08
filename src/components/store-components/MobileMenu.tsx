import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react";
import Product from "./Product/Product";

const MobileMenu = ({
  openMenuMobile,
  handleMenuMobile,
  productData,
  pathname,
}: any) => {
  const [openSubNavMobile, setOpenSubNavMobile] = useState<null | number>(null);

  const handleOpenSubNavMobile = (index: number | null) => {
    if (openSubNavMobile === index) {
      setOpenSubNavMobile(null);
    } else {
      setOpenSubNavMobile(index);
    }
  };

//   const handleCategoryClick = (category: any) => {
//     // Your implementation for category click
//     handleMenuMobile();
//   };

//   const handleTypeClick = (type:any) => {
//     // Your implementation for type click
//     handleMenuMobile();
//   };

  return (
    <div id="menu-mobile" className={`${openMenuMobile ? "open" : ""}`}>
      <div className="menu-container h-full bg-white">
        <div className="container h-full">
          <div className="menu-main h-full overflow-hidden">
            <div className="heading relative flex items-center justify-center py-2">
              <div
                className="close-menu-mobile-btn absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface"
                onClick={handleMenuMobile}
              >
                <Icon.X size={14} />
              </div>
              <Link
                href={"/"}
                className="logo text-center text-3xl font-semibold"
              >
                Rinors
              </Link>
            </div>
            <div className="form-search relative mt-2">
              <Icon.MagnifyingGlass
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
              />
              <input
                type="text"
                placeholder="What are you looking for?"
                className="h-12 w-full rounded-lg border border-line pl-10 pr-4 text-sm"
              />
            </div>
            <div className="list-nav mt-6">
              <ul>
                <li
                  className={`${openSubNavMobile === 2 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(2)}
                >
                  <Link
                    href="/categories"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Categories
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                  <div className="sub-nav-mobile">
                    <div
                      className="back-btn flex items-center gap-3"
                      onClick={() => handleOpenSubNavMobile(2)}
                    >
                      <Icon.CaretLeft />
                      Back
                    </div>
                    <div className="list-nav-item w-full pb-12 pt-3">
                      <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                        <div className="nav-item">
                          <div className="text-button-uppercase pb-1">
                            Sale & Offer
                          </div>
                          <ul>
                            <li>
                              <div
                                onClick={() => handleCategoryClick("cosmetic")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Starting From 50% Off
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("face")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Faces Skin
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("eye")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Eyes Makeup
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("lip")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Lip Polish
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleCategoryClick("cosmetic")}
                                className={`link view-all-btn cursor-pointer text-secondary duration-300`}
                              >
                                View All
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="nav-item">
                          <div className="text-button-uppercase pb-1">
                            Makeup
                          </div>
                          <ul>
                            <li>
                              <div
                                onClick={() => handleTypeClick("hair")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Hair Treatment
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("nail")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Nail Polish
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("lip")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Liquid Lipstick
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("face")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Face Highlighter
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleCategoryClick("cosmetic")}
                                className={`link view-all-btn text-secondary duration-300`}
                              >
                                View All
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="nav-item">
                          <div className="text-button-uppercase pb-1">
                            Skincare
                          </div>
                          <ul>
                            <li>
                              <div
                                onClick={() => handleTypeClick("eye")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Eye Palettes
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("nail")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Nail Custom
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("lip")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Lip Oil
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("hair")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Hair Serums
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleCategoryClick("cosmetic")}
                                className={`link view-all-btn text-secondary duration-300`}
                              >
                                View All
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="nav-item">
                          <div className="text-button-uppercase pb-1">
                            New product
                          </div>
                          <ul>
                            <li>
                              <div
                                onClick={() => handleTypeClick("face")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Faces Skin
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("eye")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Eyes Makeup
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("nail")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Nail Polish
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleTypeClick("lip")}
                                className={`link cursor-pointer text-secondary duration-300`}
                              >
                                Liquid Lipstick
                              </div>
                            </li>
                            <li>
                              <div
                                onClick={() => handleCategoryClick("cosmetic")}
                                className={`link view-all-btn text-secondary duration-300`}
                              >
                                View All
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="banner-ads-block grid items-center gap-6 pt-6 sm:grid-cols-2">
                        <div
                          className="banner-ads-item bg-linear relative overflow-hidden rounded-2xl"
                          onClick={() => handleCategoryClick("cosmetic")}
                        >
                          <div className="text-content relative z-[1] py-14 pl-8">
                            <div className="text-button-uppercase bg-red inline-block rounded-sm px-2 py-0.5 text-white">
                              Save $10
                            </div>
                            <div className="heading6 mt-2">
                              20% off <br />
                              Cosmetic
                            </div>
                            <div className="body1 mt-3 text-secondary">
                              Starting at{" "}
                              <span className="text-red">$59.99</span>
                            </div>
                            <div className="button-main mt-5">Shop Now</div>
                          </div>
                          <Image
                            src={"/images/other/bg-feature-cosmetic.png"}
                            width={1000}
                            height={900}
                            alt="bg-img"
                            className="absolute left-0 top-0 h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li
                  className={`${openSubNavMobile === 3 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(3)}
                >
                  <Link
                    href="/products"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Products
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                  <div className="sub-nav-mobile">
                    <div
                      className="back-btn flex items-center gap-3"
                      onClick={() => handleOpenSubNavMobile(3)}
                    >
                      <Icon.CaretLeft />
                      Back
                    </div>
                    <div className="list-nav-item w-full pb-12 pt-3">
                      <div className="">
                        <div className="nav-link grid grid-cols-2 justify-between gap-5 gap-y-6">
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              Shop Features
                            </div>
                            <ul>
                              <li>
                                <Link
                                  href={"/shop/breadcrumb-img"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/breadcrumb-img"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Breadcrumb IMG
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/breadcrumb1"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/breadcrumb1"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Breadcrumb 1
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/breadcrumb2"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/breadcrumb2"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Breadcrumb 2
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/collection"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/collection"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Collection
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              Shop Features
                            </div>
                            <ul>
                              <li>
                                <Link
                                  href={"/shop/filter-canvas"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/filter-canvas"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Filter Canvas
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/filter-options"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/filter-options"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Filter Options
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/filter-dropdown"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/filter-dropdown"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Filter Dropdown
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/sidebar-list"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/shop/sidebar-list"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Sidebar List
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              Shop Layout
                            </div>
                            <ul>
                              <li>
                                <Link
                                  href={"/shop/default"}
                                  className={`link cursor-pointer text-secondary duration-300 ${
                                    pathname === "/shop/default" ? "active" : ""
                                  }`}
                                >
                                  Shop Default
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/default-grid"}
                                  className={`link cursor-pointer text-secondary duration-300 ${
                                    pathname === "/shop/default-grid"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Default Grid
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/default-list"}
                                  className={`link cursor-pointer text-secondary duration-300 ${
                                    pathname === "/shop/default-list"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Default List
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/fullwidth"}
                                  className={`link cursor-pointer text-secondary duration-300 ${
                                    pathname === "/shop/fullwidth"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Shop Full Width
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/shop/square"}
                                  className={`link text-secondary duration-300 ${
                                    pathname === "/shop/square" ? "active" : ""
                                  }`}
                                >
                                  Shop Square
                                </Link>
                              </li>
                            </ul>
                          </div>
                          <div className="nav-item">
                            <div className="text-button-uppercase pb-1">
                              Products Pages
                            </div>
                            <ul>
                              <li>
                                <Link
                                  href={"/wishlist"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/wishlist" ? "active" : ""
                                  }`}
                                >
                                  Wish List
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/search-result"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/search-result"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Search Result
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/cart"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/cart" ? "active" : ""
                                  }`}
                                >
                                  Shopping Cart
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/login"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/login" ? "active" : ""
                                  }`}
                                >
                                  Login/Register
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/forgot-password"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/forgot-password"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Forgot Password
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/order-tracking"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/order-tracking"
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  Order Tracking
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href={"/my-account"}
                                  className={`text-secondary duration-300 ${
                                    pathname === "/my-account" ? "active" : ""
                                  }`}
                                >
                                  My Account
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="recent-product pt-3">
                          <div className="text-button-uppercase pb-1">
                            Recent Products
                          </div>
                          <div className="list-product hide-product-sold mt-3 grid grid-cols-2 gap-5">
                            {productData
                              .filter(
                                (item) =>
                                  item.action === "add to cart" &&
                                  item.category === "cosmetic",
                              )
                              .slice(0, 2)
                              .map((prd, index) => (
                                <Product
                                  key={index}
                                  data={prd}
                                  type="grid"
                                  style="style-1"
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li
                  className={`${openSubNavMobile === 4 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(4)}
                >
                  <Link
                    href="/blog"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Blog
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li
                  className={`${openSubNavMobile === 5 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(5)}
                >
                  <Link
                    href="/about"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    About Us
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li
                  className={`${openSubNavMobile === 6 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(6)}
                >
                  <Link
                    href="/contact"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Contact Us
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li
                  className={`${openSubNavMobile === 6 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(6)}
                >
                  <Link
                    href="/store-list"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Store List
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li
                  className={`${openSubNavMobile === 7 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(7)}
                >
                  <Link
                    href="/order-tracking"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Track Order
                    <span className="text-right">
                      <Icon.CaretRight size={20} />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
