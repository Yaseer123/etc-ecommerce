"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import type CountdownTimeType from "@/types/CountdownType";
import { useModalCartContext } from "@/context/store-context/ModalCartContext";
import { countdownTime } from "@/utils/countdownTime";
import { api } from "@/trpc/react";
import CartProductItem from "./CartProductItem";

const ModalCart = ({
  serverTimeLeft,
}: {
  serverTimeLeft: CountdownTimeType;
}) => {
  const [timeLeft, setTimeLeft] = useState(serverTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = countdownTime();
        return JSON.stringify(prevTime) === JSON.stringify(newTime)
          ? prevTime
          : newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<string | undefined>("");
  const { isModalOpen, closeModalCart } = useModalCartContext();
  // const { cartState, addToCart, removeFromCart, updateCart } = useCart();

  const utils = api.useUtils();
  const [cartState] = api.cart.getCart.useSuspenseQuery();
  const removeFromCart = api.cart.removeFromCart.useMutation({
    onSuccess: async () => {
      await utils.cart.getCart.invalidate();
    },
  });

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  const moneyForFreeship = 150;
  let [totalCart] = useState<number>(0);

  cartState?.items.map(
    (item) => (totalCart += item.product.price * item.quantity),
  );

  return (
    <>
      <div className={`modal-cart-block`} onClick={closeModalCart}>
        <div
          className={`modal-cart-main flex ${isModalOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="right cart-block relative w-full overflow-hidden py-6">
            <div className="heading relative flex items-center justify-between px-6 pb-3">
              <div className="heading5">Shopping Cart</div>
              <div
                className="close-btn absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                onClick={closeModalCart}
              >
                <Icon.X size={14} />
              </div>
            </div>
            <div className="time px-6">
              <div className="flex items-center gap-3 rounded-lg bg-green px-5 py-3">
                <p className="text-3xl">🔥</p>
                <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                  Your cart will expire in{" "}
                  <span className="text-base font-semibold leading-[22] text-red md:text-[13px] md:leading-5">
                    {timeLeft.minutes}:
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds}`
                      : timeLeft.seconds}
                  </span>{" "}
                  minutes!
                  <br />
                  Please checkout now before your items sell out!
                </div>
              </div>
            </div>
            <div className="heading banner mt-3 px-6">
              <div className="text">
                Buy{" "}
                <span className="text-button">
                  {" "}
                  $
                  <span className="more-price">
                    {moneyForFreeship - totalCart > 0 ? (
                      <>{moneyForFreeship - totalCart}</>
                    ) : (
                      0
                    )}
                  </span>
                  .00{" "}
                </span>
                <span>more to get </span>
                <span className="text-button">freeship</span>
              </div>
              <div className="tow-bar-block mt-3">
                <div
                  className="progress-line"
                  style={{
                    width:
                      totalCart <= moneyForFreeship
                        ? `${(totalCart / moneyForFreeship) * 100}%`
                        : `100%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="list-product px-6">
              {cartState?.items.map((item) => (
                <div
                  key={item.product.id}
                  className="item flex items-center justify-between gap-3 border-b border-line py-5"
                >
                  <CartProductItem
                    item={item}
                    removeFromCart={() => removeFromCart.mutate(item.id)}
                  />
                </div>
              ))}
            </div>
            <div className="footer-modal absolute bottom-0 left-0 w-full bg-white">
              <div className="flex items-center justify-center gap-8 border-b border-line px-6 py-4 lg:gap-14">
                <div
                  className="item flex cursor-pointer items-center gap-3"
                  onClick={() => handleActiveTab("note")}
                >
                  <Icon.NotePencil className="text-xl" />
                  <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                    Note
                  </div>
                </div>
                <div
                  className="item flex cursor-pointer items-center gap-3"
                  onClick={() => handleActiveTab("shipping")}
                >
                  <Icon.Truck className="text-xl" />
                  <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                    Shipping
                  </div>
                </div>
                <div
                  className="item flex cursor-pointer items-center gap-3"
                  onClick={() => handleActiveTab("coupon")}
                >
                  <Icon.Tag className="text-xl" />
                  <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                    Coupon
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 pt-6">
                <div className="heading5">Subtotal</div>
                <div className="heading5">${totalCart}.00</div>
              </div>
              <div className="block-button p-6 text-center">
                <div className="flex items-center gap-4">
                  <Link
                    href={"/cart"}
                    className="duration-400 md:text-md inline-block basis-1/2 cursor-pointer rounded-[12px] border border-black bg-white px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-black hover:text-white transition-all ease-in-out hover:bg-black  md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={closeModalCart}
                  >
                    View cart
                  </Link>
                  <Link
                    href={"/checkout"}
                    className="duration-400 md:text-md inline-block basis-1/2 cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={closeModalCart}
                  >
                    Check Out
                  </Link>
                </div>
                <div
                  onClick={closeModalCart}
                  className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
                >
                  Or continue shopping
                </div>
              </div>
              <div
                className={`tab-item note-block ${activeTab === "note" ? "active" : ""}`}
              >
                <div className="border-b border-line px-6 py-4">
                  <div className="item flex cursor-pointer items-center gap-3">
                    <Icon.NotePencil className="text-xl" />
                    <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                      Note
                    </div>
                  </div>
                </div>
                <div className="form px-6 pt-4">
                  <textarea
                    name="form-note"
                    id="form-note"
                    rows={4}
                    placeholder="Add special instructions for your order..."
                    className="w-full rounded-md border-line bg-surface px-4 py-3 text-base font-normal leading-[22] md:text-[13px] md:leading-5"
                  ></textarea>
                </div>
                <div className="block-button px-6 pb-6 pt-4 text-center">
                  <div
                    className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={() => setActiveTab("")}
                  >
                    Save
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
                  >
                    Cancel
                  </div>
                </div>
              </div>
              <div
                className={`tab-item note-block ${activeTab === "shipping" ? "active" : ""}`}
              >
                <div className="border-b border-line px-6 py-4">
                  <div className="item flex cursor-pointer items-center gap-3">
                    <Icon.Truck className="text-xl" />
                    <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                      Estimate shipping rates
                    </div>
                  </div>
                </div>
                <div className="form px-6 pt-4">
                  <div className="">
                    <label
                      htmlFor="select-country"
                      className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5"
                    >
                      Country/region
                    </label>
                    <div className="select-block relative mt-2">
                      <select
                        id="select-country"
                        name="select-country"
                        className="w-full rounded-xl border border-line bg-white py-3 pl-5"
                        defaultValue={"Country/region"}
                      >
                        <option value="Country/region" disabled>
                          Country/region
                        </option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="UK">UK</option>
                        <option value="USA">USA</option>
                      </select>
                      <Icon.CaretDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 md:right-5"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="select-state"
                      className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5"
                    >
                      State
                    </label>
                    <div className="select-block relative mt-2">
                      <select
                        id="select-state"
                        name="select-state"
                        className="w-full rounded-xl border border-line bg-white py-3 pl-5"
                        defaultValue={"State"}
                      >
                        <option value="State" disabled>
                          State
                        </option>
                        <option value="Paris">Paris</option>
                        <option value="Madrid">Madrid</option>
                        <option value="London">London</option>
                        <option value="New York">New York</option>
                      </select>
                      <Icon.CaretDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 md:right-5"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label
                      htmlFor="select-code"
                      className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5"
                    >
                      Postal/Zip Code
                    </label>
                    <input
                      className="mt-3 w-full rounded-xl border-line px-5 py-3"
                      id="select-code"
                      type="text"
                      placeholder="Postal/Zip Code"
                    />
                  </div>
                </div>
                <div className="block-button px-6 pb-6 pt-4 text-center">
                  <div
                    className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={() => setActiveTab("")}
                  >
                    Calculator
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
                  >
                    Cancel
                  </div>
                </div>
              </div>
              <div
                className={`tab-item note-block ${activeTab === "coupon" ? "active" : ""}`}
              >
                <div className="border-b border-line px-6 py-4">
                  <div className="item flex cursor-pointer items-center gap-3">
                    <Icon.Tag className="text-xl" />
                    <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                      Add A Coupon Code
                    </div>
                  </div>
                </div>
                <div className="form px-6 pt-4">
                  <div className="">
                    <label
                      htmlFor="select-discount"
                      className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5"
                    >
                      Enter Code
                    </label>
                    <input
                      className="mt-3 w-full rounded-xl border-line px-5 py-3"
                      id="select-discount"
                      type="text"
                      placeholder="Discount code"
                    />
                  </div>
                </div>
                <div className="block-button px-6 pb-6 pt-4 text-center">
                  <div
                    className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={() => setActiveTab("")}
                  >
                    Apply
                  </div>
                  <div
                    onClick={() => setActiveTab("")}
                    className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
                  >
                    Cancel
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

export default ModalCart;
