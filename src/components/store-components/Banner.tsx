import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Banner() {
  return (
    <>
      <div className="banner-block pt-10 md:pt-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="list-banner grid gap-[20px] md:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
            <Link
              href={"/shop/breadcrumb-img"}
              className="banner-item relative block duration-500"
            >
              <div className="banner-img w-full overflow-hidden rounded-2xl">
                <Image
                  src={"/images/banner/10.png"}
                  width={600}
                  height={400}
                  alt="bg-img"
                  className="w-full duration-500"
                />
              </div>
              <div className="banner-content absolute left-[30px] top-1/2 -translate-y-1/2">
                <div className="heading6">
                  Women{String.raw`'s`} Fashion <br />
                  Must-Haves
                </div>
                <div className="relative mt-2 inline-block border-b-2 border-black pb-1 text-base font-normal font-semibold leading-[22] text-black duration-500 md:text-[13px] md:leading-5">
                  Shop Now
                </div>
              </div>
            </Link>
            <Link
              href={"/shop/breadcrumb-img"}
              className="banner-item relative block duration-500"
            >
              <div className="banner-img w-full overflow-hidden rounded-2xl">
                <Image
                  src={"/images/banner/11.png"}
                  width={600}
                  height={400}
                  alt="bg-img"
                  className="w-full duration-500"
                />
              </div>
              <div className="banner-content absolute left-[30px] top-1/2 -translate-y-1/2">
                <div className="heading6">
                  Latest Men{String.raw`'s`} <br />
                  Fashion Essentials
                </div>
                <div className="relative mt-2 inline-block border-b-2 border-black pb-1 text-base font-normal font-semibold leading-[22] text-black duration-500 md:text-[13px] md:leading-5">
                  Shop Now
                </div>
              </div>
            </Link>
            <Link
              href={"/shop/breadcrumb-img"}
              className="banner-item relative block duration-500 max-lg:hidden"
            >
              <div className="banner-img w-full overflow-hidden rounded-2xl">
                <Image
                  src={"/images/banner/12.png"}
                  width={600}
                  height={400}
                  alt="bg-img"
                  className="w-full duration-500"
                />
              </div>
              <div className="banner-content absolute left-[30px] top-1/2 -translate-y-1/2">
                <div className="heading6">
                  Summer Sale <br />
                  collection
                </div>
                <div className="relative mt-2 inline-block border-b-2 border-black pb-1 text-base font-normal font-semibold leading-[22] text-black duration-500 md:text-[13px] md:leading-5">
                  Shop Now
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
