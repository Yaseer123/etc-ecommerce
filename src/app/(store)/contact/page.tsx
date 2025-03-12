"use client";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import Menu from "@/components/store-components/Menu";
import React from "react";

const ContactUs = () => {
  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="Contact us" subHeading="Contact us" />
      </div>
      <div className="contact-us py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex justify-between gap-y-10 max-lg:flex-col">
            <div className="left lg:w-2/3 lg:pr-4">
              <div className="text-[36px] font-semibold capitalize leading-[40px] md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
                Drop Us A Line
              </div>
              <div className="body1 mt-3 text-secondary2">
                Use the form below to get in touch with the sales team
              </div>
              <form className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 gap-4 gap-y-5 sm:grid-cols-2">
                  <div className="name">
                    <input
                      className="w-full rounded-lg border-line px-4 py-3"
                      id="username"
                      type="text"
                      placeholder="Your Name *"
                      required
                    />
                  </div>
                  <div className="email">
                    <input
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      id="email"
                      type="email"
                      placeholder="Your Email *"
                      required
                    />
                  </div>
                  <div className="message sm:col-span-2">
                    <textarea
                      className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                      id="message"
                      rows={3}
                      placeholder="Your Message *"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 md:mt-6">
                  <button className="duration-400 hover:bg-green-500 inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3">
                    Send message
                  </button>
                </div>
              </form>
            </div>
            <div className="right lg:w-1/4 lg:pl-4">
              <div className="item">
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  Our Store
                </div>
                <p className="mt-3">
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, United
                  States
                </p>
                <p className="mt-3">
                  Phone: <span className="whitespace-nowrap">+1 666 8888</span>
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <span className="whitespace-nowrap">hi.avitex@gmail.com</span>
                </p>
              </div>
              <div className="item mt-10">
                <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                  Open Hours
                </div>
                <p className="mt-3">
                  Mon - Fri:{" "}
                  <span className="whitespace-nowrap">7:30am - 8:00pm PST</span>
                </p>
                <p className="mt-3">
                  Saturday:{" "}
                  <span className="whitespace-nowrap">8:00am - 6:00pm PST</span>
                </p>
                <p className="mt-3">
                  Sunday:{" "}
                  <span className="whitespace-nowrap">9:00am - 5:00pm PST</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
