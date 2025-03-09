"use client";

import React from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";

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
    <div className="breadcrumb-block style-img">
      <div className="breadcrumb-main bg-linear overflow-hidden">
        <div className="container relative pb-10 pt-24 lg:pt-[134px]">
          <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
            <div className="text-content">
              {pageTitle && (
                <div className="heading2 text-center capitalize">
                  {pageTitle}
                </div>
              )}
              <div className="link caption1 mt-3 flex items-center justify-center gap-1">
                {items?.map((item, index) => (
                  <React.Fragment key={`breadcrumb-${index}`}>
                    {index > 0 && (
                      <Icon.CaretRight size={14} className="text-secondary2" />
                    )}
                    {index === items.length - 1 ? (
                      <span className="capitalize text-secondary2">
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
              <div className="list-tab mt-12 flex flex-wrap items-center justify-center gap-8 gap-y-5 overflow-hidden lg:mt-[70px]">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
