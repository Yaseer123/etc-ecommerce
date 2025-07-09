"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
} from "@/components/ui/resizable-navbar";
import { useCartStore } from "@/context/store-context/CartContext";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import useLoginPopup from "@/hooks/useLoginPopup";
import { api } from "@/trpc/react";
import { Handbag, Heart, User } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryNav from "./CategoryNav";
import SearchBar from "./SearchBar";

export type CategoryType = {
  id: string | number;
  name: string;
  subcategories?: CategoryType[];
};

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

export default function SlideNavbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { data: categories, isLoading } = api.category.getAll.useQuery();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openLoginPopup, handleLoginPopup } = useLoginPopup();
  const { openModalCart } = useModalCartStore();
  const { cartArray } = useCartStore();
  const { openModalWishlist } = useModalWishlistStore();

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Products", link: "/products" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <>
      <Navbar
        className={`bg-white transition-all dark:bg-neutral-900 ${isSticky ? "shadow-md" : ""} sticky top-0 z-50 lg:static`}
      >
        <NavBody>
          <NavbarLogo />
          <div className="mx-4 hidden max-w-xl flex-1 lg:block">
            <SearchBar />
          </div>

          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/products"
                    className="text-sm font-semibold text-neutral-800 transition-colors hover:text-primary dark:text-neutral-200"
                  >
                    Products
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {navItems.slice(1).map((item, idx) => (
                <NavigationMenuItem key={idx}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.link}
                      className="text-sm font-semibold text-neutral-800 transition-colors hover:text-primary dark:text-neutral-200"
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto flex items-center gap-4">
            {/* Account Icon */}
            <div className="user-icon relative flex cursor-pointer items-center justify-center">
              <User
                size={24}
                className="dark:text-white"
                onClick={handleLoginPopup}
              />
              <div
                className={`login-popup box-shadow-sm absolute right-0 top-[40px] w-[320px] rounded-xl bg-white p-7 ${
                  openLoginPopup ? "open" : ""
                }`}
              >
                {isAuthenticated ? (
                  <Link
                    href={"/signout"}
                    className="duration-400 md:text-md hover:bg-green inline-block w-full cursor-pointer rounded-[.25rem] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-black/75 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                  >
                    Sign Out
                  </Link>
                ) : (
                  <Link
                    href={"/login"}
                    className="duration-400 md:text-md hover:bg-green inline-block w-full cursor-pointer rounded-[.25rem] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-black/75 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                  >
                    Login
                  </Link>
                )}
                {!isAuthenticated ? (
                  <div className="mt-3 pb-4 text-center text-secondary">
                    Don&apos;t have an account?
                    <Link
                      href={"/register"}
                      className="pl-1 text-black hover:underline"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="mt-3"></div>
                )}
                <Link
                  href={"/my-account"}
                  className="button-main w-full border border-black bg-white text-center text-black"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Wishlist Icon */}
            {isAuthenticated && (
              <div
                className="wishlist-icon hidden cursor-pointer items-center lg:flex"
                onClick={openModalWishlist}
              >
                <Heart size={24} className="dark:text-white" />
              </div>
            )}

            {/* Cart Icon */}
            <div
              className="cart-icon relative hidden cursor-pointer items-center dark:text-white lg:flex"
              onClick={openModalCart}
            >
              <Handbag size={24} className="dark:text-white" />
              <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white hover:bg-black/75 dark:text-white">
                {cartArray.length}
              </span>
            </div>

            {/* Theme Toggle */}
            <div className="ml-2 mr-2">
              <div className="rounded-full bg-neutral-100 p-1 transition hover:bg-neutral-200 dark:bg-neutral-300 dark:hover:bg-neutral-200">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-800 hover:text-primary dark:text-neutral-200"
              >
                <span className="block py-2">{item.name}</span>
              </a>
            ))}

            <div className="mt-4 flex items-center justify-around gap-4 border-t border-neutral-300 pt-4 dark:border-neutral-700">
              <Link
                href={isAuthenticated ? "/my-account" : "/login"}
                className="flex flex-col items-center text-sm text-neutral-700 dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={22} />
                {isAuthenticated ? "Account" : "Login"}
              </Link>
              <button
                onClick={() => {
                  openModalCart();
                  setIsMobileMenuOpen(false);
                }}
                className="relative flex flex-col items-center text-sm text-neutral-700 dark:text-white"
              >
                <Handbag size={22} />
                <span>Cart</span>
                {cartArray.length > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                    {cartArray.length}
                  </span>
                )}
              </button>
            </div>

            {isAuthenticated && (
              <div className="mt-4 flex justify-center">
                <NavbarButton
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    openModalWishlist();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Wishlist
                </NavbarButton>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </>
  );
}
