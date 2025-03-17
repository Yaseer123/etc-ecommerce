"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

const TrendingNow = () => {
  const [categories] = api.category.getAll.useSuspenseQuery();
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  return (
    <div className="trending-block style-six pt-10 md:pt-20">
      <div className="container">
        <div className="heading3 text-center">Trending Right Now</div>
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
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <div
                  className="trending-item relative block cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="bg-img overflow-hidden rounded-full">
                    <Image
                      src={"/images/avatar/1.png"}
                      width={1000}
                      height={1000}
                      alt={category.name}
                      priority={true}
                      className="w-full"
                    />
                  </div>
                  <div className="trending-name mt-5 text-center duration-500">
                    <span className="heading5">{category.name}</span>
                    <span className="text-secondary2">
                      {" "}
                      ({category.subcategories.length})
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TrendingNow;
