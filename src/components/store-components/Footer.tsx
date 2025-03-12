import React from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <>
      <div id="footer" className="footer">
        <div className="footer-main bg-surface">
          <div className="mx-auto w-full !max-w-[1322px] px-4">
            <div className="content-footer flex flex-wrap justify-between gap-y-8 py-[60px]">
              <div className="company-infor basis-1/4 pr-7 max-lg:basis-full">
                <Link href={"/"} className="logo">
                  <div className="text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                    Rinors
                  </div>
                </Link>
                <div className="mt-3 flex gap-3">
                  <div className="flex flex-col">
                    <Link
                      href="mailto:rinorscorporation@gmail.com"
                      className="text-button"
                    >
                      Mail:
                    </Link>
                    <span className="text-button mt-3">Phone:</span>
                    <span className="text-button mt-3">Address:</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="">rinorscorporation@gmail.com</span>
                    <span className="mt-3">+8801312223452</span>
                    <span className="mt-3 pt-px">
                      41/5, East Badda, Dhaka 1212, Bangladesh
                    </span>
                  </div>
                </div>
              </div>
              <div className="right-content flex basis-3/4 flex-wrap gap-y-8 max-lg:basis-full">
                <div className="list-nav flex basis-2/3 justify-between gap-4 max-md:basis-full">
                  <div className="item flex basis-1/3 flex-col">
                    <div className="pb-3 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Infomation
                    </div>
                    <Link
                      className="has-line-before w-fit text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/pages/contact"}
                    >
                      Contact us
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"#!"}
                    >
                      Career
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/my-account"}
                    >
                      My Account
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/order-tracking"}
                    >
                      Order & Returns
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/pages/faqs"}
                    >
                      FAQs
                    </Link>
                  </div>
                  <div className="item flex basis-1/3 flex-col">
                    <div className="pb-3 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Quick Shop
                    </div>
                    <Link
                      className="has-line-before w-fit text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/shop/breadcrumb1"}
                    >
                      Women
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/shop/breadcrumb1"}
                    >
                      Men
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/shop/breadcrumb1"}
                    >
                      Clothes
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/shop/breadcrumb1"}
                    >
                      Accessories
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/blog"}
                    >
                      Blog
                    </Link>
                  </div>
                  <div className="item flex basis-1/3 flex-col">
                    <div className="pb-3 text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Customer Services
                    </div>
                    <Link
                      className="has-line-before w-fit text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/pages/faqs"}
                    >
                      Orders FAQs
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/pages/faqs"}
                    >
                      Shipping
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/pages/faqs"}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      className="has-line-before w-fit pt-2 text-base font-normal leading-[22] duration-300 md:text-[13px] md:leading-5"
                      href={"/order-tracking"}
                    >
                      Return & Refund
                    </Link>
                  </div>
                </div>
                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                  <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                    Newletter
                  </div>
                  <div className="mt-3 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                    Sign up for our newsletter and get 10% off your first
                    purchase
                  </div>
                  <div className="input-block mt-4 h-[52px] w-full">
                    <form className="relative h-full w-full" action="post">
                      <input
                        type="email"
                        placeholder="Enter your e-mail"
                        className="h-full w-full rounded-xl border border-line pl-4 pr-14 text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                        required
                      />
                      <button className="absolute right-1 top-1 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-black">
                        <Icon.ArrowRight size={24} color="#fff" />
                      </button>
                    </form>
                  </div>
                  <div className="list-social mt-4 flex items-center gap-6">
                    <Link href={"https://www.facebook.com/"} target="_blank">
                      <div className="icon-facebook text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://www.instagram.com/"} target="_blank">
                      <div className="icon-instagram text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://www.twitter.com/"} target="_blank">
                      <div className="icon-twitter text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://www.youtube.com/"} target="_blank">
                      <div className="icon-youtube text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://www.pinterest.com/"} target="_blank">
                      <div className="icon-pinterest text-2xl text-black"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom flex items-center justify-between gap-5 border-t border-line py-3 max-lg:flex-col max-lg:justify-center">
              <div className="left flex items-center gap-8">
                <div className="copyright text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                  ©{new Date().getFullYear()} Rinors. All Rights Reserved.
                </div>
                <div className="select-block flex items-center gap-5 max-md:hidden">
                  <div className="choose-language flex items-center gap-1.5">
                    <select
                      name="language"
                      id="chooseLanguageFooter"
                      className="caption2 bg-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Espana">Espana</option>
                      <option value="France">France</option>
                    </select>
                    <Icon.CaretDown size={12} color="#1F1F1F" />
                  </div>
                  <div className="choose-currency flex items-center gap-1.5">
                    <select
                      name="currency"
                      id="chooseCurrencyFooter"
                      className="caption2 bg-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <Icon.CaretDown size={12} color="#1F1F1F" />
                  </div>
                </div>
              </div>
              <div className="right flex items-center gap-2">
                <div className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                  Payment:
                </div>
                <div className="payment-img">
                  <Image
                    src={"/images/payment/Frame-0.png"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"/images/payment/Frame-1.png"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"/images/payment/Frame-2.png"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"/images/payment/Frame-3.png"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"/images/payment/Frame-4.png"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
                <div className="payment-img">
                  <Image
                    src={"/images/payment/Frame-5.png"}
                    width={500}
                    height={500}
                    alt={"payment"}
                    className="w-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
