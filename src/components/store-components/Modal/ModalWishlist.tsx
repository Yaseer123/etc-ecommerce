"use client";

import { Button } from "@/components/ui/button";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { api } from "@/trpc/react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const ModalWishlist = () => {
  const { isModalOpen, closeModalWishlist } = useModalWishlistStore();
  const { data: session } = useSession(); // Check if the user is logged in

  const utils = api.useUtils();

  const {
    data: wishList,
    isLoading,
    isError,
  } = api.wishList.getWishList.useQuery(undefined, {
    enabled: !!session?.user, // Only fetch wishlist if the user is logged in
  });

  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onSuccess: async () => {
        await utils.wishList.getWishList.invalidate(); // Invalidate the cache to refresh the wishlist
      },
    });

  if (!session?.user) {
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
                className="close-btn bg-surface absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full duration-300 hover:bg-black hover:bg-black/75 hover:text-white"
                onClick={closeModalWishlist}
              >
                <X size={14} />
              </div>
            </div>
            <div className="list-product px-6">
              <div className="text-center text-base font-semibold text-gray-600">
                Login to add products to your wishlist.
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="default"
                  className="w-full max-w-xs bg-black text-white hover:bg-black/75"
                  onClick={() =>
                    signIn(undefined, { callbackUrl: window.location.href })
                  }
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
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
                className="close-btn bg-surface absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full duration-300 hover:bg-black hover:bg-black/75 hover:text-white"
                onClick={closeModalWishlist}
              >
                <X size={14} />
              </div>
            </div>
            <div className="list-product px-6">
              <div className="text-center text-base font-semibold text-gray-600">
                Loading your wishlist...
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
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
                className="close-btn bg-surface absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full duration-300 hover:bg-black hover:bg-black/75 hover:text-white"
                onClick={closeModalWishlist}
              >
                <X size={14} />
              </div>
            </div>
            <div className="list-product px-6">
              <div className="text-center text-base font-semibold text-red-600">
                Failed to load your wishlist. Please try again later.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
              className="close-btn bg-surface absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full duration-300 hover:bg-black hover:bg-black/75 hover:text-white"
              onClick={closeModalWishlist}
            >
              <X size={14} />
            </div>
          </div>
          <div className="list-product px-6">
            {wishList?.map((w) => (
              <div
                key={w.product.id}
                className="item flex items-center justify-between gap-3 border-b border-[#ddd] py-5 focus:border-[#ddd]"
              >
                <div className="infor flex items-center gap-5">
                  <div className="bg-img">
                    <Image
                      src={w.product.images[0] ?? "/images/product/1.png"}
                      width={300}
                      height={300}
                      alt={w.product.title}
                      className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
                    />
                  </div>
                  <div className="">
                    <div className="name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                      {w.product.title}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="product-price text-title">
                        ৳{w.product.discountedPrice ?? w.product.price}.00
                      </div>
                      {w.product.discountedPrice &&
                        w.product.discountedPrice < w.product.price && (
                          <div className="product-origin-price text-title text-secondary2">
                            <del>৳{w.product.price}.00</del>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
                <div
                  className="remove-wishlist-btn cursor-pointer text-base font-semibold leading-[22] text-red-500 underline md:text-[13px] md:leading-5"
                  onClick={() =>
                    removeFromWishlistMutation.mutate({
                      productId: w.product.id,
                    })
                  }
                >
                  Remove
                </div>
              </div>
            ))}
          </div>
          <div className="footer-modal absolute bottom-0 left-0 w-full border-t border-[#ddd] bg-white p-6 text-center focus:border-[#ddd]">
            <Link
              href={"/wishlist"}
              onClick={closeModalWishlist}
              className="button-main w-full text-center uppercase"
            >
              View All Wish List
            </Link>
            <Link
              href={"/products"}
              onClick={closeModalWishlist}
              className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
            >
              Or continue shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalWishlist;
