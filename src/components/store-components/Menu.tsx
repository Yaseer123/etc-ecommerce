"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/context/store-context/CartContext";
import useLoginPopup from "@/hooks/useLoginPopup";
import useMenuMobile from "@/hooks/useMenuMobile";
import CategoryDropdown from "./Category/CategoryDropdown";
import MobileMenu from "./MobileMenu";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { Handbag, Heart, User } from "@phosphor-icons/react/dist/ssr";
import TopNav from "./TopNav";

export default function Menu({
  isAuthenticated,
  props,
}: {
  isAuthenticated: boolean;
  props?: string;
}) {
  const pathname = usePathname();
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const { openModalCart } = useModalCartStore();
  const { cartArray } = useCartStore();
  const { openModalWishlist } = useModalWishlistStore();

  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (value: string) => {
    router.push(`/search-result?query=${value}`);
    setSearchKeyword("");
  };

  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  return (
    <>
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div
        className={`${fixedHeader ? "fixed" : "relative"} header-menu top-0 z-10 w-full bg-white duration-500 lg:pt-5`}
      >
        <div
          className={`header-menu style-eight h-[56px] w-full bg-white md:h-[74px] ${props}`}
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
                    className="search-button duration-400 md:text-md !flex h-full cursor-pointer !items-center !justify-center rounded-[12px] !rounded-l-none !rounded-r bg-black px-7 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
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
                    <User size={24} color="black" onClick={handleLoginPopup} />
                    <div
                      className={`login-popup box-shadow-sm absolute top-[74px] w-[320px] rounded-xl bg-white p-7 ${openLoginPopup ? "open" : ""}`}
                    >
                      {isAuthenticated ? (
                        <Link
                          href={"/api/auth/signout"}
                          className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        >
                          Sign Out
                        </Link>
                      ) : (
                        <Link
                          href={"/login"}
                          className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        >
                          Login
                        </Link>
                      )}
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
                    </div>
                  </div>
                  {isAuthenticated && (
                    <div
                      className="wishlist-icon flex cursor-pointer items-center max-md:hidden"
                      onClick={openModalWishlist}
                    >
                      <Heart size={24} color="black" />
                    </div>
                  )}
                  <div
                    className="cart-icon relative flex cursor-pointer items-center"
                    onClick={openModalCart}
                  >
                    <Handbag size={24} color="black" />
                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                      {cartArray.length}
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
                <div className="menu-main style-eight h-full max-lg:hidden">
                  <ul className="flex h-full items-center gap-8">
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
      />
    </>
  );
}
