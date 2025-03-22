"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";

const ForgotPassword = () => {
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Forgot your password?",
    },
  ];
  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb
          items={breadcrumbItems}
          pageTitle="Forgot your password?"
        />
      </div>
      <div className="py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex gap-y-8 max-md:flex-col">
            <div className="left w-full border-line md:w-1/2 md:border-r md:pr-[40px] lg:pr-[60px]">
              <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                Reset your password
              </div>
              <div className="body1 mt-2">
                We will send you an email to reset your password
              </div>
              <form className="mt-4 md:mt-7">
                <div className="email">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="username"
                    type="email"
                    placeholder="Username or email address *"
                    required
                  />
                </div>
                <div className="mt-4 md:mt-7">
                  <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className="right flex w-full items-center md:w-1/2 md:pl-[40px] lg:pl-[60px]">
              <div>
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  New Customer
                </div>
                <div className="mt-2 text-secondary">
                  Be part of our growing family of new customers! Join us today
                  and unlock a world of exclusive benefits, offers, and
                  personalized experiences.
                </div>
                <div className="mt-4 md:mt-7">
                  <Link
                    href={"/register"}
                    className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
