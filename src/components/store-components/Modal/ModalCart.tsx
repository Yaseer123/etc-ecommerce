"use client";

import React, { useState } from "react";
import Link from "next/link";
import CartProductItem from "./CartProductItem";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { X, NotePencil, Tag, Trash } from "@phosphor-icons/react/dist/ssr";
import { useCartStore } from "@/context/store-context/CartContext";

const ModalCart = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>("");
  const { isModalOpen, closeModalCart } = useModalCartStore();
  const {
    cartArray: cartState,
    note,
    coupon,
    setNote,
    setCoupon,
    removeFromCart,
  } = useCartStore();
  const [tempNote, setTempNote] = useState(note);
  const [tempCoupon, setTempCoupon] = useState(coupon);

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  let [totalCart] = useState<number>(0);

  cartState.map((item) => (totalCart += item.price * item.quantity));

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
              <div className="heading5">Shopping Cart ({cartState.length})</div>
              <div
                className="close-btn absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                onClick={closeModalCart}
              >
                <X size={14} />
              </div>
            </div>

            <div className="list-product max-h-[calc(100vh-280px)] overflow-y-auto px-6">
              {cartState.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                cartState.map((item) => (
                  <div
                    key={item.id}
                    className="group relative mb-4 flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-50">
                      <CartProductItem item={item} />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h4 className="mb-1 text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <button
                          className="hover:text-red-500 text-gray-400 transition-colors"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                      <div className="mb-2 text-xs text-gray-500">
                        SKU: {item.id}
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            × {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="footer-modal absolute bottom-0 left-0 w-full bg-white shadow-lg">
              <div className="flex items-center justify-center gap-8 border-b border-line bg-gray-50 px-6 py-4 lg:gap-14">
                <div
                  className="item flex cursor-pointer items-center gap-3"
                  onClick={() => handleActiveTab("note")}
                >
                  <NotePencil className="text-xl" />
                  <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                    Note
                  </div>
                </div>
                <div
                  className="item flex cursor-pointer items-center gap-3"
                  onClick={() => handleActiveTab("coupon")}
                >
                  <Tag className="text-xl" />
                  <div className="text-base font-normal leading-[22] md:text-[13px] md:leading-5">
                    Coupon
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 px-6 pt-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Items ({cartState.length})</span>
                  <span>${totalCart.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="heading5">Total</div>
                  <div className="heading5 text-xl">
                    ${totalCart.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="block-button p-6 text-center">
                <div className="flex items-center gap-4">
                  <Link
                    href={"/cart"}
                    className="duration-400 md:text-md inline-block basis-1/2 cursor-pointer rounded-[12px] border border-black bg-white px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-black transition-all ease-in-out hover:bg-black hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
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
                    <NotePencil className="text-xl" />
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
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                  ></textarea>
                </div>
                <div className="block-button px-6 pb-6 pt-4 text-center">
                  <div
                    className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={() => {
                      setNote(tempNote);
                      setActiveTab("");
                    }}
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
                className={`tab-item note-block ${activeTab === "coupon" ? "active" : ""}`}
              >
                <div className="border-b border-line px-6 py-4">
                  <div className="item flex cursor-pointer items-center gap-3">
                    <Tag className="text-xl" />
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
                      value={tempCoupon}
                      onChange={(e) => setTempCoupon(e.target.value)}
                    />
                  </div>
                </div>
                <div className="block-button px-6 pb-6 pt-4 text-center">
                  <div
                    className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={() => {
                      setCoupon(tempCoupon);
                      setActiveTab("");
                    }}
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
