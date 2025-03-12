"use client";

// QuickView.tsx
import React, { useState } from "react";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalQuickViewContext } from "@/context/store-context/ModalQuickViewContext";
import { useCart } from "@/context/store-context/CartContext";
import { useModalCartContext } from "@/context/store-context/ModalCartContext";
import { useModalWishlistContext } from "@/context/store-context/ModalWishlistContext";
import { useWishlist } from "@/context/store-context/WishlistContext";
import Rate from "../Rate";

const ModalQuickView = () => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false);
  const { selectedProduct, closeQuickView } = useModalQuickViewContext();
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const { addToCart, updateCart, cartState } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { openModalWishlist } = useModalWishlistContext();
  const percentSale =
    selectedProduct &&
    Math.floor(
      100 - (selectedProduct.price / selectedProduct.originPrice) * 100,
    );

  const handleOpenSizeGuide = () => {
    setOpenSizeGuide(true);
  };

  const handleCloseSizeGuide = () => {
    setOpenSizeGuide(false);
  };

  const handleActiveColor = (item: string) => {
    setActiveColor(item);
  };

  const handleActiveSize = (item: string) => {
    setActiveSize(item);
  };

  const handleIncreaseQuantity = () => {
    if (selectedProduct) {
      selectedProduct.quantityPurchase += 1;
      updateCart(
        selectedProduct.id,
        selectedProduct.quantityPurchase + 1,
        activeSize,
        activeColor,
      );
    }
  };

  const handleDecreaseQuantity = () => {
    if (selectedProduct && selectedProduct.quantityPurchase > 1) {
      selectedProduct.quantityPurchase -= 1;
      updateCart(
        selectedProduct.id,
        selectedProduct.quantityPurchase - 1,
        activeSize,
        activeColor,
      );
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      if (!cartState.cartArray.find((item) => item.id === selectedProduct.id)) {
        addToCart({ ...selectedProduct });
        updateCart(
          selectedProduct.id,
          selectedProduct.quantityPurchase,
          activeSize,
          activeColor,
        );
      } else {
        updateCart(
          selectedProduct.id,
          selectedProduct.quantityPurchase,
          activeSize,
          activeColor,
        );
      }
      openModalCart();
      closeQuickView();
    }
  };

  const handleAddToWishlist = () => {
    // if product existed in wishlit, remove from wishlist and set state to false
    if (selectedProduct) {
      if (
        wishlist.wishlistArray.some((item) => item.id === selectedProduct.id)
      ) {
        removeFromWishlist(selectedProduct.id);
      } else {
        // else, add to wishlist and set state to true
        addToWishlist(selectedProduct);
      }
    }
    openModalWishlist();
  };
  return (
    <>
      <div className={`modal-quickview-block`} onClick={closeQuickView}>
        <div
          className={`modal-quickview-main py-6 ${selectedProduct !== null ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex h-full gap-y-6 max-md:flex-col-reverse">
            <div className="left flex-shrink-0 px-6 md:w-[300px] lg:w-[388px]">
              <div className="list-img items-center gap-4 max-md:flex">
                {selectedProduct?.images.map((item, index) => (
                  <div
                    className="bg-img aspect-[3/4] w-full overflow-hidden rounded-[20px] max-md:w-[150px] max-md:flex-shrink-0 md:mt-6"
                    key={index}
                  >
                    <Image
                      src={item}
                      width={1500}
                      height={2000}
                      alt={item}
                      priority={true}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="right w-full px-4">
              <div className="heading relative flex items-center justify-between px-4 pb-6">
                <div className="heading5">Quick View</div>
                <div
                  className="close-btn absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                  onClick={closeQuickView}
                >
                  <Icon.X size={14} />
                </div>
              </div>
              <div className="product-infor px-4">
                <div className="flex justify-between">
                  <div>
                    <div className="mt-1 text-[30px] font-semibold capitalize leading-[42px] md:text-[18px] md:leading-[28px] lg:text-[26px] lg:leading-[32px]">
                      {selectedProduct?.name}
                    </div>
                  </div>
                  <div
                    className={`add-wishlist-btn flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line duration-300 hover:bg-black hover:text-white ${wishlist.wishlistArray.some((item) => item.id === selectedProduct?.id) ? "active" : ""}`}
                    onClick={handleAddToWishlist}
                  >
                    {wishlist.wishlistArray.some(
                      (item) => item.id === selectedProduct?.id,
                    ) ? (
                      <>
                        <Icon.Heart
                          size={20}
                          weight="fill"
                          className="text-red"
                        />
                      </>
                    ) : (
                      <>
                        <Icon.Heart size={20} />
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  <Rate currentRate={selectedProduct?.rate} size={14} />
                  <span className="text-base font-normal leading-[22] text-secondary md:text-[13px] md:leading-5">
                    (1.234 reviews)
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3 border-b border-line pb-6">
                  <div className="product-price heading5">
                    ${selectedProduct?.price}.00
                  </div>
                  <div className="h-4 w-px bg-line"></div>
                  <div className="product-origin-price font-normal text-secondary2">
                    <del>${selectedProduct?.originPrice}.00</del>
                  </div>
                  {selectedProduct?.originPrice && (
                    <div className="product-sale caption2 inline-block rounded-full bg-green px-3 py-0.5 font-semibold">
                      -{percentSale}%
                    </div>
                  )}
                  <div className="desc mt-3 text-secondary">
                    {selectedProduct?.description}
                  </div>
                </div>
                <div className="list-action mt-6">
                  <div className="choose-color">
                    <div className="text-title">
                      Colors:{" "}
                      <span className="text-title color">{activeColor}</span>
                    </div>
                  </div>
                  <div className="choose-size mt-5">
                    <div className="heading flex items-center justify-between">
                      <div className="text-title">
                        Size:{" "}
                        <span className="text-title size">{activeSize}</span>
                      </div>
                    </div>
                    <div className="list-size mt-3 flex flex-wrap items-center gap-2">
                      {selectedProduct?.sizes.map((item, index) => (
                        <div
                          className={`size-item ${item === "freesize" ? "px-3 py-2" : "h-12 w-12"} flex items-center justify-center rounded-full border border-line bg-white text-base font-semibold capitalize leading-[26px] md:text-base md:leading-6 ${activeSize === item ? "active" : ""}`}
                          key={index}
                          onClick={() => handleActiveSize(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-title mt-5">Quantity:</div>
                  <div className="choose-quantity mt-3 flex items-center gap-5 max-xl:flex-wrap lg:justify-between">
                    <div className="quantity-block flex w-[120px] flex-shrink-0 items-center justify-between rounded-lg border border-line max-md:px-3 max-md:py-1.5 sm:w-[180px] md:p-3">
                      <Icon.Minus
                        onClick={handleDecreaseQuantity}
                        className={`${selectedProduct?.quantityPurchase === 1 ? "disabled" : ""} body1 cursor-pointer`}
                      />
                      <div className="body1 font-semibold">
                        {selectedProduct?.quantityPurchase}
                      </div>
                      <Icon.Plus
                        onClick={handleIncreaseQuantity}
                        className="body1 cursor-pointer"
                      />
                    </div>
                    <div
                      onClick={handleAddToCart}
                      className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] border border-black bg-black bg-white px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-black text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4"
                    >
                      Add To Cart
                    </div>
                  </div>
                  <div className="button-block mt-5">
                    <div className="duration-400 md:text-md inline-block w-full cursor-pointer rounded-[12px] bg-black px-10 py-4 text-center text-sm font-semibold uppercase leading-5 text-white transition-all ease-in-out hover:bg-green hover:text-black md:rounded-[8px] md:px-4 md:py-2.5 md:leading-4 lg:rounded-[10px] lg:px-7 lg:py-4">
                      Buy It Now
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-8 gap-y-4 lg:gap-20">
                    <div className="share flex cursor-pointer items-center gap-3">
                      <div className="share-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line duration-300 hover:bg-black hover:text-white md:h-12 md:w-12">
                        <Icon.ShareNetwork weight="fill" className="heading6" />
                      </div>
                      <span>Share Products</span>
                    </div>
                  </div>
                  <div className="more-infor mt-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Icon.ArrowClockwise className="body1" />
                        <div className="text-title">Delivery & Return</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon.Question className="body1" />
                        <div className="text-title">Ask A Question</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      <Icon.Timer className="body1" />
                      <span className="text-title">Estimated Delivery:</span>
                      <span className="text-secondary">
                        14 January - 18 January
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      <Icon.Eye className="body1" />
                      <span className="text-title">38</span>
                      <span className="text-secondary">
                        people viewing this product right now!
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <div className="text-title">SKU:</div>
                      <div className="text-secondary">53453412</div>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <div className="text-title">Categories:</div>
                      <div className="text-secondary">
                        {selectedProduct?.category}
                      </div>
                    </div>
                  </div>
                  <div className="list-payment mt-7">
                    <div className="main-content relative rounded-xl border border-line px-3 pb-4 pt-6 max-md:w-2/3 max-sm:w-full sm:px-4 lg:pb-6 lg:pt-8">
                      <div className="heading6 absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-5">
                        Guaranteed safe checkout
                      </div>
                      <div className="list grid grid-cols-6">
                        <div className="item flex items-center justify-center px-1 lg:px-3">
                          <Image
                            src={"/images/payment/Frame-0.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center px-1 lg:px-3">
                          <Image
                            src={"/images/payment/Frame-1.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center px-1 lg:px-3">
                          <Image
                            src={"/images/payment/Frame-2.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center px-1 lg:px-3">
                          <Image
                            src={"/images/payment/Frame-3.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center px-1 lg:px-3">
                          <Image
                            src={"/images/payment/Frame-4.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
                        <div className="item flex items-center justify-center px-1 lg:px-3">
                          <Image
                            src={"/images/payment/Frame-5.png"}
                            width={500}
                            height={450}
                            alt="payment"
                            className="w-full"
                          />
                        </div>
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

export default ModalQuickView;
