"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalWishlistContext } from "@/context/store-context/ModalWishlistContext";
import { api } from "@/trpc/react";

const ModalWishlist = () => {
  const { isModalOpen, closeModalWishlist } = useModalWishlistContext();
  const [wishList] = api.wishList.getWishList.useSuspenseQuery();
  const utils = api.useUtils();
  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onSuccess: async () => {
        await utils.wishList.getWishList.invalidate();
      },
    });
  return (
    <>
      <div className={`modal-wishlist-block`} onClick={closeModalWishlist}>
        <div
          className={`modal-wishlist-main py-6 ${isModalOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="heading relative flex items-center justify-between px-6 pb-3">
            <div className="heading5">Wishlist</div>
            <div
              className="close-btn absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
              onClick={closeModalWishlist}
            >
              <Icon.X size={14} />
            </div>
          </div>
          <div className="list-product px-6">
            {wishList.map((product) => (
              <div
                key={product.id}
                className="item flex items-center justify-between gap-3 border-b border-line py-5"
              >
                <div className="infor flex items-center gap-5">
                  <div className="bg-img">
                    <Image
                      src={product.images[0] ?? "/images/product/1.png"}
                      width={300}
                      height={300}
                      alt={product.name}
                      className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
                    />
                  </div>
                  <div className="">
                    <div className="name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                      {product.name}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="product-price text-title">
                        ${product.price}.00
                      </div>
                      <div className="product-origin-price text-title text-secondary2">
                        <del>${product.originPrice}.00</del>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="remove-wishlist-btn cursor-pointer text-base font-normal font-semibold leading-[22] text-red underline md:text-[13px] md:leading-5"
                  onClick={() =>
                    removeFromWishlistMutation.mutate({ productId: product.id })
                  }
                >
                  Remove
                </div>
              </div>
            ))}
          </div>
          <div className="footer-modal absolute bottom-0 left-0 w-full border-t border-line bg-white p-6 text-center">
            <Link
              href={"/wishlist"}
              onClick={closeModalWishlist}
              className="button-main w-full text-center uppercase"
            >
              View All Wish List
            </Link>
            <div
              onClick={closeModalWishlist}
              className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
            >
              Or continue shopping
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWishlist;
