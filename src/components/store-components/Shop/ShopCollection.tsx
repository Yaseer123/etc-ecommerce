import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/types/ProductType";
import Product from "../Product/Product";

interface Props {
  data: Array<ProductType>;
}

const ShopCollection: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="shop-collection py-10 md:py-14 lg:py-20">
        <div className="container">
          <div className="banner-heading relative overflow-hidden rounded-2xl max-lg:h-[300px] max-md:h-[260px]">
            <div className="bg-img h-full">
              <Image
                src={"/images/banner/banner-shop-breadcrumb-img.png"}
                width={3000}
                height={3000}
                alt="bg"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-content absolute right-10 top-1/2 -translate-y-1/2">
              <div className="body1 font-semibold uppercase">
                New Trend 2022
              </div>
              <div className="heading1 mt-2 font-semibold">
                Sale Off <br />
                Up To 30%
              </div>
              <Link
                href={"/shop/breadcrumb1"}
                className="button-main mt-6 lg:mt-10"
              >
                Explore More
              </Link>
            </div>
          </div>
          <div className="list-collection py-10 md:py-20">
            <div className="item">
              <div className="main flex items-center justify-between gap-y-8 max-sm:flex-wrap">
                <div className="bg-img sm:w-1/2 sm:pr-14 lg:pr-[90px]">
                  <Image
                    src={"/images/product/1000x1000.png"}
                    width={3000}
                    height={3000}
                    alt="bg"
                    className="aspect-[3/4] w-full rounded-xl object-cover"
                  />
                </div>
                <div className="right sm:w-1/2">
                  <div className="heading flex flex-wrap items-center justify-between gap-y-4">
                    <div className="left">
                      <div className="body1 font-semibold uppercase text-secondary2">
                        SUMMER STAPLE
                      </div>
                      <div className="heading3 mt-1 sm:mt-3">
                        Linen Wrap Dresses
                      </div>
                    </div>
                    <div className="right">
                      <Link
                        href={"/shop/breadcrumb1"}
                        className="button-main border border-black bg-white text-black"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                  <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-5 md:mt-10 md:gap-[30px]">
                    {data
                      .filter(
                        (product) =>
                          product.type === "accessories" &&
                          product.category === "fashion",
                      )
                      .slice(0, 2)
                      .map((product) => (
                        <Product data={product} type="grid" key={product.id} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="item mt-10 md:mt-20">
              <div className="main flex items-center justify-between gap-y-8 max-sm:flex-wrap">
                <div className="bg-img sm:w-1/2 sm:pr-14 lg:pr-[90px]">
                  <Image
                    src={"/images/product/1000x1000.png"}
                    width={3000}
                    height={3000}
                    alt="bg"
                    className="aspect-[3/4] w-full rounded-xl object-cover"
                  />
                </div>
                <div className="right sm:w-1/2">
                  <div className="heading flex flex-wrap items-center justify-between gap-y-4">
                    <div className="left">
                      <div className="body1 font-semibold uppercase text-secondary2">
                        SUMMER STAPLE
                      </div>
                      <div className="heading3 mt-1 sm:mt-3">
                        Linen Wrap Dresses
                      </div>
                    </div>
                    <div className="right">
                      <Link
                        href={"/shop/breadcrumb1"}
                        className="button-main border border-black bg-white text-black"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                  <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-5 md:mt-10 md:gap-[30px]">
                    {data
                      .filter(
                        (product) =>
                          product.type === "accessories" &&
                          product.category === "fashion",
                      )
                      .slice(2, 4)
                      .map((product) => (
                        <Product data={product} type="grid" key={product.id} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="item mt-10 md:mt-20">
              <div className="main flex items-center justify-between gap-y-8 max-sm:flex-wrap">
                <div className="bg-img sm:w-1/2 sm:pr-14 lg:pr-[90px]">
                  <Image
                    src={"/images/collection/outerwear.png"}
                    width={3000}
                    height={3000}
                    alt="bg"
                    className="aspect-[3/4] w-full rounded-xl object-cover"
                  />
                </div>
                <div className="right sm:w-1/2">
                  <div className="heading flex flex-wrap items-center justify-between gap-y-4">
                    <div className="left">
                      <div className="body1 font-semibold uppercase text-secondary2">
                        SUMMER STAPLE
                      </div>
                      <div className="heading3 mt-1 sm:mt-3">
                        Linen Wrap Dresses
                      </div>
                    </div>
                    <div className="right">
                      <Link
                        href={"/shop/breadcrumb1"}
                        className="button-main border border-black bg-white text-black"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                  <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-5 md:mt-10 md:gap-[30px]">
                    {data
                      .filter(
                        (product) =>
                          product.type === "accessories" &&
                          product.category === "fashion",
                      )
                      .slice(4, 6)
                      .map((product) => (
                        <Product data={product} type="grid" key={product.id} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCollection;
