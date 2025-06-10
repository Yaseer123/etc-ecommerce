import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div id="footer" className="footer">
        <div className="footer-main bg-surface">
          <div className="container">
            <div className="content-footer flex flex-wrap justify-between gap-y-8 py-[60px]">
              <div className="company-infor basis-1/4 pr-7 max-lg:basis-full">
                <Link href={"/"} className="logo">
                  <Image
                    src="/images/brand/RINORS.png"
                    alt="Rinors Logo"
                    width={120}
                    height={40}
                    priority
                    className="h-auto w-[120px] object-contain"
                  />
                </Link>
                <div className="mt-3 flex gap-3">
                  <div className="flex flex-col">
                    <span className="text-button">Mail:</span>
                    <span className="text-button mt-3">Phone:</span>
                    <span className="text-button mt-3">Address:</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="">rinorscorporation@gmail.com</span>
                    <span className="mt-3">01312223452</span>
                    <span className="mt-3 pt-px">
                      41/5 east badda Dhaka, Bangladesh
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
                      href={"/contact"}
                    >
                      Contact us
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/contact"}
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
                      Order Tracking
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/faqs"}
                    >
                      FAQs
                    </Link>
                  </div>
                  <div className="item flex basis-1/3 flex-col">
                    <div className="text-button-uppercase pb-3">Quick Shop</div>
                    <Link
                      className="caption1 has-line-before w-fit duration-300"
                      href={"/products?category=cmbb6pxmn000gpfkk10p0fv0l"}
                    >
                     Home Electricals
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/products?category=cmbb6dq3y000epfkkjn0sie9j"}
                    >
                      Energy Solutions
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/products?category=cmbb78cte000mpfkkt0cyt53d"}
                    >
                      Smart Gadget
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/products?category=cmbb7dno0000opfkk9ttqrmxj"}
                    >
                      Health and Fitness
                    </Link>
                    <Link
                      className="caption1 has-line-before w-fit pt-2 duration-300"
                      href={"/products?category=cmbb6x8b3000ipfkkcas967g6"}
                    >
                      Smart Appliances
                    </Link>
                  </div>
                  <div className="item flex basis-1/3 flex-col">
                    <div className="text-button-uppercase pb-3">
                      Customer Services
                    </div>
                    <Link
                      className="caption1 has-line-before w-fit duration-300"
                      href={"/faqs"}
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
                    <Link
                      href={
                        "https://www.facebook.com/profile.php?id=61572946813700"
                      }
                      target="_blank"
                    >
                      <div className="icon-facebook text-2xl text-black"></div>
                    </Link>
                    <Link
                      href={
                        "https://www.instagram.com/rinors_electronic_store/"
                      }
                      target="_blank"
                    >
                      <div className="icon-instagram text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://x.com/Rinors_Corpor"} target="_blank">
                      <div className="icon-twitter text-2xl text-black"></div>
                    </Link>
                    <Link
                      href={"https://www.tiktok.com/@rinors_ecommerce"}
                      target="_blank"
                    >
                      <div className="icon-tiktok text-2xl text-black">
                      </div>
                    </Link>
                    <Link
                      href={"https://www.youtube.com/@rinorsgreenenergy"}
                      target="_blank"
                    >
                      <div className="icon-youtube text-2xl text-black"></div>
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
