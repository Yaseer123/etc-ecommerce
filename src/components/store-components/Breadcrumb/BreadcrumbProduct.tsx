"use client";

import React from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { type ProductType } from "@/type/ProductType";
import { useRouter } from "next/navigation";

interface Props {
  data: Array<ProductType>;
  productPage: string | null;
  productId: string | number | null;
}

const BreadcrumbProduct: React.FC<Props> = ({
  data,
  productPage,
  productId,
}) => {
  const productMain = data.filter((product) => product.id === productId);
  const router = useRouter();

  const handleDetailProduct = (productId: string | number | null) => {
    // Chuyển hướng đến trang shop với category được chọn
    router.push(`/product/${productPage}?id=${productId}`);
  };

  return (
    <>
      <div className="breadcrumb-product">
        <div className="main bg-surface pb-[14px] pt-[70px] md:pt-[88px]">
          <div className="mx-auto flex w-full !max-w-[1322px] flex-wrap items-center justify-between gap-3 px-4">
            <div className="left flex items-center gap-1">
              <Link
                href={"/"}
                className="text-base font-normal leading-[22] text-secondary2 hover:underline md:text-[13px] md:leading-5"
              >
                Homepage
              </Link>
              <Icon.CaretRight size={12} className="text-secondary2" />
              <div className="text-base font-normal leading-[22] text-secondary2 md:text-[13px] md:leading-5">
                Product
              </div>
              <Icon.CaretRight size={12} className="text-secondary2" />
              <div className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5">{`Product ${productPage}`}</div>
            </div>
            <div className="right flex items-center gap-3">
              {productId !== null && Number(productId) >= 2 ? (
                <>
                  <div
                    onClick={() => handleDetailProduct(Number(productId) - 1)}
                    className="flex cursor-pointer items-center border-r border-line pr-3 text-secondary hover:text-black"
                  >
                    <Icon.CaretCircleLeft className="text-2xl text-black" />
                    <span className="pl-1 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                      Previous Product
                    </span>
                  </div>
                  <div
                    onClick={() => handleDetailProduct(Number(productId) + 1)}
                    className="flex cursor-pointer items-center text-secondary hover:text-black"
                  >
                    <span className="pr-1 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                      Next Product
                    </span>
                    <Icon.CaretCircleRight className="text-2xl text-black" />
                  </div>
                </>
              ) : (
                <>
                  {productId !== null && Number(productId) === 1 && (
                    <div
                      onClick={() => handleDetailProduct(Number(productId) + 1)}
                      className="flex cursor-pointer items-center text-secondary hover:text-black"
                    >
                      <span className="pr-1 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                        Next Product
                      </span>
                      <Icon.CaretCircleRight className="text-2xl text-black" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadcrumbProduct;
