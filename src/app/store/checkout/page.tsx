"use client";
import React, { useState } from "react";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import TopNav from "@/components/store-components/TopNav";
import { useCart } from "@/context/store-context/CartContext";
import Menu from "@/components/store-components/Menu";

const Checkout = () => {
  const searchParams = useSearchParams();
  const discount = searchParams.get("discount");
  const ship = searchParams.get("ship");

  const { cartState } = useCart();
  let [totalCart, setTotalCart] = useState<number>(0);
  const [activePayment, setActivePayment] = useState<string>("credit-card");

  cartState.cartArray.map((item) => (totalCart += item.price * item.quantity));

  const handlePayment = (item: string) => {
    setActivePayment(item);
  };

  return (
    <>
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>
      <div className="cart-block py-10 md:py-20">
        <div className="container">
          <div className="content-main flex justify-between">
            <div className="left w-1/2">
              <div className="login flex justify-between rounded-lg bg-surface px-4 py-3">
                <div className="left flex items-center">
                  <span className="text-on-surface-variant1 pr-4">
                    Already have an account?{" "}
                  </span>
                  <span className="text-button text-on-surface hover-underline cursor-pointer">
                    Login
                  </span>
                </div>
                <div className="right">
                  <i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i>
                </div>
              </div>
              <div className="form-login-block mt-3">
                <form className="rounded-lg border border-line p-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="email">
                      <input
                        className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                        id="username"
                        type="email"
                        placeholder="Username or email"
                        required
                      />
                    </div>
                    <div className="pass">
                      <input
                        className="w-full rounded-lg border-line px-4 pb-3 pt-3"
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="block-button mt-3">
                    <button className="button-main button-blue-hover">
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div className="information mt-5">
                <div className="heading5">Information</div>
                <div className="form-checkout mt-5">
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
                      <div className="select-block col-span-full">
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
                        <Icon.CaretDown className="arrow-down" />
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
                      <div className="select-block">
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
                        <Icon.CaretDown className="arrow-down" />
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
                    <div className="payment-block mt-6 md:mt-10">
                      <div className="heading5">Choose payment Option:</div>
                      <div className="list-payment mt-5">
                        <div
                          className={`type rounded-lg border border-line bg-surface p-5 ${activePayment === "credit-card" ? "open" : ""}`}
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
                            className="text-button cursor-pointer pl-2"
                            htmlFor="credit"
                          >
                            Credit Card
                          </label>
                          <div className="infor">
                            <div className="text-on-surface-variant1 pt-4">
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
                                className="text-button"
                                htmlFor="saveCredit"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`type mt-5 rounded-lg border border-line bg-surface p-5 ${activePayment === "cash-delivery" ? "open" : ""}`}
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
                            className="text-button cursor-pointer pl-2"
                            htmlFor="delivery"
                          >
                            Cash on delivery
                          </label>
                          <div className="infor">
                            <div className="text-on-surface-variant1 pt-4">
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
                                className="text-button"
                                htmlFor="saveDelivery"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`type mt-5 rounded-lg border border-line bg-surface p-5 ${activePayment === "apple-pay" ? "open" : ""}`}
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
                            className="text-button cursor-pointer pl-2"
                            htmlFor="apple"
                          >
                            Apple Pay
                          </label>
                          <div className="infor">
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
                                className="text-button"
                                htmlFor="saveApple"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`type mt-5 rounded-lg border border-line bg-surface p-5 ${activePayment === "paypal" ? "open" : ""}`}
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
                            className="text-button cursor-pointer pl-2"
                            htmlFor="paypal"
                          >
                            PayPal
                          </label>
                          <div className="infor">
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
                                className="text-button"
                                htmlFor="savePaypal"
                              >
                                Save Card Details
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block-button mt-6 md:mt-10">
                      <button className="button-main w-full">Payment</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="right w-5/12">
              <div className="checkout-block">
                <div className="heading5 pb-3">Your Order</div>
                <div className="list-product-checkout">
                  {cartState.cartArray.length < 1 ? (
                    <p className="text-button pt-3">No product in cart</p>
                  ) : (
                    cartState.cartArray.map((product) => (
                      <>
                        <div className="item mt-5 flex w-full items-center justify-between gap-6 border-b border-line pb-5">
                          <div className="bg-img aspect-square w-[100px] flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={product.thumbImage[0]}
                              width={500}
                              height={500}
                              alt="img"
                              className="h-full w-full"
                            />
                          </div>
                          <div className="flex w-full items-center justify-between">
                            <div>
                              <div className="name text-title">
                                {product.name}
                              </div>
                              <div className="caption1 mt-2 text-secondary">
                                <span className="size capitalize">
                                  {product.selectedSize || product.sizes[0]}
                                </span>
                                <span>/</span>
                                <span className="color capitalize">
                                  {product.selectedColor ||
                                    product.variation[0].color}
                                </span>
                              </div>
                            </div>
                            <div className="text-title">
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
                <div className="discount-block flex justify-between border-b border-line py-5">
                  <div className="text-title">Discounts</div>
                  <div className="text-title">
                    -$<span className="discount">{discount}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="ship-block flex justify-between border-b border-line py-5">
                  <div className="text-title">Shipping</div>
                  <div className="text-title">
                    {Number(ship) === 0 ? "Free" : `$${ship}.00`}
                  </div>
                </div>
                <div className="total-cart-block flex justify-between pt-5">
                  <div className="heading5">Total</div>
                  <div className="heading5 total-cart">
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
