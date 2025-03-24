import React from "react";
import Link from "next/link";
import {
  CaretRight,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react/dist/ssr";

interface MobileMenuProps {
  openMenuMobile: boolean;
  handleMenuMobile: () => void;
}

const MobileMenu = ({
  openMenuMobile,
  handleMenuMobile,
}: MobileMenuProps) => {
  return (
    <div id="menu-mobile" className={`${openMenuMobile ? "open" : ""}`}>
      <div className="menu-w-full mx-auto h-full !max-w-[1322px] bg-white px-4">
        <div className="mx-auto h-full w-full !max-w-[1322px] px-4">
          <div className="menu-main h-full overflow-hidden">
            <div className="heading relative flex items-center justify-center py-2">
              <div
                className="close-menu-mobile-btn absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface"
                onClick={handleMenuMobile}
              >
                <X size={14} />
              </div>
              <Link
                href={"/"}
                className="logo text-center text-3xl font-semibold"
              >
                Rinors
              </Link>
            </div>
            <div className="form-search relative mt-2">
              <MagnifyingGlass
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
                <li>
                  <Link
                    href="/products"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Products
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Blog
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    About Us
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Contact Us
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/order-tracking"
                    className="mt-5 flex items-center justify-between text-xl font-semibold"
                  >
                    Track Order
                    <span className="text-right">
                      <CaretRight size={20} />
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
