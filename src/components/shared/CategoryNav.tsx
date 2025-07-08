"use client";

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

  return (
    <div className="relative z-[2] w-full border-y border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-zinc-900 max-lg:hidden">
      <div className="mx-auto h-full w-full max-w-[1322px]">
        <div className="ml-5 flex h-full items-center justify-between px-4">
          {/* Category navigation */}
          {isLoading ? (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
              Loading categories...
            </div>
          ) : (categories?.length ?? 0) > 0 ? (
            <NavigationMenu>
              <NavigationMenuList>
                {(categories ?? []).map((category: CategoryType) => (
                  <NavigationMenuItem key={category.id}>
                    {category.subcategories?.length ? (
                      <>
                        <NavigationMenuTrigger className="text-gray-800 hover:text-brand-primary dark:text-gray-100 dark:hover:text-brand-primary">
                          {toTitleCase(category.name)}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-[9999] min-w-[250px] rounded-md border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-zinc-800">
                          {category.subcategories.map((subcat) => (
                            <div key={subcat.id} className="group relative">
                              {subcat.subcategories?.length ? (
                                <>
                                  <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700">
                                    <Link
                                      href={`/products?category=${subcat.id}`}
                                    >
                                      {toTitleCase(subcat.name)}
                                    </Link>
                                    <span className="ml-1 text-brand-primary">
                                      ›
                                    </span>
                                  </div>
                                  <div className="pl-4">
                                    {subcat.subcategories.map((childCat) => (
                                      <Link
                                        key={childCat.id}
                                        href={`/products?category=${childCat.id}`}
                                        className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-700"
                                      >
                                        {toTitleCase(childCat.name)}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <Link
                                  href={`/products?category=${subcat.id}`}
                                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
                                >
                                  {toTitleCase(subcat.name)}
                                </Link>
                              )}
                            </div>
                          ))}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/products?category=${category.id}`}
                          className="px-4 py-3.5 text-sm font-medium text-gray-800 hover:text-brand-primary dark:text-gray-100 dark:hover:text-brand-primary"
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

          {/* Hotline */}
          <div className="ml-auto mr-[40px] flex items-center gap-2 border-l border-gray-200 pl-4 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Hotline:
            </span>
            <span className="text-sm font-semibold text-gray-800 hover:text-brand-primary dark:text-white">
              +8801312223452
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
