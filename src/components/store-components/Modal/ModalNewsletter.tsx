"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";

import Image from "next/image";
import { useModalQuickViewContext } from "@/context/store-context/ModalQuickViewContext";

const ModalNewsletter = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { openQuickView } = useModalQuickViewContext();

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
      <div className="mx-auto flex h-full w-full !max-w-[1322px] items-center justify-center px-4">
        <div
          className={`modal-newsletter-main ${open ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="main-content flex w-full overflow-hidden rounded-[20px]">
            <div className="left flex flex-col items-center justify-center gap-5 bg-green py-14 max-sm:hidden sm:w-2/5 lg:w-1/2">
              <div className="text-center text-xs font-semibold uppercase">
                Special Offer
              </div>
              <div className="text-center text-4xl font-bold uppercase leading-[42px] lg:text-[70px] lg:leading-[78px]">
                Black
                <br />
                Fridays
              </div>
              <div className="text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                New customers save <span className="text-red">30%</span>
                with the code
              </div>
              <div className="rounded-lg bg-white px-4 py-2 text-sm font-semibold uppercase leading-5 text-red md:text-xs md:leading-4">
                GET20off
              </div>
              <div className="duration-400 md:text-md md:text-md inline-block w-fit cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:bg-white hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4 lg:py-40">
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
                  <>
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
                            src={item.thumbImage[0]}
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
                        className="quick-view-btn duration-400 md:text-md inline-block cursor-pointer whitespace-nowrap rounded-[12px] rounded-full bg-black px-10 px-4 py-2 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black sm:px-5 sm:py-3 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        onClick={() => openQuickView(item)}
                      >
                        QUICK VIEW
                      </button>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewsletter;
