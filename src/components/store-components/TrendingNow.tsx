"use client";

import { api } from "@/trpc/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Custom hook to detect mobile or tablet screen
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

const TrendingNow = () => {
  const [categories] = api.category.getAll.useSuspenseQuery();
  const router = useRouter();

  // Use mobile detection
  const isMobile = useIsMobile();

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: isMobile,
    align: "center",
    skipSnaps: false,
  });

  // Dot navigation state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Navigation handlers
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  // Embla event listeners for dot navigation
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

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/products?category=${categoryId}`);
  };

  return (
    <div className="trending-block style-six w-full bg-transparent py-10 transition-colors md:py-20">
      <div className="w-full px-4">
        <div className="heading3 mb-8 text-center text-4xl font-semibold text-gray-900 dark:text-white md:mb-12">
          Trending Right Now
        </div>
        <div className="list-trending section-swiper-navigation style-small-border style-outline relative w-full">
          <div ref={emblaRef} className="">
            <div className="flex" style={{ gap: "0.5rem" }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-[0_0_33.3333%] justify-center py-2 lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
                >
                  <div
                    onClick={() => handleCategoryClick(category.id)}
                    className="trending-item group relative mx-auto block max-w-[150px] cursor-pointer transition-all duration-300 hover:-translate-y-1 md:max-w-[220px]"
                  >
                    <div className="aspect-square overflow-hidden rounded-full border-4 border-white bg-white shadow-lg transition-all duration-300 group-hover:border-brand-primary group-hover:shadow-xl dark:border-slate-700 dark:bg-slate-800">
                      <Image
                        src={category.image ?? "/images/avatar/1.png"}
                        width={220}
                        height={220}
                        sizes="(max-width: 576px) 150px, (max-width: 768px) 180px, (max-width: 992px) 200px, 220px"
                        alt={category.name}
                        priority={true}
                        className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="trending-name mt-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="heading5 mb-1 font-medium text-gray-800 transition-colors duration-300 group-hover:text-brand-primary dark:text-white">
                          {category.name}
                        </span>
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-brand-primary dark:bg-slate-700 dark:text-orange-300">
                          {category.subcategories.length}{" "}
                          {category.subcategories.length === 1
                            ? "Subcategory"
                            : "Subcategories"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Move dot navigation here, below the carousel */}
          {isMobile && (
            <div className="mt-4 flex justify-center gap-3">
              {scrollSnaps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`h-4 w-4 rounded-full border border-gray-300 transition-colors duration-200 focus:outline-none ${
                    selectedIndex === idx
                      ? "border-gray-800 bg-gray-800"
                      : "bg-gray-200"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
          {/* Navigation buttons - absolutely positioned and always visible */}
          {isMobile && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute bottom-2 left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-100 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
                aria-label="Previous"
                type="button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute bottom-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-100 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
                aria-label="Next"
                type="button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingNow;
