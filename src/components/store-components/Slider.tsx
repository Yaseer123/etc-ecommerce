"use client";

import { api } from "@/trpc/react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SaleBanner } from "./SaleBanner";

// Add a type for the slide data
interface SliderDataType {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  imageId: string;
  link?: string | null;
  autoSlideTime?: number;
}

const Slider = () => {
  const { data: sliderData, isLoading } = api.slider.getAll.useQuery() as {
    data?: SliderDataType[];
    isLoading: boolean;
  };

  // Safely get autoSlideTime from the first slide, fallback to 4000
  let autoSlideTime = 4000;
  if (
    Array.isArray(sliderData) &&
    sliderData.length > 0 &&
    typeof sliderData[0]?.autoSlideTime === "number"
  ) {
    autoSlideTime = sliderData[0].autoSlideTime;
  }

  // Embla setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Dot navigation
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList().map((_, i) => i));
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Autoplay
  useEffect(() => {
    if (!emblaApi || !sliderData?.length) return;
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      emblaApi.scrollNext();
    }, autoSlideTime);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [emblaApi, autoSlideTime, sliderData]);

  if (isLoading) {
    return (
      <div className="slider-block style-two w-full animate-pulse">
        <div className="banner-block mx-auto flex h-full w-full !max-w-[1322px] gap-5 px-4 max-lg:flex-wrap lg:pt-[30px]">
          <div className="slider-main w-full max-lg:h-[300px] max-[420px]:h-[340px] lg:w-2/3">
            <div className="relative h-full w-full overflow-hidden bg-gray-200" />
          </div>
          <div className="banner-ads-block flex w-full flex-col gap-5 max-lg:mt-5 lg:w-1/3">
            <div className="banner-ads-item relative h-[200px] overflow-hidden bg-gray-200" />
            <div className="banner-ads-item relative h-[200px] overflow-hidden bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-block style-two mt-24 w-full md:mt-0">
      <div className="banner-block mx-auto flex h-full w-full max-w-[1322px] gap-5 max-lg:flex-wrap lg:pt-[30px]">
        {/* Slider */}
        <div className="slider-main relative aspect-[3/2] w-full shadow-lg lg:w-2/3">
          <div
            ref={emblaRef}
            className="relative h-full w-full overflow-hidden"
          >
            <div className="flex h-full">
              {(sliderData ?? []).map((slide, idx) => (
                <div
                  className="relative h-full min-w-full"
                  key={slide.id}
                  style={{ position: "relative" }}
                >
                  {slide.link ? (
                    <Link
                      href={slide.link}
                      className="slider-item bg-linear relative flex h-full w-full items-center"
                    >
                      <Image
                        src={slide.imageUrl ?? ""}
                        alt={slide.title ?? ""}
                        fill
                        priority={true}
                        className="z-0 object-cover object-center"
                        style={{ position: "absolute" }}
                      />
                      <div className="text-content relative z-10 basis-1/2 pl-5 md:pl-[60px]">
                        <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                          {slide.subtitle ?? ""}
                        </div>
                        <div className="heading2 mt-2 lg:mt-3">
                          {slide.title ?? ""}
                        </div>
                        <div className="body1 mt-3 lg:mt-4">
                          {slide.description ?? ""}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="slider-item bg-linear relative flex h-full w-full items-center">
                      <Image
                        src={slide.imageUrl ?? ""}
                        alt={slide.title ?? ""}
                        fill
                        priority={true}
                        className="z-0 object-cover object-center"
                        style={{ position: "absolute" }}
                      />
                      <div className="text-content relative z-10 basis-1/2 pl-5 md:pl-[60px]">
                        <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                          {slide.subtitle ?? ""}
                        </div>
                        <div className="heading2 mt-2 lg:mt-3">
                          {slide.title ?? ""}
                        </div>
                        <div className="body1 mt-3 lg:mt-4">
                          {slide.description ?? ""}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Dot navigation */}
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
              {scrollSnaps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`h-3 w-3 rounded-full border border-gray-300 transition-colors duration-200 focus:outline-none ${selectedIndex === idx ? "border-gray-800 bg-gray-800" : "bg-gray-200"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Sale Banner */}
        <SaleBanner />
      </div>
    </div>
  );
};

export default Slider;
