import React from "react";
import { useRouter } from "next/navigation";
import { CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";

interface MobileMenuProps {
  openMenuMobile: boolean;
  handleMenuMobile: () => void;
}

const MobileMenu = ({
  openMenuMobile,
  handleMenuMobile,
}: MobileMenuProps) => {
  const router = useRouter();

  // Function to handle navigation and close menu
  const handleNavigation = (path: string) => {
    handleMenuMobile(); // First close the menu
    router.push(path); // Then navigate to the path
  };

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
              <div
                onClick={() => handleNavigation("/")}
                className="logo cursor-pointer text-center text-3xl font-semibold"
              >
                Rinors
              </div>
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
                  <div
                    onClick={() => handleNavigation("/products")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    Products
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/blog")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    Blog
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/about")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    About Us
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/contact")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    Contact Us
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
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
