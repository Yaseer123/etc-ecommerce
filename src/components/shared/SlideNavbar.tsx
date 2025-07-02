"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
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
  NavItems,
} from "@/components/ui/resizable-navbar";
import CategoryNav from "./CategoryNav";

export type CategoryType = {
  id: string | number;
  name: string;
  subcategories?: CategoryType[];
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export default function SlideNavbar() {
  const { data: categories, isLoading } = api.category.getAll.useQuery();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <Navbar className={`transition-all ${isSticky ? "shadow-md" : ""} bg-white dark:bg-neutral-900`}>
        <NavBody>
          <NavbarLogo />

          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white dark:bg-neutral-900 shadow-lg rounded-md p-4">
                  <ul className="grid gap-3 md:w-[300px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/product/ai-writer"
                          className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-md block text-neutral-800 dark:text-neutral-200"
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
                          className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-md block text-neutral-800 dark:text-neutral-200"
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
                          className="hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-md block text-neutral-800 dark:text-neutral-200"
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
                      className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4 ml-auto">
            <NavbarButton variant="secondary" className="text-black dark:text-white">
              Account
            </NavbarButton>
            <NavbarButton variant="primary" className="text-black dark:text-white dark:bg-gray-800">
              Book a call
            </NavbarButton>
            <div className="ml-4 mr-4">
            <div className="rounded-full  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
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

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-800 dark:text-neutral-200 hover:text-primary"
              >
                <span className="block py-2">{item.name}</span>
              </a>
            ))}

            <div className="flex flex-col gap-3 mt-4">
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
