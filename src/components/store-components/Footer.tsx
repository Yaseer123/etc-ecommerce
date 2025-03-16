import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CaretDown } from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
  return (
    <>
      <div id="footer" className="footer">
        <div className="footer-main bg-surface">
          <div className="container">
            <div className="content-footer flex flex-wrap justify-between gap-y-8 py-[60px]">
              <div className="company-infor basis-1/4 pr-7 max-lg:basis-full">
                <Link href={"/"} className="logo">
                  <div className="heading4">Rinors</div>
                </Link>
                <div className="mt-3 flex gap-3">
                  <div className="flex flex-col">
                    <span className="text-button">Mail:</span>
                    <span className="text-button mt-3">Phone:</span>
                    <span className="text-button mt-3">Address:</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="">hi.avitex@gmail.com</span>
                    <span className="mt-3">1-333-345-6868</span>
                    <span className="mt-3 pt-px">
                      549 Oak St.Crystal Lake, IL 60014
                    </span>
                  </div>
                </div>
              </div>
              <div className="right-content flex basis-3/4 flex-wrap gap-y-8 max-lg:basis-full">
                <div className="list-nav flex basis-2/3 justify-between gap-4 max-md:basis-full">
                  <div className="item flex basis-1/3 flex-col">
                    <div className="text-button-uppercase pb-3">Infomation</div>
                    <Link
                      className="caption1 has-line-before w-fit duration-300"
                      href={"/pages/contact"}
                    >
                      Contact us
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"#!"}
                    >
                      Career
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/my-account"}
                    >
                      My Account
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/order-tracking"}
                    >
                      Order & Returns
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/pages/faqs"}
                    >
                      FAQs
                    </Link>
                  </div>
                  <div className="item flex basis-1/3 flex-col">
                    <div className="text-button-uppercase pb-3">Quick Shop</div>
                    <Link
                      className="caption1 has-line-before w-fit duration-300"
                      href={"/shop/breadcrumb1"}
                    >
                      Women
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/shop/breadcrumb1"}
                    >
                      Men
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/shop/breadcrumb1"}
                    >
                      Clothes
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/shop/breadcrumb1"}
                    >
                      Accessories
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/blog"}
                    >
                      Blog
                    </Link>
                  </div>
                  <div className="item flex basis-1/3 flex-col">
                    <div className="text-button-uppercase pb-3">
                      Customer Services
                    </div>
                    <Link
                      className="caption1 has-line-before w-fit duration-300"
                      href={"/pages/faqs"}
                    >
                      Orders FAQs
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/pages/faqs"}
                    >
                      Shipping
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/pages/faqs"}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/order-tracking"}
                    >
                      Return & Refund
                    </Link>
                  </div>
                </div>
                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                  <div className="text-button-uppercase">Newletter</div>
                  <div className="caption1 mt-3">
                    Sign up for our newsletter and get 10% off your first
                    purchase
                  </div>
                  <div className="input-block mt-4 h-[52px] w-full">
                    <form className="relative h-full w-full" action="post">
                      <input
                        type="email"
                        placeholder="Enter your e-mail"
                        className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-14"
                        required
                      />
                      <button className="absolute right-1 top-1 flex h-[44px] w-[44px] items-center justify-center rounded-xl bg-black">
                        <ArrowRight size={24} color="#fff" />
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
                <div className="copyright caption1 text-secondary">
                  ©2023 Anvogue. All Rights Reserved.
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
                    <CaretDown size={12} color="#1F1F1F" />
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
                    <CaretDown size={12} color="#1F1F1F" />
                  </div>
                </div>
              </div>
              <div className="right flex items-center gap-2">
                <div className="caption1 text-secondary">Payment:</div>
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
};

export default Footer;
