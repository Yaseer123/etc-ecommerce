"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/store-context/CartContext";
import { useModalCartContext } from "@/context/store-context/ModalCartContext";
import { useModalWishlistContext } from "@/context/store-context/ModalWishlistContext";
import Product from "./Product/Product";
import productData from "@/data/Product.json";
import useLoginPopup from "@/hooks/useLoginPopup";
import useShopDepartmentPopup from "@/hooks/useShopDepartmentPopup";
import useMenuMobile from "@/hooks/useMenuMobile";
import CategoryDropdown from "./Category/CategoryDropdown";
import MobileMenu from "./MobileMenu";

export default function Menu({ props }: { props?: string }) {
  const pathname = usePathname();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openShopDepartmentPopup, handleShopDepartmentPopup } =
    useShopDepartmentPopup();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const { openModalCart } = useModalCartContext();
  const { cartState } = useCart();
  const { openModalWishlist } = useModalWishlistContext();

  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();
  const handleMouseEnter = (menu: string) => {
    setActiveMegaMenu(menu);
  };

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
  };

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };

    // Gắn sự kiện cuộn khi component được mount
    window.addEventListener("scroll", handleScroll);

    // Hủy sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  const handleGenderClick = (gender: string) => {
    router.push(`/shop/breadcrumb1?gender=${gender}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/shop/breadcrumb1?category=${category}`);
  };

  const handleTypeClick = (type: string) => {
    router.push(`/shop/breadcrumb1?type=${type}`);
  };
  return (
    <>
      <div
        className={`${fixedHeader ? "fixed" : "relative"} header-menu top-0 z-10 w-full bg-white duration-500`}
      >
        <div
          className={`header-menu style-eigh h-[56px] w-full bg-white md:h-[74px] ${props}`}
        >
          <div className="mx-auto h-full w-full !max-w-[1322px] px-4">
            <div className="header-main flex h-full items-center justify-between">
              <div
                className="menu-mobile-icon flex items-center lg:hidden"
                onClick={handleMenuMobile}
              >
                <i className="icon-category text-2xl"></i>
              </div>
              <Link href={"/"} className="flex items-center">
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  Rinors
                </div>
              </Link>
              <div className="form-search flex h-[44px] w-2/3 items-center pl-8 max-lg:hidden">
                <CategoryDropdown />
                <div className="flex h-full w-full items-center">
                  <input
                    type="text"
                    className="search-input h-full w-full border border-line px-4"
                    placeholder="What are you looking for today?"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSearch(searchKeyword)
                    }
                  />
                  <button
                    className="search-button duration-400 md:text-md inline-block !flex h-full cursor-pointer !items-center !justify-center !rounded-none rounded-[12px] !rounded-r bg-black px-10 px-7 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={() => {
                      handleSearch(searchKeyword);
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="right flex gap-12">
                <div className="list-action flex items-center gap-4">
                  <div className="user-icon flex cursor-pointer items-center justify-center">
                    <Icon.User
                      size={24}
                      color="black"
                      onClick={handleLoginPopup}
                    />
                    <div
                      className={`login-popup box-shadow-sm absolute top-[74px] w-[320px] rounded-xl bg-white p-7 ${openLoginPopup ? "open" : ""}`}
                    >
                      <Link
                        href={"/login"}
                        className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                      >
                        Login
                      </Link>
                      <div className="mt-3 pb-4 text-center text-secondary">
                        Don’t have an account?
                        <Link
                          href={"/register"}
                          className="pl-1 text-black hover:underline"
                        >
                          Register
                        </Link>
                      </div>
                      <Link
                        href={"/my-account"}
                        className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] border border-black bg-black bg-white px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-black text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                      >
                        Dashboard
                      </Link>
                      <div className="bottom mt-4 border-t border-line pt-4"></div>
                      <Link href={"#!"} className="body1 hover:underline">
                        Support
                      </Link>
                    </div>
                  </div>
                  <div
                    className="wishlist-icon flex cursor-pointer items-center max-md:hidden"
                    onClick={openModalWishlist}
                  >
                    <Icon.Heart size={24} color="black" />
                  </div>
                  <div
                    className="cart-icon relative flex cursor-pointer items-center"
                    onClick={openModalCart}
                  >
                    <Icon.Handbag size={24} color="black" />
                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                      {cartState.cartArray.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-nav-menu relative z-10 h-[44px] border-b border-t border-line bg-white max-lg:hidden">
          <div className="mx-auto h-full w-full !max-w-[1322px] px-4">
            <div className="top-nav-menu-main flex h-full items-center justify-between">
              <div className="left flex h-full items-center">
                <div className="menu-department-block relative h-full">
                  <div
                    className="menu-department-btn relative flex h-full w-fit cursor-pointer items-center gap-4 bg-black px-4 sm:gap-5"
                    onClick={handleShopDepartmentPopup}
                  >
                    <div className="whitespace-nowrap text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                      Shop By Department
                    </div>
                    <Icon.CaretDown
                      color="#ffffff"
                      className="text-xl max-sm:text-base"
                    />
                  </div>
                  <div
                    className={`sub-menu-department shop-department-popup box-shadow-sm absolute left-0 right-0 top-[44px] h-max rounded-b-2xl bg-white ${openShopDepartmentPopup ? "open" : ""}`}
                  >
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Men’s Clothing
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Women’s Clothing
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Accessories
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Bags & Backpacks
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Shoes
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Jewelry
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Watches
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Beauty & Care
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Pets
                      </Link>
                    </div>
                    <div className="item block">
                      <Link
                        href={"/shop/breadcrumb-img"}
                        className="inline-block whitespace-nowrap py-1.5"
                      >
                        Kids & Baby
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="menu-main style-eight h-full pl-12 max-lg:hidden">
                  <ul className="flex h-full items-center gap-8">
                    <li className="h-full">
                      <Link
                        href="/categories"
                        className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4"
                      >
                        Categories
                      </Link>
                      <div className="mega-menu absolute left-0 top-[44px] w-screen bg-white">
                        <div className="mx-auto w-full !max-w-[1322px] px-4">
                          <div className="flex justify-between py-8">
                            <div className="nav-link grid basis-2/3 grid-cols-4 gap-y-8">
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  For Men
                                </div>
                                <ul>
                                  <li>
                                    <div
                                      onClick={() => handleGenderClick("men")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Starting From 50% Off
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleTypeClick("outerwear")
                                      }
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Outerwear | Coats
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("sweater")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Sweaters | Cardigans
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("shirt")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Shirt | Sweatshirts
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleGenderClick("men")}
                                      className={`link view-all-btn cursor-pointer text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  Massimo Dutti
                                </div>
                                <ul>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("shirt")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Shirt | Clothes
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("top")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Top | Overshirts
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("t-shirt")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      T-shirts | Clothes
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleTypeClick("swimwear")
                                      }
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Swimwear | Underwear
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleCategoryClick("fashion")
                                      }
                                      className={`link view-all-btn text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  Skincare
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
                                      onClick={() => handleTypeClick("lip")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Lip Polish
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("hair")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Hair Care
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleCategoryClick("cosmetic")
                                      }
                                      className={`link view-all-btn text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  Health
                                </div>
                                <ul>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("candle")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Cented Candle
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("drinks")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Health Drinks
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("clothes")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Yoga Clothes
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("mats")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Yoga Equipment
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleCategoryClick("yoga")
                                      }
                                      className={`link view-all-btn text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  For Women
                                </div>
                                <ul>
                                  <li>
                                    <div
                                      onClick={() => handleGenderClick("women")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Starting From 60% Off
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("dress")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Dresses | Jumpsuits
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("t-shirt")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      T-shirts | Sweatshirts
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleTypeClick("accessories")
                                      }
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Accessories | Jewelry
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleGenderClick("women")}
                                      className={`link view-all-btn text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  For Kid
                                </div>
                                <ul>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("bed")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Kids Bed
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("toy")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Boy{String.raw`'s`} Toy
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("blanket")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Baby Blanket
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleTypeClick("clothing")
                                      }
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Newborn Clothing
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleCategoryClick("toys-kid")
                                      }
                                      className={`link view-all-btn text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="pb-2 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                                  For Home
                                </div>
                                <ul>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleCategoryClick("furniture")
                                      }
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Furniture | Decor
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("table")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Table | Living Room
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() => handleTypeClick("chair")}
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Chair | Work Room
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleTypeClick("lighting")
                                      }
                                      className={`link cursor-pointer text-secondary duration-300`}
                                    >
                                      Lighting | Bed Room
                                    </div>
                                  </li>
                                  <li>
                                    <div
                                      onClick={() =>
                                        handleCategoryClick("furniture")
                                      }
                                      className={`link view-all-btn text-secondary duration-300`}
                                    >
                                      View All
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="banner-ads-block basis-1/3 pl-2.5">
                              <div
                                className="banner-ads-item bg-linear relative cursor-pointer overflow-hidden rounded-2xl"
                                onClick={() => handleTypeClick("swimwear")}
                              >
                                <div className="text-content relative z-[1] py-14 pl-8">
                                  <div className="inline-block rounded-sm bg-red px-2 py-0.5 text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                                    Save $10
                                  </div>
                                  <div className="heading6 mt-2">
                                    Dive into Savings <br />
                                    on Swimwear
                                  </div>
                                  <div className="body1 mt-3 text-secondary">
                                    Starting at{" "}
                                    <span className="text-red">$59.99</span>
                                  </div>
                                </div>
                                <Image
                                  src={"/images/slider/bg2-2.png"}
                                  width={200}
                                  height={100}
                                  alt="bg-img"
                                  className="absolute right-0 top-0 basis-1/3 duration-700"
                                />
                              </div>
                              <div
                                className="banner-ads-item bg-linear relative mt-8 cursor-pointer overflow-hidden rounded-2xl"
                                onClick={() => handleTypeClick("accessories")}
                              >
                                <div className="text-content relative z-[1] py-14 pl-8">
                                  <div className="inline-block rounded-sm bg-red px-2 py-0.5 text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                                    Save $10
                                  </div>
                                  <div className="heading6 mt-2">
                                    20% off <br />
                                    accessories
                                  </div>
                                  <div className="body1 mt-3 text-secondary">
                                    Starting at{" "}
                                    <span className="text-red">$59.99</span>
                                  </div>
                                </div>
                                <Image
                                  src={"/images/other/bg-feature.png"}
                                  width={200}
                                  height={100}
                                  alt="bg-img"
                                  className="absolute right-0 top-0 basis-1/3 duration-700"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="h-full">
                      <Link
                        href="/products"
                        className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4"
                      >
                        Products
                      </Link>
                    </li>

                    <li className="relative h-full">
                      <Link
                        href="/blog"
                        className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4"
                      >
                        Blog
                      </Link>
                    </li>
                    <li className="h-full">
                      <Link
                        href="/about"
                        className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4"
                      >
                        About Us
                      </Link>
                    </li>

                    <li className="h-full">
                      <Link
                        href="/faqs"
                        className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4"
                      >
                        FAQ
                      </Link>
                    </li>
                    <li className="h-full">
                      <Link
                        href="/contact"
                        className={`flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4 ${pathname.includes("/pages") ? "active" : ""}`}
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li className="h-full">
                      <Link
                        href="/store-list"
                        className={`flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4 ${pathname.includes("/pages") ? "active" : ""}`}
                      >
                        Store list
                      </Link>
                    </li>
                    <li className="h-full">
                      <Link
                        href="/order-tracking"
                        className={`flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 md:text-xs md:leading-4 ${pathname.includes("/pages") ? "active" : ""}`}
                      >
                        Track Order
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="right flex items-center gap-1">
                <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                  Hotline:
                </div>
                <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                  +01 1234 8888
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu Component */}
      <MobileMenu
        openMenuMobile={openMenuMobile}
        handleMenuMobile={handleMenuMobile}
        productData={productData}
        pathname={pathname}
      />
    </>
  );
}
