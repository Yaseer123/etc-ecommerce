"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Order Tracking" },
];
const OrderTracking = () => {
  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="Order Tracking" />
      </div>
      <div className="py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex gap-y-8 max-md:flex-col">
            <div className="left w-full border-line md:w-1/2 md:border-r md:pr-[40px] lg:pr-[60px]">
              <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                Order Tracking
              </div>
              <div className="mt-2">
                To track your order please enter your Order ID in the box below
                and press the {String.raw`"`}Track{String.raw`"`} button. This
                was given to you on your receipt and in the confirmation email
                you should have received.
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
                <div className="billing mt-5">
                  <input
                    className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                    id="billing"
                    type="email"
                    placeholder="Billing Email *"
                    required
                  />
                </div>
                <div className="mt-4 md:mt-7">
                  <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                    Tracking Orders
                  </button>
                </div>
              </form>
            </div>
            <div className="right flex w-full items-center md:w-1/2 md:pl-[40px] lg:pl-[60px]">
              <div className="text-content">
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  Already have an account?
                </div>
                <div className="mt-2 text-secondary">
                  Welcome back. Sign in to access your personalized experience,
                  saved preferences, and more. We{String.raw`'re`} thrilled to
                  have you with us again!
                </div>
                <div className="mt-4 md:mt-7">
                  <Link
                    href={"/login"}
                    className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                  >
                    Login
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

export default OrderTracking;
