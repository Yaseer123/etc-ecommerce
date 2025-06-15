"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/store-context/CartContext";
import { useModalCartStore } from "@/context/store-context/ModalCartContext";
import { NotePencil, Trash, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";
import CartProductItem from "./CartProductItem";

const ModalCart = () => {
  const [activeTab, setActiveTab] = useState<string | undefined>("");
  const { isModalOpen, closeModalCart } = useModalCartStore();
  const {
    cartArray: cartState,
    note,
    setNote,
    removeFromCart,
  } = useCartStore();
  const [tempNote, setTempNote] = useState(note);
  const [showAll, setShowAll] = useState(false);

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  let [totalCart] = useState<number>(0);

  cartState.map(
    (item) =>
      (totalCart += (item.discountedPrice ?? item.price) * item.quantity),
  );

  const itemsToShow = showAll ? cartState : cartState.slice(0, 2);

  return (
    <>
      <div className={`modal-cart-block`} onClick={closeModalCart}>
        <div
          className={`modal-cart-main flex h-full flex-col ${isModalOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="right cart-block relative flex h-full w-full flex-col overflow-hidden py-6">
            <div className="heading relative flex items-center justify-between px-6 pb-3">
              <div className="heading5">Shopping Cart ({cartState.length})</div>
              <div
                className="close-btn bg-surface absolute right-6 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full duration-300 hover:bg-black hover:bg-black/75 hover:text-white"
                onClick={closeModalCart}
              >
                <X size={14} />
              </div>
            </div>

            <div className="list-product mb-20 px-6">
              {cartState.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <>
                  {itemsToShow.map((item) => (
                    <div
                      key={item.id}
                      className="group relative mb-4 flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
                    >
                      <div className="relative z-10 h-20 w-20 overflow-hidden rounded-lg bg-gray-50">
                        <CartProductItem item={item} />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h4 className="mb-1 text-sm font-medium text-gray-900">
                            {item.name}
                          </h4>
                          <button
                            className="text-gray-400 transition-colors hover:text-red-500"
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
                            <span className="discounted-price text-sm font-medium">
                              ৳{(item.discountedPrice ?? item.price).toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              × {item.quantity}
                            </span>
                          </div>
                          <span className="font-medium text-black">
                            ৳
                            {(
                              (item.discountedPrice ?? item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cartState.length > 3 && !showAll && (
                    <Button variant="black" className="mt-2 w-full" asChild>
                      <Link href={"/cart"} onClick={() => closeModalCart()}>
                        Show All
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
              <div className="flex flex-col gap-2 px-6 pt-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Items ({cartState.length})</span>
                  <span>৳{totalCart.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="heading5">Total</div>
                  <div className="heading5 text-xl">
                    ৳{totalCart.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="block-button p-6 text-center">
                <div className="flex items-center gap-4">
                  <Link
                    href={"/cart"}
                    className="duration-400 md:text-md inline-block basis-1/2 cursor-pointer rounded-[.25rem] border border-black bg-white px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-black transition-all ease-in-out hover:bg-black hover:bg-black/75 hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={closeModalCart}
                  >
                    View cart
                  </Link>
                  <Link
                    href={"/checkout"}
                    className="duration-400 md:text-md hover:bg-black/75/75 hover:bg-green inline-block basis-1/2 cursor-pointer rounded-[.25rem] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-black hover:bg-black/75 hover:text-white md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    onClick={closeModalCart}
                  >
                    Check Out
                  </Link>
                </div>
                <Link
                  href={"/products"}
                  onClick={closeModalCart}
                  className="has-line-before mt-4 inline-block cursor-pointer text-center text-sm font-semibold uppercase leading-5 md:text-xs md:leading-4"
                >
                  Or continue shopping
                </Link>
              </div>
              {activeTab === "note" && (
                <div className="tab-item note-block active">
                  <div className="border-b border-[#ddd] px-6 py-4 focus:border-[#ddd]">
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
                      className="bg-surface w-full rounded-md border-[#ddd] px-4 py-3 text-base font-normal leading-[22] focus:border-[#ddd] md:text-[13px] md:leading-5"
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="block-button px-6 pb-6 pt-4 text-center">
                    <div
                      className="duration-400 md:text-md hover:bg-green inline-block w-full cursor-pointer rounded-[.25rem] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-black/75 md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCart;
