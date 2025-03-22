"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/context/store-context/CartContext";
import { countdownTime } from "@/utils/countdownTime";
import { Minus, Plus, XCircle } from "@phosphor-icons/react/dist/ssr";

const Cart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { cartArray, updateCart, removeFromCart } = useCartStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const itemToUpdate = cartArray.find((item) => item.id === productId);

    if (itemToUpdate) {
      updateCart(productId, newQuantity);
    }
  };

  const moneyForFreeship = 150;
  const [totalCart, setTotalCart] = useState<number>(0);
  const [discountCart, setDiscountCart] = useState<number>(0);
  const [shipCart, setShipCart] = useState<number>(30);
  const [applyCode, setApplyCode] = useState<number>(0);

  useEffect(() => {
    const total = cartArray.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setTotalCart(total);
  }, [cartArray]);

  const handleApplyCode = (minValue: number, discount: number) => {
    if (totalCart > minValue) {
      setApplyCode(minValue);
      setDiscountCart(discount);
    } else {
      alert(`Minimum order must be ${minValue}$`);
    }
  };

  // if (totalCart < applyCode) {
  //   setApplyCode(0);
  //   setDiscountCart(0);
  // }

  // if (totalCart < moneyForFreeship) {
  //   setShipCart(30);
  // }

  // if (cartArray.cartArray.length === 0) {
  //   setShipCart(0);
  // }

  const redirectToCheckout = () => {
    router.push(`/checkout?discount=${discountCart}&ship=${shipCart}`);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        {/* <Breadcrumb pageTitle="Shopping cart" subHeading="Shopping cart" /> */}
      </div>
      <div className="py-10 md:py-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="flex justify-between gap-y-8 max-xl:flex-col">
            <div className="w-full xl:w-2/3 xl:pr-3">
              <div className="flex items-center rounded-lg bg-green px-5 py-3">
                <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                  🔥
                </div>
                <div className="pl-2 text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                  Your cart will expire in
                  <span className="fw-700 text-base font-semibold capitalize leading-[26px] text-red md:text-base md:leading-6">
                    {" "}
                    {timeLeft.minutes}:
                    {timeLeft.seconds < 10
                      ? `0${timeLeft.seconds}`
                      : timeLeft.seconds}
                  </span>
                  <span>
                    {" "}
                    minutes! Please checkout now before your items sell out!
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <div>
                  Buy
                  <span className="text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                    {" "}
                    $
                    <span>
                      {moneyForFreeship - totalCart > 0 ? (
                        <>{moneyForFreeship - totalCart}</>
                      ) : (
                        0
                      )}
                    </span>
                    .00{" "}
                  </span>
                  <span>more to get </span>
                  <span className="text-base font-semibold capitalize leading-[26px]">
                    freeship
                  </span>
                </div>
                <div className="relative mt-4 h-[4px] bg-outline">
                  <div
                    className="cart-progress-line absolute left-0 h-[4px] bg-[#3dab25]"
                    style={{
                      width:
                        totalCart <= moneyForFreeship
                          ? `${(totalCart / moneyForFreeship) * 100}%`
                          : `100%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="mt-5 w-full sm:mt-7 sm:overflow-x-auto">
                <div className="w-full">
                  <div className="heading bg-surface pb-4 pt-4">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-center text-base font-semibold capitalize leading-[26px]">
                          Products
                        </div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-center text-base font-semibold capitalize leading-[26px]">
                          Price
                        </div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-center text-base font-semibold capitalize leading-[26px]">
                          Quantity
                        </div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-center text-base font-semibold capitalize leading-[26px]">
                          Total Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 w-full">
                    {cartArray.length < 1 ? (
                      <p className="pt-3 text-base font-semibold capitalize leading-[26px]">
                        No product in cart
                      </p>
                    ) : (
                      cartArray.map((product) => (
                        <div
                          className="mt-5 flex w-full border-b border-line pb-5 md:mt-7 md:pb-7"
                          key={product.id}
                        >
                          <div className="w-1/2">
                            <div className="flex items-center gap-6">
                              <div className="bg-img aspect-[3/4] w-20 md:w-[100px]">
                                <Image
                                  src={
                                    product.coverImage ??
                                    "/images/product/1000x1000.png"
                                  }
                                  width={1000}
                                  height={1000}
                                  alt={product.name}
                                  className="h-full w-full rounded-lg object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                                  {product.name}
                                </div>
                                <div className="list-select mt-3"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex w-1/12 items-center justify-center">
                            <div className="text-center text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                              ${product.price}.00
                            </div>
                          </div>
                          <div className="flex w-1/6 items-center justify-center">
                            <div className="quantity-block flex w-20 flex-shrink-0 items-center justify-between rounded-lg border border-line bg-surface p-2 md:w-[100px] md:p-3">
                              <Minus
                                onClick={() => {
                                  if (product.quantity > 1) {
                                    handleQuantityChange(
                                      product.id,
                                      product.quantity - 1,
                                    );
                                  }
                                }}
                                className={`cursor-pointer text-base disabled:pointer-events-none disabled:text-secondary max-md:text-sm ${product.quantity === 1 ? "disabled" : ""}`}
                              />
                              <div className="quantity text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6">
                                {product.quantity}
                              </div>
                              <Plus
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.quantity + 1,
                                  )
                                }
                                className="cursor-pointer text-base disabled:pointer-events-none disabled:text-secondary max-md:text-sm"
                              />
                            </div>
                          </div>
                          <div className="total-price flex w-1/6 items-center justify-center">
                            <div className="text-center text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                              ${product.quantity * product.price}.00
                            </div>
                          </div>
                          <div className="flex w-1/12 items-center justify-center">
                            <XCircle
                              className="cursor-pointer text-xl text-red duration-500 hover:text-black max-md:text-base"
                              onClick={() => {
                                removeFromCart(product.id);
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 h-12 w-full sm:mt-7">
                <form className="relative h-full w-full">
                  <input
                    type="text"
                    placeholder="Add voucher discount"
                    className="h-full w-full rounded-lg border border-line bg-surface pl-4 pr-14"
                    required
                  />
                  <button className="duration-400 absolute bottom-1 right-1 top-1 flex cursor-pointer items-center justify-center rounded-lg bg-black px-5 py-4 text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3">
                    Apply Code
                  </button>
                </form>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-5 sm:mt-7">
                <div
                  className={`transition-all duration-300 ease-in-out ${applyCode === 200 ? "border-green bg-green" : ""} rounded-lg border border-line py-2`}
                >
                  <div className="list-voucher-item-top relative flex justify-between gap-10 border-b border-dashed border-line px-3 pb-2">
                    <div className="left">
                      <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                        Discount
                      </div>
                      <div className="text-base font-bold leading-[22] md:text-[13px] md:leading-5">
                        10% OFF
                      </div>
                    </div>
                    <div className="right">
                      <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                        For all orders <br />
                        from 200$
                      </div>
                    </div>
                  </div>
                  <div className="bottom flex items-center justify-between gap-6 px-3 pt-2">
                    <div className="text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4">
                      Code: AN6810
                    </div>
                    <div
                      className="duration-400 inline-block cursor-pointer rounded-[12px] bg-black px-2.5 py-1 text-xs font-semibold capitalize leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-xs md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-3"
                      onClick={() =>
                        handleApplyCode(200, Math.floor((totalCart / 100) * 10))
                      }
                    >
                      {applyCode === 200 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full xl:w-1/3 xl:pl-12">
              <div className="rounded-2xl bg-surface p-6">
                <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                  Order Summary
                </div>
                <div className="total-block flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Subtotal
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    $<span>{totalCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Discounts
                  </div>
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    {" "}
                    <span>-$</span>
                    <span>{discountCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-line py-5">
                  <div className="text-base font-medium capitalize leading-6 md:text-base md:leading-5">
                    Shipping
                  </div>
                  <div className="flex gap-12">
                    <div className="left">
                      <div>
                        {moneyForFreeship - totalCart > 0 ? (
                          <input
                            id="shipping"
                            type="radio"
                            name="ship"
                            disabled
                          />
                        ) : (
                          <input
                            id="shipping"
                            type="radio"
                            name="ship"
                            checked={shipCart === 0}
                            onChange={() => setShipCart(0)}
                          />
                        )}
                        <label className="pl-1" htmlFor="shipping">
                          Free Shipping:
                        </label>
                      </div>
                      <div className="mt-1">
                        <input
                          id="local"
                          type="radio"
                          name="ship"
                          value={30}
                          checked={shipCart === 30}
                          onChange={() => setShipCart(30)}
                        />
                        <label className="pl-1" htmlFor="local">
                          Local:
                        </label>
                      </div>
                      <div className="mt-1">
                        <input
                          id="flat"
                          type="radio"
                          name="ship"
                          value={40}
                          checked={shipCart === 40}
                          onChange={() => setShipCart(40)}
                        />
                        <label className="pl-1" htmlFor="flat">
                          Flat Rate:
                        </label>
                      </div>
                    </div>
                    <div className="right">
                      <div className="ship">$0.00</div>
                      <div className="local mt-1">$30.00</div>
                      <div className="flat mt-1">$40.00</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pb-4 pt-4">
                  <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                    Total
                  </div>
                  <div className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                    $
                    <span className="total-cart text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                      {totalCart - discountCart + shipCart}
                    </span>
                    <span className="text-[24px] font-semibold capitalize leading-[30px] md:text-base md:leading-[26px] lg:text-[22px] lg:leading-[28px]">
                      .00
                    </span>
                  </div>
                </div>
                <div className="block-button mt-5 flex flex-col items-center gap-y-4">
                  <div
                    className="duration-400 text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:text-[15px] md:leading-4 lg:rounded-[10px] lg:px-6 lg:py-5"
                    onClick={redirectToCheckout}
                  >
                    Process To Checkout
                  </div>
                  <Link
                    className="text-base font-semibold capitalize leading-[26px] hover:underline md:text-base md:leading-6"
                    href={"/shop/breadcrumb1"}
                  >
                    Continue shopping
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

export default Cart;
