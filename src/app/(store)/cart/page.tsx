"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/store-context/CartContext";
import { countdownTime } from "@/utils/countdownTime";
import Menu from "@/components/store-components/Menu";

const Cart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { cartState, updateCart, removeFromCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    // Tìm sản phẩm trong giỏ hàng
    const itemToUpdate = cartState.cartArray.find(
      (item) => item.id === productId,
    );

    // Kiểm tra xem sản phẩm có tồn tại không
    if (itemToUpdate) {
      // Truyền giá trị hiện tại của selectedSize và selectedColor
      updateCart(
        productId,
        newQuantity,
        itemToUpdate.selectedSize,
        itemToUpdate.selectedColor,
      );
    }
  };

  const moneyForFreeship = 150;
  const [totalCart, setTotalCart] = useState<number>(0);
  const [discountCart, setDiscountCart] = useState<number>(0);
  const [shipCart, setShipCart] = useState<number>(30);
  const [applyCode, setApplyCode] = useState<number>(0);

  useEffect(() => {
    const total = cartState.cartArray.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    setTotalCart(total);
  }, [cartState.cartArray]);

  const handleApplyCode = (minValue: number, discount: number) => {
    if (totalCart > minValue) {
      setApplyCode(minValue);
      setDiscountCart(discount);
    } else {
      alert(`Minimum order must be ${minValue}$`);
    }
  };

  if (totalCart < applyCode) {
    setApplyCode(0);
    setDiscountCart(0);
  }

  if (totalCart < moneyForFreeship) {
    setShipCart(30);
  }

  if (cartState.cartArray.length === 0) {
    setShipCart(0);
  }

  const redirectToCheckout = () => {
    router.push(`/checkout?discount=${discountCart}&ship=${shipCart}`);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        {/* <Breadcrumb pageTitle="Shopping cart" subHeading="Shopping cart" /> */}
      </div>
      <div className="cart-block py-10 md:py-20">
        <div className="container">
          <div className="content-main flex justify-between gap-y-8 max-xl:flex-col">
            <div className="w-full xl:w-2/3 xl:pr-3">
              <div className="time flex items-center rounded-lg bg-green px-5 py-3">
                <div className="heding5">🔥</div>
                <div className="caption1 pl-2">
                  Your cart will expire in
                  <span className="min text-button fw-700 text-red">
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
              <div className="heading banner mt-5">
                <div className="text">
                  Buy
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
                <div className="tow-bar-block mt-4">
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
              <div className="list-product mt-5 w-full sm:mt-7">
                <div className="w-full">
                  <div className="heading bora-4 bg-surface pb-4 pt-4">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-button text-center">Products</div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Price</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">Quantity</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">
                          Total Price
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="list-product-main mt-3 w-full">
                    {cartState.cartArray.length < 1 ? (
                      <p className="text-button pt-3">No product in cart</p>
                    ) : (
                      cartState.cartArray.map((product) => (
                        <div
                          className="item mt-5 flex w-full border-b border-line pb-5 md:mt-7 md:pb-7"
                          key={product.id}
                        >
                          <div className="w-1/2">
                            <div className="flex items-center gap-6">
                              <div className="bg-img aspect-[3/4] w-20 md:w-[100px]">
                                <Image
                                  src={product.thumbImage[0] ?? ""}
                                  width={1000}
                                  height={1000}
                                  alt={product.name}
                                  className="h-full w-full rounded-lg object-cover"
                                />
                              </div>
                              <div>
                                <div className="text-title">{product.name}</div>
                                <div className="list-select mt-3"></div>
                              </div>
                            </div>
                          </div>
                          <div className="price flex w-1/12 items-center justify-center">
                            <div className="text-title text-center">
                              ${product.price}.00
                            </div>
                          </div>
                          <div className="flex w-1/6 items-center justify-center">
                            <div className="quantity-block flex w-20 flex-shrink-0 items-center justify-between rounded-lg border border-line bg-surface p-2 md:w-[100px] md:p-3">
                              <Icon.Minus
                                onClick={() => {
                                  if (product.quantity > 1) {
                                    handleQuantityChange(
                                      product.id,
                                      product.quantity - 1,
                                    );
                                  }
                                }}
                                className={`text-base max-md:text-sm ${product.quantity === 1 ? "disabled" : ""}`}
                              />
                              <div className="text-button quantity">
                                {product.quantity}
                              </div>
                              <Icon.Plus
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.quantity + 1,
                                  )
                                }
                                className="text-base max-md:text-sm"
                              />
                            </div>
                          </div>
                          <div className="total-price flex w-1/6 items-center justify-center">
                            <div className="text-title text-center">
                              ${product.quantity * product.price}.00
                            </div>
                          </div>
                          <div className="flex w-1/12 items-center justify-center">
                            <Icon.XCircle
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
              <div className="input-block discount-code mt-5 h-12 w-full sm:mt-7">
                <form className="relative h-full w-full">
                  <input
                    type="text"
                    placeholder="Add voucher discount"
                    className="h-full w-full rounded-lg border border-line bg-surface pl-4 pr-14"
                    required
                  />
                  <button className="button-main absolute bottom-1 right-1 top-1 flex items-center justify-center rounded-lg px-5">
                    Apply Code
                  </button>
                </form>
              </div>
              <div className="list-voucher mt-5 flex flex-wrap items-center gap-5 sm:mt-7">
                <div
                  className={`item ${applyCode === 200 ? "bg-green" : ""} rounded-lg border border-line py-2`}
                >
                  <div className="top flex justify-between gap-10 border-b border-dashed border-line px-3 pb-2">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">10% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from 200$
                      </div>
                    </div>
                  </div>
                  <div className="bottom flex items-center justify-between gap-6 px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main px-2.5 py-1 text-xs capitalize"
                      onClick={() =>
                        handleApplyCode(200, Math.floor((totalCart / 100) * 10))
                      }
                    >
                      {applyCode === 200 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
                <div
                  className={`item ${applyCode === 300 ? "bg-green" : ""} rounded-lg border border-line py-2`}
                >
                  <div className="top flex justify-between gap-10 border-b border-dashed border-line px-3 pb-2">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">15% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from 300$
                      </div>
                    </div>
                  </div>
                  <div className="bottom flex items-center justify-between gap-6 px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main px-2.5 py-1 text-xs capitalize"
                      onClick={() =>
                        handleApplyCode(300, Math.floor((totalCart / 100) * 15))
                      }
                    >
                      {applyCode === 300 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
                <div
                  className={`item ${applyCode === 400 ? "bg-green" : ""} rounded-lg border border-line py-2`}
                >
                  <div className="top flex justify-between gap-10 border-b border-dashed border-line px-3 pb-2">
                    <div className="left">
                      <div className="caption1">Discount</div>
                      <div className="caption1 font-bold">20% OFF</div>
                    </div>
                    <div className="right">
                      <div className="caption1">
                        For all orders <br />
                        from 400$
                      </div>
                    </div>
                  </div>
                  <div className="bottom flex items-center justify-between gap-6 px-3 pt-2">
                    <div className="text-button-uppercase">Code: AN6810</div>
                    <div
                      className="button-main px-2.5 py-1 text-xs capitalize"
                      onClick={() =>
                        handleApplyCode(400, Math.floor((totalCart / 100) * 20))
                      }
                    >
                      {applyCode === 400 ? "Applied" : "Apply Code"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full xl:w-1/3 xl:pl-12">
              <div className="checkout-block rounded-2xl bg-surface p-6">
                <div className="heading5">Order Summary</div>
                <div className="total-block flex justify-between border-b border-line py-5">
                  <div className="text-title">Subtotal</div>
                  <div className="text-title">
                    $<span className="total-product">{totalCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="discount-block flex justify-between border-b border-line py-5">
                  <div className="text-title">Discounts</div>
                  <div className="text-title">
                    {" "}
                    <span>-$</span>
                    <span className="discount">{discountCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="ship-block flex justify-between border-b border-line py-5">
                  <div className="text-title">Shipping</div>
                  <div className="choose-type flex gap-12">
                    <div className="left">
                      <div className="type">
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
                      <div className="type mt-1">
                        <input
                          id="local"
                          type="radio"
                          name="ship"
                          value={30}
                          checked={shipCart === 30}
                          onChange={() => setShipCart(30)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="local"
                        >
                          Local:
                        </label>
                      </div>
                      <div className="type mt-1">
                        <input
                          id="flat"
                          type="radio"
                          name="ship"
                          value={40}
                          checked={shipCart === 40}
                          onChange={() => setShipCart(40)}
                        />
                        <label
                          className="text-on-surface-variant1 pl-1"
                          htmlFor="flat"
                        >
                          Flat Rate:
                        </label>
                      </div>
                    </div>
                    <div className="right">
                      <div className="ship">$0.00</div>
                      <div className="local text-on-surface-variant1 mt-1">
                        $30.00
                      </div>
                      <div className="flat text-on-surface-variant1 mt-1">
                        $40.00
                      </div>
                    </div>
                  </div>
                </div>
                <div className="total-cart-block flex justify-between pb-4 pt-4">
                  <div className="heading5">Total</div>
                  <div className="heading5">
                    $
                    <span className="total-cart heading5">
                      {totalCart - discountCart + shipCart}
                    </span>
                    <span className="heading5">.00</span>
                  </div>
                </div>
                <div className="block-button mt-5 flex flex-col items-center gap-y-4">
                  <div
                    className="checkout-btn button-main w-full text-center"
                    onClick={redirectToCheckout}
                  >
                    Process To Checkout
                  </div>
                  <Link
                    className="text-button hover-underline"
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
