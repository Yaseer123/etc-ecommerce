"use client";
import React from "react";
import Image from "next/image";

import { type ProductType } from "@/types/ProductType";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import Rate from "@/components/store-components/Rate";
import TopNav from "@/components/store-components/TopNav";
import { useCart } from "@/context/store-context/CartContext";
import { useCompare } from "@/context/store-context/CompareContext";
import { useModalCartContext } from "@/context/store-context/ModalCartContext";
import Menu from "@/components/store-components/Menu";

const Compare = () => {
  const { compareState } = useCompare();
  const { cartState, addToCart, updateCart } = useCart();
  const { openModalCart } = useModalCartContext();

  const handleAddToCart = (productItem: ProductType) => {
    if (!cartState.cartArray.find((item) => item.id === productItem.id)) {
      addToCart({ ...productItem });
      updateCart(productItem.id, productItem.quantityPurchase, "", "");
    } else {
      updateCart(productItem.id, productItem.quantityPurchase, "", "");
    }
    openModalCart();
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="Compare Products" subHeading="Compare Products" />
      </div>
      <div className="compare-block py-10 md:py-20">
        <div className="container">
          <div className="content-main">
            <div>
              <div className="list-product flex">
                <div className="left w-[170px] flex-shrink-0 lg:w-[240px]"></div>
                <div className="right flex w-full rounded-t-2xl border border-b-0 border-line">
                  {compareState.compareArray.map((item) => (
                    <div
                      className="product-item border-r border-line px-10 pb-5 pt-6"
                      key={item.id}
                    >
                      <div className="bg-img aspect-[3/4] w-full flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.images[0]}
                          width={1000}
                          height={1500}
                          alt={item.images[0]}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-title mt-4 text-center">
                        {item.name}
                      </div>
                      <div className="caption2 mt-1 text-center font-semibold uppercase text-secondary2">
                        {item.brand}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="compare-table flex">
                <div className="left w-[170px] flex-shrink-0 rounded-l-2xl border border-r-0 border-line lg:w-[240px]">
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Rating
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Price
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Type
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Brand
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Size
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Colors
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Metarial
                  </div>
                  <div className="item text-button flex h-[60px] w-full items-center border-b border-line px-8">
                    Add To Cart
                  </div>
                </div>
                <table className="right w-full border-collapse border-r border-t border-line">
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center">
                          <Rate currentRate={item.rate} size={12} />
                          <p className="pl-1">(1.234)</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center">
                          ${item.price}.00
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center capitalize">
                          {item.type}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center capitalize">
                          {item.brand}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="size h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center gap-1 capitalize">
                          {item.sizes.map((size, i) => (
                            <p key={i}>
                              {size}
                              <span>,</span>
                            </p>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="size h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center gap-2 capitalize">
                          {item.variation.map((colorItem, i) => (
                            <span
                              key={i}
                              className={`h-6 w-6 rounded-full`}
                              style={{
                                backgroundColor: `${colorItem.colorCode}`,
                              }}
                            ></span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center capitalize">
                          Cotton
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className={`flex w-full items-center`}>
                    {compareState.compareArray.map((item, index) => (
                      <td
                        className="h-[60px] w-full border border-r-0 border-t-0 border-line"
                        key={index}
                      >
                        <div className="flex h-full items-center justify-center">
                          <div
                            className="button-main px-5 py-1.5"
                            onClick={() => handleAddToCart(item)}
                          >
                            Add To Cart
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Compare;
