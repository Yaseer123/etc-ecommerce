"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import { useCartStore } from "@/context/store-context/CartContext";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

const Checkout = () => {
  const searchParams = useSearchParams();
  const discount = searchParams.get("discount");
  const ship = searchParams.get("ship");

  const { cartArray } = useCartStore();
  const [totalCart, setTotalCart] = useState<number>(0);
  const [activePayment, setActivePayment] = useState<string>("credit-card");

  React.useEffect(() => {
    const sum = cartArray.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    setTotalCart(sum);
  }, [cartArray]);

  const handlePayment = (item: string) => {
    setActivePayment(item);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>
      <div className="py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex justify-between md:overflow-x-auto">
            <div className="w-1/2">
              <div className="flex justify-between rounded-lg bg-surface px-4 py-3">
                <div className="flex items-center">
                  <span className="pr-4">Already have an account? </span>
                  <span className="cursor-pointer text-base font-semibold capitalize leading-[26px] hover:underline md:text-base md:leading-6">
                    Login
                  </span>
                </div>
                <div>
                  <i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i>
                </div>
              </div>
              <div className="mt-3">
                <form className="rounded-lg border border-line p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <input
                        className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                        id="username"
                        type="email"
                        placeholder="Username or email"
                        required
                      />
                    </div>
                    <div>
                      <input
                        className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button className="duration-400 inline-block cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3">
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div className="mt-5">
                <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                  Information
                </div>
                <div className="mt-5">
                  <form>
                    <div className="grid flex-wrap gap-4 gap-y-5 sm:grid-cols-2">
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="firstName"
                          type="text"
                          placeholder="First Name *"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="lastName"
                          type="text"
                          placeholder="Last Name *"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="email"
                          type="email"
                          placeholder="Email Address *"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="phoneNumber"
                          type="number"
                          placeholder="Phone Numbers *"
                          required
                        />
                      </div>
                      <div className="relative col-span-full">
                        <select
                          className="w-full rounded-lg border border-line px-4 py-3"
                          id="region"
                          name="region"
                          defaultValue={"default"}
                        >
                          <option value="default" disabled>
                            Choose Country/Region
                          </option>
                          <option value="India">India</option>
                          <option value="France">France</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="city"
                          type="text"
                          placeholder="Town/City *"
                          required
                        />
                      </div>
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="apartment"
                          type="text"
                          placeholder="Street,..."
                          required
                        />
                      </div>
                      <div className="relative">
                        <select
                          className="w-full rounded-lg border border-line px-4 py-3"
                          id="country"
                          name="country"
                          defaultValue={"default"}
                        >
                          <option value="default" disabled>
                            Choose State
                          </option>
                          <option value="India">India</option>
                          <option value="France">France</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                        <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2" />
                      </div>
                      <div className="">
                        <input
                          className="w-full rounded-lg border-line px-4 py-3"
                          id="postal"
                          type="text"
                          placeholder="Postal Code *"
                          required
                        />
                      </div>
                      <div className="col-span-full">
                        <textarea
                          className="w-full rounded-lg border border-line px-4 py-3"
                          id="note"
                          name="note"
                          placeholder="Write note..."
                        ></textarea>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-10">
                      <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                        Choose payment Option:
                      </div>
                      <div className="mt-5">
                        <div
                          className={`rounded-lg border border-line bg-surface p-5`}
                        >
                          <input
                            className="cursor-pointer"
                            type="radio"
                            id="credit"
                            name="payment"
                            checked={activePayment === "credit-card"}
                            onChange={() => handlePayment("credit-card")}
                          />
                          <label
                            className="cursor-pointer pl-2 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                            htmlFor="credit"
                          >
                            Credit Card
                          </label>
                          <div
                            className={
                              activePayment === "credit-card"
                                ? "visible max-h-[1000px] opacity-100"
                                : "duration-800 invisible max-h-0 overflow-hidden transition-all ease-in-out"
                            }
                          >
                            <div className="pt-4">
                              Make your payment directly into our bank account.
                              Your order will not be shipped until the funds
                              have cleared in our account.
                            </div>
                            <div className="row">
                              <div className="col-12 mt-3">
                                <label htmlFor="cardNumberCredit">
                                  Card Numbers
                                </label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="cardNumberCredit"
                                  placeholder="ex.1234567290"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="dateCredit">Date</label>
                                <input
                                  className="mt-2 w-full rounded border-line px-4 py-3"
                                  type="date"
                                  id="dateCredit"
                                  name="date"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="ccvCredit">CCV</label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="ccvCredit"
                                  placeholder="****"
                                />
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="saveCredit"
                                name="save"
                              />
                              <label
                                className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                                htmlFor="saveCredit"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`mt-5 rounded-lg border border-line bg-surface p-5`}
                        >
                          <input
                            className="cursor-pointer"
                            type="radio"
                            id="delivery"
                            name="payment"
                            checked={activePayment === "cash-delivery"}
                            onChange={() => handlePayment("cash-delivery")}
                          />
                          <label
                            className="cursor-pointer pl-2 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                            htmlFor="delivery"
                          >
                            Cash on delivery
                          </label>
                          <div
                            className={
                              activePayment === "cash-delivery"
                                ? "visible max-h-[1000px] opacity-100"
                                : "duration-800 invisible max-h-0 overflow-hidden transition-all ease-in-out"
                            }
                          >
                            <div className="pt-4">
                              Make your payment directly into our bank account.
                              Your order will not be shipped until the funds
                              have cleared in our account.
                            </div>
                            <div className="row">
                              <div className="col-12 mt-3">
                                {/* <div className="bg-img"><Image src="assets/images/component/payment.png" alt="" /></div> */}
                                <label htmlFor="cardNumberDelivery">
                                  Card Numbers
                                </label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="cardNumberDelivery"
                                  placeholder="ex.1234567290"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="dateDelivery">Date</label>
                                <input
                                  className="mt-2 w-full rounded border-line px-4 py-3"
                                  type="date"
                                  id="dateDelivery"
                                  name="date"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="ccvDelivery">CCV</label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="ccvDelivery"
                                  placeholder="****"
                                />
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="saveDelivery"
                                name="save"
                              />
                              <label
                                className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                                htmlFor="saveDelivery"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`mt-5 rounded-lg border border-line bg-surface p-5`}
                        >
                          <input
                            className="cursor-pointer"
                            type="radio"
                            id="apple"
                            name="payment"
                            checked={activePayment === "apple-pay"}
                            onChange={() => handlePayment("apple-pay")}
                          />
                          <label
                            className="cursor-pointer pl-2 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                            htmlFor="apple"
                          >
                            Apple Pay
                          </label>
                          <div
                            className={
                              activePayment === "apple-pay"
                                ? "visible max-h-[1000px] opacity-100"
                                : "duration-800 invisible max-h-0 overflow-hidden transition-all ease-in-out"
                            }
                          >
                            <div className="text-on-surface-variant1 pt-4">
                              Make your payment directly into our bank account.
                              Your order will not be shipped until the funds
                              have cleared in our account.
                            </div>
                            <div className="row">
                              <div className="col-12 mt-3">
                                {/* <div className="bg-img"><Image src="assets/images/component/payment.png" alt="" /></div> */}
                                <label htmlFor="cardNumberApple">
                                  Card Numbers
                                </label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="cardNumberApple"
                                  placeholder="ex.1234567290"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="dateApple">Date</label>
                                <input
                                  className="mt-2 w-full rounded border-line px-4 py-3"
                                  type="date"
                                  id="dateApple"
                                  name="date"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="ccvApple">CCV</label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="ccvApple"
                                  placeholder="****"
                                />
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="saveApple"
                                name="save"
                              />
                              <label
                                className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                                htmlFor="saveApple"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`type mt-5 rounded-lg border border-line bg-surface p-5`}
                        >
                          <input
                            className="cursor-pointer"
                            type="radio"
                            id="paypal"
                            name="payment"
                            checked={activePayment === "paypal"}
                            onChange={() => handlePayment("paypal")}
                          />
                          <label
                            className="cursor-pointer pl-2 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                            htmlFor="paypal"
                          >
                            PayPal
                          </label>
                          <div
                            className={
                              activePayment === "paypal"
                                ? "visible max-h-[1000px] opacity-100"
                                : "duration-800 invisible max-h-0 overflow-hidden transition-all ease-in-out"
                            }
                          >
                            <div className="text-on-surface-variant1 pt-4">
                              Make your payment directly into our bank account.
                              Your order will not be shipped until the funds
                              have cleared in our account.
                            </div>
                            <div className="row">
                              <div className="col-12 mt-3">
                                <label htmlFor="cardNumberPaypal">
                                  Card Numbers
                                </label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="cardNumberPaypal"
                                  placeholder="ex.1234567290"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="datePaypal">Date</label>
                                <input
                                  className="mt-2 w-full rounded border-line px-4 py-3"
                                  type="date"
                                  id="datePaypal"
                                  name="date"
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="ccvPaypal">CCV</label>
                                <input
                                  className="mt-2 w-full cursor-pointer rounded border-line px-4 py-3"
                                  type="text"
                                  id="ccvPaypal"
                                  placeholder="****"
                                />
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="savePaypal"
                                name="save"
                              />
                              <label
                                className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6"
                                htmlFor="savePaypal"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 md:mt-10">
                      <button className="duration-400 hover:bg-green-500 inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3">
                        Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="right w-5/12">
              <div>
                <div className="pb-3 text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                  Your Order
                </div>
                <div>
                  {cartState.cartArray.length < 1 ? (
                    <p className="pt-3 text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                      No product in cart
                    </p>
                  ) : (
                    cartState.cartArray.map((product) => (
                      <>
                        <div className="mt-5 flex w-full items-center justify-between gap-6 border-b border-line pb-5">
                          <div className="bg-img aspect-square w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={product.thumbImage[0] ?? ""}
                              width={500}
                              height={500}
                              alt="img"
                              className="h-full w-full"
                            />
                          </div>
                          <div className="flex w-full items-center justify-between">
                            <div>
                              <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                                {product.name}
                              </div>
                              <div className="mt-2 text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                                <span className="size capitalize">
                                  {product.selectedSize || product.sizes[0]}
                                </span>
                                <span>/</span>
                                <span className="color capitalize">
                                  {product.selectedColor ??
                                    product.variation?.[0]?.color ??
                                    "default"}
                                </span>
                              </div>
                            </div>
                            <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                              <span className="quantity">
                                {product.quantity}
                              </span>
                              <span className="px-1">x</span>
                              <span>${product.price}.00</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ))
                  )}
                </div>
                <div className="flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Discounts
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    -$<span className="discount">{discount}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Shipping
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    {Number(ship) === 0 ? "Free" : `$${ship}.00`}
                  </div>
                </div>
                <div className="flex justify-between pt-5">
                  <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                    Total
                  </div>
                  <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                    ${totalCart - Number(discount) + Number(ship)}.00
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

export default Checkout;
