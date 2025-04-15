"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/trpc/react";

export const SaleBanner = () => {
  const router = useRouter();
  const { data: banners } = api.saleBanner.getAll.useQuery();

  const handleClick = (link: string | null) => {
    if (link) router.push(link);
  };

  const activeBanners = banners?.filter(
    (banner) =>
      banner.isActive &&
      new Date(banner.startDate) <= new Date() &&
      new Date(banner.endDate) >= new Date(),
  );

  if (!activeBanners?.length) return null;

  return (
    <div className="banner-ads-block w-full max-lg:mt-5 lg:w-1/3">
      <div className="grid h-full w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">
        {activeBanners.slice(0, 2).map((banner) => (
          <div
            key={banner.id}
            className="banner-ads-item bg-linear relative h-full cursor-pointer overflow-hidden rounded-2xl"
            onClick={() => handleClick(banner.link)}
          >
            <div className="text-content relative z-[1] py-8 pl-8">
              <div className="inline-block rounded-sm bg-red px-2 py-0.5 text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
                {banner.title}
              </div>
              <div className="heading6 mt-2">{banner.subtitle ?? ""}</div>
              <div className="body1 mt-3 text-secondary">
                {banner.description ?? ""}
              </div>
            </div>
            <Image
              src={banner.imageUrl}
              width={200}
              height={100}
              alt={banner.title}
              priority={true}
              className="absolute right-0 top-0 h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
