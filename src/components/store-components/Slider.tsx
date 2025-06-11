"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css/bundle";
import "swiper/css/effect-fade";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SaleBanner } from "./SaleBanner";

const Slider = () => {
  const { data: sliderData, isLoading } = api.slider.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="slider-block style-two w-full animate-pulse">
        <div className="banner-block mx-auto flex h-full w-full !max-w-[1322px] gap-5 px-4 max-lg:flex-wrap lg:pt-[30px]">
          <div className="slider-main w-full max-lg:h-[300px] max-[420px]:h-[340px] lg:w-2/3">
            <div className="relative h-full w-full overflow-hidden  bg-gray-200" />
          </div>
          <div className="banner-ads-block flex w-full flex-col gap-5 max-lg:mt-5 lg:w-1/3">
            <div className="banner-ads-item relative h-[200px] overflow-hidden  bg-gray-200" />
            <div className="banner-ads-item relative h-[200px] overflow-hidden bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-block style-two w-full">
      <div className="banner-block mx-auto flex h-full w-full !max-w-[1322px] gap-5 px-4 max-lg:flex-wrap lg:pt-[30px]">
        {/* Slider */}
        <div className="slider-main min-h-[60vh] w-full max-lg:h-[300px] max-[420px]:h-[340px] lg:w-2/3 shadow-lg">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="relative h-full w-full overflow-hidden "
            autoplay={{
              delay: 4000,
            }}
          >
            {sliderData?.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="slider-item bg-linear relative flex h-full min-h-[60vh] w-full items-center">
                  <div className="text-content relative z-[1] basis-1/2 pl-5 md:pl-[60px]">
                    <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      {slide.subtitle}
                    </div>
                    <div className="heading2 mt-2 lg:mt-3">{slide.title}</div>
                    <div className="body1 mt-3 lg:mt-4">
                      {slide.description}
                    </div>
                    <Link
                      href={slide.link}
                      className="button-main mt-3 lg:mt-8"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="sub-img absolute -right-10 bottom-0 top-0 h-full sm:right-[20px] md:right-[40px] lg:right-[20px] xl:right-[50px]">
                    <Image
                      src={slide.imageUrl}
                      width={2000}
                      height={1936}
                      alt={slide.title}
                      priority={true}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sale Banner */}
        <SaleBanner />
      </div>
    </div>
  );
};

export default Slider;
