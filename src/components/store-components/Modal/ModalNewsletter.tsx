"use client";

import { useModalQuickViewStore } from "@/context/store-context/ModalQuickViewContext";
import { api } from "@/trpc/react";
import type { ProductWithCategory } from "@/types/ProductType";
import { X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ModalNewsletter = () => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { openQuickView } = useModalQuickViewStore();

  const [productData]: [{ products: ProductWithCategory[] }] =
    api.product.getAll.useSuspenseQuery();

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
            <div className="left bg-green flex flex-col items-center justify-center gap-5 py-14 max-sm:hidden sm:w-2/5 lg:w-1/2">
              <div className="text-center text-xs font-semibold uppercase">
                Special Offer
              </div>
              <div className="text-center text-4xl font-bold uppercase leading-[42px] lg:text-[70px] lg:leading-[78px]">
                Black
                <br />
                Fridays
              </div>
              <div className="text-button-uppercase text-center">
                New customers save <span className="text-red-500">30%</span>
                with the code
              </div>
              <div className="text-button-uppercase rounded-lg bg-white px-4 py-2 text-red-500">
                GET20off
              </div>
              <div className="button-main w-fit bg-black uppercase text-white hover:bg-black/75 hover:bg-white">
                Copy coupon code
              </div>
            </div>
            <div className="right relative w-full bg-white max-sm:p-6 sm:w-3/5 sm:pl-10 sm:pt-10 lg:w-1/2">
              <div
                className="close-newsletter-btn absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#ddd] focus:border-[#ddd]"
                onClick={() => setOpen(false)}
              >
                <X weight="bold" className="text-xl" />
              </div>
              <div className="heading5 pb-5">You May Also Like</div>
              <div className="list flex flex-col gap-5 overflow-x-auto sm:pr-6">
                {productData.products
                  .slice(11, 16)
                  .map((item: ProductWithCategory) => (
                    <div
                      className="product-item item flex items-center justify-between gap-3 border-b border-[#ddd] pb-5 focus:border-[#ddd]"
                      key={item.id}
                    >
                      <div
                        className="infor flex cursor-pointer items-center gap-5"
                        onClick={() => handleDetailProduct(item.id)}
                      >
                        <div className="bg-img flex-shrink-0">
                          <Image
                            width={5000}
                            height={5000}
                            src={
                              item.images[0] ?? "/images/product/1000x1000.png"
                            }
                            alt={item.title}
                            className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
                          />
                        </div>
                        <div className="">
                          <div className="name text-button">{item.title}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="product-price text-title">
                              ৳{item.discountedPrice ?? item.price}.00
                            </div>
                            {item.discountedPrice && (
                              <div className="product-origin-price text-title text-secondary2">
                                <del>৳{item.price}.00</del>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className="quick-view-btn button-main hover:bg-green whitespace-nowrap rounded-full bg-black px-4 py-2 text-white hover:bg-black/75 sm:px-5 sm:py-3"
                        onClick={() => openQuickView(item)}
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
};

export default ModalNewsletter;
