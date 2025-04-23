"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { api } from "@/trpc/react";

export default function WishListProducts() {
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
      <div className="text-center text-lg font-semibold text-gray-600">
        Login to view your wishlist.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-lg font-semibold text-gray-600">
        Loading your wishlist...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center text-lg font-semibold">
        Failed to load your wishlist. Please try again later.
      </div>
    );
  }

  return (
    <div className="list-product px-6">
      {wishList?.map((item) => (
        <div
          key={item.id}
          className="item flex items-center justify-between gap-3 border-b border-line py-5"
        >
          <div className="infor flex items-center gap-5">
            <div className="bg-img">
              <Image
                src={item.product.images[0] ?? "/images/product/1.png"}
                width={300}
                height={300}
                alt={item.product.title}
                className="aspect-square w-[100px] flex-shrink-0 rounded-lg"
              />
            </div>
            <div className="">
              <div className="name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                {item.product.title}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="product-price text-title">
                  ৳{item.product.price}.00
                </div>
                <div className="product-origin-price text-title text-secondary2">
                  <del>৳{item.product.originPrice}.00</del>
                </div>
              </div>
            </div>
          </div>
          <div
            className="remove-wishlist-btn cursor-pointer text-base font-semibold leading-[22] text-red underline md:text-[13px] md:leading-5"
            onClick={() =>
              removeFromWishlistMutation.mutate({ productId: item.product.id })
            }
          >
            Remove
          </div>
        </div>
      ))}
    </div>
  );
}
