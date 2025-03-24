"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css/bundle";
import {
  X,
  Heart,
  Minus,
  Plus,
  ShareNetwork,
  ArrowClockwise,
  Question,
  Timer,
  Eye,
  Star,
  CaretDown,
  DotsThree,
  HandsClapping,
} from "@phosphor-icons/react/dist/ssr";
import SwiperCore from "swiper/core";
import Rate from "../../Rate";
import { useCartStore } from "@/context/store-context/CartContext";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { useModalWishlistStore } from "@/context/store-context/ModalWishlistContext";
import { api } from "@/trpc/react";
import ParseContent from "../../Blog/ParseContent";
import { v4 as uuid } from "uuid";
import { useSession } from "next-auth/react";
import type { ProductWithCategory } from "@/types/ProductType";

export default function ProductDetails({
  productMain,
}: {
  productMain: ProductWithCategory;
}) {
  SwiperCore.use([Navigation, Thumbs]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef: any = useRef();

  const { data: session } = useSession();

  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [activeTab, setActiveTab] = useState<string | undefined>("description");
  const [productQuantity, setProductQuantity] = useState<number>(1);

  const { addToCart, updateCart, cartArray } = useCartStore();
  const { openModalCart } = useModalCartStore();
  const { openModalWishlist } = useModalWishlistStore();
  const utils = api.useUtils();

  const [wishlistResponse] = api.wishList.getWishList.useSuspenseQuery();
  const wishlist = wishlistResponse ?? [];

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

  const percentSale = Math.floor(
    100 - (productMain.price / productMain.originPrice) * 100,
  );

  const handleSwiper = (swiper: SwiperCore) => {
    setThumbsSwiper(swiper);
  };

  const handleIncreaseQuantity = () => {
    // updateCart(productMain.id, productQuantity + 1);
    setProductQuantity(productQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity(productQuantity - 1);
      // updateCart(productMain.id, productMain.quantityPurchase - 1);
    }
  };

  const handleAddToCart = () => {
    if (!cartArray.find((item) => item.id === productMain.id)) {
      addToCart({ ...productMain });
      updateCart(productMain.id, productQuantity);
    } else {
      updateCart(productMain.id, productQuantity);
    }
    openModalCart();
  };

  const isInWishlist = (itemId: string): boolean => {
    return wishlist.some((item: { id: string }) => item?.id === itemId);
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(productMain.id)) {
      // **Optimistic UI Update: Remove item immediately**
      utils.wishList.getWishList.setData(
        undefined,
        (old) => old?.filter((item) => item.id !== productMain.id) ?? [],
      );

      removeFromWishlistMutation.mutate(
        { productId: productMain.id },
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
        {
          id: uuid(), // Temporary ID for optimistic update
          product: productMain,
          createdAt: new Date(),
          userId: session?.user.id ?? "temp-user", // Replace with actual user ID if available
          productId: productMain.id,
        },
      ]);

      addToWishlistMutation.mutate(
        { productId: productMain.id },
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

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="product-detail grouped">
        <div className="featured-product underwear bg-linear pb-8 pt-6 md:pb-[60px] md:pt-8">
          <div className="mx-auto flex w-full !max-w-[1322px] flex-wrap justify-between gap-y-6 px-4">
            <div className="list-img w-full md:w-1/2 md:pr-[45px]">
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="mySwiper2 ml-30 overflow-hidden rounded-2xl"
              >
                {productMain.images.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                      swiperRef.current?.slideTo(index);
                      setOpenPopupImg(true);
                    }}
                  >
                    <Image
                      src={item}
                      width={1000}
                      height={1000}
                      alt="prd-img"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={handleSwiper}
                spaceBetween={0}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="mySwiper"
              >
                {productMain.images.map((item, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={item}
                      width={1000}
                      height={1000}
                      alt="prd-img"
                      className="aspect-[3/4] w-full rounded-xl object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className={`popup-img ${openPopupImg ? "open" : ""}`}>
                <span
                  className="close-popup-btn absolute right-4 top-4 z-[2] cursor-pointer"
                  onClick={() => {
                    setOpenPopupImg(false);
                  }}
                >
                  <X className="text-3xl text-white" />
                </span>
                <Swiper
                  spaceBetween={0}
                  slidesPerView={1}
                  modules={[Navigation, Thumbs]}
                  navigation={true}
                  loop={true}
                  className="popupSwiper"
                  onSwiper={(swiper) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    swiperRef.current = swiper;
                  }}
                >
                  {productMain.images.map((item, index) => (
                    <SwiperSlide
                      key={index}
                      onClick={() => {
                        setOpenPopupImg(false);
                      }}
                    >
                      <Image
                        src={item}
                        width={1000}
                        height={1000}
                        alt="prd-img"
                        className="aspect-[3/4] w-full rounded-xl object-cover"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="product-infor w-full md:w-1/2 md:pl-2 lg:pl-[15px]">
              <div className="flex justify-between">
                <div>
                  <div className="mt-1 text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                    {productMain.title}
                  </div>
                </div>
                <div
                  className={`add-wishlist-btn flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-line duration-300 hover:bg-black hover:text-white ${wishlist.some((item) => item.id === productMain.id) ? "active" : ""}`}
                  onClick={handleAddToWishlist}
                >
                  {wishlist.some((item) => item.id === productMain.id) ? (
                    <>
                      <Heart size={24} weight="fill" className="text-white" />
                    </>
                  ) : (
                    <>
                      <Heart size={24} />
                    </>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <Rate currentRate={productMain.rate} size={14} />
                <span className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                  (1.234 reviews)
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="product-price heading5">
                  ${productMain.price}.00
                </div>
                <div className="h-4 w-px bg-line"></div>
                <div className="product-origin-price font-normal text-secondary2">
                  <del>${productMain.originPrice}.00</del>
                </div>
                {productMain.originPrice && (
                  <div className="product-sale caption2 bg-green_custom inline-block rounded-full px-3 py-0.5 font-semibold">
                    -{percentSale}%
                  </div>
                )}
              </div>
              <div className="desc mt-5 block border-b border-line pb-6 text-secondary">
                {productMain.shortDescription}
              </div>
              <div className="list-action mt-6">
                <div className="discount-code">
                  <div className="text-title">Useable discount codes:</div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="item relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="130"
                        height="32"
                        viewBox="0 0 130 32"
                        fill="none"
                      >
                        <path
                          d="M6.67572e-06 31.0335V31.0335C6.67572e-06 31.5651 0.430976 31.9961 0.962603 31.9961H13.5219C14.2048 31.9961 14.8816 31.4936 15.1194 30.795C15.1604 30.6745 15.0581 30.5573 14.9709 30.4646V30.4646C14.9168 30.407 14.887 30.3321 14.8874 30.2545V29.2172C14.8874 29.1347 14.9215 29.0555 14.9822 28.9972C15.043 28.9388 15.1253 28.906 15.2112 28.906C15.2971 28.906 15.3795 28.9388 15.4402 28.9972C15.5009 29.0555 15.535 29.1347 15.535 29.2172V30.2545C15.5354 30.3322 15.5055 30.4073 15.4511 30.4649V30.4649C15.3637 30.5576 15.261 30.6748 15.3021 30.7955C15.5399 31.4938 16.2158 31.9961 16.9005 31.9961L126 31.9961C128.209 31.9961 130 30.2052 130 27.9961V3.99609C130 1.78695 128.209 -0.00390625 126 -0.00390625L16.8962 -0.00390625C16.117 -0.00390625 15.5003 0.496968 15.2882 1.1946C15.2507 1.31784 15.3567 1.43416 15.4456 1.52737V1.52737C15.5006 1.58504 15.531 1.6605 15.5307 1.73873V2.25736C15.5307 2.3399 15.4966 2.41905 15.4359 2.47741C15.3751 2.53576 15.2928 2.56855 15.2069 2.56855C15.121 2.56855 15.0386 2.53576 14.9779 2.47741C14.9172 2.41905 14.8831 2.3399 14.8831 2.25736V1.73873C14.8826 1.6618 14.9118 1.58742 14.965 1.52995V1.52995C15.0504 1.43773 15.149 1.31968 15.1045 1.20212C14.8388 0.500396 14.0963 -0.00494385 13.5176 -0.00494385H0.481824C0.215723 -0.00494385 6.67572e-06 0.210773 6.67572e-06 0.476873V0.476873C6.67572e-06 0.742974 0.220644 0.951525 0.474363 1.03175C0.697986 1.10246 0.903572 1.22287 1.07316 1.38583C1.35777 1.65934 1.51767 2.03031 1.51767 2.41711C1.51767 2.8039 1.35777 3.17485 1.07316 3.44836C0.903447 3.61144 0.697684 3.73191 0.473869 3.8026C0.220396 3.88265 6.67572e-06 4.09098 6.67572e-06 4.3568V4.3568C6.67572e-06 4.62261 0.220397 4.83095 0.473867 4.91101C0.697682 4.98171 0.903447 5.10218 1.07316 5.26526C1.35777 5.53877 1.51767 5.90972 1.51767 6.29651C1.51767 6.68331 1.35777 7.05426 1.07316 7.32776C0.903447 7.49085 0.697683 7.61132 0.473868 7.68201C0.220397 7.76207 6.67572e-06 7.9704 6.67572e-06 8.23622V8.23622C6.67572e-06 8.50203 0.220397 8.71037 0.473868 8.79042C0.697683 8.86112 0.903447 8.98159 1.07316 9.14467C1.35777 9.41818 1.51767 9.78914 1.51767 10.1759C1.51767 10.5627 1.35777 10.9337 1.07316 11.2072C0.903447 11.3703 0.697683 11.4907 0.473868 11.5614C0.220397 11.6415 6.67572e-06 11.8498 6.67572e-06 12.1156V12.1156C6.67572e-06 12.3815 0.220397 12.5898 0.473868 12.6698C0.697683 12.7405 0.903447 12.861 1.07316 13.0241C1.35777 13.2976 1.51767 13.6685 1.51767 14.0553C1.51767 14.4421 1.35777 14.8131 1.07316 15.0866C0.902084 15.251 0.694377 15.3721 0.468473 15.4425C0.217696 15.5208 6.67572e-06 15.7267 6.67572e-06 15.9894V15.9894C6.67572e-06 16.2569 0.225281 16.4649 0.482009 16.54C0.519464 16.5509 0.556524 16.5633 0.5931 16.577C0.781892 16.6479 0.953983 16.7545 1.09922 16.8904C1.24445 17.0263 1.35989 17.1887 1.43871 17.3682C1.51753 17.5477 1.55815 17.7405 1.55815 17.9353C1.55815 18.1301 1.51753 18.3229 1.43871 18.5024C1.35989 18.6818 1.24445 18.8443 1.09922 18.9802C0.953983 19.1161 0.781892 19.2226 0.5931 19.2936C0.556521 19.3073 0.51946 19.3197 0.482002 19.3306C0.225278 19.4056 6.67572e-06 19.6137 6.67572e-06 19.8812V19.8812C6.67572e-06 20.1438 0.21768 20.3498 0.468455 20.428C0.506373 20.4398 0.54385 20.4531 0.580795 20.4678C0.764926 20.5411 0.932229 20.6485 1.07316 20.784C1.21409 20.9194 1.32588 21.0802 1.40215 21.2571C1.47842 21.4341 1.51767 21.6237 1.51767 21.8152C1.51767 22.0067 1.47842 22.1964 1.40215 22.3733C1.32588 22.5503 1.21409 22.711 1.07316 22.8465C0.932229 22.9819 0.764926 23.0893 0.580795 23.1626C0.545606 23.1766 0.509935 23.1893 0.47386 23.2007C0.220386 23.2808 6.67572e-06 23.4891 6.67572e-06 23.7549V23.7549C6.67572e-06 24.0207 0.220397 24.2291 0.473866 24.3091C0.697682 24.3798 0.903447 24.5003 1.07316 24.6634C1.35777 24.9369 1.51767 25.3078 1.51767 25.6946C1.51767 26.0814 1.35777 26.4524 1.07316 26.7259C0.903447 26.889 0.697683 27.0094 0.473867 27.0801C0.220397 27.1602 6.67572e-06 27.3685 6.67572e-06 27.6343V27.6343C6.67572e-06 27.9002 0.220396 28.1085 0.473867 28.1885C0.697683 28.2592 0.903447 28.3797 1.07316 28.5428C1.35777 28.8163 1.51767 29.1873 1.51767 29.5741C1.51767 29.9608 1.35777 30.3318 1.07316 30.6053C0.788785 30.8786 0.403181 31.0322 0.00104617 31.0325C0.000472754 31.0325 6.67572e-06 31.0329 6.67572e-06 31.0335V31.0335ZM14.8874 4.3288C14.8874 4.24627 14.9215 4.16712 14.9822 4.10876C15.043 4.0504 15.1253 4.01762 15.2112 4.01762C15.2971 4.01762 15.3795 4.0504 15.4402 4.10876C15.5009 4.16712 15.535 4.24627 15.535 4.3288V5.36608C15.535 5.44861 15.5009 5.52776 15.4402 5.58612C15.3795 5.64448 15.2971 5.67726 15.2112 5.67726C15.1253 5.67726 15.043 5.64448 14.9822 5.58612C14.9215 5.52776 14.8874 5.44861 14.8874 5.36608V4.3288ZM14.8874 7.44063C14.8874 7.3581 14.9215 7.27895 14.9822 7.22059C15.043 7.16223 15.1253 7.12945 15.2112 7.12945C15.2971 7.12945 15.3795 7.16223 15.4402 7.22059C15.5009 7.27895 15.535 7.3581 15.535 7.44063V8.47791C15.535 8.56044 15.5009 8.63958 15.4402 8.69794C15.3795 8.7563 15.2971 8.78909 15.2112 8.78909C15.1253 8.78909 15.043 8.7563 14.9822 8.69794C14.9215 8.63958 14.8874 8.56044 14.8874 8.47791V7.44063ZM14.8874 10.5525C14.8874 10.4699 14.9215 10.3908 14.9822 10.3324C15.043 10.2741 15.1253 10.2413 15.2112 10.2413C15.2971 10.2413 15.3795 10.2741 15.4402 10.3324C15.5009 10.3908 15.535 10.4699 15.535 10.5525V11.5897C15.535 11.6723 15.5009 11.7514 15.4402 11.8098C15.3795 11.8681 15.2971 11.9009 15.2112 11.9009C15.1253 11.9009 15.043 11.8681 14.9822 11.8098C14.9215 11.7514 14.8874 11.6723 14.8874 11.5897V10.5525ZM14.8874 13.6643C14.8874 13.5818 14.9215 13.5026 14.9822 13.4443C15.043 13.3859 15.1253 13.3531 15.2112 13.3531C15.2971 13.3531 15.3795 13.3859 15.4402 13.4443C15.5009 13.5026 15.535 13.5818 15.535 13.6643V14.7016C15.535 14.7841 15.5009 14.8632 15.4402 14.9216C15.3795 14.98 15.2971 15.0128 15.2112 15.0128C15.1253 15.0128 15.043 14.98 14.9822 14.9216C14.9215 14.8632 14.8874 14.7841 14.8874 14.7016V13.6643ZM14.8874 16.7761C14.8874 16.6936 14.9215 16.6144 14.9822 16.5561C15.043 16.4977 15.1253 16.4649 15.2112 16.4649C15.2971 16.4649 15.3795 16.4977 15.4402 16.5561C15.5009 16.6144 15.535 16.6936 15.535 16.7761V17.8134C15.535 17.8959 15.5009 17.9751 15.4402 18.0334C15.3795 18.0918 15.2971 18.1246 15.2112 18.1246C15.1253 18.1246 15.043 18.0918 14.9822 18.0334C14.9215 17.9751 14.8874 17.8959 14.8874 17.8134V16.7761ZM14.8874 19.888C14.8874 19.8054 14.9215 19.7263 14.9822 19.6679C15.043 19.6096 15.1253 19.5768 15.2112 19.5768C15.2971 19.5768 15.3795 19.6096 15.4402 19.6679C15.5009 19.7263 15.535 19.8054 15.535 19.888V20.9252C15.535 21.0078 15.5009 21.0869 15.4402 21.1453C15.3795 21.2036 15.2971 21.2364 15.2112 21.2364C15.1253 21.2364 15.043 21.2036 14.9822 21.1453C14.9215 21.0869 14.8874 21.0078 14.8874 20.9252V19.888ZM14.8874 22.9998C14.8874 22.9173 14.9215 22.8381 14.9822 22.7797C15.043 22.7214 15.1253 22.6886 15.2112 22.6886C15.2971 22.6886 15.3795 22.7214 15.4402 22.7797C15.5009 22.8381 15.535 22.9173 15.535 22.9998V24.0371C15.535 24.1196 15.5009 24.1987 15.4402 24.2571C15.3795 24.3155 15.2971 24.3483 15.2112 24.3483C15.1253 24.3483 15.043 24.3155 14.9822 24.2571C14.9215 24.1987 14.8874 24.1196 14.8874 24.0371V22.9998ZM14.8874 26.1116C14.8874 26.0291 14.9215 25.9499 14.9822 25.8916C15.043 25.8332 15.1253 25.8004 15.2112 25.8004C15.2971 25.8004 15.3795 25.8332 15.4402 25.8916C15.5009 25.9499 15.535 26.0291 15.535 26.1116V27.1489C15.535 27.2314 15.5009 27.3106 15.4402 27.3689C15.3795 27.4273 15.2971 27.4601 15.2112 27.4601C15.1253 27.4601 15.043 27.4273 14.9822 27.3689C14.9215 27.3106 14.8874 27.2314 14.8874 27.1489V26.1116Z"
                          fill="#DB4444"
                        />
                      </svg>
                      <div className="content absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 md:right-1">
                        <div className="text-base font-normal leading-[22] text-white md:text-[13px] md:leading-5">
                          15% Off
                        </div>
                        <div className="button cursor-pointer rounded-full bg-white px-2 py-1 text-xs font-semibold duration-300 hover:bg-black hover:text-white">
                          Apply
                        </div>
                      </div>
                    </div>
                    <div className="item relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="130"
                        height="32"
                        viewBox="0 0 130 32"
                        fill="none"
                      >
                        <path
                          d="M6.67572e-06 31.0335V31.0335C6.67572e-06 31.5651 0.430976 31.9961 0.962603 31.9961H13.5219C14.2048 31.9961 14.8816 31.4936 15.1194 30.795C15.1604 30.6745 15.0581 30.5573 14.9709 30.4646V30.4646C14.9168 30.407 14.887 30.3321 14.8874 30.2545V29.2172C14.8874 29.1347 14.9215 29.0555 14.9822 28.9972C15.043 28.9388 15.1253 28.906 15.2112 28.906C15.2971 28.906 15.3795 28.9388 15.4402 28.9972C15.5009 29.0555 15.535 29.1347 15.535 29.2172V30.2545C15.5354 30.3322 15.5055 30.4073 15.4511 30.4649V30.4649C15.3637 30.5576 15.261 30.6748 15.3021 30.7955C15.5399 31.4938 16.2158 31.9961 16.9005 31.9961L126 31.9961C128.209 31.9961 130 30.2052 130 27.9961V3.99609C130 1.78695 128.209 -0.00390625 126 -0.00390625L16.8962 -0.00390625C16.117 -0.00390625 15.5003 0.496968 15.2882 1.1946C15.2507 1.31784 15.3567 1.43416 15.4456 1.52737V1.52737C15.5006 1.58504 15.531 1.6605 15.5307 1.73873V2.25736C15.5307 2.3399 15.4966 2.41905 15.4359 2.47741C15.3751 2.53576 15.2928 2.56855 15.2069 2.56855C15.121 2.56855 15.0386 2.53576 14.9779 2.47741C14.9172 2.41905 14.8831 2.3399 14.8831 2.25736V1.73873C14.8826 1.6618 14.9118 1.58742 14.965 1.52995V1.52995C15.0504 1.43773 15.149 1.31968 15.1045 1.20212C14.8388 0.500396 14.0963 -0.00494385 13.5176 -0.00494385H0.481824C0.215723 -0.00494385 6.67572e-06 0.210773 6.67572e-06 0.476873V0.476873C6.67572e-06 0.742974 0.220644 0.951525 0.474363 1.03175C0.697986 1.10246 0.903572 1.22287 1.07316 1.38583C1.35777 1.65934 1.51767 2.03031 1.51767 2.41711C1.51767 2.8039 1.35777 3.17485 1.07316 3.44836C0.903447 3.61144 0.697684 3.73191 0.473869 3.8026C0.220396 3.88265 6.67572e-06 4.09098 6.67572e-06 4.3568V4.3568C6.67572e-06 4.62261 0.220397 4.83095 0.473867 4.91101C0.697682 4.98171 0.903447 5.10218 1.07316 5.26526C1.35777 5.53877 1.51767 5.90972 1.51767 6.29651C1.51767 6.68331 1.35777 7.05426 1.07316 7.32776C0.903447 7.49085 0.697683 7.61132 0.473868 7.68201C0.220397 7.76207 6.67572e-06 7.9704 6.67572e-06 8.23622V8.23622C6.67572e-06 8.50203 0.220397 8.71037 0.473868 8.79042C0.697683 8.86112 0.903447 8.98159 1.07316 9.14467C1.35777 9.41818 1.51767 9.78914 1.51767 10.1759C1.51767 10.5627 1.35777 10.9337 1.07316 11.2072C0.903447 11.3703 0.697683 11.4907 0.473868 11.5614C0.220397 11.6415 6.67572e-06 11.8498 6.67572e-06 12.1156V12.1156C6.67572e-06 12.3815 0.220397 12.5898 0.473868 12.6698C0.697683 12.7405 0.903447 12.861 1.07316 13.0241C1.35777 13.2976 1.51767 13.6685 1.51767 14.0553C1.51767 14.4421 1.35777 14.8131 1.07316 15.0866C0.902084 15.251 0.694377 15.3721 0.468473 15.4425C0.217696 15.5208 6.67572e-06 15.7267 6.67572e-06 15.9894V15.9894C6.67572e-06 16.2569 0.225281 16.4649 0.482009 16.54C0.519464 16.5509 0.556524 16.5633 0.5931 16.577C0.781892 16.6479 0.953983 16.7545 1.09922 16.8904C1.24445 17.0263 1.35989 17.1887 1.43871 17.3682C1.51753 17.5477 1.55815 17.7405 1.55815 17.9353C1.55815 18.1301 1.51753 18.3229 1.43871 18.5024C1.35989 18.6818 1.24445 18.8443 1.09922 18.9802C0.953983 19.1161 0.781892 19.2226 0.5931 19.2936C0.556521 19.3073 0.51946 19.3197 0.482002 19.3306C0.225278 19.4056 6.67572e-06 19.6137 6.67572e-06 19.8812V19.8812C6.67572e-06 20.1438 0.21768 20.3498 0.468455 20.428C0.506373 20.4398 0.54385 20.4531 0.580795 20.4678C0.764926 20.5411 0.932229 20.6485 1.07316 20.784C1.21409 20.9194 1.32588 21.0802 1.40215 21.2571C1.47842 21.4341 1.51767 21.6237 1.51767 21.8152C1.51767 22.0067 1.47842 22.1964 1.40215 22.3733C1.32588 22.5503 1.21409 22.711 1.07316 22.8465C0.932229 22.9819 0.764926 23.0893 0.580795 23.1626C0.545606 23.1766 0.509935 23.1893 0.47386 23.2007C0.220386 23.2808 6.67572e-06 23.4891 6.67572e-06 23.7549V23.7549C6.67572e-06 24.0207 0.220397 24.2291 0.473866 24.3091C0.697682 24.3798 0.903447 24.5003 1.07316 24.6634C1.35777 24.9369 1.51767 25.3078 1.51767 25.6946C1.51767 26.0814 1.35777 26.4524 1.07316 26.7259C0.903447 26.889 0.697683 27.0094 0.473867 27.0801C0.220397 27.1602 6.67572e-06 27.3685 6.67572e-06 27.6343V27.6343C6.67572e-06 27.9002 0.220396 28.1085 0.473867 28.1885C0.697683 28.2592 0.903447 28.3797 1.07316 28.5428C1.35777 28.8163 1.51767 29.1873 1.51767 29.5741C1.51767 29.9608 1.35777 30.3318 1.07316 30.6053C0.788785 30.8786 0.403181 31.0322 0.00104617 31.0325C0.000472754 31.0325 6.67572e-06 31.0329 6.67572e-06 31.0335V31.0335ZM14.8874 4.3288C14.8874 4.24627 14.9215 4.16712 14.9822 4.10876C15.043 4.0504 15.1253 4.01762 15.2112 4.01762C15.2971 4.01762 15.3795 4.0504 15.4402 4.10876C15.5009 4.16712 15.535 4.24627 15.535 4.3288V5.36608C15.535 5.44861 15.5009 5.52776 15.4402 5.58612C15.3795 5.64448 15.2971 5.67726 15.2112 5.67726C15.1253 5.67726 15.043 5.64448 14.9822 5.58612C14.9215 5.52776 14.8874 5.44861 14.8874 5.36608V4.3288ZM14.8874 7.44063C14.8874 7.3581 14.9215 7.27895 14.9822 7.22059C15.043 7.16223 15.1253 7.12945 15.2112 7.12945C15.2971 7.12945 15.3795 7.16223 15.4402 7.22059C15.5009 7.27895 15.535 7.3581 15.535 7.44063V8.47791C15.535 8.56044 15.5009 8.63958 15.4402 8.69794C15.3795 8.7563 15.2971 8.78909 15.2112 8.78909C15.1253 8.78909 15.043 8.7563 14.9822 8.69794C14.9215 8.63958 14.8874 8.56044 14.8874 8.47791V7.44063ZM14.8874 10.5525C14.8874 10.4699 14.9215 10.3908 14.9822 10.3324C15.043 10.2741 15.1253 10.2413 15.2112 10.2413C15.2971 10.2413 15.3795 10.2741 15.4402 10.3324C15.5009 10.3908 15.535 10.4699 15.535 10.5525V11.5897C15.535 11.6723 15.5009 11.7514 15.4402 11.8098C15.3795 11.8681 15.2971 11.9009 15.2112 11.9009C15.1253 11.9009 15.043 11.8681 14.9822 11.8098C14.9215 11.7514 14.8874 11.6723 14.8874 11.5897V10.5525ZM14.8874 13.6643C14.8874 13.5818 14.9215 13.5026 14.9822 13.4443C15.043 13.3859 15.1253 13.3531 15.2112 13.3531C15.2971 13.3531 15.3795 13.3859 15.4402 13.4443C15.5009 13.5026 15.535 13.5818 15.535 13.6643V14.7016C15.535 14.7841 15.5009 14.8632 15.4402 14.9216C15.3795 14.98 15.2971 15.0128 15.2112 15.0128C15.1253 15.0128 15.043 14.98 14.9822 14.9216C14.9215 14.8632 14.8874 14.7841 14.8874 14.7016V13.6643ZM14.8874 16.7761C14.8874 16.6936 14.9215 16.6144 14.9822 16.5561C15.043 16.4977 15.1253 16.4649 15.2112 16.4649C15.2971 16.4649 15.3795 16.4977 15.4402 16.5561C15.5009 16.6144 15.535 16.6936 15.535 16.7761V17.8134C15.535 17.8959 15.5009 17.9751 15.4402 18.0334C15.3795 18.0918 15.2971 18.1246 15.2112 18.1246C15.1253 18.1246 15.043 18.0918 14.9822 18.0334C14.9215 17.9751 14.8874 17.8959 14.8874 17.8134V16.7761ZM14.8874 19.888C14.8874 19.8054 14.9215 19.7263 14.9822 19.6679C15.043 19.6096 15.1253 19.5768 15.2112 19.5768C15.2971 19.5768 15.3795 19.6096 15.4402 19.6679C15.5009 19.7263 15.535 19.8054 15.535 19.888V20.9252C15.535 21.0078 15.5009 21.0869 15.4402 21.1453C15.3795 21.2036 15.2971 21.2364 15.2112 21.2364C15.1253 21.2364 15.043 21.2036 14.9822 21.1453C14.9215 21.0869 14.8874 21.0078 14.8874 20.9252V19.888ZM14.8874 22.9998C14.8874 22.9173 14.9215 22.8381 14.9822 22.7797C15.043 22.7214 15.1253 22.6886 15.2112 22.6886C15.2971 22.6886 15.3795 22.7214 15.4402 22.7797C15.5009 22.8381 15.535 22.9173 15.535 22.9998V24.0371C15.535 24.1196 15.5009 24.1987 15.4402 24.2571C15.3795 24.3155 15.2971 24.3483 15.2112 24.3483C15.1253 24.3483 15.043 24.3155 14.9822 24.2571C14.9215 24.1987 14.8874 24.1196 14.8874 24.0371V22.9998ZM14.8874 26.1116C14.8874 26.0291 14.9215 25.9499 14.9822 25.8916C15.043 25.8332 15.1253 25.8004 15.2112 25.8004C15.2971 25.8004 15.3795 25.8332 15.4402 25.8916C15.5009 25.9499 15.535 26.0291 15.535 26.1116V27.1489C15.535 27.2314 15.5009 27.3106 15.4402 27.3689C15.3795 27.4273 15.2971 27.4601 15.2112 27.4601C15.1253 27.4601 15.043 27.4273 14.9822 27.3689C14.9215 27.3106 14.8874 27.2314 14.8874 27.1489V26.1116Z"
                          fill="#DB4444"
                        />
                      </svg>
                      <div className="content absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2 md:right-1">
                        <div className="text-base font-normal leading-[22] text-white md:text-[13px] md:leading-5">
                          25% Off
                        </div>
                        <div className="button cursor-pointer rounded-full bg-white px-2 py-1 text-xs font-semibold duration-300 hover:bg-black hover:text-white">
                          Apply
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-title mt-5">Quantity:</div>
                <div className="choose-quantity mt-3 flex items-center gap-5 gap-y-3 lg:justify-between">
                  <div className="quantity-block flex w-[120px] flex-shrink-0 items-center justify-between rounded-lg border border-line bg-white max-md:px-3 max-md:py-1.5 sm:w-[180px] md:p-3">
                    <Minus
                      size={20}
                      onClick={handleDecreaseQuantity}
                      className={`${productQuantity === 1 ? "disabled" : ""} cursor-pointer`}
                    />
                    <div className="body1 font-semibold">{productQuantity}</div>
                    <Plus
                      size={20}
                      onClick={handleIncreaseQuantity}
                      className="cursor-pointer"
                    />
                  </div>
                  <div
                    onClick={handleAddToCart}
                    className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] border border-black bg-white px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-black transition-all ease-in-out hover:bg-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                  >
                    Add To Cart
                  </div>
                </div>
                <div className="button-block mt-5">
                  <div className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                    Buy It Now
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-8 border-b border-line pb-6 lg:gap-20">
                  <div className="share flex cursor-pointer items-center gap-3">
                    <div className="share-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line duration-300 hover:bg-black hover:text-white md:h-12 md:w-12">
                      <ShareNetwork weight="fill" className="heading6" />
                    </div>
                    <span>Share Products</span>
                  </div>
                </div>
                <div className="more-infor mt-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ArrowClockwise className="body1" />
                      <div className="text-title">Delivery & Return</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Question className="body1" />
                      <div className="text-title">Ask A Question</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <Timer className="body1" />
                    <div className="text-title">Estimated Delivery:</div>
                    <div className="text-secondary">
                      14 January - 18 January
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <Eye className="body1" />
                    <div className="text-title">38</div>
                    <div className="text-secondary">
                      people viewing this product right now!
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <div className="text-title">SKU:</div>
                    <div className="text-secondary">53453412</div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <div className="text-title">Categories:</div>
                    <div className="text-secondary">
                      {productMain.category?.name}
                    </div>
                  </div>
                </div>
                <div className="list-payment mt-7">
                  <div className="main-content relative rounded-xl border border-line px-3 pb-4 pt-6 max-md:w-2/3 max-sm:w-full sm:px-4 lg:pb-6 lg:pt-8">
                    <div className="heading6 bg-linear absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap px-5">
                      Guranteed safe checkout
                    </div>
                    <div className="list grid grid-cols-6">
                      <div className="item flex items-center justify-center px-1 lg:px-3">
                        <Image
                          src={"/images/payment/Frame-0.png"}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                      <div className="item flex items-center justify-center px-1 lg:px-3">
                        <Image
                          src={"/images/payment/Frame-1.png"}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                      <div className="item flex items-center justify-center px-1 lg:px-3">
                        <Image
                          src={"/images/payment/Frame-2.png"}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                      <div className="item flex items-center justify-center px-1 lg:px-3">
                        <Image
                          src={"/images/payment/Frame-3.png"}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                      <div className="item flex items-center justify-center px-1 lg:px-3">
                        <Image
                          src={"/images/payment/Frame-4.png"}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                      <div className="item flex items-center justify-center px-1 lg:px-3">
                        <Image
                          src={"/images/payment/Frame-5.png"}
                          width={500}
                          height={450}
                          alt="payment"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="get-it mt-6">
                <div className="heading5">Get it today</div>
                <div className="item mt-4 flex items-center gap-3">
                  <div className="icon-delivery-truck text-4xl"></div>
                  <div>
                    <div className="text-title">Free shipping</div>
                    <div className="mt-1 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                      Free shipping on orders over $75.
                    </div>
                  </div>
                </div>
                <div className="item mt-4 flex items-center gap-3">
                  <div className="icon-phone-call text-4xl"></div>
                  <div>
                    <div className="text-title">Support everyday</div>
                    <div className="mt-1 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                      Support from 8:30 AM to 10:00 PM everyday
                    </div>
                  </div>
                </div>
                <div className="item mt-4 flex items-center gap-3">
                  <div className="icon-return text-4xl"></div>
                  <div>
                    <div className="text-title">100 Day Returns</div>
                    <div className="mt-1 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                      Not impressed? Get a refund. You have 100 days to break
                      our hearts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="desc-tab py-10 md:py-20">
          <div className="mx-auto w-full !max-w-[1322px] px-4">
            <div className="flex w-full items-center justify-center">
              <div className="menu-tab flex items-center gap-8 md:gap-[60px]">
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 duration-300 hover:text-black ${activeTab === "description" ? "active" : ""}`}
                  onClick={() => handleActiveTab("description")}
                >
                  Description
                </div>
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 duration-300 hover:text-black ${activeTab === "specifications" ? "active" : ""}`}
                  onClick={() => handleActiveTab("specifications")}
                >
                  Specifications
                </div>
                <div
                  className={`tab-item heading5 has-line-before text-secondary2 duration-300 hover:text-black ${activeTab === "review" ? "active" : ""}`}
                  onClick={() => handleActiveTab("review")}
                >
                  Review
                </div>
              </div>
            </div>
            <div className="desc-block mt-8">
              <div
                className={`desc-item description ${activeTab === "description" ? "open" : ""}`}
              >
                <ParseContent content={productMain.description} />
              </div>
              <div
                className={`desc-item specifications ${activeTab === "specifications" ? "open" : ""}`}
              >
                <div className="w-full sm:w-3/4 lg:w-1/2">
                  {productMain.attributes &&
                    Object.entries(productMain.attributes).map(
                      ([key, value], index) => (
                        <div
                          key={index}
                          className={`item flex items-center gap-8 ${
                            index % 2 === 0 ? "bg-surface" : ""
                          } px-10 py-3`}
                        >
                          <div className="text-title w-1/3 sm:w-1/4">{key}</div>
                          <p>{value}</p>
                        </div>
                      ),
                    )}
                </div>
              </div>
              <div
                className={`desc-item review-block ${activeTab === "review" ? "open" : ""}`}
              >
                <div className="top-overview flex items-center justify-between gap-12 gap-y-4 max-sm:flex-col">
                  <div className="left flex w-full items-center justify-between gap-y-4 max-sm:flex-col sm:w-2/3 sm:pr-5 lg:w-1/2">
                    <div className="rating black-start flex flex-col items-center">
                      <div className="text-display">4.6</div>
                      <Rate currentRate={5} size={18} />
                      <div className="mt-1 whitespace-nowrap text-center">
                        (1,968 Ratings)
                      </div>
                    </div>
                    <div className="list-rating w-2/3">
                      <div className="item flex items-center justify-end gap-1.5">
                        <div className="flex items-center gap-1">
                          <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                            5
                          </div>
                          <Star size={14} weight="fill" />
                        </div>
                        <div className="progress relative h-2 w-3/4 bg-line">
                          <div className="progress-percent absolute left-0 top-0 h-full w-[50%] bg-black"></div>
                        </div>
                        <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                          50%
                        </div>
                      </div>
                      <div className="item mt-1 flex items-center justify-end gap-1.5">
                        <div className="flex items-center gap-1">
                          <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                            4
                          </div>
                          <Star size={14} weight="fill" />
                        </div>
                        <div className="progress relative h-2 w-3/4 bg-line">
                          <div className="progress-percent absolute left-0 top-0 h-full w-[20%] bg-black"></div>
                        </div>
                        <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                          20%
                        </div>
                      </div>
                      <div className="item mt-1 flex items-center justify-end gap-1.5">
                        <div className="flex items-center gap-1">
                          <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                            3
                          </div>
                          <Star size={14} weight="fill" />
                        </div>
                        <div className="progress relative h-2 w-3/4 bg-line">
                          <div className="progress-percent absolute left-0 top-0 h-full w-[10%] bg-black"></div>
                        </div>
                        <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                          10%
                        </div>
                      </div>
                      <div className="item mt-1 flex items-center justify-end gap-1.5">
                        <div className="flex items-center gap-1">
                          <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                            2
                          </div>
                          <Star size={14} weight="fill" />
                        </div>
                        <div className="progress relative h-2 w-3/4 bg-line">
                          <div className="progress-percent absolute left-0 top-0 h-full w-[10%] bg-black"></div>
                        </div>
                        <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                          10%
                        </div>
                      </div>
                      <div className="item mt-1 flex items-center justify-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                            1
                          </div>
                          <Star size={14} weight="fill" />
                        </div>
                        <div className="progress relative h-2 w-3/4 bg-line">
                          <div className="progress-percent absolute left-0 top-0 h-full w-[10%] bg-black"></div>
                        </div>
                        <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                          10%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <Link
                      href={"#form-review"}
                      className="duration-400 md:text-md inline-block cursor-pointer whitespace-nowrap rounded-[12px] border border-black bg-white px-10 py-4 text-sm font-semibold uppercase leading-5 text-black transition-all ease-in-out hover:bg-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    >
                      Write Reviews
                    </Link>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="heading flex flex-wrap items-center justify-between gap-4">
                    <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                      03 Comments
                    </div>
                    <div className="right flex items-center gap-3">
                      <label htmlFor="select-filter" className="uppercase">
                        Sort by:
                      </label>
                      <div className="select-block relative">
                        <select
                          id="select-filter"
                          name="select-filter"
                          className="rounded-lg border border-line bg-white py-2 pl-3 pr-10 text-base font-semibold capitalize leading-[26px] md:pr-14 md:text-base md:leading-6"
                          defaultValue={"Sorting"}
                        >
                          <option value="Sorting" disabled>
                            Sorting
                          </option>
                          <option value="newest">Newest</option>
                          <option value="5star">5 Star</option>
                          <option value="4star">4 Star</option>
                          <option value="3star">3 Star</option>
                          <option value="2star">2 Star</option>
                          <option value="1star">1 Star</option>
                        </select>
                        <CaretDown
                          size={12}
                          className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="list-review mt-6">
                    <div className="item">
                      <div className="heading flex items-center justify-between">
                        <div className="user-infor flex gap-4">
                          <div className="avatar">
                            <Image
                              src={"/images/avatar/1.png"}
                              width={200}
                              height={200}
                              alt="img"
                              className="aspect-square w-[52px] rounded-full"
                            />
                          </div>
                          <div className="user">
                            <div className="flex items-center gap-2">
                              <div className="text-title">Tony Nguyen</div>
                              <div className="span text-line">-</div>
                              <Rate currentRate={5} size={12} />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-secondary2">1 days ago</div>
                              <div className="text-secondary2">-</div>
                              <div className="text-secondary2">
                                <span>Yellow</span> / <span>XL</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="more-action cursor-pointer">
                          <DotsThree size={24} weight="bold" />
                        </div>
                      </div>
                      <div className="mt-3">
                        I can{String.raw`'t`} get enough of the fashion pieces
                        from this brand. They have a great selection for every
                        occasion and the prices are reasonable. The shipping is
                        fast and the items always arrive in perfect condition.
                      </div>
                      <div className="action mt-3">
                        <div className="flex items-center gap-4">
                          <div className="like-btn flex cursor-pointer items-center gap-1">
                            <HandsClapping size={18} />
                            <div className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                              20
                            </div>
                          </div>
                          <Link
                            href={"#form-review"}
                            className="reply-btn cursor-pointer text-base font-semibold capitalize leading-[26px] text-secondary hover:text-black md:text-base md:leading-6"
                          >
                            Reply
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="item mt-8">
                      <div className="heading flex items-center justify-between">
                        <div className="user-infor flex gap-4">
                          <div className="avatar">
                            <Image
                              src={"/images/avatar/2.png"}
                              width={200}
                              height={200}
                              alt="img"
                              className="aspect-square w-[52px] rounded-full"
                            />
                          </div>
                          <div className="user">
                            <div className="flex items-center gap-2">
                              <div className="text-title">Guy Hawkins</div>
                              <div className="span text-line">-</div>
                              <Rate currentRate={4} size={12} />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-secondary2">1 days ago</div>
                              <div className="text-secondary2">-</div>
                              <div className="text-secondary2">
                                <span>Yellow</span> / <span>XL</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="more-action cursor-pointer">
                          <DotsThree size={24} weight="bold" />
                        </div>
                      </div>
                      <div className="mt-3">
                        I can{String.raw`'t`} get enough of the fashion pieces
                        from this brand. They have a great selection for every
                        occasion and the prices are reasonable. The shipping is
                        fast and the items always arrive in perfect condition.
                      </div>
                      <div className="action mt-3">
                        <div className="flex items-center gap-4">
                          <div className="like-btn flex cursor-pointer items-center gap-1">
                            <HandsClapping size={18} />
                            <div className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                              20
                            </div>
                          </div>
                          <Link
                            href={"#form-review"}
                            className="reply-btn cursor-pointer text-base font-semibold capitalize leading-[26px] text-secondary hover:text-black md:text-base md:leading-6"
                          >
                            Reply
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="item mt-8">
                      <div className="heading flex items-center justify-between">
                        <div className="user-infor flex gap-4">
                          <div className="avatar">
                            <Image
                              src={"/images/avatar/3.png"}
                              width={200}
                              height={200}
                              alt="img"
                              className="aspect-square w-[52px] rounded-full"
                            />
                          </div>
                          <div className="user">
                            <div className="flex items-center gap-2">
                              <div className="text-title">John Smith</div>
                              <div className="span text-line">-</div>
                              <Rate currentRate={5} size={12} />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-secondary2">1 days ago</div>
                              <div className="text-secondary2">-</div>
                              <div className="text-secondary2">
                                <span>Yellow</span> / <span>XL</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="more-action cursor-pointer">
                          <DotsThree size={24} weight="bold" />
                        </div>
                      </div>
                      <div className="mt-3">
                        I can{String.raw`'t`} get enough of the fashion pieces
                        from this brand. They have a great selection for every
                        occasion and the prices are reasonable. The shipping is
                        fast and the items always arrive in perfect condition.
                      </div>
                      <div className="action mt-3">
                        <div className="flex items-center gap-4">
                          <div className="like-btn flex cursor-pointer items-center gap-1">
                            <HandsClapping size={18} />
                            <div className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                              20
                            </div>
                          </div>
                          <Link
                            href={"#form-review"}
                            className="reply-btn cursor-pointer text-base font-semibold capitalize leading-[26px] text-secondary hover:text-black md:text-base md:leading-6"
                          >
                            Reply
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="form-review" className="form-review pt-6">
                    <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                      Leave A comment
                    </div>
                    <form className="mt-3 grid gap-4 gap-y-5 sm:grid-cols-2 md:mt-6">
                      <div className="name">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="username"
                          type="text"
                          placeholder="Your Name *"
                          required
                        />
                      </div>
                      <div className="mail">
                        <input
                          className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                          id="email"
                          type="email"
                          placeholder="Your Email *"
                          required
                        />
                      </div>
                      <div className="message col-span-full">
                        <textarea
                          className="w-full rounded-lg border border-line px-4 py-3"
                          id="message"
                          name="message"
                          placeholder="Your message *"
                          required
                        ></textarea>
                      </div>
                      <div className="col-span-full -mt-2 flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="saveAccount"
                          name="saveAccount"
                          className="mt-1.5"
                        />
                        <label className="" htmlFor="saveAccount">
                          Save my name, email, and website in this browser for
                          the next time I comment.
                        </label>
                      </div>
                      <div className="col-span-full sm:pt-3">
                        <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] border border-black bg-white px-10 py-4 text-sm font-semibold uppercase leading-5 text-black transition-all ease-in-out hover:bg-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                          Submit Reviews
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="related-product py-10 md:py-20">
          <div className="mx-auto w-full !max-w-[1322px] px-4">
            <div className="text-center text-[36px] font-semibold capitalize leading-[40px] md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
              Related Products
            </div>
            <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-5 md:mt-10 md:gap-[30px] lg:grid-cols-4">
              {data
                .slice(Number(productId), Number(productId) + 4)
                .map((item, index) => (
                  <Product
                    key={index}
                    data={item}
                    type="grid"
                    style="style-1"
                  />
                ))}
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
