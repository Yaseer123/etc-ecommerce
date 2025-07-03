"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <>
      <Navbar
        className={`transition-all ${isSticky ? "shadow-md" : ""} bg-white dark:bg-neutral-900`}
      >
        <NavBody>
          <NavbarLogo />

          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent className="rounded-md bg-white p-4 shadow-lg dark:bg-neutral-900">
                  <ul className="grid gap-3 md:w-[300px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/products"
                          className="block rounded-md p-2 text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          Most Selling
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Generate text automatically
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/product/analytics"
                          className="block rounded-md p-2 text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          Most Rated
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Track your audience behavior
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/product/editor"
                          className="block rounded-md p-2 text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                          Best Price
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Edit content with AI suggestions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
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
            {/* Account Icon (copied from Menu.tsx) */}
            <div className="user-icon relative flex cursor-pointer items-center justify-center">
              <User size={24} color="black" onClick={handleLoginPopup} />
              <div
                className={`login-popup box-shadow-sm absolute right-0 top-[40px] w-[320px] rounded-xl bg-white p-7 ${openLoginPopup ? "open" : ""}`}
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
            {/* Wishlist Icon (only if authenticated) */}
            {isAuthenticated && (
              <div
                className="wishlist-icon flex cursor-pointer items-center"
                onClick={openModalWishlist}
              >
                <Heart size={24} color="black" />
              </div>
            )}
            {/* Cart Icon */}
            <div
              className="cart-icon relative flex cursor-pointer items-center"
              onClick={openModalCart}
            >
              <Handbag size={24} color="black" />
              <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white hover:bg-black/75">
                {cartArray.length}
              </span>
            </div>
          </div>
          <div className="ml-4 mr-4">
            <div className="rounded-full bg-white text-neutral-800 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">
              <ThemeToggle />
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

            <div className="mt-4 flex flex-col gap-3">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full text-black dark:text-white"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full text-white"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <CategoryNav />
    </>
  );
}
