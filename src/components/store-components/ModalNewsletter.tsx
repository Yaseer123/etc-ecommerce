"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";

import Image from "next/image";
import { useModalQuickviewContext } from "@/context/store-context/ModalQuickViewContext";

export default function ModalNewsletter() {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { openQuickview } = useModalQuickviewContext();

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/default?id=${productId}`);
  };

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 3000);
  }, []);

  return (
    <div className="modal-newsletter" onClick={() => setOpen(false)}>
      <div className="container flex h-full w-full items-center justify-center">
        <div
          className={`modal-newsletter-main ${open ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="main-content flex w-full overflow-hidden rounded-[20px]">
            <div className="left flex flex-col items-center justify-center gap-5 bg-green_custom py-14 max-sm:hidden sm:w-2/5 lg:w-1/2">
              <div className="text-center text-xs font-semibold uppercase">
                Special Offer
              </div>
              <div className="text-center text-4xl font-bold uppercase leading-[42px] lg:text-[70px] lg:leading-[78px]">
                Black
                <br />
                Fridays
              </div>
              <div className="text-button-uppercase text-center">
                New customers save <span className="text-red">30%</span>
                with the code
              </div>
              <div className="text-button-uppercase text-red rounded-lg bg-white px-4 py-2">
                GET20off
              </div>
              <div className="button-main w-fit bg-black uppercase text-white hover:bg-white">
                Copy coupon code
              </div>
            </div>
            <div className="right relative w-full bg-white max-sm:p-6 sm:w-3/5 sm:pl-10 sm:pt-10 lg:w-1/2">
              <div
                className="close-newsletter-btn absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line"
                onClick={() => setOpen(false)}
              >
                <Icon.X weight="bold" className="text-xl" />
              </div>
              <div className="heading5 pb-5">You May Also Like</div>
              <div className="list flex flex-col gap-5 overflow-x-auto sm:pr-6">
                {productData.slice(11, 16).map((item, index) => (
                  <div
                    className="product-item item flex items-center justify-between gap-3 border-b border-line pb-5"
                    key={index}
                  >
                    <div
                      className="infor flex cursor-pointer items-center gap-5"
                      onClick={() => handleDetailProduct(item.id)}
                    >
                      <div className="bg-img flex-shrink-0">
                        <Image
                          width={5000}
                          height={5000}
                          src={item.thumbImage[0] ?? "/images/product/1.png"}
                          alt={item.name}
                          className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
                        />
                      </div>
                      <div className="">
                        <div className="name text-button">{item.name}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="product-price text-title">
                            ${item.price}.00
                          </div>
                          <div className="product-origin-price text-title text-secondary2">
                            <del>${item.originPrice}.00</del>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="quick-view-btn button-main whitespace-nowrap rounded-full bg-black px-4 py-2 text-white hover:bg-green_custom sm:px-5 sm:py-3"
                      onClick={() => openQuickview(item)}
                    >
                      QUICK VIEW
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
