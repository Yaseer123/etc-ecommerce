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
import CategoryDropdown from "./category/CategoryDropdown";

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
          <div className="container mx-auto h-full">
            <div className="header-main flex h-full items-center justify-between">
              <div
                className="menu-mobile-icon flex items-center lg:hidden"
                onClick={handleMenuMobile}
              >
                <i className="icon-category text-2xl"></i>
              </div>
              <Link href={"/"} className="flex items-center">
                <div className="heading4">Rinors</div>
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
                    className="search-button button-main !flex h-full !items-center !justify-center !rounded-none !rounded-r bg-black px-7"
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
                        className="button-main w-full text-center"
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
                        className="button-main w-full border border-black bg-white text-center text-black"
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
          <div className="container h-full">
            <div className="top-nav-menu-main flex h-full items-center justify-between">
              <div className="left flex h-full items-center">
                <div className="menu-department-block relative h-full">
                  <div
                    className="menu-department-btn relative flex h-full w-fit cursor-pointer items-center gap-4 bg-black px-4 sm:gap-5"
                    onClick={handleShopDepartmentPopup}
                  >
                    <div className="text-button-uppercase whitespace-nowrap text-white">
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
                        href="#!"
                        className="text-button-uppercase flex h-full items-center justify-center duration-300"
                      >
                        Features
                      </Link>
                      <div className="mega-menu absolute left-0 top-[44px] w-screen bg-white">
                        <div className="container">
                          <div className="flex justify-between py-8">
                            <div className="nav-link grid basis-2/3 grid-cols-4 gap-y-8">
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
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
                                <div className="text-button-uppercase pb-2">
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
                                <div className="text-button-uppercase pb-2">
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
                                <div className="text-button-uppercase pb-2">
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
                                <div className="text-button-uppercase pb-2">
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
                                <div className="text-button-uppercase pb-2">
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
                                <div className="text-button-uppercase pb-2">
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
                                  <div className="text-button-uppercase bg-red inline-block rounded-sm px-2 py-0.5 text-white">
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
                                  <div className="text-button-uppercase bg-red inline-block rounded-sm px-2 py-0.5 text-white">
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
                        href="#!"
                        className="text-button-uppercase flex h-full items-center justify-center duration-300"
                      >
                        Shop
                      </Link>
                      <div className="mega-menu absolute left-0 top-[44px] w-screen bg-white">
                        <div className="container">
                          <div className="flex justify-between py-8">
                            <div className="nav-link flex basis-2/3 justify-between pr-12">
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Shop Features
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/shop/breadcrumb-img"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/breadcrumb-img" ? "active" : ""}`}
                                    >
                                      Shop Breadcrumb IMG
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/breadcrumb1"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/breadcrumb1" ? "active" : ""}`}
                                    >
                                      Shop Breadcrumb 1
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/breadcrumb2"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/breadcrumb2" ? "active" : ""}`}
                                    >
                                      Shop Breadcrumb 2
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/collection"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/collection" ? "active" : ""}`}
                                    >
                                      Shop Collection
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Shop Features
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/shop/filter-canvas"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/filter-canvas" ? "active" : ""}`}
                                    >
                                      Shop Filter Canvas
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/filter-options"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/filter-options" ? "active" : ""}`}
                                    >
                                      Shop Filter Options
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/filter-dropdown"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/filter-dropdown" ? "active" : ""}`}
                                    >
                                      Shop Filter Dropdown
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/sidebar-list"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/sidebar-list" ? "active" : ""}`}
                                    >
                                      Shop Sidebar List
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Shop Layout
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/shop/default"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/shop/default" ? "active" : ""}`}
                                    >
                                      Shop Default
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/default-grid"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/shop/default-grid" ? "active" : ""}`}
                                    >
                                      Shop Default Grid
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/default-list"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/shop/default-list" ? "active" : ""}`}
                                    >
                                      Shop Default List
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/fullwidth"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/shop/fullwidth" ? "active" : ""}`}
                                    >
                                      Shop Full Width
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/shop/square"}
                                      className={`link text-secondary duration-300 ${pathname === "/shop/square" ? "active" : ""}`}
                                    >
                                      Shop Square
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/checkout"}
                                      className={`link text-secondary duration-300 ${pathname === "/checkout" ? "active" : ""}`}
                                    >
                                      Checkout
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/checkout2"}
                                      className={`link text-secondary duration-300 ${pathname === "/checkout2" ? "active" : ""}`}
                                    >
                                      Checkout Style 2
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Products Pages
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/wishlist"}
                                      className={`link text-secondary duration-300 ${pathname === "/wishlist" ? "active" : ""}`}
                                    >
                                      Wish List
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/search-result"}
                                      className={`link text-secondary duration-300 ${pathname === "/search-result" ? "active" : ""}`}
                                    >
                                      Search Result
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/cart"}
                                      className={`link text-secondary duration-300 ${pathname === "/cart" ? "active" : ""}`}
                                    >
                                      Shopping Cart
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/login"}
                                      className={`link text-secondary duration-300 ${pathname === "/login" ? "active" : ""}`}
                                    >
                                      Login/Register
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/forgot-password"}
                                      className={`link text-secondary duration-300 ${pathname === "/forgot-password" ? "active" : ""}`}
                                    >
                                      Forgot Password
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/order-tracking"}
                                      className={`link text-secondary duration-300 ${pathname === "/order-tracking" ? "active" : ""}`}
                                    >
                                      Order Tracking
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/my-account"}
                                      className={`link text-secondary duration-300 ${pathname === "/my-account" ? "active" : ""}`}
                                    >
                                      My Account
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="recent-product basis-1/3 pl-2.5">
                              <div className="text-button-uppercase pb-2">
                                Recent Products
                              </div>
                              <div className="list-product hide-product-sold mt-3 grid grid-cols-2 gap-5">
                                {productData
                                  .filter(
                                    (item) => item.action === "add to cart",
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
                    <li className="h-full">
                      <Link
                        href="#!"
                        className="text-button-uppercase flex h-full items-center justify-center duration-300"
                      >
                        Product
                      </Link>
                      <div className="mega-menu absolute left-0 top-[44px] w-screen bg-white">
                        <div className="container">
                          <div className="flex justify-between py-8">
                            <div className="nav-link flex basis-2/3 justify-between pr-5 xl:pr-14">
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Products Features
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/product/default"}
                                      className={`text-secondary duration-300 ${pathname === "/product/default" ? "active" : ""}`}
                                    >
                                      Products Defaults
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/sale"}
                                      className={`text-secondary duration-300 ${pathname === "/product/sale" ? "active" : ""}`}
                                    >
                                      Products Sale
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/countdown-timer"}
                                      className={`text-secondary duration-300 ${pathname === "/product/countdown-timer" ? "active" : ""}`}
                                    >
                                      Products Countdown Timer
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/grouped"}
                                      className={`text-secondary duration-300 ${pathname === "/product/grouped" ? "active" : ""}`}
                                    >
                                      Products Grouped
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/bought-together"}
                                      className={`text-secondary duration-300 ${pathname === "/product/bought-together" ? "active" : ""}`}
                                    >
                                      Frequently Bought Together
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/out-of-stock"}
                                      className={`text-secondary duration-300 ${pathname === "/product/out-of-stock" ? "active" : ""}`}
                                    >
                                      Products Out Of Stock
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/variable"}
                                      className={`text-secondary duration-300 ${pathname === "/product/variable" ? "active" : ""}`}
                                    >
                                      Products Variable
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Products Features
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/product/external"}
                                      className={`text-secondary duration-300 ${pathname === "/product/external" ? "active" : ""}`}
                                    >
                                      Products External
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/on-sale"}
                                      className={`text-secondary duration-300 ${pathname === "/product/on-sale" ? "active" : ""}`}
                                    >
                                      Products On Sale
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/discount"}
                                      className={`text-secondary duration-300 ${pathname === "/product/discount" ? "active" : ""}`}
                                    >
                                      Products With Discount
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/sidebar"}
                                      className={`text-secondary duration-300 ${pathname === "/product/sidebar" ? "active" : ""}`}
                                    >
                                      Products With Sidebar
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/fixed-price"}
                                      className={`text-secondary duration-300 ${pathname === "/product/fixed-price" ? "active" : ""}`}
                                    >
                                      Products Fixed Price
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="nav-item">
                                <div className="text-button-uppercase pb-2">
                                  Products Layout
                                </div>
                                <ul>
                                  <li>
                                    <Link
                                      href={"/product/thumbnail-left"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/product/thumbnail-left" ? "active" : ""}`}
                                    >
                                      Products Thumbnails Left
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/thumbnail-bottom"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/product/thumbnail-bottom" ? "active" : ""}`}
                                    >
                                      Products Thumbnails Bottom
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/one-scrolling"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/product/one-scrolling" ? "active" : ""}`}
                                    >
                                      Products Grid 1 Scrolling
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/two-scrolling"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/product/two-scrolling" ? "active" : ""}`}
                                    >
                                      Products Grid 2 Scrolling
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/combined-one"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/product/combined-one" ? "active" : ""}`}
                                    >
                                      Products Combined 1
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      href={"/product/combined-two"}
                                      className={`link cursor-pointer text-secondary duration-300 ${pathname === "/product/combined-two" ? "active" : ""}`}
                                    >
                                      Products Combined 2
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="recent-product basis-1/3 pl-2.5">
                              <div className="text-button-uppercase pb-2">
                                Recent Products
                              </div>
                              <div className="list-product hide-product-sold mt-3 grid grid-cols-2 gap-5">
                                {productData
                                  .filter(
                                    (item) => item.action === "add to cart",
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
                    <li className="relative h-full">
                      <Link
                        href="#!"
                        className="text-button-uppercase flex h-full items-center justify-center duration-300"
                      >
                        Blog
                      </Link>
                      <div className="sub-menu absolute -left-10 rounded-b-xl bg-white px-5 py-3">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/blog/default"
                              className={`text-secondary duration-300 ${pathname === "/blog/default" ? "active" : ""}`}
                            >
                              Blog Default
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/list"
                              className={`text-secondary duration-300 ${pathname === "/blog/list" ? "active" : ""}`}
                            >
                              Blog List
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/grid"
                              className={`text-secondary duration-300 ${pathname === "/blog/grid" ? "active" : ""}`}
                            >
                              Blog Grid
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail1"
                              className={`text-secondary duration-300 ${pathname === "/blog/detail1" ? "active" : ""}`}
                            >
                              Blog Detail 1
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail2"
                              className={`text-secondary duration-300 ${pathname === "/blog/detail2" ? "active" : ""}`}
                            >
                              Blog Detail 2
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="relative h-full">
                      <Link
                        href="#!"
                        className={`text-button-uppercase flex h-full items-center justify-center duration-300 ${pathname.includes("/pages") ? "active" : ""}`}
                      >
                        Pages
                      </Link>
                      <div className="sub-menu absolute -left-10 rounded-b-xl bg-white px-5 py-3">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/pages/about"
                              className={`text-secondary duration-300 ${pathname === "/pages/about" ? "active" : ""}`}
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/contact"
                              className={`text-secondary duration-300 ${pathname === "/pages/contact" ? "active" : ""}`}
                            >
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/store-list"
                              className={`text-secondary duration-300 ${pathname === "/pages/store-list" ? "active" : ""}`}
                            >
                              Store List
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/page-not-found"
                              className={`text-secondary duration-300 ${pathname === "/pages/page-not-found" ? "active" : ""}`}
                            >
                              404
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/faqs"
                              className={`text-secondary duration-300 ${pathname === "/pages/faqs" ? "active" : ""}`}
                            >
                              FAQs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/coming-soon"
                              className={`text-secondary duration-300 ${pathname === "/pages/coming-soon" ? "active" : ""}`}
                            >
                              Coming Soon
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/customer-feedbacks"
                              className={`text-secondary duration-300 ${pathname === "/pages/customer-feedbacks" ? "active" : ""}`}
                            >
                              Customer Feedbacks
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="right flex items-center gap-1">
                <div className="caption1">Hotline:</div>
                <div className="text-button-uppercase">+01 1234 8888</div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  Anvogue
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
                    <a
                      href={"#!"}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      Features
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
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
                                  onClick={() =>
                                    handleCategoryClick("cosmetic")
                                  }
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
                                  onClick={() =>
                                    handleCategoryClick("cosmetic")
                                  }
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
                    <a
                      href={"#!"}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      Shop
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
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
                                      pathname === "/shop/default"
                                        ? "active"
                                        : ""
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
                                      pathname === "/shop/square"
                                        ? "active"
                                        : ""
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
                    <a
                      href={"#!"}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      Product
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(4)}
                      >
                        <Icon.CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pb-12 pt-3">
                        <div className="">
                          <div className="nav-link grid grid-cols-2 justify-between gap-5 gap-y-6">
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                Products Features
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/default"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/default"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Defaults
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/sale"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/sale"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Sale
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/countdown-timer"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/countdown-timer"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Countdown Timer
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/grouped"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/grouped"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Grouped
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/bought-together"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/bought-together"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Frequently Bought Together
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/out-of-stock"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/out-of-stock"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Out Of Stock
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/variable"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/variable"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Variable
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                Products Features
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/external"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/external"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products External
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/on-sale"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/on-sale"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products On Sale
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/discount"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/discount"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products With Discount
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/sidebar"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/sidebar"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products With Sidebar
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/fixed-price"}
                                    className={`text-secondary duration-300 ${
                                      pathname === "/product/fixed-price"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Fixed Price
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div className="nav-item col-span-2">
                              <div className="text-button-uppercase pb-1">
                                Products Layout
                              </div>
                              <ul>
                                <li>
                                  <Link
                                    href={"/product/thumbnail-left"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/thumbnail-left"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Thumbnails Left
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/thumbnail-bottom"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/thumbnail-bottom"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Thumbnails Bottom
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/one-scrolling"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/one-scrolling"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Grid 1 Scrolling
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/two-scrolling"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/two-scrolling"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Grid 2 Scrolling
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/combined-one"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/combined-one"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Combined 1
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={"/product/combined-two"}
                                    className={`link text-secondary duration-300 ${
                                      pathname === "/product/combined-two"
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    Products Combined 2
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="recent-product pt-4">
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
                    className={`${openSubNavMobile === 5 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(5)}
                  >
                    <a
                      href={"#!"}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      Blog
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(5)}
                      >
                        <Icon.CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pb-6 pt-2">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/blog/default"
                              className={`text-secondary duration-300 ${
                                pathname === "/blog/default" ? "active" : ""
                              }`}
                            >
                              Blog Default
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/list"
                              className={`text-secondary duration-300 ${
                                pathname === "/blog/list" ? "active" : ""
                              }`}
                            >
                              Blog List
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/grid"
                              className={`text-secondary duration-300 ${
                                pathname === "/blog/grid" ? "active" : ""
                              }`}
                            >
                              Blog Grid
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail1"
                              className={`text-secondary duration-300 ${
                                pathname === "/blog/detail1" ? "active" : ""
                              }`}
                            >
                              Blog Detail 1
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/detail2"
                              className={`text-secondary duration-300 ${
                                pathname === "/blog/detail2" ? "active" : ""
                              }`}
                            >
                              Blog Detail 2
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 6 ? "open" : ""}`}
                    onClick={() => handleOpenSubNavMobile(6)}
                  >
                    <a
                      href={"#!"}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      Pages
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <div
                        className="back-btn flex items-center gap-3"
                        onClick={() => handleOpenSubNavMobile(6)}
                      >
                        <Icon.CaretLeft />
                        Back
                      </div>
                      <div className="list-nav-item w-full pb-6 pt-2">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/pages/about"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/about" ? "active" : ""
                              }`}
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/contact"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/contact" ? "active" : ""
                              }`}
                            >
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/store-list"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/store-list" ? "active" : ""
                              }`}
                            >
                              Store List
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/page-not-found"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/page-not-found"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              404
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/faqs"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/faqs" ? "active" : ""
                              }`}
                            >
                              FAQs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/coming-soon"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/coming-soon"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Coming Soon
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/customer-feedbacks"
                              className={`text-secondary duration-300 ${
                                pathname === "/pages/customer-feedbacks"
                                  ? "active"
                                  : ""
                              }`}
                            >
                              Customer Feedbacks
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
