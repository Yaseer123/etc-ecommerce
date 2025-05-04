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
import { toast } from "sonner";
import { formatDistanceToNow, format, addDays } from "date-fns";

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
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewSortOrder, setReviewSortOrder] = useState("newest");

  const { addToCart, updateCart, cartArray } = useCartStore();
  const { openModalCart } = useModalCartStore();
  const { openModalWishlist } = useModalWishlistStore();
  const utils = api.useUtils();

  const [wishlistResponse] = api.wishList.getWishList.useSuspenseQuery();
  const wishlist = wishlistResponse ?? [];

  const { data: reviews, refetch: refetchReviews } =
    api.review.getReviewsByProduct.useQuery(productMain.id, {
      initialData: [],
    });

  const { data: reviewStats } = api.review.getReviewStats.useQuery(
    productMain.id,
    {
      initialData: {
        totalCount: 0,
        averageRating: "0.0",
        ratingPercentages: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      },
    },
  );

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Parse the star rating from the sort order (e.g., "5star" -> 5)
      const targetRating = parseInt(reviewSortOrder.replace("star", ""));
      // First group by matching the target rating
      if (a.rating === targetRating && b.rating !== targetRating) return -1;
      if (a.rating !== targetRating && b.rating === targetRating) return 1;
      // Then sort by date within each group
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

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

  const addReviewMutation = api.review.addReview.useMutation({
    onSuccess: async () => {
      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 5, comment: "" });
      await utils.review.getReviewsByProduct.invalidate(productMain.id);
      await utils.review.getReviewStats.invalidate(productMain.id);
      void refetchReviews();
    },
    onError: (error) => {
      toast.error(`Error submitting review: ${error.message}`);
    },
  });

  const percentSale =
    productMain.originPrice &&
    Math.floor(100 - (productMain.price / productMain.originPrice) * 100);

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
    return wishlist.some((item) => item.productId === itemId);
  };

  const handleAddToWishlist = () => {
    if (isInWishlist(productMain.id)) {
      // **Optimistic UI Update: Remove item immediately**
      utils.wishList.getWishList.setData(
        undefined,
        (old) => old?.filter((item) => item.productId !== productMain.id) ?? [],
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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to submit a review");
      return;
    }

    addReviewMutation.mutate({
      productId: productMain.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });
  };

  const handleReviewSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReviewSortOrder(e.target.value);
  };

  // Calculate estimated delivery date based on the product's estimatedDeliveryTime
  const calculateEstimatedDeliveryDate = () => {
    if (!productMain.estimatedDeliveryTime) {
      return "Not available";
    }
    const today = new Date();
    const deliveryDate = addDays(today, productMain.estimatedDeliveryTime);
    return format(deliveryDate, "dd MMMM");
  };

  return (
    <>
      <div className="product-detail sale">
        <div className="featured-product underwear py-10 md:py-20">
          <div className="container flex flex-wrap justify-between gap-y-6">
            <div className="list-img w-full md:w-1/2 md:pr-[45px]">
              <Swiper
                slidesPerView={1}
                spaceBetween={0}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Thumbs]}
                className="mySwiper2 overflow-hidden rounded-2xl"
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
                className="mySwiper style-rectangle"
              >
                {productMain.images.map((item, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={item}
                      width={1000}
                      height={1300}
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
                  className={`add-wishlist-btn flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border ${isInWishlist(productMain.id) ? "border-black bg-black" : "border-line bg-white"} duration-300 hover:bg-black hover:text-white`}
                  onClick={handleAddToWishlist}
                >
                  {isInWishlist(productMain.id) ? (
                    <Heart size={24} weight="fill" className="text-white" />
                  ) : (
                    <Heart size={24} />
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <Rate
                  currentRate={parseFloat(reviewStats.averageRating)}
                  size={14}
                />
                <span className="text-base font-normal text-secondary md:text-[13px] md:leading-5">
                  ({reviewStats.totalCount}{" "}
                  {reviewStats.totalCount === 1 ? "review" : "reviews"})
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="product-price heading5">
                  ৳{productMain.price}.00
                </div>
                {productMain.originPrice && productMain.originPrice > 0 && (
                  <>
                    <div className="h-4 w-px bg-line"></div>
                    <div className="product-origin-price font-normal text-secondary2">
                      <del>৳{productMain.originPrice}.00</del>
                    </div>
                    <div className="product-sale caption2 bg-green_custom inline-block rounded-full px-3 py-0.5 font-semibold">
                      -{percentSale}%
                    </div>
                  </>
                )}
              </div>
              <div className="desc mt-5 block border-b border-line pb-6 text-base text-secondary lg:text-lg">
                {productMain.shortDescription}
              </div>
              <div className="list-action mt-6">
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
                      {calculateEstimatedDeliveryDate()}
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
                  <div className="main-content relative w-full rounded-xl border border-line px-2 pb-4 pt-6 sm:px-3 md:px-4 lg:pb-6 lg:pt-8">
                    <div className="heading6 bg-linear absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap px-3 text-sm sm:px-5 sm:text-base">
                      Guranteed safe checkout
                    </div>
                    <div className="list grid grid-cols-3 sm:grid-cols-6">
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
                <div className="item mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="icon-delivery-truck text-3xl sm:text-4xl"></div>
                  <div>
                    <div className="text-title">Free shipping</div>
                    <div className="mt-1 text-sm font-normal leading-5 text-secondary md:text-[13px]">
                      Free shipping on orders over $75.
                    </div>
                  </div>
                </div>
                <div className="item mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="icon-phone-call text-3xl sm:text-4xl"></div>
                  <div>
                    <div className="text-title">Support everyday</div>
                    <div className="mt-1 text-sm font-normal leading-5 text-secondary md:text-[13px]">
                      Support from 8:30 AM to 10:00 PM everyday
                    </div>
                  </div>
                </div>
                <div className="item mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="icon-return text-3xl sm:text-4xl"></div>
                  <div>
                    <div className="text-title">100 Day Returns</div>
                    <div className="mt-1 text-sm font-normal leading-5 text-secondary md:text-[13px]">
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
                <div className="mx-auto w-full sm:w-3/4 lg:w-1/2">
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
                <div className="top-overview border-b border-line pb-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Rating Summary Card */}
                    <div className="rating-summary rounded-xl bg-surface p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Overall Rating
                        </h3>
                        <div className="rounded-full bg-black/5 px-2 py-0.5 text-xs">
                          {reviewStats.totalCount}{" "}
                          {reviewStats.totalCount === 1 ? "Review" : "Reviews"}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-center">
                        <div className="relative flex flex-col items-center">
                          <div className="text-5xl font-bold">
                            {reviewStats.averageRating}
                          </div>
                          <div className="mt-2">
                            <Rate
                              currentRate={parseFloat(
                                reviewStats.averageRating,
                              )}
                              size={22}
                            />
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            out of 5
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating Distribution Card */}
                    <div className="rating-distribution rounded-xl bg-surface p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:col-span-1 lg:col-span-1">
                      <h3 className="mb-3 text-lg font-semibold">
                        Rating Distribution
                      </h3>
                      <div className="space-y-2.5">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <div className="flex min-w-[32px] items-center gap-1">
                              <span className="font-medium">{rating}</span>
                              <Star
                                size={14}
                                weight="fill"
                                className="text-yellow-500"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="bg-yellow-500 absolute left-0 top-0 h-full rounded-full"
                                  style={{
                                    width: `${reviewStats.ratingPercentages[rating]}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="min-w-[40px] text-right text-sm text-gray-500">
                              {reviewStats.ratingPercentages[rating]}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Write Review Card */}
                    <div className="write-review-card flex flex-col rounded-xl bg-surface p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                      <h3 className="mb-3 text-lg font-semibold">
                        Share Your Experience
                      </h3>
                      <p className="mb-4 text-sm text-gray-500">
                        Your honest feedback helps other shoppers make better
                        choices.
                      </p>
                      <Link
                        href={"#form-review"}
                        className="mt-auto inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-black/80"
                      >
                        Write a Review
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="heading flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="text-xl font-semibold capitalize leading-[30px] sm:text-[26px] sm:leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                      {reviewStats.totalCount}{" "}
                      {reviewStats.totalCount === 1 ? "Comment" : "Comments"}
                    </div>
                    <div className="right flex w-full items-center gap-3 sm:w-auto">
                      <label
                        htmlFor="select-filter"
                        className="text-sm uppercase sm:text-base"
                      >
                        Sort by:
                      </label>
                      <div className="select-block relative flex-grow sm:flex-grow-0">
                        <select
                          id="select-filter"
                          name="select-filter"
                          className="w-full rounded-lg border border-line bg-white py-2 pl-3 pr-10 text-sm font-semibold capitalize leading-[26px] sm:w-auto sm:text-base md:pr-14 md:text-base md:leading-6"
                          value={reviewSortOrder}
                          onChange={handleReviewSortChange}
                        >
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
                    {sortedReviews.length === 0 ? (
                      <div className="py-6 text-center">
                        No reviews yet. Be the first to review!
                      </div>
                    ) : (
                      sortedReviews.map((review) => (
                        <div
                          className="item mb-8 rounded-lg bg-surface/30 p-3 transition-all duration-300 hover:bg-surface sm:p-5"
                          key={review.id}
                        >
                          <div className="heading flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                            <div className="user-infor flex gap-4">
                              <div className="avatar">
                                <Image
                                  src={
                                    review.user?.image ??
                                    "/images/avatar/default.png"
                                  }
                                  width={200}
                                  height={200}
                                  alt={review.user?.name ?? "Anonymous"}
                                  className="aspect-square w-[40px] rounded-full object-cover sm:w-[52px]"
                                />
                              </div>
                              <div className="user">
                                <div className="flex items-center gap-2">
                                  <div className="text-title">
                                    {review.user?.name ?? "Anonymous"}
                                  </div>
                                  <div className="span text-line">-</div>
                                  <Rate currentRate={review.rating} size={12} />
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-secondary2">
                                    {formatDistanceToNow(
                                      new Date(review.createdAt),
                                      { addSuffix: true },
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="more-action cursor-pointer">
                              <DotsThree size={24} weight="bold" />
                            </div>
                          </div>
                          <div className="mt-3 text-sm sm:text-base">
                            {review.comment ?? "No comment provided."}
                          </div>
                          <div className="action mt-3">
                            <div className="flex items-center gap-4">
                              <div className="like-btn flex cursor-pointer items-center gap-1">
                                <HandsClapping size={18} />
                                <div className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  0
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
                      ))
                    )}
                  </div>
                  <div
                    id="form-review"
                    className="form-review rounded-lg bg-surface/20 p-4 pt-6 sm:p-6"
                  >
                    <div className="text-xl font-semibold capitalize leading-[30px] sm:text-[26px] sm:leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                      Leave A comment
                    </div>
                    <form
                      className="mt-3 grid gap-4 gap-y-5 sm:grid-cols-2 md:mt-6"
                      onSubmit={handleReviewSubmit}
                    >
                      <div className="col-span-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="text-title">Your Rating:</div>
                        <div className="flex cursor-pointer">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={20}
                              weight={
                                star <= reviewForm.rating ? "fill" : "regular"
                              }
                              className="text-yellow-500 transition-all hover:scale-110"
                              onClick={() =>
                                setReviewForm({ ...reviewForm, rating: star })
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div className="message col-span-full">
                        <textarea
                          className="w-full rounded-lg border border-line px-4 py-3"
                          id="message"
                          name="comment"
                          placeholder="Your review *"
                          required
                          rows={4}
                          value={reviewForm.comment}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              comment: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>

                      <div className="col-span-full sm:pt-3">
                        <button
                          type="submit"
                          disabled={addReviewMutation.isPending}
                          className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] border border-black bg-white px-6 py-3 text-sm font-semibold uppercase leading-5 text-black transition-all ease-in-out hover:bg-black hover:text-white disabled:opacity-50 sm:w-auto sm:px-10 sm:py-4 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        >
                          {addReviewMutation.isPending
                            ? "Submitting..."
                            : "Submit Review"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
