"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useRouter } from "next/navigation";
interface Category {
  name: string;

  subcategories: { name: string }[];
}
export default function TrendingNow({ data }: { data: Category[] }) {
  const router = useRouter();

  const handleTypeClick = (type: string) => {
    router.push(`/shop/breadcrumb1?type=${type}`);
  };

  return (
    <>
      <div className="trending-block style-six pt-10 md:pt-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="text-center text-[36px] font-semibold capitalize leading-[40px] md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
            Trending Right Now
          </div>
          <div className="list-trending section-swiper-navigation style-small-border style-outline mt-6 md:mt-10">
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              navigation
              loop={true}
              modules={[Navigation, Autoplay]}
              breakpoints={{
                576: {
                  slidesPerView: 3,
                  spaceBetween: 12,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                992: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
                1290: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
              className="h-full"
            >
              {data.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="trending-item relative block cursor-pointer"
                    onClick={() => handleTypeClick("t-shirt")}
                  >
                    <div className="bg-img overflow-hidden rounded-full">
                      <Image
                        src={"/images/avatar/1.png"}
                        width={1000}
                        height={1000}
                        alt="outerwear"
                        priority={true}
                        className="w-full"
                      />
                    </div>
                    <div className="trending-name mt-5 text-center duration-500">
                      <span className="heading5">{item.name}</span>
                      <span className="text-secondar2"> ({index})</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}
