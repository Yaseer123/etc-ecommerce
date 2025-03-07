"use client";
import React, { useState } from "react";
import Image from "next/image";
import { type ProductType } from "@/types/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/store-context/CartContext";
import { useModalCartContext } from "@/context/store-context/ModalCartContext";
import { useModalWishlistContext } from "@/context/store-context/ModalWishlistContext";
import { useRouter } from "next/navigation";
import Marquee from "react-fast-marquee";
import Rate from "../Rate";
import { useModalQuickViewContext } from "@/context/store-context/ModalQuickViewContext";
import { api } from "@/trpc/react";

interface ProductProps {
  data: ProductType;
  type: string;
  style?: string;
}
export default function Product({ data, type, style }: ProductProps) {
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [openQuickShop, setOpenQuickShop] = useState<boolean>(false);
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();
  const { openModalWishlist } = useModalWishlistContext();
  const { openQuickView } = useModalQuickViewContext();

  const utils = api.useUtils();
  const [wishlistState] = api.wishList.getWishList.useSuspenseQuery();
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

  const router = useRouter();

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: string) => {
    setActiveSize(item);
  };

  const handleAddToCart = () => {
    if (!cartState.cartArray.find((item) => item?.id === data.id)) {
      addToCart({ ...data });
      updateCart(data.id, data.quantityPurchase, activeSize, activeColor);
    } else {
      updateCart(data.id, data.quantityPurchase, activeSize, activeColor);
    }
    openModalCart();
  };

  const handleAddToWishlist = () => {
    // if product existed in wishlistState, remove from wishlistState and set state to false
    if (wishlistState.some((item) => item.id === data.id)) {
      removeFromWishlistMutation.mutate({ productId: data.id });
    } else {
      // else, add to wishlistState and set state to true
      addToWishlistMutation.mutate({ productId: data.id });
    }
    openModalWishlist();
  };

  const handleQuickViewOpen = () => {
    openQuickView(data);
  };

  const handleDetailProduct = (productId: string) => {
    // redirect to shop with category selected
    router.push(`/product/default?id=${productId}`);
  };

  const percentSale = Math.floor(100 - (data.price / data.originPrice) * 100);
  const percentSold = Math.floor((data.sold / data.quantity) * 100);
  return (
    <>
      {type === "grid" && (
        <div className={`product-item grid-type ${style}`}>
          <div
            onClick={() => handleDetailProduct(data.id)}
            className="product-main block cursor-pointer"
          >
            <div className="product-thumb relative overflow-hidden rounded-2xl bg-white">
              {data.new && (
                <div className="product-tag text-button-uppercase absolute left-3 top-3 z-[1] inline-block rounded-full bg-green_custom px-3 py-0.5">
                  New
                </div>
              )}
              {data.sale && (
                <div className="product-tag text-button-uppercase absolute left-3 top-3 z-[1] inline-block rounded-full bg-red_custom px-3 py-0.5 text-white">
                  Sale
                </div>
              )}

              <div className="list-action-right absolute right-3 top-3 max-lg:hidden">
                <div
                  className={`add-wishlistState-btn relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white duration-300 ${wishlistState.some((item) => item.id === data.id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist();
                  }}
                >
                  <div className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 text-white">
                    Add To wishlist
                  </div>
                  {wishlistState.some((item) => item.id === data.id) ? (
                    <>
                      <Icon.Heart
                        size={18}
                        weight="fill"
                        className="text-white"
                      />
                    </>
                  ) : (
                    <>
                      <Icon.Heart size={18} />
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
                    <div
                      className={`caption2 px-2.5 font-semibold uppercase text-white`}
                    >
                      Hot Sale {percentSale}% OFF
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 px-2.5 font-semibold uppercase text-white`}
                    >
                      Hot Sale {percentSale}% OFF
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 px-2.5 font-semibold uppercase text-white`}
                    >
                      Hot Sale {percentSale}% OFF
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 px-2.5 font-semibold uppercase text-white`}
                    >
                      Hot Sale {percentSale}% OFF
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                    <div
                      className={`caption2 px-2.5 font-semibold uppercase text-white`}
                    >
                      Hot Sale {percentSale}% OFF
                    </div>
                    <Icon.Lightning weight="fill" className="text-red" />
                  </Marquee>
                </>
              )}

              <div
                className={`list-action ${style === "style-1" ? "grid grid-cols-2 gap-3" : ""} absolute bottom-5 w-full px-5 max-lg:hidden`}
              >
                {style === "style-1" && (
                  <div
                    className="quick-view-btn text-button-uppercase w-full rounded-full bg-white py-2 text-center duration-300 hover:bg-black hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickViewOpen();
                    }}
                  >
                    Quick View
                  </div>
                )}
                {data.action === "add to cart" ? (
                  <div
                    className="add-cart-btn text-button-uppercase w-full rounded-full bg-white py-2 text-center duration-500 hover:bg-black hover:text-white"
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
                      className="quick-shop-btn text-button-uppercase rounded-full bg-white py-2 text-center duration-500 hover:bg-black hover:text-white"
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
                            className={`size-item text-button flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white ${activeSize === item ? "active" : ""}`}
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
                  <Icon.Eye className="text-lg" />
                </div>
                <div
                  className="add-cart-btn flex h-9 w-9 items-center justify-center rounded-lg bg-white duration-300 hover:bg-black hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  <Icon.ShoppingBagOpen className="text-lg" />
                </div>
              </div>
            </div>
            <div className="product-infor mt-4 lg:mb-7">
              <div className="product-sold pb-2 sm:pb-4">
                <div className="progress relative h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={`progress-sold bg-red absolute left-0 top-0 h-full`}
                    style={{ width: `${percentSold}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 gap-y-1">
                  <div className="text-button-uppercase">
                    <span className="text-secondary2 max-sm:text-xs">
                      Sold:{" "}
                    </span>
                    <span className="max-sm:text-xs">{data.sold}</span>
                  </div>
                  <div className="text-button-uppercase">
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
                    <div className="product-origin-price caption1 text-secondary2">
                      <del>${data.originPrice}.00</del>
                    </div>
                    <div className="product-sale caption1 inline-block rounded-full bg-green_custom px-3 py-0.5 font-medium">
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
                className={`add-wishlistState-btn box-shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-white duration-300 ${wishlistState.some((item) => item.id === data.id) ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
              >
                {wishlistState.some((item) => item.id === data.id) ? (
                  <>
                    <Icon.Heart
                      size={18}
                      weight="duotone"
                      className="text-black"
                    />
                  </>
                ) : (
                  <>
                    <Icon.Heart size={18} />
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
                <Icon.Eye />
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
                <Icon.ShoppingBagOpen />
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
