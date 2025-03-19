"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import {
  CaretDown,
  GearSix,
  HourglassMedium,
  HouseLine,
  Package,
  ReceiptX,
  SignOut,
  Tag,
} from "@phosphor-icons/react/dist/ssr";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>("dashboard");
  const [activeAddress, setActiveAddress] = useState<string | null>("billing");
  const [activeOrders, setActiveOrders] = useState<string | undefined>("all");
  const [openDetail, setOpenDetail] = useState<boolean | undefined>(false);

  const handleActiveAddress = (order: string) => {
    setActiveAddress((prevOrder) => (prevOrder === order ? null : order));
  };

  const handleActiveOrders = (order: string) => {
    setActiveOrders(order);
  };

  const breadcrumbItems = [
    {label:"home", href:"/"},
    {label:"my-account"}
  ]

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="My Account" />
      </div>
      <div className="py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex w-full gap-y-8 max-md:flex-col">
            <div className="left w-full md:w-1/3 md:pr-[16px] lg:pr-[28px] xl:pr-[3.125rem]">
              <div className="rounded-xl bg-surface px-4 py-5 md:rounded-[20px] lg:px-7 lg:py-10">
                <div className="heading flex flex-col items-center justify-center">
                  <div>
                    <Image
                      src={"/images/avatar/1.png"}
                      width={300}
                      height={300}
                      alt="avatar"
                      className="h-[120px] w-[120px] rounded-full md:h-[140px] md:w-[140px]"
                    />
                  </div>
                  <div className="mt-4 text-center text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                    Tony Nguyen
                  </div>
                  <div className="mt-1 text-center text-[20px] font-semibold capitalize leading-[28px] text-secondary md:text-base lg:text-lg lg:leading-[26px]">
                    hi.avitex@gmail.com
                  </div>
                </div>
                <div className="menu-tab mt-6 w-full max-w-none lg:mt-10">
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveTab("dashboard")}
                  >
                    <HouseLine size={20} />
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      Dashboard
                    </strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package size={20} />
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      History Orders
                    </strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "address" ? "active" : ""}`}
                    onClick={() => setActiveTab("address")}
                  >
                    <Tag size={20} />
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      My Address
                    </strong>
                  </Link>
                  <Link
                    href={"#!"}
                    scroll={false}
                    className={`item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white ${activeTab === "setting" ? "active" : ""}`}
                    onClick={() => setActiveTab("setting")}
                  >
                    <GearSix size={20} />
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      Setting
                    </strong>
                  </Link>
                  <Link
                    href={"/api/auth/signout"}
                    className="item mt-1.5 flex w-full cursor-pointer items-center gap-3 rounded-lg px-5 py-4 duration-300 hover:bg-white"
                  >
                    <SignOut size={20} />
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      Logout
                    </strong>
                  </Link>
                </div>
              </div>
            </div>
            <div className="right w-full pl-2.5 md:w-2/3">
              <div
                className={`tab text-content w-full ${activeTab === "dashboard" ? "block" : "hidden"}`}
              >
                <div className="overview grid gap-5 sm:grid-cols-3">
                  <div className="item box-shadow-xs flex items-center justify-between rounded-lg border border-line p-5">
                    <div className="counter">
                      <span className="text-secondary">Awaiting Pickup</span>
                      <h5 className="heading5 mt-1">4</h5>
                    </div>
                    <HourglassMedium className="text-4xl" />
                  </div>
                  <div className="item box-shadow-xs flex items-center justify-between rounded-lg border border-line p-5">
                    <div className="counter">
                      <span className="text-secondary">Cancelled Orders</span>
                      <h5 className="heading5 mt-1">12</h5>
                    </div>
                    <ReceiptX className="text-4xl" />
                  </div>
                  <div className="item box-shadow-xs flex items-center justify-between rounded-lg border border-line p-5">
                    <div className="counter">
                      <span className="text-secondary">
                        Total Number of Orders
                      </span>
                      <h5 className="heading5 mt-1">200</h5>
                    </div>
                    <Package className="text-4xl" />
                  </div>
                </div>
                <div className="recent_order mt-7 rounded-xl border border-line px-5 pb-2 pt-5">
                  <h6 className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                    Recent Orders
                  </h6>
                  <div className="list mt-5 w-full overflow-x-auto">
                    <table className="w-full max-[1400px]:w-[700px] max-md:w-[700px]">
                      <thead className="border-b border-line">
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap pb-3 text-left text-sm font-bold uppercase text-secondary"
                          >
                            Order
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap pb-3 text-left text-sm font-bold uppercase text-secondary"
                          >
                            Products
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap pb-3 text-left text-sm font-bold uppercase text-secondary"
                          >
                            Pricing
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap pb-3 text-right text-sm font-bold uppercase text-secondary"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="item border-b border-line duration-300">
                          <th scope="row" className="py-3 text-left">
                            <strong className="text-title">54312452</strong>
                          </th>
                          <td className="py-3">
                            <Link
                              href={"/product/default"}
                              className="product flex items-center gap-3"
                            >
                              <Image
                                src={"/images/product/1000x1000.png"}
                                width={400}
                                height={400}
                                alt="Contrasting sweatshirt"
                                className="h-12 w-12 flex-shrink-0 rounded"
                              />
                              <div className="info flex flex-col">
                                <strong className="product_name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  Contrasting sweatshirt
                                </strong>
                                <span className="product_tag text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                  Women, Clothing
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="price py-3">$45.00</td>
                          <td className="py-3 text-right">
                            <span className="tag rounded-full bg-yellow bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-yellow md:text-[13px] md:leading-5">
                              Pending
                            </span>
                          </td>
                        </tr>
                        <tr className="item border-b border-line duration-300">
                          <th scope="row" className="py-3 text-left">
                            <strong className="text-title">54312452</strong>
                          </th>
                          <td className="py-3">
                            <Link
                              href={"/product/default"}
                              className="product flex items-center gap-3"
                            >
                              <Image
                                src={"/images/product/1000x1000.png"}
                                width={400}
                                height={400}
                                alt="Faux-leather trousers"
                                className="h-12 w-12 flex-shrink-0 rounded"
                              />
                              <div className="info flex flex-col">
                                <strong className="product_name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  Faux-leather trousers
                                </strong>
                                <span className="product_tag text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                  Women, Clothing
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="price py-3">$45.00</td>
                          <td className="py-3 text-right">
                            <span className="tag rounded-full bg-purple bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-purple md:text-[13px] md:leading-5">
                              Delivery
                            </span>
                          </td>
                        </tr>
                        <tr className="item border-b border-line duration-300">
                          <th scope="row" className="py-3 text-left">
                            <strong className="text-title">54312452</strong>
                          </th>
                          <td className="py-3">
                            <Link
                              href={"/product/default"}
                              className="product flex items-center gap-3"
                            >
                              <Image
                                src={"/images/product/1000x1000.png"}
                                width={400}
                                height={400}
                                alt="V-neck knitted top"
                                className="h-12 w-12 flex-shrink-0 rounded"
                              />
                              <div className="info flex flex-col">
                                <strong className="product_name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  V-neck knitted top
                                </strong>
                                <span className="product_tag text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                  Women, Clothing
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="price py-3">$45.00</td>
                          <td className="py-3 text-right">
                            <span className="tag rounded-full bg-success bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-success md:text-[13px] md:leading-5">
                              Completed
                            </span>
                          </td>
                        </tr>
                        <tr className="item border-b border-line duration-300">
                          <th scope="row" className="py-3 text-left">
                            <strong className="text-title">54312452</strong>
                          </th>
                          <td className="py-3">
                            <Link
                              href={"/product/default"}
                              className="product flex items-center gap-3"
                            >
                              <Image
                                src={"/images/product/1000x1000.png"}
                                width={400}
                                height={400}
                                alt="Contrasting sweatshirt"
                                className="h-12 w-12 flex-shrink-0 rounded"
                              />
                              <div className="info flex flex-col">
                                <strong className="product_name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  Contrasting sweatshirt
                                </strong>
                                <span className="product_tag text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                  Women, Clothing
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="price py-3">$45.00</td>
                          <td className="py-3 text-right">
                            <span className="tag rounded-full bg-yellow bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-yellow md:text-[13px] md:leading-5">
                              Pending
                            </span>
                          </td>
                        </tr>
                        <tr className="item border-b border-line duration-300">
                          <th scope="row" className="py-3 text-left">
                            <strong className="text-title">54312452</strong>
                          </th>
                          <td className="py-3">
                            <Link
                              href={"/product/default"}
                              className="product flex items-center gap-3"
                            >
                              <Image
                                src={"/images/product/1000x1000.png"}
                                width={400}
                                height={400}
                                alt="Faux-leather trousers"
                                className="h-12 w-12 flex-shrink-0 rounded"
                              />
                              <div className="info flex flex-col">
                                <strong className="product_name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  Faux-leather trousers
                                </strong>
                                <span className="product_tag text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                  Women, Clothing
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="price py-3">$45.00</td>
                          <td className="py-3 text-right">
                            <span className="tag rounded-full bg-purple bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-purple md:text-[13px] md:leading-5">
                              Delivery
                            </span>
                          </td>
                        </tr>
                        <tr className="item duration-300">
                          <th scope="row" className="py-3 text-left">
                            <strong className="text-title">54312452</strong>
                          </th>
                          <td className="py-3">
                            <Link
                              href={"/product/default"}
                              className="product flex items-center gap-3"
                            >
                              <Image
                                src={"/images/product/1000x1000.png"}
                                width={400}
                                height={400}
                                alt="V-neck knitted top"
                                className="h-12 w-12 flex-shrink-0 rounded"
                              />
                              <div className="info flex flex-col">
                                <strong className="product_name text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                  V-neck knitted top
                                </strong>
                                <span className="product_tag text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                  Women, Clothing
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="price py-3">$45.00</td>
                          <td className="py-3 text-right">
                            <span className="tag rounded-full bg-red bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-red md:text-[13px] md:leading-5">
                              Canceled
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                className={`tab text-content w-full overflow-hidden rounded-xl border border-line p-7 ${activeTab === "orders" ? "block" : "hidden"}`}
              >
                <h6 className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  Your Orders
                </h6>
                <div className="w-full overflow-x-auto">
                  <div className="menu-tab mt-3 grid grid-cols-5 border-b border-line max-lg:w-[500px]">
                    {[
                      "all",
                      "pending",
                      "delivery",
                      "completed",
                      "canceled",
                    ].map((item, index) => (
                      <button
                        key={index}
                        className={`item relative border-b-2 px-3 py-2.5 text-center text-secondary duration-300 hover:text-black ${activeOrders === item ? "active border-black" : "border-transparent"}`}
                        onClick={() => handleActiveOrders(item)}
                      >
                        {/* {activeOrders === item && (
                                                <motion.span layoutId='active-pill' className='absolute inset-0 border-black border-b-2'></motion.span>
                                                )} */}
                        <span className="relative z-[1] text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                          {item}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="list_order">
                  <div className="order_item box-shadow-xs mt-5 rounded-lg border border-line">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order Number:</strong>
                        <strong className="order_number text-base font-semibold uppercase capitalize leading-[26px] md:text-base md:leading-6">
                          s184989823
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order status:</strong>
                        <span className="tag rounded-full bg-purple bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-purple md:text-[13px] md:leading-5">
                          Delivery
                        </span>
                      </div>
                    </div>
                    <div className="list_prd px-5">
                      <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                        <Link
                          href={"/product/default"}
                          className="flex items-center gap-5"
                        >
                          <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                            <Image
                              src={"/images/product/1000x1000.png"}
                              width={1000}
                              height={1000}
                              alt={"Contrasting sheepskin sweatshirt"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="prd_name text-title">
                              Contrasting sheepskin sweatshirt
                            </div>
                            <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                              <span className="prd_size uppercase">XL</span>
                              <span>/</span>
                              <span className="prd_color capitalize">
                                Yellow
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="text-title">
                          <span className="prd_quantity">1</span>
                          <span> X </span>
                          <span className="prd_price">$45.00</span>
                        </div>
                      </div>
                      <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                        <Link
                          href={"/product/default"}
                          className="flex items-center gap-5"
                        >
                          <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                            <Image
                              src={"/images/product/1000x1000.png"}
                              width={1000}
                              height={1000}
                              alt={"Contrasting sheepskin sweatshirt"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="prd_name text-title">
                              Contrasting sheepskin sweatshirt
                            </div>
                            <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                              <span className="prd_size uppercase">XL</span>
                              <span>/</span>
                              <span className="prd_color capitalize">
                                White
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="text-title">
                          <span className="prd_quantity">2</span>
                          <span> X </span>
                          <span className="prd_price">$70.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                      <button
                        className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        onClick={() => setOpenDetail(true)}
                      >
                        Order Details
                      </button>
                      <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] border border-line bg-black bg-surface px-10 py-4 text-sm font-semibold uppercase leading-5 text-black text-white transition-all ease-in-out hover:bg-black hover:bg-green hover:text-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                        Cancel Order
                      </button>
                    </div>
                  </div>
                  <div className="order_item box-shadow-xs mt-5 rounded-lg border border-line">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order Number:</strong>
                        <strong className="order_number text-base font-semibold uppercase capitalize leading-[26px] md:text-base md:leading-6">
                          s184989824
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order status:</strong>
                        <span className="tag rounded-full bg-yellow bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-yellow md:text-[13px] md:leading-5">
                          Pending
                        </span>
                      </div>
                    </div>
                    <div className="list_prd px-5">
                      <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                        <Link
                          href={"/product/default"}
                          className="flex items-center gap-5"
                        >
                          <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                            <Image
                              src={"/images/product/1000x1000.png"}
                              width={1000}
                              height={1000}
                              alt={"Contrasting sheepskin sweatshirt"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="prd_name text-title">
                              Contrasting sheepskin sweatshirt
                            </div>
                            <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                              <span className="prd_size uppercase">L</span>
                              <span>/</span>
                              <span className="prd_color capitalize">Pink</span>
                            </div>
                          </div>
                        </Link>
                        <div className="text-title">
                          <span className="prd_quantity">1</span>
                          <span> X </span>
                          <span className="prd_price">$69.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                      <button
                        className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        onClick={() => setOpenDetail(true)}
                      >
                        Order Details
                      </button>
                      <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] border border-line bg-black bg-surface px-10 py-4 text-sm font-semibold uppercase leading-5 text-black text-white transition-all ease-in-out hover:bg-black hover:bg-green hover:text-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                        Cancel Order
                      </button>
                    </div>
                  </div>
                  <div className="order_item box-shadow-xs mt-5 rounded-lg border border-line">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order Number:</strong>
                        <strong className="order_number text-base font-semibold uppercase capitalize leading-[26px] md:text-base md:leading-6">
                          s184989824
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order status:</strong>
                        <span className="tag rounded-full bg-success bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-success md:text-[13px] md:leading-5">
                          Completed
                        </span>
                      </div>
                    </div>
                    <div className="list_prd px-5">
                      <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                        <Link
                          href={"/product/default"}
                          className="flex items-center gap-5"
                        >
                          <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                            <Image
                              src={"/images/product/1000x1000.png"}
                              width={1000}
                              height={1000}
                              alt={"Contrasting sheepskin sweatshirt"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="prd_name text-title">
                              Contrasting sheepskin sweatshirt
                            </div>
                            <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                              <span className="prd_size uppercase">L</span>
                              <span>/</span>
                              <span className="prd_color capitalize">
                                White
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="text-title">
                          <span className="prd_quantity">1</span>
                          <span> X </span>
                          <span className="prd_price">$32.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                      <button
                        className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        onClick={() => setOpenDetail(true)}
                      >
                        Order Details
                      </button>
                      <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] border border-line bg-black bg-surface px-10 py-4 text-sm font-semibold uppercase leading-5 text-black text-white transition-all ease-in-out hover:bg-black hover:bg-green hover:text-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                        Cancel Order
                      </button>
                    </div>
                  </div>
                  <div className="order_item box-shadow-xs mt-5 rounded-lg border border-line">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order Number:</strong>
                        <strong className="order_number text-base font-semibold uppercase capitalize leading-[26px] md:text-base md:leading-6">
                          s184989824
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong className="text-title">Order status:</strong>
                        <span className="tag rounded-full bg-red bg-opacity-10 px-4 py-1.5 text-base font-normal font-semibold leading-[22] text-red md:text-[13px] md:leading-5">
                          Canceled
                        </span>
                      </div>
                    </div>
                    <div className="list_prd px-5">
                      <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                        <Link
                          href={"/product/default"}
                          className="flex items-center gap-5"
                        >
                          <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                            <Image
                              src={"/images/product/1000x1000.png"}
                              width={1000}
                              height={1000}
                              alt={"Contrasting sheepskin sweatshirt"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="prd_name text-title">
                              Contrasting sheepskin sweatshirt
                            </div>
                            <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                              <span className="prd_size uppercase">M</span>
                              <span>/</span>
                              <span className="prd_color capitalize">
                                Black
                              </span>
                            </div>
                          </div>
                        </Link>
                        <div className="text-title">
                          <span className="prd_quantity">1</span>
                          <span> X </span>
                          <span className="prd_price">$49.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 p-5">
                      <button
                        className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                        onClick={() => setOpenDetail(true)}
                      >
                        Order Details
                      </button>
                      <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] border border-line bg-black bg-surface px-10 py-4 text-sm font-semibold uppercase leading-5 text-black text-white transition-all ease-in-out hover:bg-black hover:bg-green hover:text-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                        Cancel Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`tab_address text-content w-full rounded-xl border border-line p-7 ${activeTab === "address" ? "block" : "hidden"}`}
              >
                <form>
                  <button
                    type="button"
                    className={`tab_btn flex w-full items-center justify-between border-b border-line pb-1.5 ${activeAddress === "billing" ? "active" : ""}`}
                    onClick={() => handleActiveAddress("billing")}
                  >
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      Billing address
                    </strong>
                    <CaretDown className="ic_down text-2xl duration-300" />
                  </button>
                  <div
                    className={`form_address ${activeAddress === "billing" ? "block" : "hidden"}`}
                  >
                    <div className="mt-5 grid gap-4 gap-y-5 sm:grid-cols-2">
                      <div className="first-name">
                        <label
                          htmlFor="billingFirstName"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          First Name <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingFirstName"
                          type="text"
                          required
                        />
                      </div>
                      <div className="last-name">
                        <label
                          htmlFor="billingLastName"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Last Name <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingLastName"
                          type="text"
                          required
                        />
                      </div>
                      <div className="company">
                        <label
                          htmlFor="billingCompany"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Company name (optional)
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingCompany"
                          type="text"
                          required
                        />
                      </div>
                      <div className="country">
                        <label
                          htmlFor="billingCountry"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Country / Region <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingCountry"
                          type="text"
                          required
                        />
                      </div>
                      <div className="street">
                        <label
                          htmlFor="billingStreet"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          street address <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingStreet"
                          type="text"
                          required
                        />
                      </div>
                      <div className="city">
                        <label
                          htmlFor="billingCity"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Town / city <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingCity"
                          type="text"
                          required
                        />
                      </div>
                      <div className="state">
                        <label
                          htmlFor="billingState"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          state <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingState"
                          type="text"
                          required
                        />
                      </div>
                      <div className="zip">
                        <label
                          htmlFor="billingZip"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          ZIP <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingZip"
                          type="text"
                          required
                        />
                      </div>
                      <div className="phone">
                        <label
                          htmlFor="billingPhone"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Phone <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingPhone"
                          type="text"
                          required
                        />
                      </div>
                      <div className="email">
                        <label
                          htmlFor="billingEmail"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Email <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="billingEmail"
                          type="email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`tab_btn mt-10 flex w-full items-center justify-between border-b border-line pb-1.5 ${activeAddress === "shipping" ? "active" : ""}`}
                    onClick={() => handleActiveAddress("shipping")}
                  >
                    <strong className="text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                      Shipping address
                    </strong>
                    <CaretDown className="ic_down text-2xl duration-300" />
                  </button>
                  <div
                    className={`form_address ${activeAddress === "shipping" ? "block" : "hidden"}`}
                  >
                    <div className="mt-5 grid gap-4 gap-y-5 sm:grid-cols-2">
                      <div className="first-name">
                        <label
                          htmlFor="shippingFirstName"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          First Name <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingFirstName"
                          type="text"
                          required
                        />
                      </div>
                      <div className="last-name">
                        <label
                          htmlFor="shippingLastName"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Last Name <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingLastName"
                          type="text"
                          required
                        />
                      </div>
                      <div className="company">
                        <label
                          htmlFor="shippingCompany"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Company name (optional)
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingCompany"
                          type="text"
                          required
                        />
                      </div>
                      <div className="country">
                        <label
                          htmlFor="shippingCountry"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Country / Region <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingCountry"
                          type="text"
                          required
                        />
                      </div>
                      <div className="street">
                        <label
                          htmlFor="shippingStreet"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          street address <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingStreet"
                          type="text"
                          required
                        />
                      </div>
                      <div className="city">
                        <label
                          htmlFor="shippingCity"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Town / city <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingCity"
                          type="text"
                          required
                        />
                      </div>
                      <div className="state">
                        <label
                          htmlFor="shippingState"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          state <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingState"
                          type="text"
                          required
                        />
                      </div>
                      <div className="zip">
                        <label
                          htmlFor="shippingZip"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          ZIP <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingZip"
                          type="text"
                          required
                        />
                      </div>
                      <div className="phone">
                        <label
                          htmlFor="shippingPhone"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Phone <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingPhone"
                          type="text"
                          required
                        />
                      </div>
                      <div className="email">
                        <label
                          htmlFor="shippingEmail"
                          className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                        >
                          Email <span className="text-red">*</span>
                        </label>
                        <input
                          className="mt-2 w-full rounded-lg border-line px-4 py-3"
                          id="shippingEmail"
                          type="email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="block-button mt-6 lg:mt-10">
                    <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                      Update Address
                    </button>
                  </div>
                </form>
              </div>
              <div
                className={`tab text-content w-full rounded-xl border border-line p-7 ${activeTab === "setting" ? "block" : "hidden"}`}
              >
                <form>
                  <div className="heading5 pb-4">Information</div>
                  <div className="upload_image col-span-full">
                    <label htmlFor="uploadImage">
                      Upload Avatar: <span className="text-red">*</span>
                    </label>
                    <div className="mt-3 flex flex-wrap items-center gap-5">
                      <div className="bg_img relative h-[7.5rem] w-[7.5rem] flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                        <span className="ph ph-image absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl text-secondary"></span>
                        <Image
                          src={"/images/avatar/1.png"}
                          width={300}
                          height={300}
                          alt="avatar"
                          className="upload_img relative z-[1] h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <strong className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                          Upload File:
                        </strong>
                        <p className="mt-1 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                          JPG 120x120px
                        </p>
                        <div className="upload_file mt-3 flex w-[220px] items-center gap-3 rounded border border-line px-3 py-2">
                          <label
                            htmlFor="uploadImage"
                            className="caption2 cursor-pointer whitespace-nowrap rounded bg-line px-3 py-1"
                          >
                            Choose File
                          </label>
                          <input
                            type="file"
                            name="uploadImage"
                            id="uploadImage"
                            accept="image/*"
                            className="caption2 cursor-pointer"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 gap-y-5 sm:grid-cols-2">
                    <div className="first-name">
                      <label
                        htmlFor="firstName"
                        className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                      >
                        First Name <span className="text-red">*</span>
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border-line px-4 py-3"
                        id="firstName"
                        type="text"
                        defaultValue={"Tony"}
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="last-name">
                      <label
                        htmlFor="lastName"
                        className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                      >
                        Last Name <span className="text-red">*</span>
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border-line px-4 py-3"
                        id="lastName"
                        type="text"
                        defaultValue={"Nguyen"}
                        placeholder="Last name"
                        required
                      />
                    </div>
                    <div className="phone-number">
                      <label
                        htmlFor="phoneNumber"
                        className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                      >
                        Phone Number <span className="text-red">*</span>
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border-line px-4 py-3"
                        id="phoneNumber"
                        type="text"
                        defaultValue={"(+12) 345 678 910"}
                        placeholder="Phone number"
                        required
                      />
                    </div>
                    <div className="email">
                      <label
                        htmlFor="email"
                        className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                      >
                        Email Address <span className="text-red">*</span>
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border-line px-4 py-3"
                        id="email"
                        type="email"
                        defaultValue={"hi.avitex@gmail.com"}
                        placeholder="Email address"
                        required
                      />
                    </div>
                    <div className="gender">
                      <label
                        htmlFor="gender"
                        className="text-base font-normal capitalize leading-[22] md:text-[13px] md:leading-5"
                      >
                        Gender <span className="text-red">*</span>
                      </label>
                      <div className="select-block mt-2">
                        <select
                          className="w-full rounded-lg border border-line px-4 py-3"
                          id="gender"
                          name="gender"
                          defaultValue={"default"}
                        >
                          <option value="default" disabled>
                            Choose Gender
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <CaretDown className="arrow-down text-lg" />
                      </div>
                    </div>
                    <div className="birth">
                      <label
                        htmlFor="birth"
                        className="text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                      >
                        Day of Birth <span className="text-red">*</span>
                      </label>
                      <input
                        className="mt-2 w-full rounded-lg border-line px-4 py-3"
                        id="birth"
                        type="date"
                        placeholder="Day of Birth"
                        required
                      />
                    </div>
                  </div>
                  <div className="heading5 mt-6 pb-4 lg:mt-10">
                    Change Password
                  </div>
                  <div className="pass">
                    <label
                      htmlFor="password"
                      className="text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                    >
                      Current password <span className="text-red">*</span>
                    </label>
                    <input
                      className="mt-2 w-full rounded-lg border-line px-4 py-3"
                      id="password"
                      type="password"
                      placeholder="Password *"
                      required
                    />
                  </div>
                  <div className="new-pass mt-5">
                    <label
                      htmlFor="newPassword"
                      className="text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                    >
                      New password <span className="text-red">*</span>
                    </label>
                    <input
                      className="mt-2 w-full rounded-lg border-line px-4 py-3"
                      id="newPassword"
                      type="password"
                      placeholder="New Password *"
                      required
                    />
                  </div>
                  <div className="confirm-pass mt-5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                    >
                      Confirm new password <span className="text-red">*</span>
                    </label>
                    <input
                      className="mt-2 w-full rounded-lg border-line px-4 py-3"
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password *"
                      required
                    />
                  </div>
                  <div className="block-button mt-6 lg:mt-10">
                    <button className="duration-400 md:text-md inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                      Save Change
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-order-detail-block flex items-center justify-center`}
        onClick={() => setOpenDetail(false)}
      >
        <div
          className={`modal-order-detail-main grid w-[1160px] grid-cols-2 rounded-2xl bg-white ${openDetail ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="info border-r border-line p-10">
            <h5 className="heading5">Order Details</h5>
            <div className="list_info mt-5 grid grid-cols-2 gap-10 gap-y-8">
              <div className="info_item">
                <strong className="text-sm font-semibold uppercase leading-5 text-secondary md:text-xs md:leading-4">
                  Contact Information
                </strong>
                <h6 className="order_name mt-2 text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  Tony nguyen
                </h6>
                <h6 className="order_phone mt-2 text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  (+12) 345 - 678910
                </h6>
                <h6 className="order_email mt-2 text-[20px] font-semibold capitalize normal-case leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  hi.avitex@gmail.com
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-sm font-semibold uppercase leading-5 text-secondary md:text-xs md:leading-4">
                  Payment method
                </strong>
                <h6 className="order_payment mt-2 text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  cash delivery
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-sm font-semibold uppercase leading-5 text-secondary md:text-xs md:leading-4">
                  Shipping address
                </strong>
                <h6 className="order_shipping_address mt-2 text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, US
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-sm font-semibold uppercase leading-5 text-secondary md:text-xs md:leading-4">
                  Billing address
                </strong>
                <h6 className="order_billing_address mt-2 text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  2163 Phillips Gap Rd, West Jefferson, North Carolina, US
                </h6>
              </div>
              <div className="info_item">
                <strong className="text-sm font-semibold uppercase leading-5 text-secondary md:text-xs md:leading-4">
                  Company
                </strong>
                <h6 className="order_company mt-2 text-[20px] font-semibold capitalize leading-[28px] md:text-base lg:text-lg lg:leading-[26px]">
                  Avitex Technology
                </h6>
              </div>
            </div>
          </div>
          <div className="list p-10">
            <h5 className="heading5">Items</h5>
            <div className="list_prd">
              <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                <Link
                  href={"/product/default"}
                  className="flex items-center gap-5"
                >
                  <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                    <Image
                      src={"/images/product/1000x1000.png"}
                      width={1000}
                      height={1000}
                      alt={"Contrasting sheepskin sweatshirt"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="prd_name text-title">
                      Contrasting sheepskin sweatshirt
                    </div>
                    <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                      <span className="prd_size uppercase">XL</span>
                      <span>/</span>
                      <span className="prd_color capitalize">Yellow</span>
                    </div>
                  </div>
                </Link>
                <div className="text-title">
                  <span className="prd_quantity">1</span>
                  <span> X </span>
                  <span className="prd_price">$45.00</span>
                </div>
              </div>
              <div className="prd_item flex flex-wrap items-center justify-between gap-3 border-b border-line py-5">
                <Link
                  href={"/product/default"}
                  className="flex items-center gap-5"
                >
                  <div className="bg-img aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg md:w-[100px]">
                    <Image
                      src={"/images/product/1000x1000.png"}
                      width={1000}
                      height={1000}
                      alt={"Contrasting sheepskin sweatshirt"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="prd_name text-title">
                      Contrasting sheepskin sweatshirt
                    </div>
                    <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                      <span className="prd_size uppercase">XL</span>
                      <span>/</span>
                      <span className="prd_color capitalize">White</span>
                    </div>
                  </div>
                </Link>
                <div className="text-title">
                  <span className="prd_quantity">2</span>
                  <span> X </span>
                  <span className="prd_price">$70.00</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <strong className="text-title">Shipping</strong>
              <strong className="order_ship text-title">Free</strong>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <strong className="text-title">Discounts</strong>
              <strong className="order_discounts text-title">-$80.00</strong>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
              <h5 className="heading5">Subtotal</h5>
              <h5 className="order_total heading5">$105.00</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
