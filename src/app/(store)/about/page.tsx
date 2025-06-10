"use client";
import Benefit from "@/components/store-components/Benefit";
import Brand from "@/components/store-components/Brand";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import Instagram from "@/components/store-components/Instagram";
import Image from "next/image";
const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
];
const AboutUs = () => {
  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="About Us" />
      </div>
      <div className="pt-10 md:pt-20">
        <div>
          <div className="mx-auto w-full max-w-[1322px] pl-4 pr-4">
            <div className="flex items-center justify-center">
              <div className="w-full md:w-5/6">
                <div className="text-center text-[36px] font-semibold capitalize leading-[40px] md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
                  Elevating Everyday Style
                </div>
                <div className="mt-5 text-center text-lg font-normal leading-7 md:mt-7">
                  Welcome to Rinors, your destination for modern, sustainable
                  fashion. Founded in 2022, our mission is to empower
                  individuals to express themselves through thoughtfully
                  designed clothing that blends comfort, quality, and style. We
                  believe fashion should be accessible, ethical, and
                  inspiring—every piece in our collection is carefully curated
                  to reflect these values.
                  <br />
                  <br />
                  Our passionate team is dedicated to providing an exceptional
                  shopping experience, from handpicking the latest trends to
                  ensuring your order arrives with care. Whether you&apos;re
                  looking for timeless essentials or statement pieces, Rinors is
                  here to help you look and feel your best every day.
                </div>
              </div>
            </div>
            {/* <div className="grid gap-[30px] pt-10 sm:grid-cols-3 md:pt-20">
              <div className="bg-img">
                <Image
                  src={"/images/other/about-team.jpg"}
                  width={2000}
                  height={3000}
                  alt="Our Team"
                  className="w-full rounded-[30px]"
                />
              </div>
              <div className="bg-img">
                <Image
                  src={"/images/other/about-store.jpg"}
                  width={2000}
                  height={3000}
                  alt="Our Store"
                  className="w-full rounded-[30px]"
                />
              </div>
              <div className="bg-img">
                <Image
                  src={"/images/other/about-values.jpg"}
                  width={2000}
                  height={3000}
                  alt="Our Values"
                  className="w-full rounded-[30px]"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Benefit props="md:pt-20 pt-10" />
      {/* Newsletter */}
      <div className="mx-auto w-full max-w-[1322px] pl-4 pr-4">
        <div
          className={`mt-10 flex flex-col items-center rounded-3xl bg-green px-6 py-10 sm:rounded-[32px] sm:px-8 sm:py-14 md:mt-20 md:py-20`}
        >
          <div className="text-center text-4xl font-semibold capitalize leading-[40px] text-white">
            Join our community
          </div>
          <div className="mt-3 text-center text-white">
            Subscribe for exclusive updates, style tips, and special offers
          </div>
          <div className="mt-7 h-[52px] w-full sm:mt-10 sm:w-3/5 lg:w-1/2">
            <form className="relative h-full w-full" action="post">
              <input
                type="email"
                placeholder="Enter your e-mail"
                className="h-full w-full rounded-xl border border-line pl-4 pr-14 text-sm font-normal leading-[22px]"
                required
              />
              <button className="duration-400 absolute bottom-1 right-1 top-1 flex cursor-pointer items-center justify-center rounded-[12px] bg-green px-10 py-4 font-semibold uppercase leading-5 text-black transition-all ease-in-out">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* <Instagram /> */}
      {/* <Brand /> */}
    </>
  );
};

export default AboutUs;
