"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/store-components/Menu";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";

const StoreList = () => {
  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="Store list" subHeading="Store list" />
      </div>
      <div className="store-list py-10 md:py-20">
        <div className="container">
          <div className="item overflow-hidden rounded-[20px] bg-surface">
            <div className="relative flex items-center max-lg:flex-col lg:justify-end">
              <Image
                src={"/images/other/store-list-office1.png"}
                width={3000}
                height={2000}
                alt="bg-img"
                className="relative left-0 top-0 h-full w-full object-cover lg:absolute lg:bottom-0 lg:w-1/2"
              />
              <div className="text-content py-6 max-lg:px-6 sm:py-10 lg:w-1/2 lg:py-14 lg:pl-[100px] lg:pr-20">
                <div className="heading3">New York Office</div>
                <div className="list-featrue mt-6 lg:mt-10">
                  <div className="item flex gap-6 lg:gap-10">
                    <div className="w-1/2">
                      <div className="heading6">Address:</div>
                      <div className="mt-2 text-secondary">
                        2163 Phillips Gap Rd West Jefferson, North Carolina
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="heading6">Opentime:</div>
                      <div className="mt-2 whitespace-nowrap text-secondary">
                        Monay - Friday:
                      </div>
                      <div className="text-title whitespace-nowrap text-black">
                        08:00 - 20:00
                      </div>
                      <div className="whitespace-nowrap text-secondary">
                        Saturday - Sunday:
                      </div>
                      <div className="text-title whitespace-nowrap text-black">
                        10:00 - 18:00
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-featrue mt-5">
                  <div className="item flex gap-6 lg:gap-10">
                    <div className="w-1/2">
                      <div className="heading6">Infomation:</div>
                      <div className="mt-2 text-secondary">
                        +1 666 234 8888
                        <br />
                        hi.avitex@gmail.com
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="heading6">Our social media:</div>
                      <div className="mt-2 flex items-center gap-2 sm:gap-4">
                        <Link
                          href={"https://www.facebook.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-facebook"></div>
                        </Link>
                        <Link
                          href={"https://www.instagram.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-instagram"></div>
                        </Link>
                        <Link
                          href={"https://www.youtube.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-youtube"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="item mt-10 overflow-hidden rounded-[20px] bg-surface md:mt-20">
            <div className="relative flex items-center justify-start max-lg:flex-col-reverse">
              <div className="text-content w-full py-6 max-lg:px-6 sm:py-10 lg:w-1/2 lg:py-14 lg:pl-20 lg:pr-[100px]">
                <div className="heading3">Chicago Office</div>
                <div className="list-featrue mt-6 lg:mt-10">
                  <div className="item flex gap-6 lg:gap-10">
                    <div className="w-1/2">
                      <div className="heading6">Address:</div>
                      <div className="mt-2 text-secondary">
                        2163 Phillips Gap Rd West Jefferson, North Carolina
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="heading6">Opentime:</div>
                      <div className="mt-2 whitespace-nowrap text-secondary">
                        Monay - Friday:
                      </div>
                      <div className="text-title whitespace-nowrap text-black">
                        08:00 - 20:00
                      </div>
                      <div className="whitespace-nowrap text-secondary">
                        Saturday - Sunday:
                      </div>
                      <div className="text-title whitespace-nowrap text-black">
                        10:00 - 18:00
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-featrue mt-5">
                  <div className="item flex gap-6 lg:gap-10">
                    <div className="w-1/2">
                      <div className="heading6">Infomation:</div>
                      <div className="mt-2 text-secondary">
                        +1 666 234 8888
                        <br />
                        hi.avitex@gmail.com
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="heading6">Our social media:</div>
                      <div className="mt-2 flex items-center gap-2 sm:gap-4">
                        <Link
                          href={"https://www.facebook.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-facebook"></div>
                        </Link>
                        <Link
                          href={"https://www.instagram.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-instagram"></div>
                        </Link>
                        <Link
                          href={"https://www.youtube.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-youtube"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src={"/images/other/store-list-office2.png"}
                width={3000}
                height={2000}
                alt="bg-img"
                className="relative bottom-0 right-0 top-0 h-full w-full object-cover lg:absolute lg:bottom-0 lg:w-1/2"
              />
            </div>
          </div>
          <div className="item mt-10 overflow-hidden rounded-[20px] bg-surface md:mt-20">
            <div className="relative flex items-center max-lg:flex-col lg:justify-end">
              <Image
                src={"/images/other/store-list-office3.png"}
                width={3000}
                height={2000}
                alt="bg-img"
                className="relative left-0 top-0 h-full w-full object-cover lg:absolute lg:bottom-0 lg:w-1/2"
              />
              <div className="text-content py-6 max-lg:px-6 sm:py-10 lg:w-1/2 lg:py-14 lg:pl-[100px] lg:pr-20">
                <div className="heading3">San Francisco Office</div>
                <div className="list-featrue mt-6 lg:mt-10">
                  <div className="item flex gap-6 lg:gap-10">
                    <div className="w-1/2">
                      <div className="heading6">Address:</div>
                      <div className="mt-2 text-secondary">
                        2163 Phillips Gap Rd West Jefferson, North Carolina
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="heading6">Opentime:</div>
                      <div className="mt-2 whitespace-nowrap text-secondary">
                        Monay - Friday:
                      </div>
                      <div className="text-title whitespace-nowrap text-black">
                        08:00 - 20:00
                      </div>
                      <div className="whitespace-nowrap text-secondary">
                        Saturday - Sunday:
                      </div>
                      <div className="text-title whitespace-nowrap text-black">
                        10:00 - 18:00
                      </div>
                    </div>
                  </div>
                </div>
                <div className="list-featrue mt-5">
                  <div className="item flex gap-6 lg:gap-10">
                    <div className="w-1/2">
                      <div className="heading6">Infomation:</div>
                      <div className="mt-2 text-secondary">
                        +1 666 234 8888
                        <br />
                        hi.avitex@gmail.com
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="heading6">Our social media:</div>
                      <div className="mt-2 flex items-center gap-2 sm:gap-4">
                        <Link
                          href={"https://www.facebook.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-facebook"></div>
                        </Link>
                        <Link
                          href={"https://www.instagram.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-instagram"></div>
                        </Link>
                        <Link
                          href={"https://www.youtube.com/"}
                          target="_blank"
                          className="item flex h-10 w-10 items-center justify-center rounded-full bg-white duration-300 hover:bg-black hover:text-white"
                        >
                          <div className="icon-youtube"></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreList;
