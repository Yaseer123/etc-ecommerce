"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "motion/react";
import "swiper/css/bundle";
import "swiper/css/effect-fade";

const Slider = () => {


  return (
    <div className="slider-block style-two w-full">
      <div className="banner-block container flex h-full w-full gap-y-5 max-lg:flex-wrap lg:pt-[30px]">
        <div className="slider-main w-full max-lg:h-[300px] max-[420px]:h-[340px] lg:w-2/3 lg:pr-[15px]">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            className="relative h-full w-full overflow-hidden rounded-3xl"
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
          >
            {/** Slide 1 */}
            <SwiperSlide>
              <div className="slider-item bg-linear relative flex h-full w-full items-center">
                {/* Animated Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-content relative z-[1] basis-1/2 pl-5 md:pl-[60px]"
                >
                  <div className="text-button-uppercase">Fresh and Tasty</div>
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
                </motion.div>

                {/* Animated Image */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                  className="sub-img absolute -right-10 bottom-0 top-0 sm:right-[20px] md:right-[40px] lg:right-[20px] xl:right-[50px]"
                >
                  <Image
                    src={"/images/slider/bg11-1.png"}
                    width={2000}
                    height={1936}
                    alt="bg11-1"
                    priority={true}
                    className="h-full w-full"
                  />
                </motion.div>
              </div>
            </SwiperSlide>

            {/** Slide 2 */}
            <SwiperSlide>
              <div className="slider-item bg-linear relative flex h-full w-full items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-content relative z-[1] basis-1/2 pl-5 md:pl-[60px]"
                >
                  <div className="text-button-uppercase">Fresh and Tasty</div>
                  <div className="heading2 mt-2 lg:mt-3">
                    Men’s Clothing Fashion
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
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                  className="sub-img absolute -right-[80px] bottom-0 w-[45%] sm:right-[20px] md:w-[33%] lg:right-0 lg:w-[53%] xl:right-[30px] xl:w-[45%]"
                >
                  <Image
                    src={"/images/slider/bg11-2.png"}
                    width={2000}
                    height={1936}
                    alt="bg11-2"
                    priority={true}
                    className="w-full"
                  />
                </motion.div>
              </div>
            </SwiperSlide>

            {/** Slide 3 */}
            <SwiperSlide>
              <div className="slider-item bg-linear relative flex h-full w-full items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-content relative z-[1] basis-1/2 pl-5 md:pl-[60px]"
                >
                  <div className="text-button-uppercase">Fresh and Tasty</div>
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
                </motion.div>

                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                  className="sub-img absolute -right-[60px] bottom-0 w-[46%] sm:right-[20px] md:w-[36%] lg:-right-5 lg:w-[57%] xl:right-[20px] xl:w-[49%]"
                >
                  <Image
                    src={"/images/slider/bg11-3.png"}
                    width={2000}
                    height={2000}
                    alt="bg11-3"
                    priority={true}
                    className="w-full"
                  />
                </motion.div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Slider;
