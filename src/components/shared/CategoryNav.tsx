import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
const CategoryNav = () => {
  const { data: categories, isLoading } = api.category.getAll.useQuery();
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 120); // Adjust threshold as needed
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Add placeholder height when navbar is sticky to prevent content jump */}
      {isSticky && <div className="h-[46px] max-lg:hidden"></div>}
      <div
        className={`$${
          isSticky ? "fixed top-0 animate-slideDown shadow-lg" : "relative"
        } z-30 w-full border-y border-gray-100 bg-white transition-all duration-300 max-lg:hidden`}
      >
        <div className="mx-auto h-full w-full !max-w-[1322px]">
          <div className="flex h-full items-center justify-between">
            {/* Category navigation menu - left side */}
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500">
                Loading categories...
              </div>
            ) : categories && categories.length > 0 ? (
              <NavigationMenu>
                <NavigationMenuList>
                  {categories.map((category: CategoryType) => (
                    <NavigationMenuItem key={category.id}>
                      {category.subcategories &&
                      category.subcategories.length > 0 ? (
                        <>
                          <NavigationMenuTrigger>
                            {toTitleCase(category.name)}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="min-w-[240px] py-2">
                              {category.subcategories.map((subcat) => (
                                <div
                                  key={subcat.id}
                                  className="group/sub relative"
                                >
                                  {subcat.subcategories &&
                                  subcat.subcategories.length > 0 ? (
                                    <>
                                      <div className="flex items-center justify-between px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-primary">
                                        <Link
                                          href={`/products?category=${subcat.id}`}
                                        >
                                          {toTitleCase(subcat.name)}
                                        </Link>
                                        <span className="ml-1 text-brand-primary">
                                          ›
                                        </span>
                                      </div>
                                      {/* Nested subcategories */}
                                      <div className="pl-5">
                                        {subcat.subcategories.map(
                                          (childCat) => (
                                            <div key={childCat.id}>
                                              <Link
                                                href={`/products?category=${childCat.id}`}
                                                className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-primary"
                                              >
                                                {toTitleCase(childCat.name)}
                                              </Link>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <Link
                                      href={`/products?category=${subcat.id}`}
                                      className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-primary"
                                    >
                                      {toTitleCase(subcat.name)}
                                    </Link>
                                  )}
                                </div>
                              ))}
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/products?category=${category.id}`}
                            className="px-4 py-3.5 text-sm font-medium text-gray-700 hover:text-brand-primary"
                          >
                            {toTitleCase(category.name)}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            ) : null}
            {/* Hotline - right side */}
            <div className="right mr-3 flex items-center gap-2 border-l border-gray-100 pl-4">
              <div className="text-sm text-gray-500">Hotline:</div>
              <div className="text-sm font-semibold transition-colors hover:text-brand-primary">
                +8801312223452
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryNav;
