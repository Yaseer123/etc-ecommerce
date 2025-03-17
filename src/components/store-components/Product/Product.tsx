"use client";
import React, { useState } from "react";
import Image from "next/image";
import { type ProductType } from "@/types/ProductType";
import { useRouter } from "next/navigation";
import {
  Heart,
  Lightning,
  Eye,
  ShoppingBagOpen,
} from "@phosphor-icons/react/dist/ssr";
import Marquee from "react-fast-marquee";
import Rate from "../Rate";
import { api } from "@/trpc/react";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { useModalQuickViewStore } from "@/context/store-context/ModalQuickViewContext";

interface ProductProps {
  data: ProductType;
  type: string;
  style?: string;
}
type WishlistItem = {
  id: string;
  name: string;
  // other properties as needed
};
export default function Product({ data, type }: ProductProps) {
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [openQuickShop, setOpenQuickShop] = useState<boolean>(false);
  // const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartStore();
  const { openModalWishlist } = useModalWishlistStore();
  const { openQuickView } = useModalQuickViewStore();

  const utils = api.useUtils();

  // Fixed - properly handle the response from useSuspenseQuery
  const [wishlistResponse] = api.wishList.getWishList.useSuspenseQuery();
  // Ensure wishlistResponse is treated as an array
  const wishlist: WishlistItem[] = wishlistResponse ?? [];

  const addToWishlistMutation = api.wishList.addToWishList.useMutation({
    onSuccess: async () => {
      await utils.wishList.getWishList.invalidate();
    },
  });

  const removeFromWishlistMutation =
    api.wishList.removeFromWishList.useMutation({
      onSuccess: async () => {
        await utils.wishList.getWishList.invalidate();
      },
    });

  const addToCart = api.cart.addToCart.useMutation({
    onSuccess: async () => {
      await utils.cart.getCart.invalidate();
    },
  });

  // Create a safe check function for wishlist items
  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some((item: { id: string }) => item?.id === itemId);
  };

  const router = useRouter();

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: string) => {
    setActiveSize(item);
  };

  const handleAddToCart = () => {
    addToCart.mutate({ productId: data.id });
    openModalCart();
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(data.id)) {
      // **Optimistic UI Update: Remove item immediately**
      utils.wishList.getWishList.setData(
        undefined,
        (old) => old?.filter((item) => item.id !== data.id) ?? [],
      );

      removeFromWishlistMutation.mutate(
        { productId: data.id },
        {
          onError: () => {
            // **Rollback on failure**
            void utils.wishList.getWishList.invalidate();
          },
        },
      );
    } else {
      // **Optimistic UI Update: Add item immediately**
      utils.wishList.getWishList.setData(undefined, (old) => [
        ...(old ?? []),
        data, // Add complete product data
      ]);

      addToWishlistMutation.mutate(
        { productId: data.id },
        {
          onError: () => {
            // **Rollback on failure**
            void utils.wishList.getWishList.invalidate();
          },
        },
      );
    }

    openModalWishlist();
  };

  const handleQuickViewOpen = () => {
    openQuickView(data);
  };

  const handleDetailProduct = (productId: string) => {
    router.push(`/products/default?id=${productId}`);
  };

  const percentSale = Math.floor(100 - (data.price / data.originPrice) * 100);
  const percentSold = Math.floor((data.sold / data.quantity) * 100);

  return (
    <>
      {type === "grid" && (
        <div className="product-item grid-type style-1">
          <div
            onClick={() => handleDetailProduct(data.id)}
            className="product-main block cursor-pointer"
          >
            <div className="product-thumb relative overflow-hidden rounded-2xl bg-white">
              {data.new && (
                <div className="product-tag bg-green_custom absolute left-3 top-3 z-[1] inline-block rounded-full px-3 py-0.5 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                  New
                </div>
              )}
              {data.sale && (
                <div className="product-tag bg-red_custom absolute left-3 top-3 z-[1] inline-block rounded-full px-3 py-0.5 text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                  Sale
                </div>
              )}

              <div className="list-action-right absolute right-3 top-3 max-lg:hidden">
                <div
                  className={`add-wishlistState-btn relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white duration-300 ${isInWishlist(data.id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist();
                  }}
                >
                  <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                    Add To wishlist
                  </div>
                  {isInWishlist(data.id) ? (
                    <>
                      <Heart size={18} weight="fill" className="text-white" />
                    </>
                  ) : (
                    <>
                      <Heart size={18} />
                    </>
                  )}
                </div>
              </div>

              <div className="product-img aspect-[3/4] h-full w-full">
                {data.thumbImage.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={500}
                    height={500}
                    priority={true}
                    alt={data.name}
                    className="h-full w-full object-cover duration-700"
                  />
                ))}
              </div>
              {data.sale && (
                <>
                  <Marquee className="banner-sale-auto absolute bottom-0 left-0 w-full bg-black py-1.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <React.Fragment key={index}>
                        <div className="caption2 px-2.5 font-semibold uppercase text-white">
                          Hot Sale {percentSale}% OFF
                        </div>
                        <Lightning weight="fill" className="text-red" />
                      </React.Fragment>
                    ))}
                  </Marquee>
                </>
              )}

              <div className="list-action absolute bottom-5 grid w-full grid-cols-2 gap-3 px-5 max-lg:hidden">
                <div
                  className="quick-view-btn w-full rounded-full bg-white py-2 text-center text-sm font-semibold uppercase leading-5 duration-300 hover:bg-black hover:text-white md:text-xs md:leading-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickViewOpen();
                  }}
                >
                  Quick View
                </div>
                {data.action === "add to cart" ? (
                  <div
                    className="add-cart-btn w-full rounded-full bg-white py-2 text-center text-sm font-semibold uppercase leading-5 duration-500 hover:bg-black hover:text-white md:text-xs md:leading-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                  >
                    Add To Cart
                  </div>
                ) : (
                  <>
                    <div
                      className="quick-shop-btn rounded-full bg-white py-2 text-center text-sm font-semibold uppercase leading-5 duration-500 hover:bg-black hover:text-white md:text-xs md:leading-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenQuickShop(!openQuickShop);
                      }}
                    >
                      Quick Shop
                    </div>
                    <div
                      className={`quick-shop-block absolute left-5 right-5 rounded-[20px] bg-white p-5 ${openQuickShop ? "open" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="list-size flex flex-wrap items-center justify-center gap-2">
                        {data.sizes.map((item, index) => (
                          <div
                            className={`size-item flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6 ${activeSize === item ? "active" : ""}`}
                            key={index}
                            onClick={() => handleActiveSize(item)}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <div
                        className="button-main mt-4 w-full rounded-full py-3 text-center"
                        onClick={() => {
                          handleAddToCart();
                          setOpenQuickShop(false);
                        }}
                      >
                        Add To cart
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="list-action-icon absolute bottom-3 z-[1] flex w-full items-center justify-center gap-2 lg:hidden">
                <div
                  className="quick-view-btn flex h-9 w-9 items-center justify-center rounded-lg bg-white duration-300 hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickViewOpen();
                  }}
                >
                  <Eye className="text-lg" />
                </div>
                <div
                  className="add-cart-btn flex h-9 w-9 items-center justify-center rounded-lg bg-white duration-300 hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  <ShoppingBagOpen className="text-lg" />
                </div>
              </div>
            </div>
            <div className="product-infor mt-4 lg:mb-7">
              <div className="product-sold pb-2 sm:pb-4">
                <div className="progress relative h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={`progress-sold absolute left-0 top-0 h-full bg-red`}
                    style={{ width: `${percentSold}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 gap-y-1">
                  <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                    <span className="text-secondary2 max-sm:text-xs">
                      Sold:{" "}
                    </span>
                    <span className="max-sm:text-xs">{data.sold}</span>
                  </div>
                  <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                    <span className="text-secondary2 max-sm:text-xs">
                      Available:{" "}
                    </span>
                    <span className="max-sm:text-xs">
                      {data.quantity - data.sold}
                    </span>
                  </div>
                </div>
              </div>
              <div className="product-name text-title duration-300">
                {data.name}
              </div>

              <div className="product-price-block relative z-[1] mt-1 flex flex-wrap items-center gap-2 duration-300">
                <div className="product-price text-title">${data.price}.00</div>
                {percentSale > 0 && (
                  <>
                    <div className="product-origin-price text-base font-normal leading-[22] text-secondary2 md:text-[13px] md:leading-5">
                      <del>${data.originPrice}.00</del>
                    </div>
                    <div className="product-sale bg-green_custom inline-block rounded-full px-3 py-0.5 text-base font-medium font-normal leading-[22] md:text-[13px] md:leading-5">
                      -{percentSale}%
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "marketplace" && (
        <div
          className="product-item style-marketplace rounded-2xl border border-line p-4"
          onClick={() => handleDetailProduct(data.id)}
        >
          <div className="bg-img relative w-full">
            <Image
              className="aspect-square w-full"
              width={5000}
              height={5000}
              src={data.thumbImage[0] ?? ""}
              alt="img"
            />
            <div className="list-action absolute right-0 top-0 flex flex-col gap-1">
              <span
                className={`add-wishlistState-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300 ${isInWishlist(data.id) ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                {isInWishlist(data.id) ? (
                  <>
                    <Heart size={18} weight="duotone" className="text-black" />
                  </>
                ) : (
                  <>
                    <Heart size={18} />
                  </>
                )}
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Add To wishlist
                </div>
              </span>

              <span
                className="quick-view-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickViewOpen();
                }}
              >
                <Eye />
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Quick View
                </div>
              </span>
              <span
                className="add-cart-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
              >
                <ShoppingBagOpen />
                <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                  Add To Cart
                </div>
              </span>
            </div>
          </div>
          <div className="product-infor mt-4">
            <span className="text-title">{data.name}</span>
            <div className="mt-1 flex gap-0.5">
              <Rate currentRate={data.rate} size={16} />
            </div>
            <span className="text-title mt-1 inline-block">
              ${data.price}.00
            </span>
          </div>
        </div>
      )}
    </>
  );
}
