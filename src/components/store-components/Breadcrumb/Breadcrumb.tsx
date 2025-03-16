"use client";

import React from "react";
import Link from "next/link";
import {CaretRight} from "@phosphor-icons/react/dist/ssr";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  pageTitle?: string;
  children?: React.ReactNode;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  pageTitle,
  children,
}) => {
  return (
    <div className="bg-linear relative w-full overflow-hidden px-4 pb-10 pt-12 lg:pt-[80px]">
      <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
        <div className="text-content">
          {pageTitle && (
            <div className="text-center text-[44px] font-semibold capitalize leading-[55px] md:text-[22px] md:leading-[30px] lg:text-[32px] lg:leading-10">
              {pageTitle}
            </div>
          )}
          <div className="link mt-3 flex items-center justify-center gap-1 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
            {items?.map((item, index) => (
              <React.Fragment key={`breadcrumb-${index}`}>
                {index > 0 && (
                  <CaretRight
                    size={14}
                    className="text-black transition-all duration-300 ease-in-out"
                  />
                )}
                {index === items.length - 1 ? (
                  <span className="capitalize text-black transition-all duration-300 ease-in-out">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href ?? "/"}
                    className="capitalize hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {children && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 gap-y-5 overflow-hidden lg:mt-[70px]">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
