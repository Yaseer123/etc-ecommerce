"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/effect-fade";
import { useRouter } from "next/navigation";

const Slider = () => {
  const router = useRouter();

  const handleTypeClick = (type: string) => {
    router.push(`/shop/breadcrumb1?type=${type}`);
  };
  return (
    <>
      <div className="slider-block style-two w-full">
        <div className="banner-block mx-auto flex h-full w-full !max-w-[1322px] gap-y-5 px-4 max-lg:flex-wrap lg:pt-[30px]">
          <div className="slider-main w-full max-lg:h-[300px] max-[420px]:h-[340px] lg:w-2/3 lg:pr-[15px]">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="relative h-full w-full overflow-hidden rounded-3xl"
              autoplay={{
                delay: 4000,
              }}
            >
              <SwiperSlide>
                <div className="slider-item bg-linear relative flex h-full w-full items-center">
                  <div className="text-content relative z-[1] basis-1/2 pl-5 md:pl-[60px]">
                    <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Fresh and Tasty
                    </div>
                    <div className="heading2 mt-2 lg:mt-3">
                      New Season Women’s style
                    </div>
                    <div className="body1 mt-3 lg:mt-4">
                      Discover the beauty of fashion living
                    </div>
                    <Link
                      href="/shop/breadcrumb-img"
                      className="button-main mt-3 lg:mt-8"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="sub-img absolute -right-10 bottom-0 top-0 sm:right-[20px] md:right-[40px] lg:right-[20px] xl:right-[50px]">
                    <Image
                      src={"/images/slider/bg11-1.png"}
                      width={2000}
                      height={1936}
                      alt="bg11-1"
                      priority={true}
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="slider-item bg-linear relative flex h-full w-full items-center">
                  <div className="text-content relative z-[1] basis-1/2 pl-5 max-[400px]:basis-[55%] md:pl-[60px]">
                    <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Fresh and Tasty
                    </div>
                    <div className="heading2 mt-2 lg:mt-3">
                      Men’s Clothing fashion
                    </div>
                    <div className="body1 mt-3 lg:mt-4">
                      Discover the beauty of fashion living
                    </div>
                    <Link
                      href="/shop/breadcrumb-img"
                      className="button-main mt-3 lg:mt-8"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="sub-img absolute -right-[80px] bottom-0 w-[45%] max-[460px]:w-[80%] sm:right-[20px] sm:w-[40%] md:w-[33%] lg:right-0 lg:w-[53%] xl:right-[30px] xl:w-[45%]">
                    <Image
                      src={"/images/slider/bg11-2.png"}
                      width={2000}
                      height={1936}
                      alt="bg11-2"
                      priority={true}
                      className="w-full"
                    />
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="slider-item bg-linear relative flex h-full w-full items-center">
                  <div className="text-content relative z-[1] basis-1/2 pl-5 md:pl-[60px]">
                    <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Fresh and Tasty
                    </div>
                    <div className="heading2 mt-2 lg:mt-3">
                      Summer Sale Collections
                    </div>
                    <div className="body1 mt-3 lg:mt-4">
                      Discover the beauty of fashion living
                    </div>
                    <Link
                      href="/shop/breadcrumb-img"
                      className="button-main mt-3 lg:mt-8"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="sub-img absolute -right-[60px] bottom-0 w-[46%] max-[460px]:w-[80%] sm:right-[20px] sm:w-[43%] md:w-[36%] lg:-right-5 lg:w-[57%] xl:right-[20px] xl:w-[49%]">
                    <Image
                      src={"/images/slider/bg11-3.png"}
                      width={2000}
                      height={2000}
                      alt="bg11-3"
                      priority={true}
                      className="w-full"
                    />
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div className="banner-ads-block w-full gap-5 max-lg:grid sm:grid-cols-2 lg:w-1/3 lg:pl-[15px]">
            <div
              className="banner-ads-item bg-linear relative cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => handleTypeClick("swimwear")}
            >
              <div className="text-content relative z-[1] py-12 pl-8">
                <div className="inline-block rounded-sm bg-red px-2 py-0.5 text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                  Save $10
                </div>
                <div className="heading6 mt-2">
                  Dive into Savings <br />
                  on Swimwear
                </div>
                <div className="body1 mt-3 text-secondary">
                  Starting at <span className="text-red">$59.99</span>
                </div>
              </div>
              <Image
                src={"/images/slider/bg2-2.png"}
                width={200}
                height={100}
                alt="bg-img"
                priority={true}
                className="absolute right-0 top-0 basis-1/3"
              />
            </div>
            <div
              className="banner-ads-item bg-linear relative cursor-pointer overflow-hidden rounded-2xl lg:mt-8"
              onClick={() => handleTypeClick("accessories")}
            >
              <div className="text-content relative z-[1] py-12 pl-8">
                <div className="inline-block rounded-sm bg-red px-2 py-0.5 text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                  Save $10
                </div>
                <div className="heading6 mt-2">
                  20% off <br />
                  accessories
                </div>
                <div className="body1 mt-3 text-secondary">
                  Starting at <span className="text-red">$59.99</span>
                </div>
              </div>
              <Image
                src={"/images/other/bg-feature.png"}
                width={200}
                height={100}
                alt="bg-img"
                priority={true}
                className="absolute right-0 top-0 basis-1/3"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Slider;
