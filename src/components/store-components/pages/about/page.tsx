"use client";
import React from "react";
import Image from "next/image";
import Menu from "@/components/store-components/Menu";
import Benefit from "@/components/store-components/Benefit";
import Brand from "@/components/store-components/Brand";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import Newsletter from "@/components/store-components/Newsletter";
import TopNav from "@/components/store-components/TopNav";
import Instagram from "@/components/store-components/Instagram";

const AboutUs = () => {
  return (
    <>
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="About Us" subHeading="About Us" />
      </div>
      <div className="about pt-10 md:pt-20">
        <div className="about-us-block">
          <div className="container">
            <div className="text flex items-center justify-center">
              <div className="content w-full md:w-5/6">
                <div className="heading3 text-center">
                  I{String.raw`'m`} obsessed with the dress Pippa Middleton wore
                  to her brother{String.raw`'s`} wedding.
                </div>
                <div className="body1 mt-5 text-center md:mt-7">
                  Kim Kardashian West needs no introduction. In the 14 years
                  since she first graced our screens in Keeping Up With The
                  Kardashians, she has built her KKW beauty empire, filmed her
                  show, wrapped her show, become a billionaire, studied law,
                  campaigned for the rights of death row inmates, travelled the
                  world to attend events such as Paris Fashion Week, raised four
                  children and launched her wildly successful shapewear brand
                  SKIMS.
                </div>
              </div>
            </div>
            <div className="list-img grid gap-[30px] pt-10 sm:grid-cols-3 md:pt-20">
              <div className="bg-img">
                <Image
                  src={"/images/other/about-us1.png"}
                  width={2000}
                  height={3000}
                  alt="bg-img"
                  className="w-full rounded-[30px]"
                />
              </div>
              <div className="bg-img">
                <Image
                  src={"/images/other/about-us2.png"}
                  width={2000}
                  height={3000}
                  alt="bg-img"
                  className="w-full rounded-[30px]"
                />
              </div>
              <div className="bg-img">
                <Image
                  src={"/images/other/about-us3.png"}
                  width={2000}
                  height={3000}
                  alt="bg-img"
                  className="w-full rounded-[30px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Benefit props="md:pt-20 pt-10" />
      {/* Newsletter */}
      <div className="container">
        <div
          className={`newsletter-block bg-green mt-10 flex flex-col items-center rounded-3xl px-6 py-10 sm:rounded-[32px] sm:px-8 sm:py-14 md:mt-20 md:py-20`}
        >
          <div className="heading3 text-center text-white">
            Sign up and get 10% off
          </div>
          <div className="mt-3 text-center text-white">
            Sign up for early sale access, new in, promotions and more
          </div>
          <div className="input-block mt-7 h-[52px] w-full sm:mt-10 sm:w-3/5 lg:w-1/2">
            <form className="relative h-full w-full" action="post">
              <input
                type="email"
                placeholder="Enter your e-mail"
                className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-14"
                required
              />
              <button className="button-main bg-green absolute bottom-1 right-1 top-1 flex items-center justify-center text-black">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      <Instagram />
      <Brand />
    </>
  );
};

export default AboutUs;
